---
title: "Post-mortem: Degraded Host Network"
generated: 1701894028874
description: A single degraded host impacted certain Vals for some time.
pubDate: Dec 31, 2024
author: Max McDonnell
---

### Timeline

At 12:15am ET one of our servers started to experience long timeouts on both
inbound and outbound connections. This degraded the network for many of our Vals
and they started to experience network timeout errors and other issues. Existing
connections continued to serve requests and some inbound and outbound requests
were successful, but most requests would stall indefinitely in a pending state,
timing out without establishing a connection. This persisted until 7:04am ET
when we manually terminated the server after a user report.

### Impact

We make our best effort to route Val requests to the same hosts so that they can
be picked up by a warm worker. As a result, certain Vals were repeatedly routed
to this host and experienced extended degredation. Certain Vals failed to start
entirely, or experienced issues when trying to make outbound network requests.

### Next Steps

We care deeply about reliability and are making sure that we detect this type of
failure in the future. We're working with our hosting provider to understand how
the network degraded, and we'll be updating our various health checks and
alerting to detect this kind of issue more proactively in the future.
