---
title: "Post-mortem: esm.sh Breaking Changes"
description: Disclosure, mitigation, and next steps
pubDate: Jan 16, 2025
author: Steve Krouse
---

### Timeline

TODO

### Impact

Impacted approximately 2% of users, though it did impact our most active users.

About 1% of users got error emails, and another 1% didn't get error emails but did experience a failed run or two.

### Cause

TODO

### Next Steps

1. Working with esh.sh creator to ensure this doesn't happen again
2. Longer term, vendoring dependencies so this all https imports on the backend will be stable
3. Longer term for the frontend, figuring out a better solution here is important, maybe we'll work with esm.sh to make things more stable
4. Shorter term, rewriting the deno lock errors to be much less confusing, and sending fewer error emails
5. Shorter terms, automatically detecting integrity errors and automatically regenerating lock files without bothering you (if safe). If not safe, ???
