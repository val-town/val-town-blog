---
title: Val Town Newsletter 1
generated: 1701894028904
description: Programmatic notifications, Hacker News API, and more.
pubDate: January 4, 2023
author: Steve Krouse
---

Welcome to the 1st Val Town newsletter!

By way of reminder, Val Town gets you fastest from idea to deployed cloud
script. Create scheduled functions, email yourself, and persist small pieces of
data — all from the browser, with instant deploys, and never thinking about
infrastructure.

In the last three months (since the [0th Newsletter](../val-town-newsletter-0)),
we’ve gained focus around the product’s early use-cases, found a couple
fantastic early adopters, shipped major features, grew the founding team, and
are working on an exciting roadmap for 2023.

### Programmatic notifications

Our first challenge was finding use-cases for Val Town, while keeping it a
generic programming tool. After dozens of early-adopter conversations, stumbled
onto _programmatic notifications_:

1. Poll some source of information via `fetch` (Hacker News, RSS feeds, Twitter,
   etc)
2. If there are results, email them to yourself via `console.email`
3. Schedule it to run on an interval, like every hour

Most people can think of at least one kind of custom notification they’d like,
and it takes just a couple of minutes to fork one of these to suit your
purposes.

### Hacker News

The Hacker News [Agolia Search API](https://hn.algolia.com/api) is free and
unauthenticated, so it’s really easy to make queries. We made a tutorial around
it, but it was mostly ignored until [Kartik](http://akkartik.name/) taught
himself JavaScript to get it to work for him! We then built a whole website
around it ([hnfollow.com](hnfollow.com)) and
[launched it to Hacker News](https://news.ycombinator.com/item?id=33533830). We
made the front page, got a couple dozens users, and then were
[removed from the front page](https://news.ycombinator.com/item?id=33535795),
because Val Town “is much more interesting than an HN email alert.” The launch
of Scheduled Vals has made this even easier (probably deprecating hnfollow.com).
Now you can setup HN Alerts by forking a single val:

![https://www.val.town/stevekrouse.hnFollowPollJob](./val-town-newsletter-1/screenshot_2023-01-03_at_100210_am.png)

<div class="not-content">
  <iframe src="https://www.val.town/stevekrouse.hnFollowPollJob" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

### RSS

RSS has been making a comeback, particularly since the mess at Twitter.
[James](https://jsomers.net/) mentioned that he has a RSS to email Zapier Zap,
and it got me thinking that this is something Val Town would really excel at.
This is where the idea for Scheduled Vals came from, as a generalization of HN
Follow, but packaged up in a single val. Of course, we can’t compete against
full RSS readers, but if you simply want an email notification for a new post in
an RSS feed, I think we’re compelling. I put all mine in an object and then
looped over them.

![https://www.val.town/stevekrouse.pollRSSFeeds](./val-town-newsletter-1/screenshot_2023-01-03_at_95239_am.png)

<div class="not-content">
  <iframe src="https://www.val.town/stevekrouse.pollRSSFeeds" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

### New Citations

Ernest programmed a function to get notifications when there are new citations
to a particular scientific paper.

![https://www.val.town/ernest.newCitationNotification](./val-town-newsletter-1/screenshot_2023-01-03_at_53624_pm.png)

<div class="not-content">
  <iframe src="https://www.val.town/ernest.newCitationNotification" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

### Air Quality

[Lev](https://twitter.com/levpopov) programmed a bot that helps folks in San
Francisco know when they should close their window due to poor air quality
during fire season.

![https://www.val.town/stevekrouse.aqi](./val-town-newsletter-1/screenshot_2023-01-03_at_25248_pm.png)

<div class="not-content">
  <iframe src="https://www.val.town/stevekrouse.aqi" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

### _Webhooks_

Of course not all notifications need to be run on a schedule. Some notifications
come in the form of webhooks, like from Stripe, your app, database, or really
anywhere. Val Town is quite good at turning an HTTP request into an email to
yourself. For example, I get emailed when anyone signs up to Val Town or certain
errors occur.

### All the notifications

There are so many other exciting similar use-cases. Once you start thinking of
them, it’s hard to stop:

- Email notifications when certain folks post on Twitter or certain keywords are
  mentioned
- Notifications when any asset you own changes price by a large % suddenly
- I’ve long wanted to rebuild Devon’s
  [smallworld.kiwi](https://smallworld.kiwi/) in Val Town
- Morning alert if it’s going to rain that day or if you need to wear sunscreen
- A “subscribe to thread” twitter bot that will notify you when a thread gets
  new subtweets (if you @mention it like you would “@threadreaderapp unroll")

What are you waiting for? Go setup your own programmatic notifications! If you
want company while you code, free to
[schedule time to pair program with me](https://calendly.com/steviekrouse) to
set these up. It’s super useful for me to watch folks use the tool.

### Product improvements

A big focus for this year is doing a better job of blogging and celebrating each
product improvement as they happen. Given that we didn’t do this over the last
three months, here are the highlights!

### Scheduled Vals

Our initial interface for creating intervals was simply Javascript’s
`setInterval`, but made persistent. The downside was that you had to keep track
of your interval IDs and be careful about starting, editing and deleting
intervals. Now we have a one-click interface for creating & editing intervals
that are automatically attached to vals.

### TypeScript

We’ve rolled out TypeScript by default to all vals. It won’t prevent you from
running code with type errors, but will give you (hopefully) useful type errors,
even without adding any annotations.

### Evaluation History

We now save every single evaluation of every val, be it a function or piece of
state, no matter how it’s triggered. It’s been a great aid to debugging, and we
have big dreams for where we can take observability in the future
(replayability/omniscience). You can see evaluation history on the pages of vals
that you own:

![Screenshot 2023-01-03 at 5.50.22 PM.png](./val-town-newsletter-1/screenshot_2023-01-03_at_55022_pm.png)

You can click into an evaluation to see its inputs, outputs, logs, emails, and
errors. We also let you explore its parent evaluation and any sub evaluations,
which is like jumping up and down the call stack.

![Screenshot 2023-01-03 at 5.51.46 PM.png](./val-town-newsletter-1/screenshot_2023-01-03_at_55146_pm.png)

### Folders

We had a janky version of “notebooks” before, but we really needed a proper way
to organize your vals. Nobody felt this more than I did with my 1000+ vals. You
can now move vals into folders, recursively!

### Secrets

By popular demand, there is now a special, safe place for you to put your
secrets, API keys, and auth tokens. You can find this page by clicking your
username (in the top-right corner) or by going to
[https://www.val.town/@me.secrets](https://www.val.town/@me.secrets).

### Smaller upgrades

- Automatically retry `fetch` requests when they fail before even connecting,
  all from randomly assigned residential proxies, virtually eliminating a very
  common class of error.
- Val are either functions or a single statement. However now if you write a
  series of statements, we will detect it, wrap it in a function, and call that
  function for you.
- We added more versatility in ways to pass arguments via the API, including an
  ExpressJS API. (But we need better docs on this.)
- Rebuilt the architecture for running intervals and timeouts for reliability.
- Added (mostly accurate) line numbers in error messages.
- Built a more intuitive UI for logging in and out.
- We sped up a number of slow queries, some by
  [14,000x](https://twitter.com/stevekrouse/status/1593302270749327360?s=20&t=5aO8-PXFF1JDabiOn0HoTA).
- Added & then removed in-app chat.
- Added dozens of tests.

### Company

The founding team is coming together!

- [Steve Krouse](https://stevekrouse.com/) (me)
- [André Terron](https://www.andreterron.com/), engineering, joined in Oct, and
  shipped many of our biggest new features
- [Rodrigo Tello](https://rodrigotello.me/), design, whose first day was
  yesterday 🥳
- & potentially one more in engineering!

We built a lot in the last ~4 months the company has existed, but I can’t wait
for what we will accomplish as a team of three or four.

We have raised a small amount from a single investor who instigated this project
and is aligned with the kind of company we want to build: a trusted contributor
and partner to open-source and the ecosystem, valuing open-standards and
[credible exit](https://subconscious.substack.com/p/credible-exit), and leaving
users in a good place no matter what happens to the company.

This essay on [End-Programmer Programming](../end-programmer-programming) is
probably the closest thing we currently have to a company mission statement.

### 2023

The focus for 2023 is product and growth: making our scripting tool very fun and
useful, and getting lots of folks using it.

I think the product as is, modulo a bit of polish, could be useful to 10-100x
more folks than are currently using it (~10), so our initial focus this year
will be gearing up for many more users. We need to get better at some of the
too-often-overlooked sides of developer tools: docs, stability, polish, release
notes, public issue tracking, error tracking, logs & analytics, more automated
tests, open-sourcing more pieces of the product, more tweeting about the product
& celebrating what folks are doing with it, etc. There are a lot of other
low-hanging fruit to enable growth, such as being able to try the product
without creating an account, pretty share preview links, and improvements around
friction areas, such as editing functions (with confidence that you won’t break
downstream references) and useful notifications when your functions do throw
errors.

I don’t like to plan too firmly, because I’m a big believer in being surprised
by what users do with the tool and what they want from it, but my personal
instinct is that the next big feature effort we’ll add (maybe in Q2) is building
in first-class OAuth flows into your favorite tools, so you don’t have to waste
time with authenticating to do Zapier-like automations in Val Town.

### Happy programming 👨‍💻👩‍💻

Be sure to jump into our [Discord](https://discord.gg/dHv45uN5RY) to share tips,
bugs, feature requests, and show off your work!

If you want to pair program on a project in Val Town, please don't be shy! Just
reply to this email or
[find a time on my calendar](https://calendly.com/steviekrouse).

Steve

steve@val.town

### Subscribe

The easiest way to subscribe to Val Town is to _sign up for an account on
[val.town](https://www.val.town)_, and then opting in to receive our newsletter
as your set your username. You can also sign up
[via this link](https://cdn.forms-content.sg-form.com/6c6893f3-38e6-11ed-b573-a6c391c68d4b).
