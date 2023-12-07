---
title: Val Town Newsletter 4
generated: 1701894028953
description: Rebuilding on Deno, HTML emails, and more
pubDate: March 2, 2023
author: Steven Krouse
---

We’re almost done rebuilding our runtime on Deno! We also snuck in a dozen little projects and upgrades. We are overwhelmed by all the cool vals y’all are dazzling us with! We reached 100 users who have at least one scheduled val running 🤩

### Changelog

### New demo video

The [last demo video](https://www.loom.com/share/878294970d8e48919c819f35d0cd0da4) was from September 2022, so it was high time for an update. It’s amazing to see how far the product has come since then! After a fairly [awesome reception](https://twitter.com/stevekrouse/status/1629232279624077312?s=20) to our new demo video on Twitter, we decided to add it to the docs and our landing page.

[https://www.loom.com/share/c075dc075909400a85591ac3f83d1ca5](https://www.loom.com/share/c075dc075909400a85591ac3f83d1ca5)

### Subdomains galore

We launched [docs.val.town](http://docs.val.town), [blog.val.town](http://blog.val.town) and [about.val.town](http://about.val.town)!

### HTML emails

Now you can send yourself HTML emails like it’s 1999.

```tsx
console.email({ html: "<h1>hello!</h1>" });
```

### Reorder your vals

Now you can drag your vals around in whatever order your heart desires.

### Autocomplete for secrets

![Screenshot 2023-03-02 at 11.54.43 AM.png](./val-town-newsletter-4/screenshot_2023-03-02_at_115443_am.png)

### & much more

- val evaluation is back to being 300ms or so. (Down from up to 2 seconds!)
- profile pictures from github / gravatar
- migrated from create-react-app to remix
- types refresh between vals without having to refresh the page
- all date, fetch, and random values are tracked (determinism ftw)
- “About” menu with a contact email (hi@val.town) & link to blog
- speedups to the frontend when you're working with larger vals
- we don’t go down every night anymore. we almost never go down now!

### Now

It’s all hands on deck to get our new Deno runtime merged in ASAP. Maybe next week? Don’t hold us to it.

Rodrigo is working on lots of small design upgrades, including a much needed improvement to search. He designed a big upgrade to how our UI conveys the private/public-ness of vals (not yet implemented). He recently pushed a minimalist upgrade to our logo and landing page. We finally have a favicon! We’re focusing on small design improvements with outsized impact. And he’s also made the shift from mostly prototyping in figma to mostly prototyping in code directly!

I am apparently now a product manager, writing docs and tweeting, shuttling feedback from users back to the team, creating lots of github issues, and occasionally I get some time to grind out some little features and find bugs in our new Deno runtime.

### Cool vals

Now we have a `#cool-vals` channel in [our Discord](https://discord.gg/dHv45uN5RY). Go show off & give each other props! I am trying something new on this newsletter. Welcome to the wall of cool vals! (Best viewed on desktop.)

[https://twitter.com/stevekrouse/status/1625565598229925915?s=20](https://twitter.com/stevekrouse/status/1625565598229925915?s=20)

[https://twitter.com/stevekrouse/status/1630299064091770880?s=20](https://twitter.com/stevekrouse/status/1630299064091770880?s=20)

[https://twitter.com/stevekrouse/status/1631331747748093959?s=20](https://twitter.com/stevekrouse/status/1631331747748093959?s=20)

[https://twitter.com/tmcw/status/1631330968949727232?s=20](https://twitter.com/tmcw/status/1631330968949727232?s=20)

[https://twitter.com/stevekrouse/status/1630965221094244353?s=20](https://twitter.com/stevekrouse/status/1630965221094244353?s=20)

[https://twitter.com/stevekrouse/status/1630496379448487936?s=20](https://twitter.com/stevekrouse/status/1630496379448487936?s=20)

[https://twitter.com/stevekrouse/status/1631332758407487489?s=20](https://twitter.com/stevekrouse/status/1631332758407487489?s=20)

<div class="not-content">
  <iframe src="https://www.val.town/embed/ofalvai.myTorRelay" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/alp.SHA512" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/healeycodes.measureValTownE2e" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/pablopunk.checkMazeStatus" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/U9G.TV_SHOW_NEW_EPISODE_NOTIFIER" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/markprobst.webhookTest" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/dot.duckAndWaffle" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/healeycodes.isMyWebsiteDown" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/stevekrouse.twitterSearch" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/stevekrouse.twitterAlert" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/qwq.pingReplit" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/panphora.distance" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/mxderouet.remember" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/ning.sendSwedishTime" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/joshmock.githubStarsRSS" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/gilbarbara.validateEmail" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/stevekrouse.exampleBird" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/healeycodes.githubStarCounter" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/healeycodes.webassemblyExample" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/mihir.getGoogleAccessTokenFromRefreshToken" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/U9G.cyrb53" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/crsven.refreshAnimalWidget" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/joshmock.dataToRSS" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/U9G.cyrb53" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/healeycodes.measureValTownE2e" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/healeycodes.fenToASCIIboard" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/smalldogenergy.tgWeatherCommand" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/stevekrouse.twitterAlert" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/crsven.fetchBlob" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/crsven.fetchSNL" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/crsven.csvToArray" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/mcwhittemore.getYesterdaysTempatures" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

<div class="not-content">
  <iframe src="https://www.val.town/embed/jordan.latest_launch_poll" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

That’s all for this newsletter. See you around town!

Steve

### Subscribe

The easiest way to subscribe to Val Town is to *sign up for an account on [val.town](http://val.town)*, and then opting in to receive our newsletter as your set your username. You can also sign up [via this link](https://cdn.forms-content.sg-form.com/6c6893f3-38e6-11ed-b573-a6c391c68d4b).
