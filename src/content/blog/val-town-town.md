---
title: Val Town Town
generated: 1701894028953
description: Can we implement Val Town on Val Town?
pubDate: Oct 30, 2024
author: Max McDonnell
---

[![](./val-town-town/screenshot.png)](https://maxm-valtowntown.web.val.run)

_Val Town Town is Val Town implemented on Val Town. Check it out
[here](https://www.val.town/v/maxm/valtowntown) or
[here](https://maxm-valtowntown.web.val.run/). Fork it, extend it, build stuff
on it, or read on if you'd like to learn more._

Val Town lets you build all sorts of tools with vals: HTTP handlers, crons,
email endpoints, frontend applications, the list goes on. But
_can you build Val Town with Val Town_? With a few caveats, the answer
is yes: let's dive in.

### Handling a Request with import

So we want to accept user code, parse and execute it, and use it to handle a web
request.

The most naïve and solution is to use JavaScript's [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
functionality to load their code.
We effectively want to do this
([source](https://www.val.town/v/maxm/VTTnosecurity#L1)):

Supposing the user-provided HTTP handler looks like this:

```ts
export default (req: Request) => Response.json("I work!")
```

We wrap it in our runtime by creating a [data URL](https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/data)
including the code, calling import, and running the default export:

```tsx val
export default async function (req: Request): Promise<Response> {
    const mod = await import(
        `data:text/tsx,${
            encodeURIComponent(
                `export default (req: Request) => Response.json("I work!")`,
            )
        }`
    );
    return mod.default(req);
}
```

This works, but is very dangerous: there's almost no separation between the
system code and the user code. The user code has access to the same memory and
permissions that we do. It could read our secrets in `Deno.env` or mess with objects on
`globalThis`. This is barely better than the much-feared [eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) method.

How can we lock things down?

### Using Web Workers

I recently [published a Val](https://www.val.town/v/maxm/eval) that demonstrates
how to execute untrusted code safely, using Deno's
[Web Worker](https://docs.deno.com/runtime/reference/web_platform_apis/#web-workers)
and
[granular permissions](https://docs.deno.com/runtime/reference/web_platform_apis/#specifying-worker-permissions).
We can build all sorts of things with this, like secure playgrounds for writing code,
or scripting interfaces for existing applications.

With a little cleverness, we can use Web Workers as a sandbox for
user-defined HTTP handlers!

By wrapping things in a Deno Web Worker, we can isolate user code from the
parent process. This'll give us much better security guarantees than the `import()`
method did.

Here's a very minimal example:

```ts
const workerEval = (code: string, args: any[]): any => {
    return new Promise((resolve) => {
        const worker = new Worker(
            `data:text/tsx,${
                encodeURIComponent(`
self.onmessage = async (e) => {
  const mod = await import(\`data:text/tsx,\${encodeURIComponent(e.data.code)}\`);
  self.postMessage(mod.default(...e.data.args))
}`)
            }`,
            { type: "module", deno: {permissions: {net: false}},
        );
        worker.postMessage({ code, args });
        worker.onmessage = (e) => {
            resolve(e.data);
            worker.terminate();
        };
    });
};
```

Notice that we've added the permission `{net: false}` to lock things down even
further. Now the running code also doesn't get to make HTTP requests.

Web Workers make us _work_ a little harder to call that user-provided function:
we're passing messages here instead of calling functions directly. That's the cost
of better security.

We're passing messages back and forth using [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), which has some limitations on the kinds of objects it can transmit –
passing numbers back and forth like this is fine:

```ts
await workerEval(`export default (a, b) => a+b`, [1, 2]);
// => 3
```

But we can't just pass a complex object like a `Request`.

```ts
await workerEval(`export default (req) => req`, [
    new Request("https:/val.town"),
]); // => {}
```

Only [structured-cloneable](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types) types
are supported.

That's a bummer - how are we going to implement an HTTP handler if we can't
send requests and responses between the user code and the system?

### Put a Server in the Worker

If we can't send `Request` and `Response` using `postMessage`, then let's set up
a web server in the Worker and communicate directly
with that, instead of using `postMessage`. Here's how it works with
[reqEvaltown](https://www.val.town/v/maxm/reqEvaltown) the library I've created
to handle HTTP requests within a Worker.

```ts
export async function serveRequest(
    req: Request,
    importUrl: string,
): Promise<Response> {
    let port = await getFreePort();
    const worker = new Worker(
        `https://esm.town/v/maxm/evaltownWorker?cachebust=${crypto.randomUUID()}`,
        {
            type: "module",
            deno: {
                permissions: {
                    net: [`0.0.0.0:${port}`, `esm.sh:443`, `esm.town:443`],
                    read: false,
                    write: false,
                },
            },
        },
    );
    worker.postMessage({
        port,
        importUrl,
    });
    worker.onmessage = (event) => console.log(event.data);
    setTimeout(worker.terminate, 10_000); // request timeout
    await isPortListening(port);
    const { pathname, search } = new URL(req.url);
    const url = new URL("." + pathname, "http://localhost:" + port);
    url.search = search;
    const resp = await fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        redirect: "manual",
    });
    return resp;
}
```

Within this function, we:

1. Find an available port.
2. Spawn a Worker using our [script](https://www.val.town/v/maxm/evaltownWorker).
   We're running the Worker with limited permissions to allow the server to run
   and allow some https imports to work, but otherwise block network activity.
3. Send a message to the Worker with the port and importUrl.
4. Wait for the post to be available.
5. Proxy our request to the Worker and return the response.

Phew, certainly a little more complicated than before. Over in our
[Worker code](https://www.val.town/v/maxm/evaltownWorker), we handle the rest of
the exchange.

```ts
const start = (port: number, importUrl: string) => {
    import(importUrl).then((m) => {
        mod = m;
    }).catch((err) => {
        modError = err;
        console.error(err);
    }).finally(() => {
        doneLoading = true;
        for (const { req, resolve } of pendingRequests) {
            handleRequest(req).then(resolve);
        }
    });
    Deno.serve({
        port,
        onListen: () => {},
        onError: (err) => {
            console.error(err);
            return errorResponse(err);
        },
    }, (req) => {
        if (!doneLoading) {
            return new Promise<Response>((resolve) => {
                pendingRequests.push({ req, resolve });
            });
        }
        return handleRequest(req);
    });
};
```

We start a server, queue up requests that arrive while we're loading, and then
serve any pending requests with the loaded module.

There we have it, now we're ready to handle requests with a user-provided
handler.

### UI

Now for the fun part: we head over to [Townie](https://www.val.town/townie)
to create the UI. I
asked for a simple site with minimal styling that accepted user code in a text
box and stored it in a SQLite database. From there I made a few manual tweaks,
hooked up the code in the database to the request handler endpoint, added some
stylistic touches, and tweaked a few things with Townie's help.

Try it out:

<div>
<a style="font-size:20px;display:block;padding:10px;border-radius:5px;background:#eee;" href="https://maxm-valtowntown.web.val.run">👉 https://maxm-valtowntown.web.val.run</a>
</div>

The functionality is quite limited compared to Val Town, but you can still do lots
of things. You can
[host TLDraw](https://maxm-valtowntown.web.val.run/handler/29), build
[a React Playground](https://maxm-valtowntown.web.val.run/handler/31), and even
[stream Server Sent Events](https://maxm-valtowntown.web.val.run/handler/30).

<br />
<hr />
<br />

And there you have it: you can implement a subset of Val
Town's functionality on Val Town itself!

Workers provide a viable security sandbox, but it's important to note that
it is not as isolated or safe
as [the runtime strategy that we use today](https://blog.val.town/blog/first-four-val-town-runtimes/),
which uses process isolation as well. Be careful when implementing this
and any other security-sensitive code on Val Town in your accounts!

There are many more features that would be possible to implement:

1. We currently spawn one Worker per request, would it be possible to share a
   Worker across many requests?
2. We use `data:text/tsx` for import urls, could you implement your own module
   host so that you can use https imports?
3. How could you capture request logs and request metadata for users to view?
4. Could you provide user accounts? Environment variables? Database access?
5. Val Town Town
   [cannot run itself](https://maxm-valtowntown.web.val.run/handler/37), can you
   fix that?

Fork the code and see what you can make!
