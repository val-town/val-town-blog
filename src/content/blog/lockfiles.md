---
title: How we lock your dependencies
generated: 1701894028870
description: Adding lockfiles to Val Town for stability, security, and performance.
pubDate: Aug 21, 2024
author: Max McDonnell
---

Over the past few months we rolled out the use of dependency lock files in Val
Town. Now, when you save a Val we'll write a
[deno.lock](https://docs.deno.com/runtime/manual/basics/modules/integrity_checking/)
file with all of our dependencies. At any point in the future when your Val is
run again it'll use the exact same versions. When you go to update your Val
we'll regenerate the file from scratch, pulling the latest dependencies.

## Things are just a bit better with lockfiles

Generally, you'll see improvements on three fronts from this change: stability,
security and performance.

**Stability** is a bit of an obvious one. Libraries would change over time and
users would return to their Val and realize that it had broken. Now, if you
build something and it is working it should generally keep working.

The **security** benefits might be a little less obvious. If there is a
malicious dependency, it is easy for the vulnerability to proliferate rapidly
without dependency pinning. Lockfiles will slow things down, and prevent certain
types of attacks from being very effective. Additionally we do integrity
checking on the contents of dependencies. If the contents of a module have
changed unexpectedly, we won't run your code.

**Performance** wins abound. Thanks to some of the characteristics of lockfiles
we are able to make better use of caching and also make less network round-trips
for dependencies. Additionally, when Deno resolves dependencies with a lockfile
it knows the full graph ahead of time, and can get things done much more
quickly.

With this change we have dropped the number of esm.town [module fetches by
80%](https://x.com/mxmcd/status/1816144931720946080). P50 worker initialization
latency also dropped around 50% from 50ms to ~25ms.

![purple line graph showing a sharp drop from ~50ms to ~25ms](./lockfiles/image.png)

## Getting clever with updates

One of the more unique features of Val Town is the ability to make changes to
multiple Vals and see these changes flow instantly through your account.

Maybe you have your CSS styles in one Val, a shared library in another, and
they're all pulled into a few HTTP Vals. If you update your styles or alter a
library those changes should flow through to your HTTP Vals.

Naively, lockfiles would break this pattern. You would update your CSS and you'd
need to re-save any dependent vals to pick up the changes. To keep things all
nice and reactive, **when you save a Val we find all the Vals in your account that
depend on that Val and mark their lockfiles for regeneration**. That way you can
keep rapidly iterating and we'll make sure to update dependency relationships
when needed.

## Going forward

We've seen a variety of situations where an HTTPS dependency might be rebuilt
and val is halted from running because of an integrity error against the same
version of a library. If you run into this issue you can fix it by re-saving
your Val. We're working on the best way to handle these issues without removing
integrity checks entirely.

This is just the beginning of surfacing more granular control over dependencies
in Val Town. If you have a specific feature you'd like to see, or want to edit
your dependencies in specific ways please make a request in our [product
discussions](https://github.com/val-town/val-town-product/discussions).