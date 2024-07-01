---
title: "Revamping our API pt. 1: Moving from express to Fastify"
description: How switching to Fastify let us embrace runtime and compile-time types
pubDate: June 28, 2024
author: Tom MacWright
---

The last 15 years of developing software with JavaScript has included a lot
of turnover. We've gone from CommonJS to ESM, from browserify to esbuild
and Vite, from mocha to vitest, from using the request module to having
the fetch API available everywhere. The constant reinvention can be exciting
or annoying from one day to the next. But one tool that has remained
constant in my JavaScript toolkit has been [express](https://expressjs.com/).

Express, a web framework for Node.js,
was introduced by [TJ Holowaychuk][tj] in 2009. Like a lot
of early JavaScript modules and many of TJ's projects, it took inspiration
from the land of Ruby - in particular, [Sinatra](https://sinatrarb.com/), which
was established in 2007. Express is a beautifully light abstraction: a
'hello world' example is barely over 10 lines. Compared to the boilerplate
required to do the same in Ruby on Rails or a Java server at the time, it
was a breath of fresh air.

Express, to me, is part of JavaScript's Smalltalk or Scheme roots: it gives
you the freedom of JavaScript's loose types. A route that receives some query
string gets a [an arbitary object of query string parameters](https://expressjs.com/en/4x/api.html#req.query), which
might be dangerous to rely on. Similarly, a route can send any kind of
data in response. It's freeform: you can add types and schemas on top of it,
but the framework at its core wants you to feel liberated.

But the vibes have shifted: we write [TypeScript](http://typescript.com/) now,
and everyone's excited about validator modules like [Zod](https://zod.dev/)
and [TypeBox](https://github.com/sinclairzx81/typebox). APIs are no longer
documented manually: we're using [OpenAPI][openapi]
(née Swagger) and generating clients, test suites, and more from those
specifications.

When Val Town was very early on, the backend was written in Express. We
then started writing [public APIs](https://blog.val.town/blog/expanding-the-vals-api-rfc/), also using
express, and crafting manually-written OpenAPI documents to describe them.

[openapi]: https://en.wikipedia.org/wiki/OpenAPI_Specification
[async_mdn]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[tj]: https://github.com/tj
