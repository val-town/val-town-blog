---
title: Val Town Newsletter 15
description: TODO
pubDate: February 06, 2024
author: Steven Krouse
---

TODO description

You all have made hundreds of really cool vals (links below). [Come join us in Discord!](https://discord.gg/dHv45uN5RY) 👋

### Custom domains

We released a heavily requested feature - custom domains. Custom domains allow you to use your own domain names to access the HTTP vals you created. This feature enables a more branded and professional experience for users visiting your vals. This is a feature for [Pro subscribers](https://www.val.town/pricing) only.

![A custom domain configured to direct HTTP requests to "amazingVal"](./val-town-newsletter-15/custom-domains.png)

You can add your domain or subdomain in the [custom domain settings](https://www.val.town/settings/domains). For more info take a look at our [documentation page](https://docs.val.town/reference/custom-domains/).

Big thanks to [SaaS Custom Domains](https://saascustomdomains.com/) for making the implementation much easier.

### Logs – larger, faster, streamed, and scalable

We upgraded the logs viewing experience. Now vals' logs are live-streamed, can be much larger and are stored in a much more scalable way, ensuring we have room for more logging-related features. As your val is being executed you are able to see the log messages appear in real-time. This was requested in a [discussion #30](https://github.com/val-town/val-town-product/discussions/30).

```ts
import { delay } from "https://deno.land/std/async/delay.ts";

console.log("Val execution started");
await delay(2000);
console.log(" 10% [=         ] 100%");
await delay(1000);
console.log(" 30% [===       ] 100%");
await delay(1000);
console.log(" 70% [=======   ] 100%");
await delay(1000);
console.log("100% [==========] 100%");
await delay(1000);
console.log("Finished");
```
![A video showing how logs are being streamed](./val-town-newsletter-15/logs_vid.mp4)

Previously, logs had a size limit of ??? and we were able to increase it to ???. This makes is possible to debug larger data sets or longer processing chains without worrying about the logs cutting of mid-execution.

Initialy we were storing logs locally and then after a while we moved them to [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/). Now we're using [ClickHouse](https://clickhouse.com/) which enabled the real-time preview functionality and makes the whole system more scalable.

- TODO: Replace `???` with actual limit sizes.
- TODO: Close: https://github.com/val-town/val-town-product/discussions/30


### ⚡️ HTTP vals respond 100ms faster on average

Till now when HTTP val returned a response, Val Town waited for a while before sending that response. The reason for that was to ensure that all promises were resolved before terminating val's execution. We introduced an optimization, where we're returning the val's HTTP response immediately, speeding up client's exieprience significantly.

TODO:
- link to the discussion (can't find the discussion)
- and the discord announcement? https://discord.com/channels/1020432421243592714/1020432421243592717/1201996373013319690
- Add a fancy graph comparing before-and-after. Maybe in a style of Chrome dev tools network tab timimg?

### ⏲️ Running tasks after returning the HTTP response

Because we're returning HTTP responses immediately, non-resolved promises continue their execution after the response has been returned.

This allows you to speed your vals even more by performing some non-critical tasks (like logging) after sending the response:

- TODO: Include code example https://www.val.town/v/neverstew/earlyWebReturn

You can also take the _optimistic execution_ approach and perform your database operations after returning the `200 OK`:

- TODO: Include code example:
```ts
// HTTP val handling PUT request
// 1. Generate new UUID
// 2. Return new UUID early
// 3. Save data to DB after the response
```

TODOs:
- link to the discussion (can't find the discussion)
- and the discord announcement? https://discord.com/channels/1020432421243592714/1020432421243592717/1201996373013319690

### 💡 Suggest & vote on feature requests

We now have a [dedicated place for requesting and voting on features](https://github.com/val-town/val-town-product/discussions). Feel free to submit your own suggestions, or comment and vote on existing feature requests.

https://x.com/stevekrouse/status/1744721315024802285?s=20

### Val Town status page

Nobody likes when a website is down, but it's even worse not being able to figure out if it's down for everyone. We now have a public status page to answer that question!

https://status.val.town/

![Screenshot of the new Val Town status page](./val-town-newsletter-15/status-page.png)

https://x.com/Andre_Terron/status/1750578181600649312?s=20

### TypeScript-driven autocompletion

https://github.com/val-town/val.town/pull/3645

### CodeMirror Continue for comments

https://x.com/tmcw/status/1745147192656957771?s=20

### Improved Feedback button

https://x.com/stevekrouse/status/1749800319217700990?s=20

### Add code folding

- TODO ensure we closed this github discussion and link to it here

### Misc updates

- Fixed the big, old, annoying flicker on page load
- Redesigned our scheduled val & cron UI
- "Run Now" button on scheduled and cron vals
- Tabs on the bottom of vals for viewing logs and previewing HTTP vals
- Fix flicker bug with our AI autocomplete
- New comments on a val notify anyone who commented on that val
- HTTP responses can return up to 10Mb now (40x more than before)
- Val readmes can be edited via API
- Add URL ?search data to HTTP logs
- Updated Deno to 1.40.2 (there's now [an API for getting this version data](https://www.val.town/v/std/deno_version)!)
- Fix [val.town/brand](https://val.town/brand) assets
- Defer loading dprint to speed up page loading times
- Fix scheduled val bugs
- Include val readmes in val pull requests
- Add `VALTOWN_API_URL` environment variable to enable std library usage locally
- Deprecate showing output in favor of console logs
- Forked vals default to the name of the original val
- Renamed "Secrets" to "Environment Variables"
- Improved error message to when users try to preview a private HTTP val
- Speed up querying for the latest evaluation of a val (4 seconds to 40ms)
- [Halved our database size](https://x.com/tmcw/status/1742559580255658462?s=20) by removing stale data
- iframe previews of other peoples' HTTP vals are closed by default
- Disable grammarly correction in the editor
- [Improved Google indexing by adding pagination and noindex on vals without readmes](https://x.com/tmcw/status/1753458573764337783?s=20) (thanks [@tomcritchlow](https://www.val.town/u/tomcritchlow))
- Limit the number of versions a val can have to 14,400 (10 days in minutes)
- Fix bugs with our homepage buttons

### Roadmap

#### Feburary

- AI autocomplete improvements
- Improved val run scalability and pricing
- Improved workflows for POST-request HTTP vals
- Improved /trending ranking
- Button to request someone to publish a val
- Job posting & careers page
- New intro video
- Better onboarding for new users
- Drop "untitled\_" from new val names

### Soon-ish

- Speed up val execution
- Improved val organization in sidebar (TODO link to feature request)
- Val Town Projects (for more complex projects, branching and pull requests as groups of vals)
- TODO pull more from feature requests

## Kind words

- https://x.com/meekaale/status/1740818276152996271?s=20
- https://x.com/spences10/status/1741090256852586689?s=20
- https://x.com/ibuildthecloud/status/1742565036944740660?s=20
- https://x.com/arsalanbashir/status/1742830957374144658?s=20
- https://x.com/GrantSlatton/status/1743441341030486256?s=20
- https://x.com/alexzirbel/status/1744595109101101346?s=20
- https://x.com/rossSpeak/status/1744864326727737363?s=20
- https://x.com/CompuIves/status/1745400326654706144?s=20
- https://x.com/rossSpeak/status/1747310275773296841?s=20
- https://x.com/zeke/status/1748107363419332698?s=20
- https://x.com/IrvinZhan/status/1748079715515339074?s=20
- https://x.com/whelan_boyd/status/1722299311608807710?s=20
- https://x.com/glcst/status/1742554321965691324?s=20
- https://x.com/webtwozero/status/1750528451059368408?s=20
- https://x.com/okpasquale/status/1750653517629473014?s=20
- https://x.com/albfresco/status/1740955772144738738?s=20
- https://x.com/nerdymomocat/status/1743041429331689901?s=20

### Cool vals

- [@pomdtr](https://www.val.town/u/pomdtr) made a val that [serves VSCode](https://www.val.town/v/pomdtr/vscode)
- [@saolsen](https://www.val.town/u/saolsen) created a val for [tracing with OpenTelemetry](https://www.val.town/v/saolsen/tracing)
- [@pomdtr](https://www.val.town/u/pomdtr) kept updating his [Val Town VSCode extension](https://marketplace.visualstudio.com/items?itemName=pomdtr.valtown) so that now it allows to manage/edit blobs, query SQLite tables, edit readmes and a lot more
- [@saolsen](https://www.val.town/u/saolsen) explored the idea of [writing vals in Rust with WASM](https://gist.github.com/saolsen/d273bb1baba5e912e4dc2b187511affa)
- [@stevekrouse](https://www.val.town/u/stevekrouse) rebuilt his [dateme.directory](https://www.val.town/v/stevekrouse/dateme) to utilize newest Val Town features
- [@todepond](https://www.val.town/u/todepond) wrote about [making his supported dashboard using Val Town](https://todepond.com/wikiblogarden/tadi-web/fame/facts/)
- [@pomdtr](https://www.val.town/u/pomdtr) created a val that [creates screenshots from another val](https://www.val.town/v/pomdtr/val2img)
- [@saolsen](https://www.val.town/u/saolsen) created a [val version diff viewer](https://www.val.town/v/saolsen/changes)
- [@stevekrouse](https://www.val.town/u/stevekrouse) made a val demonstrating how to [compressing HTTP responses](https://www.val.town/v/stevekrouse/compress_response)
- [@saolsen](https://www.val.town/u/saolsen) implemented [val analytics with Plausible](https://www.val.town/v/saolsen/plausible)
- [@pomdtr](https://www.val.town/u/pomdtr) created a [Chrome extension for Val Town](https://github.com/pomdtr/val-town-web-extension)
- [@pomdtr](https://www.val.town/u/pomdtr) implemented [JWT authentication utility](https://www.val.town/v/pomdtr/auth_middleware) to protect your APIs
- [@xkonti](https://www.val.town/u/xkonti) created a [GPT Action Framework](https://www.val.town/v/xkonti/gptApiFramework) for simplifying creation of APIs compatible with OpenAI GPTs
- [@saolsen](https://www.val.town/u/saolsen) created a Deno script that will [sync your vals to GitHub](https://www.val.town/v/saolsen/git_sync)
- [@pomdtr](https://www.val.town/u/pomdtr) ported [blakeembrey/sql-template-tag](https://github.com/blakeembrey/sql-template-tag) to Val Town to simplify [building safe SQL queries](https://www.val.town/v/pomdtr/sql)
- [@saolsen](https://www.val.town/u/saolsen) experimented with [writing tests with Jest ](https://www.val.town/v/saolsen/tiny_jest_example)
- [@pomdtr](https://www.val.town/u/pomdtr) found a way to [serve static content by using val's readme]()https://www.val.town/v/pomdtr/notebook
- [@stevekrouse](https://www.val.town/u/stevekrouse) wrote a whole fullstack (sqlite, backend js, frontend js, html) app in a [single val](https://www.val.town/v/stevekrouse/backend_in_a_file)
- [@saolsen](https://www.val.town/u/saolsen) wrote a useful [val that can automatically prune multiple versions of other vals](https://www.val.town/v/saolsen/prune_val)
- [@nbbaier](https://www.val.town/u/nbbaier) created a [val that can generate SQL](https://www.val.town/v/nbbaier/sqliteWriter) using [prisma-gpt](https://github.com/aliyeysides/prisma-gpt)
- [@nbbaier](https://www.val.town/u/nbbaier) made a val that [generates readme for vals automatically](https://www.val.town/v/nbbaier/readmeGPT) using GPT
- [@nbbaier](https://www.val.town/u/nbbaier) wrote a [Perplexity AI API wrapper val](https://www.val.town/v/nbbaier/perplextiyAPI)
- [@pomdtr](https://www.val.town/u/pomdtr) continued his work on [lowdb adapter for Val Town](https://www.val.town/v/pomdtr/lowdb) allowing to use blobs as type-safe databases
- [@joey](https://www.val.town/u/joey) made it easier to [use blobs as arrays](https://www.val.town/v/joey/BlobArray)
- [@deepfates](https://www.val.town/u/deepfates) wrote a great [article on building a face swapping app with Val Town, HTMX, and Replicate]
- [@tom_og](https://www.val.town/u/tomcritchlow) made a val that [generates open graph images with code](https://www.val.town/v/tomcritchlow/tom_og)
- [@tmcw](https://www.val.town/u/tmcw) put together a [val that collects stats about his Figma plugins](https://www.val.town/v/tmcw/placemarkGlobeMonitor) that can be displayed as a [fancy graph](https://observablehq.com/@tmcw/placemark-figma-plugin-stats)
- [@glommer](https://www.val.town/u/glommer) wrote an [amazing article on Turso blog](https://blog.turso.tech/i-needed-a-simple-discord-bot.-val-town-made-it-fun!-bf8339ab) documenting his adventure making a Discord bot using Val Town
- [@stevekrouse](https://www.val.town/u/stevekrouse) wrote a whole fullstack (sqlite, backend js, frontend js, html) app in a [single val](https://www.val.town/v/stevekrouse/backend_in_a_file)
- [@nbbaier](https://www.val.town/u/nbbaier) made a useful [utility val](https://www.val.town/v/nbbaier/sqliteDump) that generates SQL statements to dump the data and schema of tables in a SQLite database 

---

To organize:

- https://x.com/deepfates/status/1751015063912399126?s=20
- https://x.com/tmcw/status/1744406760301920559?s=20
- https://x.com/stevedylandev/status/1745667977393910096?s=200
- https://x.com/stevekrouse/status/1747365282547478828?s=20
- https://x.com/nbbaier/status/1748564488029147417?s=20
- https://x.com/nbbaier/status/1748564489375502417?s=20
- https://x.com/glcst/status/1749888541612544292?s=20
- https://x.com/stevekrouse/status/1737173486047481887?s=20
- https://x.com/stevekrouse/status/1738651539458171255?s=20
- https://x.com/nbbaier/status/1744847782484070400?s=20