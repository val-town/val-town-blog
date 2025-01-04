---
title: "Post-mortem: Exhausted Host Connection Pool"
generated: 1701894028874
description: A single degraded host impacted certain Vals for some time.
pubDate: Dec 31, 2024
author: Max McDonnell
---

_An
[earlier version of this post](https://github.com/val-town/val-town-blog/commit/1059e2aff2973aa841b06c46c1ce6c3e680d2d45)
posited that the cause of this downtime was a degraded host network. We now
think that initial hypothesis was incorrect, so we have updated this post with
our current understanding of the cause.

### Timeline

At 12:15am ET a flurry of requests made many parallel edits to a Val. This
pattern of requests caused a few database queries to deadlock. Our database
connection pool lacked query timeouts and these locked connections permanently
occupied slots in our connection pool.

One of our servers entirely exhausted its database connection pool and started
to experience long delays on both inbound and outbound requests. Vals on that
server experienced network timeout errors and other issues. Some existing
connections continued to serve requests and some inbound and outbound requests
were successful, but most requests stalled indefinitely in a pending state. Our
health checks for this server did not check database state so the server
remained in degraded state for some time.

This persisted until 7:04am ET when we manually terminated the server after a
user report.

### Impact

We make our best effort to route Val requests to the same hosts so that they can
be picked up by a warm worker. As a result, certain Vals were repeatedly routed
to this host and experienced extended degradation. Those Vals failed to start
entirely, or experienced issues when trying to make outbound requests.

### Next Steps

We care deeply about reliability and are working to prevent this type of failure
in the future.

- We've updated our health checks to incorporate the health of the database
  connection pool, and we've added timeouts to pool queries.
- We've identified the cause of the deadlock, added tests, and changed the logic
  to be sure it can't deadlock again.
- We got unlucky with this one. Our external val execution health checks were
  being routed to other hosts. We've updated these checks to make sure that
  every host is hit with each health check request.

More generally, the lack of timeouts caused the server to reach capacity without
exhibiting backpressure. We'll be doing a more extensive review to be sure that
servers reaching capacity start to reject requests instead of queuing
indefinitely.

We are also in the middle of an ongoing effort to remove database queries from
the path of Val requests. In the future a failure like this would only lead to
API downtime and not Val execution downtime.
