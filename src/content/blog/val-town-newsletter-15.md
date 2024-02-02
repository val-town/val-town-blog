---
title: Val Town Newsletter 15
description: TODO
pubDate: February 06, 2024
author: Steven Krouse
---

TODO description

You all have made hundreds of really cool vals (links below). [Come join us in Discord!](https://discord.gg/dHv45uN5RY) 👋

### Custom domains

TODO photo and explaination and hat tip to saascustomdomains

### Logs – larger, faster, streamed, and scalable

TODO description and photo

clickhouse

### Early Return HTTP Responses

- (TODO fix this title)
- link to the discussion
- and the discord announcement?

### HTTP vals faster by 100ms ⚡️

- Tom could make a chart about this

### Suggest & vote on feature requests

on GitHub Discussions

The description of the discussions for feature-requests on GitHub [Discussions](https://github.com/val-town/val-town-product/discussions)

### Val Town status page

https://status.val.town/

- was this requested on discord or in a discussion?

### TypeScript-driven autocompletion

https://github.com/val-town/val.town/pull/3645

### CodeMirror Continue for comments

https://github.com/val-town/codemirror-continue

### Improved Feedback button

### Add code folding

- TODO ensure we closed this github discussion and link to it here

### Misc updates

- Fixed the big, old, annoying flicker on page load
- Redesigned our scheduled val & cron UI
- "Run Now" button on scheduled and cron vals
- Tabs on the bottom of vals for viewing logs and previewing HTTP vals
- Fix flicker bug with our AI autocomplete
- New comments on a val notify anyone who commented on that val
- HTTP responses can return up to 10Mb now
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
- Improved Google indexing by adding pagination and noindex on vals without readmes (thanks [@tomcritchlow](https://www.val.town/u/tomcritchlow))
- Limit the number of versions a val can have to 14,400 (10 days in minutes)
- Fix bugs with our homepage buttons

### Roadmap

- Roadmap item 1
- Roadmap item 2

### Cool vals

- [@pomdtr](https://www.val.town/u/pomdtr) made a val that [serves VSCode](https://www.val.town/v/pomdtr/vscode)
- [@saolsen](https://www.val.town/u/saolsen) created a val for [tracing with OpenTelemetry](https://www.val.town/v/saolsen/tracing)
- [@pomdtr](https://www.val.town/u/pomdtr) kept updating his [Val Town VSCode extension](https://marketplace.visualstudio.com/items?itemName=pomdtr.valtown) so that now it allows to manage/edit blobs, query SQLite tables, edit readmes and a lot more
- [@saolsen](https://www.val.town/u/saolsen) explored the idea of [writing vals in Rust with WASM](https://gist.github.com/saolsen/d273bb1baba5e912e4dc2b187511affa)
- [@todepond](https://www.val.town/u/todepond) wrote about [making his supported dashboard using Val Town](https://todepond.com/wikiblogarden/tadi-web/fame/facts/)
- [@pomdtr](https://www.val.town/u/pomdtr) created a val that [creates screenshots from another val](https://www.val.town/v/pomdtr/val2img)
- [@saolsen](https://www.val.town/u/saolsen) created a [val version diff viewer](https://www.val.town/v/saolsen/changes)
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
