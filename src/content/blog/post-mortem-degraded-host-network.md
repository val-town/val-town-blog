---
title: "Post-mortem: Degraded Host Network"
generated: 1701894028874
description: A single degraded host impacted certain Vals for some time.
pubDate: Dec 31, 2024
author: Max McDonnell
---

_After investigating we learned more about what happened and updated the content
of this post. You can view the
[original version here](https://github.com/val-town/val-town-blog/commit/1059e2aff2973aa841b06c46c1ce6c3e680d2d45)._

### Timeline

At 12:15am ET, one of our servers exhausted its database connection pool and
started to experience long delays on both inbound and outbound requests. Vals on
that server experienced network timeout errors and other issues. Some existing
connections continued to serve requests and some inbound and outbound requests
were successful, but most requests stalled indefinitely in a pending state. This
persisted until 7:04am ET when we manually terminated the server after a user
report.

### Impact

We make our best effort to route Val requests to the same hosts so that they can
be picked up by a warm worker. As a result, certain Vals were repeatedly routed
to this host and experienced extended degredation. Those Vals failed to start
entirely, or experienced issues when trying to make outbound requests.

### Next Steps

We care deeply about reliability and are working to prevent this type of failure
in the future. We're updating our health checks and alerting to detect
connection pool exhaustion. We're also further investigating the root cause to
prevent similar incidents.
