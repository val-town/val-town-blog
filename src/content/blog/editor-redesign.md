---
title: Improving the Val Editor
description: Designing the core UI of editing
pubDate: December 11, 2023
author: Tom MacWright
heroImage: ./editor-redesign/splash.png
---

The Val Editor is the core of the Val Town UI – it's the UI
where you create, edit, and view Vals. Per-pixel, it's the highest
UI density of all of the website. Every little interaction
and detail with it matters. In feedback from new users,
we've noticed a small number of common confusions that we'd like to fix:

1. How do I run a val?
2. Where are the logs?

For our team, redesigning a new and improved Val Editor UI means
tinkering around with Figma mockups and chatting
about pros & cons in the office. But everything with Val Town we do
with everyone. Open channels, working in public, and getting
ideas out fresh and early.

Here's what we're thinking. Join
our [Discord](https://discord.gg/dHv45uN5RY),
and let us know what you think.

### Run

Vals today have a "Run" button, which saves their code and then
does the equivalent of running that code on the command line with
`deno run` or `node`.

But, when the val that you're running is a [scheduled function](https://docs.val.town/types/scheduled/)
or [an email handler](https://docs.val.town/types/email/) or an
[HTTP handler](https://docs.val.town/types/http/), the code
that you care about doesn't run when you click the "Run" button, because
that code is a function. If your val looks like

```ts val
export function handler(request: Request) {
  return Response.json({ ok: true });
}
```

Clicking **Run** won't do much of anything, just like how running
this file with Deno or Node wouldn't invoke the code inside of the
`handler` method. Similarly, running an scheduled function Val won't
automatically invoke the scheduled function.

The new designs try to clear up this confusion by:

1. **Adding a "Save" button.**
   You can now "Save" a val without running it.
   "Run" will still save and run.
2. **Type-specific "Run" buttons**.
   For example, a scheduled function val will have a "Run" button
   that runs the scheduled function, and an HTTP handler val will
   have a "Run" button that sends the configured HTTP request.

### Logs

The other common confusion is around logs. Today script vals show logs inline,
while handler vals (http, scheduled, email) show them in another page. Users can
usually find this page eventually, but we wanted a more obvious and consistent
place for logs to live on the val editor.

Ok, enough about the problems, let's look at the new designs!

### Scheduled vals

Here's what a [scheduled val](https://docs.val.town/types/scheduled/)
might look like after the rework.

![Scheduled val showing popover of cron syntax](./editor-redesign/scheduled-with-popover.png)

The cron & interval editors are now in a popover. Clicking Run runs
the scheduled function. The output pane shows multiple last runs, any
of which can be expanded to see more detail.

### HTTP handlers

[HTTP handlers](https://docs.val.town/types/http/) will
let you send a configurable REST request to your APIs
when you click 'Run'. They'll also show a list of recent runs, in the
style of web server logs, and let you dig into those.

![HTTP handler value showing configuration of the sent request](./editor-redesign/web.png)

Or if you’re developing a web application rather than an API - you
use the preview tab, and the **Preview** button will
refresh that iframe.

![HTTP handler editor showing the preview pane](./editor-redesign/web-preview.png)

#### Email handlers

Vals that [handle emails](https://docs.val.town/types/email/)
can be configured to automatically get
triggered with a configurable email when you click Run. Their
logs look more like a compact inbox and, like the others, will
show you all the details about what the Val did, any logging output,
and more.

![Email handler showing email configuration](./editor-redesign/email.png)

#### Script vals

What about old script vals? Well, they're look mostly the same,
with the bonus of having the ability to see multiple logs in
the editor.

![Basic script view](./editor-redesign/script-basic.png)

Well, maybe a bit different - we have been chatting about auto-running
exported functions. It could look like this:

![Script function running](./editor-redesign/script-fn-run.png)

This is even more experimental, and probably not going to be part of
this work, but we certainly get some confusion from Script
vals as well when clicking Run doesn't invoke functions, and we're
trying to make that clearer.

#### Let us know what you think

Love it, hate it? Let us know in [the Discord channel!](https://discord.gg/dHv45uN5RY) Thank you!
