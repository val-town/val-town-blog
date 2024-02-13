---
title: Introducing Val Town v3
generated: 1701894028856
description: Our move to embrace web standards
pubDate: October 3, 2023
author: Steve Krouse
---

Shipping later this month, Val Town v3 is faster, simpler, and more reliable. It comes packed with long-requested features and bug fixes:

- Web-standard JavaScript
- Edit and run your vals locally
- JSX support
- Errors with line numbers
- No more `@` symbol to break parsers, linters, or explain to new users
- Mutation is explicit and web-standard (`vt/std/set`), not implicit, with subtle bugs
- `@me.secrets` → `process.env` and `Deno.env` (enabling many packages)
- `console.email` → `vt/std/email`
- Vals version-pin-able, so no more “[Restricted Library Mode](https://blog.val.town/blog/restricted-library-mode)”
- Vals importable in Deno, [Node](https://nodejs.org/api/esm.html#https-and-http-imports), and browser
- Static imports
- `fetch` is no longer proxied by default, and thus faster
- Your Val Town API key in `process.env.valtown`
- Log levels with colors
- Support for `Set`, `Map`, `BigInt`, `Date`, `URL`, `RegExp` in our inspector
- Formatter preserves empty lines

### Transition

We are working to make this transition as seamless as possible. We wrote a transpiler to auto-upgrade most breaking changes.

There are two breaking changes that require manual upgrades (mutation & `console.email`). We sent an email to you if you used either of those features in the last 60 days. Unless you let us know that you’d prefer to do it yourself, we will log into your account and upgrade those for you. More on those changes below.

Here’s our timeline:

- Currently – developing the v3 runtime & manually upgrading select vals
- Near the end of Oct 2023 – some downtime; transpile all vals; cutover to v3

Stay tuned for the exact release date! We will be very responsive to upgrade issues or bug reports during this time. Please reach out [over email](mailto:hi@val.town) or [on Discord](https://discord.gg/dHv45uN5RY) with any questions.

### A taste of v3

The main theme of v3 is standards. There is no custom `@` symbol. Vals are imported statically. External dependencies are automatically version-pinned for security and stability. Mutation and `console.email` are now done explicitly via [`vt/std/set`](https://www.val.town/v/std.set) and [`vt/std/email`](https://www.val.town/v/std.email).

![NOTE: This photo is slightly out-of-date. We dropped the vt/ import map in favor of importing directly from https://esm.town/user/val.](./introducing-val-town-v3/frame_1.png)

NOTE: This photo is slightly out-of-date. We dropped the `vt/` import map in favor of importing directly from `https://esm.town/user/val`.

- View `@stevekrouse.btcPriceAlert` in v2

  ![Screenshot 2023-10-02 at 16.01.05.png](./introducing-val-town-v3/screenshot_2023-10-02_at_160105.png)

- View `@stevekrouse.btcPriceAlert` in v2, upgraded to use [`@std.email`](https://www.val.town/v/std.email) and [`@std.set`](https://www.val.town/v/std.set)

  <div class="not-content">
    <iframe src="https://www.val.town/embed/stevekrouse.btcPriceAlert" width="100%" frameborder="no" style="height: 400px;">
      &#x20;
    </iframe>
  </div>

### Release notes

### 1. Mutation

#### v2

You could persist changes to your own vals much like you’d modify a JavaScript variable:

```tsx
@me.someCounter++
```

We made this work by spying on all state mutations, and then after your code has finished running, persisting them to our database. This is really simple and magical in some sense, but it’s really difficult to understand the nuances. It hides the complexity of a distributed system under an misleadingly simple interface.

#### v3

We will no longer spy on your updates, nor invisibly persist your mutations. You’ll have to mutate your own state explicitly now.

```tsx
import { set } from "https://esm.town/v/std/set";
import { someCounter } from "https://esm.town/v/myName/someCounter";

await set("someCounter", someCounter + 1);
```

### 2. `console.email`

#### v2

You could send yourself an email as easily as you’d log to the console:

```tsx
console.email({ now: Date.now() });
```

#### v3

We won’t pollute the global `Console` object with a non-standard function. We also won’t pretend that sending emails is synchronous. We’re providing a way for you to send emails from Val Town that is more flexible, understandable, and will continue to work even if you run your Val Town code locally.

```tsx
import { email } from "https://esm.town/v/std/email";

await email({ text: new Date() });
```

### 3. Importing vals

In v3, vals are imported over https, which is supported in Deno, [Node](https://nodejs.org/api/esm.html#https-and-http-imports), and browser:

```tsx
import { foo } from "https://esm.town/v/joe/foo";
```

The above imports refer to the latest version of foo. You can pin your import to a specific version:

```tsx
import { foo } from "https://esm.town/v/joe/foo?v=6";
```

Our transpiler will automatically convert all old `@`-style imports to this new style.

### 4. Exporting vals

In v2, the `export` keyword was optional.

In v3, all vals must have exactly one value exported, and optionally any number of type exports. The name of the value export is the name of the val. Our transpiler will automatically fix old vals that don’t have an export.

### 5. Secrets

In v2, secrets lived at `@me.secrets`.

In v3, secrets will live on both `process.env` and `Deno.env` for maximum compatibility. Our transpiler will automatically update these references for you.

Additionally, in both v2 and v3 we recently added a `valtown` secret that’s always defined in your account to the value of one of your Val Town API tokens that you can use to authenticate to the Val Town API.

### 6. Goodbye “Restricted Library Mode”

We shipped [Restricted Library Mode](https://blog.val.town/blog/restricted-library-mode) as an interim fix to protect you against other users maliciously stealing your secrets by changing their code after you import it.

Now with the introduction of version-pinning in v3, we are dropping Restricted Library Mode in factor of standard semantics. When you import code that refers to `process.env`, it will access _your_ secrets. This is why others’ code is version-pinned other’s code by default: so they can’t maliciously change their code after you import it.

There is a footgun you should watch out for. In a bid for simplicity Val Town sometimes blurs the distinction between a function and an API. For example, consider this val you might write:

```tsx
import { default: OpenAI } from "npm:openai";

export async function gpt3 (args) {
  const openai = new OpenAI({
    apiKey: process.env.openai
  });
  return openai.chat.completions.create(args)
}
```

If another user imported and ran this val themselves, `process.env.openai` would refer to _their_ OpenAI token. However, public or unlisted vals can also be run via our [Run API](https://docs.val.town/api/run), which uses the secrets of the _author_ of the function, not the invoker of the function. Thus anyone who published such a function would be giving away free use of their OpenAI token – without leaking the token itself.

There are ways around this footgun, but in the short-term our advice is to not publish functions that use your secrets. In the medium-term, we are considering deprecating the Run API. While it is cute, convenient, and makes for great demos, every time we blurred the distinction between functions and APIs, we’ve come to regret it. They are two different things, and blurring the distention makes for confusing semantics.

### 7. JSX

Val Town v3 supports JSX! This is a much more convenient way to write bits of HTML in vals: you get syntax highlighting for tags, CodeMirror will auto-insert closing tags for you, syntax errors if you forget to close a tag, nice syntax for attributes - the whole “XML in JavaScript” experience.

To use JSX, you’ll need to insert what TypeScript calls a “[per-file pragma](https://www.typescriptlang.org/tsconfig#jsxImportSource)” - a comment that uses `@jsxImportSource` to specify where the JSX methods are going to come from.

A good default is [Preact](https://github.com/preactjs/preact), which provides a nice `preact-render-to-string` module that lets you quickly turn that JSX object into a string that you can use for a response. Here’s an example:

```tsx
/* @jsxImportSource https://esm.sh/preact */
import { render } from "npm:preact-render-to-string";

const x = 1;

export const someDom = render(<div>Test {x}</div>);
```

And with React:

```tsx
/* @jsxImportSource https://esm.sh/react */
import { renderToString } from "npm:react-dom/server";

const x = "<div/>";

export const reactDom = renderToString(<div x={x}>Test {x}</div>);
```

Here’s an example using Vue to do the same thing:

```tsx
/* @jsxImportSource https://esm.sh/vue */
import { renderToString } from "npm:vue/server-renderer";

const x = "<div/>";

export const vueDom = renderToString(<div x={x}>Test {x}</div>);
```

And one more with Solid:

```tsx
/* @jsxImportSource https://esm.sh/solid-jsx */
import { renderToString } from "npm:solid-js/web";

const x = "<div/>";

export const solidDom = renderToString(() => <div x={x}>Test {x}</div>);
```

Now there’s a pretty important caveat here. When you see JSX, you probably think about client-side apps. Creating some components, with React hooks or Solid signals or whatever kind of client-side state and effects, and rendering them in the client - maybe pre-rendering them on the server with SSR first - but definitely at least “hydrating” them in the client.

Our support for JSX is super convenient and great, and we think it goes super well with low-JavaScript tools like [htmx](https://htmx.org/), but what it _doesn’t_ do is create client-side components. So event listeners, client-side state, React refs, anything that runs in the browser, won’t - for now.

We’re going to keep pushing on this feature and try to find ways to create bundles and support more web-app technologies, but for now we want to be clear about the limitations: Vals that use JSX won’t automatically run on the client-side like you might expect.

### 8. `fetch`

In v2, we proxied all `fetch` requests through SmartProxy, BrightData or ScrapingBee. We also automatically retried failed requests a number of times. This did not apply to `fetch` requests made via imported libraries.

In v3, we will no longer by proxying `fetch` requests by default. Now `fetch` will be faster (because it won’t go through a proxy), but all requests will come from our standard IP addresses, which may be blocked or rate-limited by certain APIs.

You can maintain the old `fetch` behavior by using `vt/std/fetch` instead of `fetch` directly, so you can have your cake and eat it too: fast and normal `fetch` by default, and magically upgraded `vt/std/fetch` when you need it. To minimize breaking your code that relied on the old fetch, our transpiler will point all your old code to use `vt/std/fetch`. You can change that to use regular `fetch` at your discretion.

### 9. `api`

The `api` function that made it easier to call vals via the Run API has been deprecated in favor of `vt/std/run`.

### 10. Evaluation logs

In v2, we instrumented your code to track the inputs and outputs of each val call throughout the call stack. While this futuristic observability was awesome, it was brittle, buggy, and slow.

The v3 runtime collects a much more limited set of data, much more reliably – only the inputs and outputs of the top-level evaluation. It saves only 100kb per part (logs, args, error, and output) in logs.

Evaluations from the v2 will not be accessible in the v3 UI. We will retain archives of them.

The v3 API does not support `/v1/me/runs` and `/v1/vals/{val_id}/runs` and `/v1/runs/{run_id}`. We plan to re-release an API around evaluation data when its API is more stable.

### 11. Eval API

To maintain backwards compatibility, our API routes `/eval` and `/v1/eval` will transpile code from the v2 to the v3 style on each request.

### 12. Promises no longer recursively `await`ed

In v2, we `await`ed all returned values, recursively throughout its data structure, ie if you had an object, which contained a value, which contained a `Promise`, we would `await` that `Promise` for you automatically.

In v3, we will `await` only top-level values. We will no longer `await` recursively. Thus you may need to use `Promise.all` where before you didn’t need to, or you could use [this recursive await helper function](https://www.val.town/v/stevekrouse.awaitAll).

### 13. Vals results not memoized

In v2, if you created a val like `let x = Math.random()` and then referred to `@me.x` it would refer to the output from the last run of that val. Metaphorically, this was like Val Town were a globally shared REPL, where anyone could refer to anyone else’s values. Over time we’ve moved away from this REPL metaphor, and now this behavior is more confusing than helpful.

In v3, the semantics will be classic JavaScript: imported code will be re-run every time, instead of injecting the memoized output from the last run. This is a breaking change that is fairly limited in scope. We are analyzing which vals are affected and will be contacting those users directly with upgrade options.
