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

I recently [published a Val](https://www.val.town/v/maxm/eval) that demonstrates
how to execute untrusted code safely. Under the hood it uses Deno's
[`Web Worker`](https://docs.deno.com/runtime/reference/web_platform_apis/#web-workers)
and the more granular
[`Worker` permissions](https://docs.deno.com/runtime/reference/web_platform_apis/#specifying-worker-permissions).

We can build all sorts of things with this building block. Secure playgrounds,
or a platform that allows users to extend functionality with custom code. Well
what about implementing something like Val Town? On Val Town you can run crons,
or scripts, or HTTP handlers, but at the core it's just storing some data and
running isolated Typescript. Could we implement Val Town on itself?

Let's try building a version of val town that just handles writing an HTTP
handler. You'll get to write code that handles a web request and returns a
response, and the platform we're building will deploy that code and make it
available on the internet!

### Handling a Request

We want to accept user code, parse and execute it, and use it to handle a web
request. We effectively want to do this
([source](https://www.val.town/v/maxm/VTTnosecurity)):

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

Our user wants to exclaim `I work!` and hands us a request handler that provides
that response. We turn that code into an importable module url, import it with a
dynamic import, and then process our request by calling the default export
directly. We've done it, yay!

The only issue is that in this current stat this is terribly insecure. When we
call `import(` the user code has access to the same memory and permissions that
we do. It could read our secrets in `Deno.env` or mess with objects on
`globalThis`. How can we lock things down?

### Web Workers

By wrapping things in a Deno
[`Web Worker`](https://docs.deno.com/runtime/reference/web_platform_apis/#web-workers)
we can isolate user code from the parent process. Just like the eval example we
can create a Worker, send it our user code, and then send back the response.
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
further. Now the running code also doesn't get to use the network.

We could call this function like so, and it will return the result we expect?

```ts
await workerEval(`export default (a, b) => a+b`, [1, 2]);
// => 3
```

Things get a little more complicated if we want to try and send a request across
the boundary though.

```ts
await workerEval(`export default (req) => req`, [
    new Request("https:/val.town"),
]); // => {}
```

Sadly the request cannot be sent between the parent process and the Worker. Hmm,
how are we going to implement an HTTP handler then?

### Put a Server in the Worker

If we can't send `Request` and `Response` using `postMessage` then let's set up
a web server in the Worker to communicate with. Here's how it works with
[reqEvaltown](https://www.val.town/v/maxm/reqEvaltown) the library I've created
to handle http requests within a Worker.

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
2. Span a Worker using our [script](https://www.val.town/v/maxm/evaltownWorker).
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

Now we head over to [Townie](https://www.val.town/townie) to create the UI. I
asked for a simple site with minimal styling that accepted user code in a text
box and stored it in a SQLite database. From there I made a few manual tweaks,
hooked up the code in the database to the request handler endpoint, added some
stylistic touches, and tweaked a few things with Townie's help.

All that is ready and working here: https://maxm-valtowntown.web.val.run. The
functionality is quite limited compared to Val Town, but you can still do lots
of things. You can
[host TLDraw](https://maxm-valtowntown.web.val.run/handler/29), build
[a React Playground](https://maxm-valtowntown.web.val.run/handler/31), and even
[stream Server Sent Events](https://maxm-valtowntown.web.val.run/handler/30).

<br />
<hr />
<br />

And there you have it. It is indeed possible to implement a basic subset of Val
Town's functionality on Val Town itself. As always, make sure to be very careful
running untrusted code. While Worker's provide us a nice security boundary you
should be very cautious editing and running this code on your own account.

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
