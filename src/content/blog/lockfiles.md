---
title: How we lock your dependencies
description: Adding lockfiles to Val Town for stability, security, and performance.
pubDate: Aug 23, 2024
author: Max McDonnell
---

Over the past few months we rolled out dependency lockfiles in Val
Town. Now when you save a val, we generate a
[deno.lock](https://docs.deno.com/runtime/manual/basics/modules/integrity_checking/)
file. When your val is run any time in the future, it'll use those exact same versions
of your dependencies – effectively pinning your unpinned dependencies. When you save a new
version of that val, we regenerate the lockfile from scratch, re-pinning your unpinned
dependencies to whatever their current versions are at that new time.

## Imports in Val Town

Val Town doesn't have a package manager like npm or yarn or package.json files. Imports
are listed at the top of the val and are resolved by our runtime, Deno. We support
`npm:` imports, `jsr:` imports, and `https:` imports. You specify the version (or not)
in the import statement. For example:

```ts
import lodash from "npm:lodash"; // unpinned, gets the latest
import lodash from "npm:lodash@4.17.21"; // pinned to 4.17.21

import { sqlite } from "https://www.val.town/v/std/sqlite"; // unpinned, gets the latest
import { sqlite } from "https://www.val.town/v/std/sqlite?v=6"; // pinned to version 6
```

## Everything's better with lockfiles

You'll see improvements on three fronts from lockfiles: stability,
security and performance.

**Stability**: Libraries would change over time and vals would break. Now, if you
build something and it is working, it should generally keep working.

**Security**: If there is a
malicious dependency, it is easy for the vulnerability to proliferate rapidly
without dependency pinning. Lockfiles will slow things down, and prevent certain
types of attacks from being very effective. Additionally we do integrity
checking on the contents of dependencies. If the contents of a module have
changed unexpectedly, we won't run your code.

**Performance**: Lockfiles cache the whole dependency tree,
so we make fewer requests, all in parallel. Module fetches to Val Town
fell by 80%. Worker initialization latency (P50) dropped 50%.

![](./lockfiles/metrics.png)

## Getting clever with updates

If you're a passionate Val Town user, you may notice an issue with this new
lockfile scheme as described so far. What happens when you are working on a
collection of vals that all depend on each other?

Maybe you have your CSS styles in one val that's imported into an HTTP val.
If you update your styles, you'd expect the HTTP val to pick up the changes
automatically.

Naively, lockfiles would break this pattern. You would update your CSS and you'd
need to re-save all vals that import that one to pick up the changes.

We don't want to make you do that. So when you save a val, we find all the vals
in your account that depend on that val and mark their lockfiles for regeneration.
That way you can keep rapidly iterating and we'll make sure to update dependency
relationships in your vals.

To be clear this pattern only works for you and your
dependencies. If you and a friend are iterating closely on a collection of vals,
you will need to re-save your vals that import your friend's vals to pick up
their newest versions. We think this is a good compromise
between security and convenience for now. Longer term, we plan to create [shared
collections of vals](https://github.com/val-town/val-town-product/discussions/139)
that teams can fluidly iterate on together.

## Going forward

We've seen a variety of situations where an https import has a subtle change
and val is halted from running because of an integrity error against what should
be the same exact version. If you run into this issue and are confident it's
not an exploit, you can fix it by re-saving your val, which will regenerate
the lockfile. We're working on the best way to handle these issues without
removing integrity checks entirely.

This is just the beginning of surfacing more granular control over dependencies
in Val Town. If you have a specific feature you'd like to see, or want to edit
your dependencies in specific ways please make a request in our [product
discussions](https://github.com/val-town/val-town-product/discussions).
