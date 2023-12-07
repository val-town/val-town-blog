---
title: Val Town Newsletter 13
generated: 1701894028937
description: SQLite, Blob Storage, updates to how Vals are named, and more
pubDate: November 28, 2023
author: Steven Krouse
---

It’s been almost three months since the [last Val Town Newsletter](https://blog.val.town/blog/val-town-newsletter-12) in early Sept! We went into a deep engineering hole to build [Val Town v3](https://blog.val.town/blog/introducing-val-town-v3). It shipped on Oct 23rd.

We then immediately embarked upon a cycle of user interviews and product polish, which has resulted in dozens of new features in the past couple weeks. We created the concept of Val Types: HTTP Handler, Interval, Email Handler, or a Script. We launched Val Town Blob and SQLite storage to put powerful persistence at your fingertips. Val exports and names are much easier to work with now too.

Coming up soon are “pull requests” for vals, continuing to polish and clarify the UI, moving our docs site to a public Github repo, custom domains, public folders, and much more!

Vals are being used on everything from tracking prices and RSS feeds to categorizing help tickets to making geolocation APIs. Lots of fun links below!

If you would like to do us a big favor, please email [steve@val.town](mailto:steve@val.town) to schedule a user interview and onboarding session. The feedback we get from these sessions are what enable us to improve Val Town. We’re most excited to chat with folks at businesses who want to automate processes, make webhooks, little APIs, or crons. However, we’re happy to chat with anyone – please reach out!

### Val Town v3

Val Town v3 finally shipped on October 23rd. It removed our custom `@` symbol syntax, but kept the ability to import code by typing the `@` symbol: we rewrite it as a web-standard JS import when you accept the completion. It’s more stable, easier to learn, supports JSX, environment variables, has no vendor lock-in, and fixed dozens of other bugs. It’s just way better — try it out!

### Val Types

We created the concept of Val Types: HTTP Handler, Interval, Email Handler, or a Script. This lets us specialize the UI particularly for each type of val, which we’ve only just begun taking advantage of.

![Screenshot 2023-11-28 at 10.29.37@2x.png](./val-town-newsletter-13/screenshot_2023-11-28_at_1029372x.png)

![Untitled](./val-town-newsletter-13/untitled.png)

### SQLite & Blob Storage

We all know functions are most useful when they can persist some state. Up until now, we had two bad answers:

1. Store your state in JSON in another val
2. Go signup for a database and come back here with your keys

The problem with (1) was that it only stored 100kb and it wasn’t ACID. The problem with (2) was that it took you out of the flow of programming.

A couple weeks ago we launched two integrations that let you persist real data without leaving Val Town:

[Val Town SQLite](https://www.val.town/v/std/sqlite) gives you your own SQLite database. There is no setup. Just start writing SQL. Make tables, insert data, run queries, whatever you want!

![Untitled](./val-town-newsletter-13/untitled-1.png)

[Val Town Blob](https://www.val.town/v/std/blob) lets you store any sort of unstructured data, like JSON, text, images, binary, whatever. Again, no setup, buckets, regions, or keys. Just send us your blobs, and then retrieve your blobs.

![Screenshot 2023-11-28 at 10.24.52@2x.png](./val-town-newsletter-13/screenshot_2023-11-28_at_1024522x.png)

### Exports & names

Vals used to require exactly one export, and the name of that export was the name of the val. This was confusing to users, so we moved the name of vals outside the code, and allow vals to have as many or few exports as you’d like.

![Screenshot 2023-11-28 at 10.28.07@2x.png](./val-town-newsletter-13/screenshot_2023-11-28_at_1028072x.png)

### Roadmap

- Docs site in a public github repo
- Near-at-hand templates for common patterns, like importing from npm, using secrets, JSX, emailing yourself, persistence, OpenAI…
- Clearer UI for running vals & logs (more intuitive feedback loop)
- Lots of small upgrades and polish to product, docs, onboarding
- Pull requests for vals
- Public folders
- Custom domains
- Benchmark v3 runtime performance and update limits
- LLM to help you write vals

### Links

- [Posthog shows how to use Val Town to capture RSS events in Posthog](https://posthog.com/tutorials/rss-item-capture)
- Val Town is being [taught in a Northeastern class](https://x.com/Neesh774/status/1728788898837323871?s=20)!
- Pete Millspaugh wrote fantastic blogs, [making a counter button](https://www.petemillspaugh.com/val-town-button), and [collecting subscriber email addresses](https://www.petemillspaugh.com/cultivating-emails)
- Nage Eagle wrote [a lovely blog about his cron](https://nateeagle.com/posts/val-town-scraper/) to scrape HTML to find when Sea Light Swizzles were back in stock
- whatrocks showed us how he extended the Farcaster protocol to create [a distributed `finger` solution](https://charlieharrington.com/farcaster-fling/). A fantastic read!
- Tom [open-sourced Val Town’s CodeMirror + TypeScript integration](https://x.com/tmcw/status/1725629130660622489?s=20)
- Andre made [the best video with vals](https://www.youtube.com/watch?v=1yWs-FZnqag) ever made (to help him work out)
- xkonti made [an incredible ntfy val](https://www.val.town/v/xkonti/ntfy) to send yourself push notifications on your phone
- Justin Bennett made vals to get your [sleep](https://www.val.town/v/just_be/getSleepScore) and [readiness](https://www.val.town/v/just_be/getReadinessScore) from your oaura ring
- [tal](http://val.town/tal) made [an iCal feed that updates with Department of Education (lunch) menu items](https://www.val.town/v/tal.doeMenuCalendar)
- [fil](http://val.town/fil) made a val to check when his favourite [museum activities are updated](https://www.val.town/v/fil.musee_angers_activites_feed)
- [maxm](http://val.town/maxm) made this awesome [retro-style visit counter](https://www.val.town/v/maxm.retroVisitCounter)
  ![https://maxm-retrovisitcounter.web.val.run/counter.png](https://maxm-retrovisitcounter.web.val.run/counter.png)
- Guy Dupont [generated STL file](https://twitter.com/gvy_dvpont/status/1726710176655581448)[s](https://www.petemillspaugh.com/cultivating-emails) with a val
- [Steve](https://val.town/stevekrouse) made [a handy val](https://www.val.town/v/stevekrouse.umbrellaReminder) to make sure he never forgets an umbrella and [another to help help him know how warm to dress](https://x.com/stevekrouse/status/1722659193792942246?s=20)
- [tmcw](http://val.town/tmcw) showed us how we could [use Elysia](https://www.val.town/v/tmcw.elysiaExample), the speedy new Bun web server library, in Val Town
- [wilt](http://val.town/wilt) showed off the new Windows feature allowing you to [add PWAs to your dock](https://www.val.town/v/wilt.miniWidget)
- [jamiedubs](http://val.town/jamiedubs) created a val to [fetch an image from any smart contract](https://www.val.town/v/jamiedubs.nftImage)
- [Generate a powerpoint](https://www.val.town/v/stevekrouse/powerPointExample) from a val
