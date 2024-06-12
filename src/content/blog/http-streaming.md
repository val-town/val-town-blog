---
title: "Val Town: Now With HTTP Streaming"
generated: 1717773046864
description: HTTP Vals support large streaming uploads, streaming responses and Server-Sent Events.
pubDate: June 7, 2024
author: Max McDonnell
---

Val Town now supports HTTP streaming requests and responses. HTTP Vals can
handle large streaming uploads and streaming responses and Server-Sent Events.
Your vals can handle more data, respond faster, and we've opened up a bunch of
streaming use-cases that weren't possible before.

On January 8th I added a feature request to Val Town's [product discussion
board](https://github.com/val-town/val-town-product/discussions) for [streaming
HTTP responses](https://github.com/val-town/val-town-product/discussions/14). I
wanted to be able to experiment with fun streaming pattern's similar to Rob
Pike's https://robpike.io and things like streaming gifs. Streaming responses
are also particularly useful for getting incremental responses from LLMs. The
lack of streaming support in our
[std/openai](https://www.val.town/v/std/openai) library, and other LLM use-cases,
quickly made this our most popular feature request.

I have since Joined Val Town and implemented and shipped HTTP streaming 🙂. Now
everyone can create [streams of emojis](https://www.val.town/v/maxm/robPikeIO)
or [gifs that stream the current
time](https://www.val.town/v/maxm/streamingGif).

Your LLM responses can now stream from Vals as well. Here is a minimal example
of a streaming OpenAI response. Simply include `stream: true` in the request
payload and a streaming response will be returned.

<iframe width="100%" height="400px" src="https://www.val.town/embed/maxm/openAIStreamingExample" title="Val Town" frameborder="0" allow="web-share" allowfullscreen></iframe>

## What Can I Do With It?

Let's take a further look at the new features we've enabled and how you can use
them.

### Server-Sent Events

Using content-type `text/event-stream` you can stream Server-Sent Events.
Server-Sent Events are similar to a one way Websocket. They have structure to
define individual messages and they'll be more responsive than a typical
streaming response. Here's a minimal example of their use:

<div class="not-content">
  <iframe width="100%" height="500px" src="https://www.val.town/embed/maxm/SSEDemo" title="Val Town" frameborder="0" allow="web-share" allowfullscreen></iframe>
</div>

In the browser you can use `EventSource` to read individual events as they are
written:

```tsx
const eventSource = new EventSource("https://maxm-ssedemo.web.val.run")

eventSource.onmessage = function(event) {
    console.log(event.data); // => "hello"
};
```

You can check out
[maxm/valTownChatGPT](https://www.val.town/v/maxm/valTownChatGPT) for a more
complex application using Server-Sent Events.

### Streaming Responses

Any HTTP response that is written incrementally will now stream to the client.
In the example below we proxy the latest image from the Webb Telescope. [A 130mb
image full of
supernovae](https://www.flickr.com/photos/nasawebbtelescope/53782948438/in/album-72177720313923911/).
This response will begin downloading before the request is complete and far
exceeds the 10mb limit we used to have on responses.

<iframe width="100%" height="200px" src="https://www.val.town/embed/maxm/jamesWebbImageProxy" title="Val Town" frameborder="0" allow="web-share" allowfullscreen></iframe>

### Streaming Requests

We've removed the 2mb limit on request body size. Request bodies can now be up
to 100mb and can be read into the Val incrementally. Here's an example Val that
returns the size of the request body without holding all of it in memory:

<iframe width="100%" height="400px" src="https://www.val.town/embed/maxm/reportBodySize" title="Val Town" frameborder="0" allow="web-share" allowfullscreen></iframe>

If we upload a large file to that endpoint it will respond as we'd expect:
```bash
$ curl --data @image.png https://maxm-reportbodysize.web.val.run
66799801
```

### Much More

We're excited to see what you build with these new features. With relaxed upload
and download limits it's much easier to store larger objects in blob storage.
This change also paves the way for future support for
[websockets](https://github.com/val-town/val-town-product/discussions/144).

Here's a few more examples to inspire your next Val:

- [maxm/multiplayerCircles](https://www.val.town/v/maxm/multiplayerCircles) - a
  collaborative canvas of movable circles that polls the database on the backend
  and streams changes to the frontend.
- [thesephist/webgen](https://www.val.town/v/thesephist/webgen) - ask chatGPT to generate a website and watch it render bit by bit in front of your eyes. (watch this built live [on Steve's livestream](https://x.com/i/broadcasts/1yNGaZYkdVXJj))
- [maxm/asciiNycCameras](https://www.val.town/v/maxm/asciiNycCameras) - streaming ASCII videos of NYC traffic cameras.