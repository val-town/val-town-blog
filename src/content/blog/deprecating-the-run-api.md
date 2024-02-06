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

Our Run API allowed any function in Val Town to be called as an API endpoint. If you wrote a function that took some parameters, the Run API would let you call it from the internet instantly, specifying arguments as JSON in a POST request.

The snag is that the Run API _ran vals as the author_. If you called my function, it would run with my environment variables. This is nifty, but it can also be dangerous and unexpected. That’s something we want to avoid. Most of the time, you publish code on Val Town to share functions for others to use as a library, using _their_ Val Town resources and _their_ environment variables.

Starting today, the Run API will be disabled by default. We have enabled the Run API on the vals that have been relying on it, and emailed the owners of those vals.

Going forward, we recommend [HTTP vals](https://docs.val.town/types/http/) to make APIs. It uses the new and wonderful web-standard “fetch handler” API. We’re so passionate about this API that we’re [trying to get it named!](https://blog.val.town/blog/the-api-we-forgot-to-name/)

For nostalgia’s sake, we have created an adapter that mimics our Run API, in user-space, on top of HTTP vals. Anyone who loves the Run API can keep using it, and now even customize it.

We are excited to continue iterating on improving how APIs are built and used with you all.

As always, if you have any questions or comments, please reach out on [discord](https://discord.gg/dHv45uN5RY), [email](mailto:steve@val.town), or [twitter](https://twitter.com/ValDotTown).

# Library vs API

When you write code for others, there are 2 prevalent permission models you can take:

1. Library: You share your code on GitHub or npm. Others copy or install your code on their codebase. They run your code with access to their files and environment variables. The code runs in the caller’s environment. In Val Town, you run code with these semantics when you import someone else’s val.
2. API: You run the code on your infrastructure, and if someone want to run your code, they usually send a request to your server, that way your code can access your private information, like keys to other services, or configurations, and you return the response. In val town, you run in API mode when you send a request to an HTTP val, or using the Run API.

If you want the full details about these permission models, and how we’ve been iterating on them, take a look at our [Restricted Library Mode blog post](https://blog.val.town/blog/restricted-library-mode/) and our [v3 announcement post](https://blog.val.town/blog/introducing-val-town-v3/). In summary, early val town ran every val in API mode, but that’s not what developers expected when running JavaScript. When we migrated to be more web standard with our v3 runtime, vals could be imported as libraries, and we created the Run API as a way to build APIs on val town.

But the problem is that any publicly accessible val could be executed from the Run API as an API, even when the author didn’t have that intention. This is a huge footgun, and we were well aware of it, here’s a [section from our blog post introducing the v3 runtime](https://blog.val.town/blog/introducing-val-town-v3/#6-goodbye-restricted-library-mode):

> There is a footgun you should watch out for. In a bid for simplicity Val Town sometimes blurs the distinction between a function and an API. For example, consider this val you might write:
>
> ```tsx
> import { default: OpenAI } from "npm:openai";
>
> export async function gpt3 (args) {
>   const openai = new OpenAI({
>     apiKey: process.env.openai
>   });
>   return openai.chat.completions.create(args)
> }
> ```
>
> If another user imported and ran this val themselves, `process.env.openai` would refer to *their* OpenAI token. However, public or unlisted vals can also be run via our [Run API](https://docs.val.town/api/run), which uses the secrets of the *author* of the function, not the invoker of the function. Thus anyone who published such a function would be giving away free use of their OpenAI token – without leaking the token itself.
>
> There are ways around this footgun, but in the short-term our advice is to not publish functions that use your secrets. In the medium-term, we are considering deprecating the Run API. While it is cute, convenient, and makes for great demos, every time we blurred the distinction between functions and APIs, we’ve come to regret it. They are two different things, and blurring the distention makes for confusing semantics.

We had in our Jan/Feb roadmap to deprecate the `/run` API, but the urgency only came after [Eas](https://easrng.net/) found a number of vals that could be exploited using the `/run` API, including from our own team. We apologize to everyone for leaving this known footgun active and hidden for so long.

# The new “RPC” val type

Our first priority is always protecting user data, and we also don’t want to disrupt our users with breaking changes or downtime.

In the end, this duality of permissions was too confusing, and the Run API resulted in a way to run vals that might not be aligned with the original intent of the author. We decided to immediately deprecate the `/run` endpoint going forward, and we allow-listed the vals that depend on it so that they can still be executed using that API, to avoid disrupting the users that rely on them.

If your val depends on the Run API, and has been used in the last 10 days, we emailed you and updated its type to “RPC”, that means it’s allow-listed for the Run API. It’s not possible to create new “RPC” vals, so if you accidentally change it, you won’t be able to change it back. Reach out to us if you need one of your vals to be set to “RPC”

In theory, the “RPC” type would allow us to keep the Run API running indefinitely, and we wouldn’t even need to fully deprecate it. But if you want an API, we have a much better way of building one, and you could even build your own `/run` endpoint on top of it:

# APIs on Val Town

The proper way to build APIs in val town is via an HTTP val. Here’s how to do it, it’s super simple:

```tsx
export default async function myApi(req: Request): Promise<Response> {
  return Response.json({ ok: true });
}
```

If you did like how the `/run` API worked, we built a helper for you:

```tsx
import { rpc } from "https://esm.town/v/std/rpc?v=3";

export const myApi = rpc(async (a: number, b: number) => {
  return a + b;
});
```

And you’d be able to access it from `username-myApi.val.run?args=[1,2]`, or by issuing a POST request to `username-myApi.val.run` with the body `[1,2]`. That should minimize the work needed to migrate from the Run API into an HTTP val.

We are committed to making it as easy as possible to make APIs, so expect more improvements, and if you have any ideas, we’re very active in our [Discord](https://discord.gg/dHv45uN5RY), and we’d love to have a community chat about this! You can also submit specific ideas on our [GitHub Discussions page](https://github.com/val-town/val-town-product/discussions).
