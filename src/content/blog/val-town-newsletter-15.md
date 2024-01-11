---
title: Val Town Newsletter 15
description: Pull Requests, Val Editor Redesign, AI Suggestions, OSS Docs, New Astro Blog, Templates
pubDate: December 15, 2023
author: Steven Krouse
---

In the last two weeks, we launched Pull Requests, redesigned the Val Editor, shipped Github Copilot-like AI Suggestions, relaunched our docs and blog sites on Astro, and a bunch of smaller things.

Coming up soon is more polish, collaboration features, and custom domains. Hopefully early next year, we're also going to be benchmarking & improving the runtime performance of Val Town v3 and updating the limits accordingly.

The community has made hundreds of really cool vals recently (links below), including through collaboration in the Discord recently. [Come join us!](https://discord.gg/dHv45uN5RY) 👋

### Pull Requests

You can now send Pull Requests to vals! Below we demonstrate forking a val, adding a feature, submitting a PR, then switching accounts, and merging the PR.

<video controls><source src="/video/pr_demo.mp4" /></video>

### Editor Redesign

We [redesigned the Val Editor](https://blog.val.town/blog/editor-redesign/) to make it clearer how to run all the different types of vals and view their logs. We are rolling out these changes over the next two weeks.

![HTTP handler value showing configuration of the sent request](./editor-redesign/web.png)

### AI Suggestions

It's like Github Copilot, but for Val Town!

<video id="copilot" autoPlay loop><source src="/video/copilot-demo.mp4" /></video>

<script>
  let video = document.getElementById("copilot")
  video.playbackRate = 2
</script>

It's free for everyone in beta. We'll follow up with pricing once we work out the kinks.

### OSS Docs

We launched our [new docs site](https://docs.val.town/) on [Astro Starlight](https://starlight.astro.build/) and [open-sourced it](https://github.com/val-town/val-town-docs).

![docs](./val-town-newsletter-14/docs.png)

Pull requests welcome! Huge shoutout to [Xkonti](https://www.val.town/u/xkonti) who's been contributing a ton of high-leverage PRs to our new docs and [mattx](https://val.town/u/mattx) for building out [this fantastic guide to working with Google Sheets in Val Town](https://docs.val.town/integrations/google-sheets/) 🤩

### Misc Updates

- Relaunched our and [open-sourced](https://github.com/val-town/val-town-blog) our blog
- `Run in Val Town` button on code in our docs [🙏 Xkonti](https://github.com/val-town/val-town-docs/pull/41)
- Make logs vertically resizable
- Import Environment Variables from .env files
- [API updates: val names & privacy](https://discord.com/channels/1020432421243592714/1020432421243592717/1182456286433005638)
- Copy `Deno.env.get("name")` when you make a new env variable
- Renamed "Secrets" to "Environment Variables" [🙏 Xkonti](https://github.com/val-town/val-town-docs/pull/48)
- Val Templates for common patterns: like importing from npm, env variables, JSX, emailing yourself, persistence, OpenAI…
- Make comments in the editor a lighter color
- Linkify @username/valname references in READMEs and comments
- Improved onboarding survey questions
- [Annual survey](https://forms.gle/sGkKodhJiqdXnrmQ6)
- Fix `URLPattern` bug
- Linkify val error stack traces
- Better error messages on `std/email`
- Fix evaluation viewing bug
- Fix error notification bug

### Roadmap

- Notifications from comments on vals you don't own but commented on
- Custom domains
- Editor redesigns
- `std/openai` (like Blob, SQLite, and Email)
- Improved AI suggestions
- Requests for pull requests aka "Todos" (kinda like Github Issues)
- Community feature request board
- Public folders (aka Projects)
- Dashboard
- Company/Team account
- Benchmark v3 runtime performance and update limits
- Improved runtime performance

### Cool vals

- [@pomdtr](https://www.val.town/u/pomdtr)'s upgraded the [Val Town CLI](https://github.com/pomdtr/vt) to manage vals, blobs, sqlite
- [@saolsen](https://www.val.town/u/saolsen) pitted val against val in a [Connect 4 Bot Royale](https://www.val.town/v/saolsen/connect4_site)
- [@rlesser](https://www.val.town/u/rlesser) visualized [your val's dependency graph](https://www.val.town/v/rlesser/dependency_graph) ([example](https://rlesser-dependency_graph.web.val.run/nbbaier/vtIdeaAggregator))
- [@pomdtr](https://www.val.town/u/pomdtr) added [basic auth middleware](https://www.val.town/v/pomdtr/basicAuth) using your Val Town auth token
- [@Glench](https://www.val.town/u/Glench) subscribes to [an RSS feed users trying to delete their Google Photos](https://www.val.town/v/Glench/googlePhotosMarketingRSS) (for marketing [his extension](https://chromewebstore.google.com/detail/bebhhjmapjadpdkkhbkpnpbjhkhndofl))
- [@xkonti](https://www.val.town/u/xkonti) created a [a GPT memory backend](https://www.val.town/v/xkonti/gptMemoryManager)
- [@nilslice](https://www.val.town/u/nilslice) (founder of [extism](https://extism.org/)) demoed [Val Town & extism wasm](https://www.val.town/v/nilslice/md2html)
- [@seep](https://www.val.town/u/seep) remotely start and stop their car via [a Subaru SDK](https://www.val.town/v/seep/subaru)!!!
- [@stevekrouse](https://www.val.town/u/stevekrouse) manages [blob storage](https://www.val.town/v/stevekrouse/blob_admin) & [sqlite](https://www.val.town/v/stevekrouse/sqlite_admin) with these admin panels
- [@karfau](https://www.val.town/u/karfau) exposed [a GitHub emoji API](https://www.val.town/v/karfau/githubEmoji)
- [@dupontgu](https://www.val.town/u/dupontgu) generated [ 3D model STL files](https://www.val.town/v/dupontgu/washer_3d) from query params ([example](https://dupontgu-washer_3d.web.val.run/?t=2&hr=8&r=10))
- [@fab1an](https://www.val.town/u/fab1an) exposed [an API to blob storage](https://www.val.town/v/fab1an/databin)
- [@karfau](https://www.val.town/u/karfau) and [@robsimmons](https://www.val.town/u/robsimmons) did [Advent of Code on Val Town](https://www.val.town/search?q=aoc)
- [@vladimyr](https://www.val.town/u/vladimyr) made [a podcast badge](https://www.val.town/v/vladimyr/podcastBadge) showing the latest episode time
- [@nbbaier](https://www.val.town/u/nbbaier) made [a list of ideas he wants to build on Val Town](https://www.val.town/v/nbbaier/vtIdeaList)
- [@nbbaier](https://www.val.town/u/nbbaier) made [an SDK for the Val Town API](https://www.val.town/v/nbbaier/vtApiClient)
- [@pomdtr](https://www.val.town/u/pomdtr) made [an SDK for val-scoped blob storage](https://www.val.town/v/pomdtr/blobStorage)
- [@sean_smyth](https://www.val.town/u/sean_smyth) gets notified when someone [stars a Github repo](https://www.val.town/v/sean_smyth/githubStarWebhook)
- [@stevedylandev](https://www.val.town/u/stevedylandev) gets a [weekly report of IFPS & Pinata](https://www.val.town/v/stevedylandev/emailPosts)
- [@julbrs](https://www.val.town/u/julbrs) made [a Zoho Desk SDK](https://www.val.town/v/julbrs/zohodesk)
- [@petermillspaugh](https://www.val.town/u/petermillspaugh) generated a [a spaced repetition course](https://www.val.town/v/petermillspaugh/emailCourseCreator)
- [@syncretizm](https://www.val.town/u/syncretizm) scrapped twitter [using browserless pupetter](https://www.val.town/v/syncretizm/twEndpoint)
- [@nbbaier](https://www.val.town/u/nbbaier) made [a blog](https://www.val.town/v/nbbaier/vtghBlog), using Github as the CMS
- [@pomdtr](https://www.val.town/u/pomdtr) made [a list of ideas for Val Town](https://www.val.town/v/pomdtr/valtownIdeas)
- [@nbbaier](https://www.val.town/u/nbbaier) made [an Val Town idea aggregator](https://www.val.town/v/nbbaier/vtIdeaAggregator)
- [@stevekrouse](https://www.val.town/u/stevekrouse) gets [notified when Val Town is mentioned on Twitter](https://www.val.town/v/stevekrouse/twitterAlert)
- [@stevekrouse](https://www.val.town/u/stevekrouse) gets [notified Val Town is mentioned on Bluesky](https://www.val.town/v/stevekrouse/blueskyAlert)
- [@stwind](https://www.val.town/u/stwind) made [a WebGL gradient](https://www.val.town/v/stwind/WebGLTest)
- [@nbbaier](https://www.val.town/u/nbbaier) demoed [running a shell script from a val](https://www.val.town/v/nbbaier/shell)
- [@nbbaier](https://www.val.town/u/nbbaier) made [a wishlist of features he wants to see on Val Town](https://www.val.town/v/nbbaier/vtWishList)
- [@stevekrouse](https://www.val.town/u/stevekrouse) gets [a daily dad joke](https://www.val.town/v/stevekrouse/dailyDadJoke)
- [@u](https://www.val.town/u/u) made [a gron API](https://www.val.town/v/u/gronw) to make [JSON greppable](https://github.com/tomnomnom/gron)
- [@nbbaier](https://www.val.town/u/nbbaier) made [a lowdb API generator](https://www.val.town/v/nbbaier/dbToAPI)
- [@pomdtr](https://www.val.town/u/pomdtr) made [a lowdb SDK for blob storage](https://www.val.town/v/pomdtr/lowdb)
- [@vez](https://www.val.town/u/vez) made [a comments API](https://www.val.town/v/vez/comments)
- [@pomdtr](https://www.val.town/u/pomdtr) made [a blog](https://www.val.town/v/pomdtr/blog) using [Github-flavored markdown](https://www.val.town/v/pomdtr/gfm)
- [@pomdtr](https://www.val.town/u/pomdtr) renders [Val Town README to HTML](https://www.val.town/v/pomdtr/readme)
- [@nbbaier](https://www.val.town/u/nbbaier) made [embedded the tiptap rich text editor](https://www.val.town/v/nbbaier/tiptapEditorExample)
- [@pomdtr](https://www.val.town/u/pomdtr) made [a gist runner](https://www.val.town/v/pomdtr/runGist)
- [@nbbaier](https://www.val.town/u/nbbaier) used [xata serverless postgres service](https://www.val.town/v/nbbaier/xata)
- [@rebelpotato](https://www.val.town/u/rebelpotato) made [a bilibili SDK](https://www.val.town/v/rebelpotato/bilibili_methods)
- [@cescyang_service](https://www.val.town/u/cescyang_service) gets notified [ios bing apps](https://www.val.town/v/cescyang_service/checkIosBingApps)
- [@pomdtr](https://www.val.town/u/pomdtr) made [a pattern to call vals from the CLI](https://www.val.town/v/pomdtr/exampleCli)
- [@stevekrouse](https://www.val.town/u/stevekrouse) made [a val editor redirector](https://www.val.town/v/stevekrouse/editRedirect)
- [@nbbaier](https://www.val.town/u/nbbaier) made [a Swagger UI Hono Zod Demo](https://www.val.town/v/nbbaier/honoZodSwaggerUi)
- [@syncretizm](https://www.val.town/u/syncretizm) made [calculator](https://www.val.town/v/syncretizm/formulaEndpoint) [endpoints](https://www.val.town/v/syncretizm/singleformulaEndpoint)
- [@syncretizm](https://www.val.town/u/syncretizm) made [a Youtube scraper](https://www.val.town/v/syncretizm/youtubeEndpoint)
- [@vladimyr](https://www.val.town/u/vladimyr) made [a crates.io API](https://www.val.town/v/vladimyr/crates_io) and [an npm registry API](https://www.val.town/v/vladimyr/npmRegistry)
