---
title: Deprecating the Run API
generated: 1707243271823
description: Not every function should be an API
pubDate: February 6, 2024
author: André Terron
---

Today we are deprecating our [Run API](https://docs.val.town/api/run/).

<aside>
✅ This change does not impact current usage. No user action is required.
</aside>

[Val Town](https://val.town) is a social website to code in the cloud. We simplify how APIs are built and used.

Our Run API allowed any published function in Val Town to be called as an API endpoint. If you wrote a function that took some parameters, and made it public, the Run API would let you call it from the internet instantly, specifying arguments as JSON in a POST request.

The snag is that the Run API _ran vals as the author_. If you called my function, it would run with my environment variables. This is nifty, but it can also be dangerous and unexpected. That’s something we want to avoid. Most of the time, you publish code on Val Town to share functions for others to use as a library, using _their_ Val Town resources and _their_ environment variables.

**The Run API is now disabled by default.**

For backwards compatibility and to prevent downtime, we have enabled the Run API specifically on the vals that have been relying on it. We have emailed the owners of those vals that their vals are still accessible via the Run API and how to turn that off. If you did not receive an email, all of your vals are now inaccessible to the Run API.

To make an API on Val Town going forward, we recommend [HTTP vals](https://docs.val.town/types/http/). They use the new and wonderful web-standard [“fetch handler” API](https://blog.val.town/blog/the-api-we-forgot-to-name/).

For anyone fond of the old Run API, we created [an adapter that mimics the Run API](https://www.val.town/v/std/rpc), in user-space, on top of the fetch handler API. Anyone who loves the Run API can keep using it, and even customize it.

We are excited to continue iterating on improving how APIs are built and used with you all.

As always, if you have any questions or comments, please reach out on [discord](https://discord.gg/dHv45uN5RY), [email](mailto:steve@val.town), or [twitter](https://twitter.com/ValDotTown).

# When everything is an API

If you want to build an API in Val Town today, you use an HTTP val. They provide a web-standard interface to receive requests and send responses. The Run API was a precursor to HTTP vals. It exposes a function to the internet. However, any publicly accessible function could be invoked by the Run API.

For example, consider this val you might write:

```tsx
import { default: OpenAI } from "npm:openai";

export async function gpt3 (args) {
  const openai = new OpenAI({
    apiKey: Deno.env.get("openai")
  });
  return openai.chat.completions.create(args)
}
```

If the author intended on using this as the backend for a client app, they'd use the Run API to invoke it using their secrets – without leaking the token.

And if the author wrote such a function to be used as a library, other users can import and run this val themselves. `Deno.env.get("openai")` would refer to the _invoker_'s OpenAI token.

However, any public or unlisted val could be invoked by the Run API. So instead of using the _invoker_'s OpenAI token, the Run API would use the _author_'s token – without leaking the token itself.

The Run API was too much of a footgun. We knew we had to fix it ASAP when [Eas](https://easrng.net/) reported a number of vals that could be exploited using the Run API, including from our own team.

# Deprecation without downtime

Our first priority is always protecting user data. But we couldn't simply disable the API without causing downtime to our users.

The Run API resulted in a way to run vals that might not be aligned with the original intent of the author. We decided to immediately deprecate the `/run` endpoint. Vals that relied on that API were allow-listed to continue working.

If you used the Run API in the last few days, we sent you an email with more information. If your val is allow-listed, it will show up as the new "RPC" type. It’s not possible to create new “RPC” vals. If you accidentally change the type out of "RPC", you won’t be able to change it back. Reach out to us if you need to allow-list one of your vals.

In theory, the “RPC” type would allow us to keep the Run API running indefinitely. We wouldn’t even need to fully deprecate it. But if you want an API, we have a much better way of building one. You could even build your own `/run` endpoint on top of it:

# APIs on Val Town

The proper way to build APIs in val town is via an HTTP val. Here’s how to do it:

```tsx
function addNumbers(a: number, b: number) {
  return a + b;
}

// api wrapper
export default async function add_numbers(req: Request): Promise<Response> {
  const [a, b]: [number, number] = await req.json();
  const result = addNumbers(a, b);
  return Response.json(result);
}
```

If you did like how the `/run` API worked, we built a [helper](https://www.val.town/v/std/rpc) for you:

```tsx
import { rpc } from "https://esm.town/v/std/rpc?v=5";

export const add_numbers = rpc(async (a: number, b: number) => {
  return a + b;
});
```

Check out the [`std/rpc`'s readme](https://www.val.town/v/std/rpc) for instructions on how to use it. That should minimize the work needed to migrate from the Run API into an HTTP val.

We are committed to making it as easy as possible to make APIs, so expect more improvements, and if you have any ideas, we’re very active in our [Discord](https://discord.gg/dHv45uN5RY), and we’d love to have a community chat about this! You can also submit specific ideas on our [GitHub Discussions page](https://github.com/val-town/val-town-product/discussions).
