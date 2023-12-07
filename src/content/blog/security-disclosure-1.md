---
title: Security Disclosure 1
generated: 1701894028891
description: Replacing our sandbox in response to a security disclosure
pubDate: January 13, 2023
author: Steven Krouse
---

Today we were alerted to a critical security vulnerability in Val Town. We immediately closed the vulnerability, investigated its scope, rotated our keys, suffered some downtime, and restored the service to full functionality.

We are very confident that this vulnerability was not exploited while it was open. Out of an abundance of caution, we rotated our database keys, which caused some downtime.

The bug was an insecurity in our sandboxing, which is currently based on [vm2](https://github.com/patriksimek/vm2). We’re actively working on replacing vm2 with Deno and hope to be running on Deno by next week. We’ll keep you all updated on that progress. Big thanks to the user who reported the bug - Philip Papurt - [@ginkoid](https://github.com/ginkoid)!

In the meanwhile, we’d like to *discourage* you from putting any particularly sensitive information into Val Town.

We are a new company and want to earn your trust over time. We are not yet confident in our security position and we want to be totally clear about that. Val Town should currently be used mostly for accessing unauthenticated API or APIs where it wouldn’t be a big deal if your auth tokens were exposed.

We apologize for this incident and hope to have a better sandboxing story for you all very soon. Thank you for your patience!

If you discover any other security vulnerabilities, please contact steve@val.town. Thank you!

*Timeline*

12:37 PM ET - notified of vulnerability

1:18 PM ET - closed the vulnerability

1:35 PM ET- rotated our keys, downtime started

1:37 PM ET - backend back up

1:42 PM ET - frontend back up
