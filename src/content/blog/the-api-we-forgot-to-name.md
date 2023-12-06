---
title: The API we forgot to name
generated: 1701894028894
description: An API that takes a Request and returns a Response - what was that, again?
pubDate: October 19, 2023
author: Steven Krouse
---

[Two years ago](https://blog.cloudflare.com/workers-javascript-modules/) Cloudflare released an API for creating servers in JavaScript. Now every modern JavaScript cloud provider — Deno, Vercel, Bun, Netlify, Fastly, Lagon — supports it. If you’ve written a serverless JavaScript API in the last two years, you likely know it well.

<div class="not-content">
  <iframe src="https://www.val.town/embed/stevekrouse.jsonOkExample" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

It’s a wonderful API. It builds on the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects we’re familiar with from [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). I can see why it got adopted so quickly.

The only problem is that we forgot to give it a name.

I entered this story when we released this API at [Val Town](https://val.town). We’re a new cloud vendor that runs server-side JavaScript. Many of the examples in this post link to vals, ie [this one](https://www.val.town/v/stevekrouse.jsonOkExample) that you [can run here](https://stevekrouse-jsonokexample.web.val.run/).

I was having trouble googling for how to do things, write its [docs](https://docs.val.town/api/web), and [announcement](https://twitter.com/stevekrouse/status/1687173420289564673?s=20). We had to distinguish it from our [ExpressJS API](https://docs.val.town/api/express). We decided on “Web API”, because it’s short and nods to “web standards.” But the mystery remained and ate away at me. How has nobody noticed that the main API of our industry — _server-side JavaScript is usually for servers!_ — has no name?

How are we supposed to talk about it? How are we supposed to google or ask ChatGPT how to do [routing](https://docs.val.town/api/web#da195b1cc50b4ee78e683cccfb9d9c9d) or [parse query params](https://www.val.town/v/stevekrouse.queryParams) or [get headers](https://www.val.town/v/tmcw.headersExample) or [return HTML](https://www.val.town/v/tmcw.htmlExample)? It’s easy to figure out how to do any of those things in Express. But without a name, we're forced to search for “redirect in Cloudflare Workers” or “set cookie in Vercel Edge Function” which feels so dirty. What’s even the point of rallying around web standards?!

You may be thinking, surely there must be a name to this API. How has all these cloud providers been referring to it in their docs? Great question! I spent a couple frustrating hours collecting those docs — remember, I couldn’t google for these docs because this API has no name — and here’s how folks refer to it:

- [Cloudflare](https://blog.cloudflare.com/workers-javascript-modules/): “ES Module Syntax”
- [Deno](https://deno.land/manual@v1.36.4/runtime/http_server_apis#http-server-apis): `Deno.serve`
- [Vercel](https://vercel.com/docs/functions/edge-functions/edge-functions-api#edge-functions-signature): “Edge functions”
- [Bun](https://bun.sh/docs/api/http): `Bun.serve`
- [Lagon](https://docs.lagon.app/runtime-apis#handler): “WinterCG conventions” and “using the Web APIs you already know”

To be fair, each of these cloud platforms does handle this API in slightly different ways, and more in this later, but the overall structure of accepting a `Request` and returning a `Response` is common to them all. This API is the true, web-standard successor to Express, that was designed so well that totally won, in two years, without a name, and nobody noticed.

The proximate reason it doesn't have a name is that Cloudflare didn't name it. They framed it as a small syntax upgrade, [distinguishing it it from their earlier “Service Worker Syntax” as their new “ES Modules Syntax.”](https://blog.cloudflare.com/workers-javascript-modules/) But “ServiceWorker API in ES Module syntax” doesn't exactly roll off the tongue.

I sent an earliest draft of this post to friends at Cloudflare and to my delight, they agreed! Apparently they were already using one of the names internally that I suggested in that blog post: “fetch handler”. They then reorganized their entire Worker docs around different types of “handlers” and quietly published them.

![https://developers.cloudflare.com/workers/runtime-apis/handlers/](./the-api-we-forgot-to-name/screenshot_2023-10-19_at_123546.png)

[https://developers.cloudflare.com/workers/runtime-apis/handlers/](https://developers.cloudflare.com/workers/runtime-apis/handlers/)

That was easier than expected! We now have a name from the folks arguably best positioned to give one. I think it’s a good name. We at Val Town are on board to rewrite our docs to around it.

There is a working group for JavaScript cloud vendors: [WinterCG](https://wintercg.org/). I went to [a meeting a couple weeks ago](https://github.com/wintercg/admin/issues/56), and asked about working towards a name and standard for this API. Apparently [there was some initial research](https://github.com/wintercg/proposal-functions-api), apparently led by folks from Red Hat.

The effort has stalled out for a couple of reasons. First, many of the biggest players have wholly incompatible APIs, including AWS Lambda and Red Hat OpenShift Serverless. The core of this API is inputting a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and outputting a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response), and they don’t do that. Second, while many providers support [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)/[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects – Cloudflare, Vercel, Netlify, Deno, Bun, Lagon, Fastly – many also support additional inputs. Cloudflare’s Fetch Handler takes two extra arguments, `env` and `ctx`, and both [are quite complex and would be a headache to standardize](https://github.com/wintercg/proposal-functions-api/blob/main/docs/implementations/cloudflare.md). Vercel also inputs a `context` object, which like Cloudflare’s `ctx`, has a very useful `waitUntil` method ([which has browser roots](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil)).

From where I’m sitting, I think it’s safe to say that the industry has moved, and AWS Lambda and Red Hat need to come along with the rest of us. As for the extra inputs, why don’t we leave room for those to be vendor specific? Let’s rally around the parts of this standard that we can all agree on: a “Fetch handler” is a function that inputs a `Request` as it’s first argument, can have arbitrary other arguments, and outputs a `Response`.

I don’t know how to actually write a serious “standard”, nor do I know which standards body would be responsible for publishing it. WinterCG is only a “community group” so they can’t publish standards. Either way, I’m on a mission to get this API named, so hopefully I’ll find out soon. Shoot me a note (steve@val.town) if you have suggestions.
