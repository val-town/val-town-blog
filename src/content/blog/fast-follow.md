---
title: Fast Following in LLM Code Generation
description: From Github Copilot to ChatGPT to Claude Artifacts, how Val Town's borrowed the best of all the code generation tools
pubDate: Jan 2, 2025
author: Steve Krouse
---

import Townie from "./val-town-newsletter-18/townie.png";

Since the beginnings of Val Town in 2022, our users have been clamouring for the state-of-the-art LLM code generation experience. At the time, it was Github Copilot, but then it was ChatGPT, then Claude Artifacts, and now Cursor and Windsurf. We've been trying our best to keep up. Looking back over 2024, our efforts have really been a series of fast-follows. Some successful and others false-starts. This article is a historical account of our efforts, giving credit where it is due.

### Github Copilot Completions

The story starts, of course, with Github Copilot. From Day 1, users were begging for a completions experience.

We were wary of building this ourselves, but one day we stumbled upon [codemirror-copilot](https://github.com/asadm/codemirror-copilot), and hooked it up. It was just ok. The completions ChatGPT provided were not great, and the latency was bad.

We researched the space and eventually found [Codeium](https://codeium.com/) as the best provider, with good completions and great latency. We [launched with Codeium](https://blog.val.town/blog/val-town-newsletter-16/#-codeium-completions) in April 2022. Our [codemirror-codeium](https://github.com/val-town/codemirror-codeium) component is open source. It's been pretty great. We turn it on by default for new users (though you can disable it in your [editor settings](https://www.val.town/settings/editor)).

### ChatGPT

Then came ChatGPT. We found our users asking it to write Val Town code, and copying and pasting it back into Val Town. We figured we could automate that process for our users: provide an interface with a pre-filled system prompt and a one-click way to save the generated code as a val.

<Image src={Townie} alt="Townie chatbot example generating a wikipedia proxy" />

The [first version of Townie](https://blog.val.town/blog/val-town-newsletter-18/#-townie) was born, a simple chat interface, very much inspired by ChatGPT, powered by GPT-3.5. It was just ok.

### ChatGPT Tool Use

Earlier this year, ChatGPT Function Calling, now called 'tool-use', was seen as the next big thing. The promise was that with a good OpenAPI spec, AI would be able to help our users do just about anything on Val Town. So we dutifully cleaned up our OpenAPI spec, and [rebuilt Townie around it](https://blog.val.town/blog/openapi/#our-ai-townie-can-now-call-our-rest-api).

<iframe
  width="100%"
  height="420"
  src="https://www.youtube-nocookie.com/embed/clj1prZunW0?si=O7l6qvW8B2OB79NT"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>

It was fine. The issue was that the interface was too generic. In theory, it was capable of doing anything (editing your blobs or sqlite data), but it wasn't very useful at anything. Most notably, it wasn't a good interface for writing code. It could write the code, but it wasn't optimized to let you run that code, see the output, debug it, ask the AI for more help, etc. The feedback loop was bad.

### Claude Artifacts

We had begun to see the potential of Claude 3.5 Sonnet for code generation with the amazing results produced by [Websim](https://websim.ai/). But it was the launch of Claude Artifacts that really got our attention. They solved the tight feedback loop problem that we saw with our ChatGPT tool use version. And thus after about a month of prototyping and building, the [current version of Townie](https://blog.val.town/blog/codegen/) was born in August 2024.

For a couple weeks there, it felt like we had one of the best tools in the space.We were the only tool that could generate a fullstack app, with a frontend, backend, and database, in minutes, and fully deployed. Now it feels like there are dozens. Live by the fast follow, die by the fast follow.

### Our Contributions

#### Diffs

While we were out in front, we invested a lot of resources in trying to stay there: we invested a lot in Townie features, in particular we worked hard to get the LLM producing diffs, based on [work we say in Aider](https://aider.chat/docs/unified-diffs.html). We were able to get it to work most of the time, but it was not reliable enough for regular use. It's now off by default, so you have to ask Townie to "reply in diff" if you'd like to try your luck with it.

Our system prompt has always been open (you can view it in your Townie settings) TODO link to a github gist version and SimonW discussions on it. So you can see how we get it done.

We're scared off of investing more time here right now, but we're eagerly waiting developments in the space that solve the problem such that we can run with their solution. Anthropic's long-rumored fast-edit mode could do it. OpenAI launched their own Predicted Outputs API, which is also compelling. Or it could simply be faster or smaller models, or faster chips. I'm a huge fan of Cerebras, and made Cerebras coder a couple weeks ago to show how game-changing instant inference is. Grok and others of course aren't too far behind. If we can get something as smart as DeepSeek on one of those chips, we're basically there, and I think that would unleash a whole new class of tools and UI interactions.

#### Autodetecting errors

We did contribute one possibly-novel UI interaction, where the LLM automatically detect errors and ask you if you'd like it to try to solve them. It's not particularly novel (ie others would have thought of this if we didn't) but maybe the folks at [Anthropic](https://support.anthropic.com/en/articles/9949260-try-fixing-with-claude-for-artifact-errors) or Bolt saw our implementation and it inspired their own. I'd like to think we're not _only_ free-riding in this space.

### Hosted runtime and included APIs

Maybe some of our UI ideas made it into Github Spark too, including deployment-free hosting, and persistent data storage, and the ability to use LLMs in your apps without a your own API key – their versions of [@std/sqlite](https://docs.val.town/std/sqlite/) and [@std/openai](https://docs.val.town/std/openai/), respectively. But of course, we're not the first hosting company to provide an LLM tool; that honor likely goes to Vercel and v0.

### Cursor

The next big thing was [Cursor](TODO). I must admit that I never personally fell in love with it. I think it's best for development in larger codebases, while my work recently is in vals in Val Town, which historically have been smaller, single-file projects, of 1000 lines or less (our upcoming launch of Projects, now in private beta, will change this). However Cursor is a real pioneer in the space, and has some UI interactions there that we have an eye to copy.

### Windsurf

Over the holiday, I fell in love with [Windsurf](TODO) by the folks at Codeium. It's Cascade feature is a chat interface, which has tool use and multi-turn agentic capabilities, to search through your codebase and edit multiple files. It feels a bit like we're coming full-circle back to when we did our tool-use version of Townie. However, I think we now all understand that you can't simply give your whole OpenAPI spec to an LLM and expect good results. The magic of Windsurf is that they carefully crafted what actions their agent can take.

I am salivating at the idea of giving Townie some of these capabilities. Imagine if Townie could search through all public vals, and maybe even npm, to find code to help you.

### Devin

Watching Windsurf take multiple actions on my behalf without my input is very inspirational. I'm dreaming of a world where Townie not only detects errors, but also automatically tries to fix them, possibly multiple times, possibly in parallel in multiple branches, without any human interaction. Here, of course, we'd be getting into territory mostly explored by the folks at [Devin](TODO).

For starters, we could feed back screenshots of the outputted website back to the LLM, but eventually you could imagine giving it a full web browser so it can itself poke around the app, like a human would, to see what features work and which ones don't. And then write itself some tests, also like a human would, to make sure things don't break as it continues to iterate.

I have a vague sense by the end of this year that you'll be able to tell Townie to "make a fully realistic Hacker News Clone, with user accounts, nested comments, upvotes, downvotes" and it could iterate for hours on your behalf. You could even go to bed and wake up with it done.

### Collaboration and competition

Is this fast-following competitive or is it collaborative? So far it's been feeling mostly collaborative. The pie is so freaking large -- there are millions and maybe billions who are jumping at the chance to code -- that we're all happy to help each other scramble to keep up with the demand. I love that, and hope it remains this way. We at Val Town certainly don't keep any secrets. Our system prompt is open, and we blog openly about all our interesting technical choices.

### Should we bow out?

Should we get out of this race entirely and just do a better job integrating with the editors like VSCode, Cursor, Windsurf, and even Bolt? Maybe! We're planning to dip our toes into integrating: we're planning to get more local development support, and possibly even a FUSE editor that would make it easy to use external editors in Val Town.

However, it still feels like there's a lot to be gained with an integrated web AI code editor experience in Val Town. We have had a lot of success fast-following so far, and think it's worth continuing to do so.

### Townie

If you've made it this far in the article, you should really [try out Townie](https://www.val.town/townie). It still is one of the best tools to create fullstack web apps. Make yourself a X, Y, or Z. And if you do, please let me know (steve@val.town) how we should improve it.
