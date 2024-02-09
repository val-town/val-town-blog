---
title: Deprecating the Run API
description: Not every function should be an API
pubDate: February 7, 2024
author: André Terron
---

Today we are deprecating our [Run API](https://docs.val.town/api/run/).

:::note{.positive}
✅ This change does not impact current usage. No user action is required.
:::

[Val Town](https://val.town) is a social website to code in the cloud. We simplify how APIs are built and used.

Our Run API allowed any published Val in Val Town to be called as an API endpoint. If you wrote a function that took some parameters and made it public, the Run API would let you call it from the internet instantly, specifying arguments as JSON in a POST request.

The snag is that the Run API _ran as the author_. If you called my function, it would run with my environment variables. This is nifty, but it can also be dangerous and unexpected. That’s something we want to avoid. Most of the time, you publish code on Val Town to share functions for others to use as a library, using _their_ Val Town resources and _their_ environment variables.

### The Run API is now disabled for new vals

For backwards compatibility and to prevent downtime, we have figured out which people and which vals are using the Run API, reviewed all of the uses, and emailed everyone affected. Vals that used the Run API will continue to work, but no new Vals will be able to access the API.

To make an API on Val Town, we recommend [HTTP vals](https://docs.val.town/types/http/). They use the new and wonderful web-standard [“fetch handler” API](https://blog.val.town/blog/the-api-we-forgot-to-name/).

For anyone fond of the old Run API, we created [an adapter that mimics the Run API](https://www.val.town/v/std/rpc) for HTTP vals. You can use that to instantly expose functions as endpoints.

We are excited to continue iterating on improving how APIs are built and used with you all.

As always, if you have any questions or comments, please reach out on [discord](https://discord.gg/dHv45uN5RY), [email](mailto:steve@val.town), or [twitter](https://twitter.com/ValDotTown).

### When every function is an API

Val Town's mission is to simplify programming. We think there's too much boilerplate to deploy an HTTP endpoint. _What if every function could instantly be an API?_, we wondered.

For example, consider this helper function you might write to call OpenAI's GPT4 API:

```tsx
import { default: OpenAI } from "npm:openai";

export const gpt4 = async (content: string, max_tokens: number = 50) => {
  const openai = new OpenAI({
    apiKey: Deno.env.get("openai")
  });
  return await openai.chat.completions.create({
    messages: [{
      role: "user",
      content,
    }],
    model: "gpt-4-1106-preview",
    max_tokens: max_tokens,
  });
};
```

The Run API let you call this function from an HTTP endpoint!

```ts
const completion = await fetch(
  `https://api.val.town/v1/run/stevekrouse.gpt4?args=["tell me a joke"]`,
  {
    method: "POST",
    body: JSON.stringify({ args: ["tell me a joke"] }),
    headers: {
      authorization: "Bearer " + Deno.env.get("valtown"),
    },
  },
);
```

This was pretty magical for folks who have never done backend programming before. Just by writing a function, you've made an API. But there's a catch.

What if you're proud of this val and you want to share it with other people, so you decide to make it public? Now people can see the val on Val Town, and they can import and use it as a function in their own vals, but they can also _run it using the Run API_.

And when they run your gpt4 val via the Run API, it runs _under your own account_, so every request uses your OpenAI API token and counts toward your GPT usage. That probably isn't what you intended!

The Run API was too much of a footgun. We knew we had to fix it ASAP when [easrng](https://easrng.net/) reported a number of vals that could be exploited using the Run API, including from our own team.

### Migrating to HTTP vals

The way to build APIs in Val Town is via an HTTP val. It uses the web-standard [“fetch handler” API](https://blog.val.town/blog/the-api-we-forgot-to-name/).

```tsx
/**
 * Receives a JSON payload of two numbers in an array, like [2, 3],
 * and returns a JSON body of the answer, like 5
 */
export default async function add_numbers(req: Request): Promise<Response> {
  const [a, b]: [number, number] = await req.json();
  return Response.json(a + b);
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

### Deprecation without downtime

Our first priority is always protecting user data. But we couldn't turn off the Run API without causing downtime for people who were using it.

We came up with a deprecation plan that balances these requirements. We wanted to allow vals that are currently being used via the Run API by their author's design to continue running, while preventing any new Vals from being accessible via the Run API.

- As of today, only vals that were actively using the Run API in the last week are allowed to continue using it.
- We've emailed everyone whose vals are included in that list and let them know about the changes.

If you used the Run API recently, we sent you an email with more information. If your val is allow-listed, it will show up as the new "RPC" type. Other vals don't have access to this type. If you accidentally change the type out of RPC, you won’t be able to change it back.

If we somehow missed you in this transition, or you have any other questions, reach out: we’re very active in our [Discord](https://discord.gg/dHv45uN5RY), and we’d love to have a community chat about this! You can also submit specific ideas on our [GitHub Discussions page](https://github.com/val-town/val-town-product/discussions).

This is another big step in our journey to make programming easier. Dive in and start building your APIs today by signing up at [val.town](https://val.town)! And If simplifying API development excites you, we're [hiring](https://www.val.town/careers)!
