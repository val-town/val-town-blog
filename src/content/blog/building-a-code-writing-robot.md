---
title: Building a code-writing robot and keeping it happy
description: Our experiences running LLMs in production
pubDate: November 8, 2024
author: Tom MacWright
---

I recently gave this talk at a lovely event put on by our friends at
[Jamsocket](https://jamsocket.com/), where we discussed different experiences
running LLMs in production. With [Townie](https://blog.val.town/blog/townie/),
we've been dealing with the magic and eccentricities of this new kind
of engineering.

![Title slide with illustration of robot](./code-writing-robot/slide-1.png)

For those who couldn't make it or are interested in following along, here
are some slides and speaker notes.

<br />

![Introduction to Val Town](./code-writing-robot/slide-2.png)

Val Town is mostly a platform for running little bits of JavaScript that we call "vals", and it makes programming accessible to a lot of new people because vals can be super small, simple, and they don't require any configuration. But we've been using LLMs to make it accessible to even more people who want to create things with natural language.

<br />


<video controls><source src="/video/townie-presentation.mp4" /></video>

Here's the feature I'm talking about today - Townie. It's the Val Town bot. If you want to be old-fashioned, you can write the code yourself with your hands and fingers, but Townie will let you write it indirectly with English. It's similar in broad strokes to [Anthropic Artifacts](https://www.anthropic.com/news/artifacts) or [Vercel v0](https://v0.dev/), but one of the biggest differences is that the artifacts have full-stack backends, can be shared and forked, and so on.

<br />


![Flowchart of Townie's LLM usage, including using Sonnet and OpenAI](./code-writing-robot/slide-4.png)

We're running a pretty plain-vanilla LLM setup! The meat and potatoes of Val Town are the challenges of running a lot of user code, at scale, with good security guarantees, and building community and collaboration tools. We aren't training our own models or running our own GPU clusters.

So for LLMs, we're riding on the coattails of [Anthropic](https://www.anthropic.com/) and OpenAI and running none of our own LLM infrastructure.

<br />


![LLMs are chaotic](./code-writing-robot/slide-5.png)

But despite the simplicity, LLMs are pretty chaotic, and this has taken longer to build than we expected.

<br />


![LLMs are great but have drawbacks like being expensive, unreliable, unpredictable, and slow](./code-writing-robot/slide-6.png)

LLMs are unlike everything else on the backend: they can easily blow up your server costs, they have plenty of downtime, they're really hard to tune, and they can be super, super slow. Here's a quick run-through of how we've been dealing with these issues.

<br />


![Good LLM models are expensive and eat money](./code-writing-robot/slide-7.png)

The good models are expensive. LLMs eat money. We're practicing financial discipline in a non-zero interest-rate world. How do we do it?

<br />


![We fix this by using different LLMs](./code-writing-robot/slide-8.png)

The easiest cost and performance alpha is just using different providers for different tasks. For example, when someone creates a val, we want to generate the TypeScript code for that val, which is pretty nitpicky work: it needs to work with [Deno](https://deno.com/)'s TypeScript environment and it should reliably know whether it's running on the frontend or the backend, and so on. For that we use Sonnet, which is pretty expensive.

But then once we have the generate code, we want to generate a name for it, given both the prompt and response to that prompt: for that we use OpenAI 4o, which is cheap, fast, and good enough.


<br />

![Use am abstraction library because you will switch models](./code-writing-robot/slide-9.png)

And to use different models, it's really nice to use an abstraction library like [@vercel/ai](https://sdk.vercel.ai/docs/introduction), which is what we've been using. I know that there are several hundred options, so that isn't a fully-researched approved recommendation, but it's worked fine for us.

<br />


![Large context windows get expensive and chat interfaces lead to them](./code-writing-robot/slide-11.png)

So the other problem is that this is a chat interface, and none of the LLM providers provide persistence: you have to put the whole chat history into context for every single new message. And the responses that we get from Claude can be pretty long - these are complete programs that we're getting back, lots of tokens. So we've basically dispatched three different approaches to this problem.

<br />


![We remind users on a regular basis that long conversations are worse and more expensive](./code-writing-robot/slide-12.png)

Our first line of defense against this is just reminding users that Townie gets dumber when you give it more input. This is pretty similar to the UIs in other tools that say the same thing. Basically once you get to the tenth reply or so, Townie will start losing the thread of what you wanted in the first place.

<br />


![caching old messages saves us a lot of money](./code-writing-robot/slide-14.png)

Caching old messages somehow lets Anthropic amortize the cost of parsing messages and turning them into embeddings or whatever kind of fancy internal representation they have. It costs more money to create the cached stuff initially, but less to use it later.

<br />


![We can visualize our cache usage with Observable](./code-writing-robot/slide-15.png)

Storing all of this in the database was also a pretty big win - so I was able to just query this from our messages table right into an Observable notebook.

This works! You can see some of the effects here, where these blue lines that are spiking up are people having super long conversations with Townie, but instead of hitting the tokens statistic, they're being read from the cache.

<br />

![Looking at a specific chart of cache usage](./code-writing-robot/slide-16.png)

Here's the cache read tokens, zoom and enhance style, colored by which thread they're part of: you can see some spots where it's just the same exact thread that's benefiting from the caching.

<br />

![Truncating old messages doesn't work](./code-writing-robot/slide-17.png)

A funny thing that doesn't work is trying to truncate old messages. Like, you're sending code back and forth, right - so if the LLM writes code and fixes some bug you have two copies of the code in the context window. So we tried replacing old code replies with comments, or something like "truncated for brevity," but the LLM took this very literally. We found that if _we_ truncated code in the conversation history, the LLM decides to truncate code in its responses, too.

<br />

![Using diffs is too unreliable](./code-writing-robot/slide-18.png)

Another potential solution that we've struggled to implement successfully is _diffs_. Claude can convincingly provide a good [unified diff](https://en.wikipedia.org/wiki/Diff#Unified_format) some percentage of the time, but it is very sloppy most of the time. Diffs will have the wrong line numbers or missing context, and they won't work with any off-the-shelf merge implementations. We've implemented our own fuzzy merge solution, but even then, diffs haven't been reliable enough for regular usage.

<br />

![Anthropic uptime](./code-writing-robot/slide-20.png)
![OpenAI uptime](./code-writing-robot/slide-21.png)

Unfortunately, we've also hit reliability issues with both Anthropic and OpenAI – both center around two nines of uptime recently. There's not too much we can do about this without hosting the models ourselves, so we have just decided to really double down on implementing good error handling in our application and have recently adopted [neverthrow](https://github.com/supermacro/neverthrow) to improve how we use errors in TypeScript.

<br />

![Tuning our custom prompt with Braintrust](./code-writing-robot/slide-26.png)

We've also spent a lot of time tuning our custom prompt, which felt like shooting in the dark until we started using a system for evals. [Braintrust](https://braintrust.dev/) has been great for this.

<br />

![Progress with braintrust](./code-writing-robot/slide-27.png)

Here's our progress with Braintrust over time. We highlight different bad behaviors that we want to forbid from our outputs: things like using `require()` instead of `import`, using the `alert()` method, or omitting code from results. Some evals rely on simple string matching, while others use a secondary LLM to judge results from the "smart" LLM.

<br />


![Notifications on pull requests](./code-writing-robot/slide-28.png)

Braintrust gives us notifications on each Pull Request, letting us know whether a given system prompt change is a regression or improvement in quality.

<br />

![Implementing our UI with streaming](./code-writing-robot/slide-34.png)

The final challenge of Townie is simply implementing the UI, which is anything but simple. We've found a nice middle ground between an overly traditional request/response flow and a fully real-time, streaming, WebSocket-based infrastructure. We're using tRPC’s [Batch Stream Link](https://trpc.io/docs/client/links/httpBatchStreamLink), which pairs traditional POST requests with streaming responses. It gives us the nice type-safety of tRPC and lets us structure our responses using [Async Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator) on the server-side.

---

That's it! Thanks for following along.
