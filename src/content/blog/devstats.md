---
title: Devstats
description: Building a simple aggregate view of our codebase
pubDate: Dec 13, 2024
author: Tom MacWright
image: ./devstats/screenshot.png
---

[Devstats](https://www.val.town/v/tmcw/devstats) is a Val that you can use to easily track send point-in-time statistics from your GitHub Actions (or other CI) runs and turn them into pretty charts. Here's ours!

![Devstats](./devstats/screenshot.png)

So far, we're using it to track dependency bloat. Much has been written about dependency bloat. A lot of web projects end up with a multi-gigabyte `node_modules` directory filled with agglomerated complexity.

Making a pretty chart of our `node_modules` size over time doesn't force us to cut weight, but it does help motivate such efforts: who doesn't like to see a big drop in a chart after making some strategic cut?

There are many other analytics stacks that we could've used for this, but I wanted to make something dead-simple:

- schemaless, so you can send any statistic without having to declare it beforehand
- using a barebones HTTP request to send statistics, so all you need is cURL

So, devstats was born! I see it as a very basic riff on the legacy of [StatsD](https://www.etsy.com/codeascraft/measure-anything-measure-everything/) and [RRDtool](https://oss.oetiker.ch/rrdtool/) but over HTTP and with a less [fancy wire protocol](https://github.com/b/statsd_spec).

Here's what our GitHub Actions configuration has at the very end
to send statistics to devstats:

```yaml
- name: devstats
  run: |
    curl -X "POST" "https://tmcw-devstats.web.val.run/" \
        -H 'Authorization: Bearer ${{ secrets.DEVSTATS_TOKEN }}' \
        -H 'Content-Type: application/json; charset=utf-8' \
        -d $"{ \"name\": \"node_modules_kb\", \"value\": $(du -sk node_modules | awk '{print $1}') }"
    curl -X "POST" "https://tmcw-devstats.web.val.run/" \
        -H 'Authorization: Bearer ${{ secrets.DEVSTATS_TOKEN }}' \
        -H 'Content-Type: application/json; charset=utf-8' \
        -d $"{ \"name\": \"package_lock_lines\", \"value\": $(wc -l package-lock.json | awk '{print $1}') }"
    curl -X "POST" "https://tmcw-devstats.web.val.run/" \
        -H 'Authorization: Bearer ${{ secrets.DEVSTATS_TOKEN }}' \
        -H 'Content-Type: application/json; charset=utf-8' \
        -d $"{ \"name\": \"package_lock\", \"value\": $(wc -l package.json | awk '{print $1}') }"
```

Not bad! `curl` is already available, so this is all you need
to start tracking your `node_modules` size, `package.json` lines,
and `package-lock.json` lines over time. This is all using Linux
utilities like `du`, `awk`, and `wc`, but you could do the same
with JavaScript or any other language to calculate more complex
metrics.

## Using it

To use devstats yourself, just

1. [Fork the val. You can rename it, and so on!](https://www.val.town/v/tmcw/devstats)
2. Come up with a random authentication token, and [add it to your repository secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) and to your [Val Town environment variables](https://docs.val.town/reference/environment-variables/)
3. Add a step like shown above to your GitHub Actions configuration.

_Not sure how to generate a random authentication token?_ One way is to run OpenSSL:

```
openssl rand -hex 20
```

That's it! The 'wire format' for devstats is simply sending an object
like this:

```json
{
  "name": "coffees",
  "value": 10
}
```

You can send any `name` you want and it'll be added to the dashboard.

## How it works

This val uses our [SQLite](https://docs.val.town/std/sqlite/) support as its database, [Observable Plot](https://observablehq.com/plot/) for charts, and [Hono](https://hono.dev/) to do some routing and rendering.

## Notes

You might be wondering: Val Town's `node_modules` directory is around 900 megabytes: what's in there! I'll give you a peek into our top-10 module (namespaces):

```
val.town/node_modules
$ du -sk * | sort -n -r | head -n 10
47592	@opentelemetry
40132	@sentry
33012	lucide-react
24700	@clerk
24136	@ai-sdk
23568	@biomejs
23168	tiktoken
22200	typescript
21044	@heroicons
20616	happy-dom
```

We spend a lot of megabytes on our monitoring stack, using [Open Telemetry](https://github.com/open-telemetry) and [Sentry](https://sentry.io/), and another chunk on the icon sets [Lucide](https://lucide.dev/) and [heroicons](https://heroicons.com/). We use [tiktoken](https://github.com/dqbd/tiktoken) to truncate text before sending it off to be encoded for [semantic search](https://blog.val.town/blog/val-vibes/).

### One issue: triple distributions

JavaScript has been in a painful transition phase between module systems, moving from CommonJS, which was Node.js's module system for many years, to ESM, which is standardized and designed to also work in browsers. This is one of the culprits behind our `node_modules` size.

Open Telemetry is a pretty heavyweight dependency for us. One issue is that they ship each line of code [three times](https://unpkg.com/browse/@opentelemetry/otlp-transformer@0.56.0/build/): not just dual modules between [CommonJS & ESM](https://nodejs.org/api/esm.html), but also an esnext build for bleeding-edge JavaScript features, and they include source maps for all three versions.

Lucide does the same thing with a triple build, but for ESM, CommonJS, and [UMD](https://github.com/umdjs/umd) module types. Heroicons does a double build, for CommonJS and ESM.

### Another: big binaries

Another big issue we have – that probably many other projects have as well – is the big binaries embedded in some NPM modules.

Sentry includes a binary distribution of their [CLI, a native Rust tool](https://github.com/getsentry/sentry-cli), which weighs 16MB. [Biome](https://biomejs.dev/), which we use to lint and format our code, is another 23MB.

### Lots of copies of esbuild

The biggest challenge that isn't on this list is [esbuild](https://esbuild.github.io/), which is used internally by lots of modules that we depend on. All in all, we spend about 94MB of space storing 10 versions of esbuild, a fact that I figured out
using this epic (for me) chain of Linux commands:

```
find . -type f -name 'esbuild' |
  xargs du -sk * |
  sort -n |
  grep "esbuild$" |
  awk  '{print $1}' |
  awk '{s+=$1} END {print s}'
```

The problem with esbuild for us is that some transitive dependency will depend on an old or specific version of esbuild, and NPM will dutifully download and store multiple copies of esbuild to satisfy all consumers. Absent some coordination from all the community, we might have to use an [override to pin esbuild to a specific version](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides), and hope that our dependencies don't really need such a specific version range.

### Endnotes

Like most decisions, there were good reasons behind all of these. Hybrid CommonJS + ESM modules make sense for a [still-divided world](https://github.com/wooorm/npm-esm-vs-cjs) of people using NPM modules. Using a conservative version range for esbuild makes sense to limit the chances that your module will unexpectedly break on a new esbuild release. NPM's ability to download multiple versions of a transitive dependency is [actually great and solves a problem inherent in other systems like pip and Cabal](https://lexi-lambda.github.io/blog/2016/08/24/understanding-the-npm-dependency-model/).

So, there aren't many opportunities to point fingers. So far I haven't found any NPM modules that accidentally included a 40MB MP4 video of _Buffy The Vampire Slayer_ and that's why they were bloated. We've used [knip](https://knip.dev/) to identify a handful of dependencies that we forgot to remove once we stopped using them. Most of the big stuff in `node_modules` is there for a reason.

---

So, it's definitely a goal to cut big dependencies that we aren't using and slim down the ones that we need to use. Devstats is helping with that, and we're working on more developer tooling for building Val Town _with_ Val Town!
