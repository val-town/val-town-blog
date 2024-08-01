---
title: Security Disclosure 2
description: Missing permissions-checking in our internal save endpoint
pubDate: August 1, 2024
author: Tom MacWright
---

Last week we discovered a security issue with our internal API endpoints for saving and running vals that allowed registered users to save and run new versions of other user’s vals if they provided their own valid API token and another user’s val ID. We discovered this while doing other product development, and haven't found any evidence that this ability was ever exploited.

Our <a href='https://docs.val.town/openapi#/tag/vals/PUT/v1/vals/%7Bval_id%7D'>publicly documented APIs</a> for saving and updating vals were not affected.

The vulnerability was present since June 20th 2023, when we launched a new system for renaming and saving vals, that incidentally didn't correctly check all ownership conditions before allowing new versions of vals to be saved. We deployed a fix on July 22, 2024, the same day that our team discovered the issue.

It's our highest priority to keep Val Town secure and stable: we're building out a comprehensive test suite and better security practices to respond. We also have a [bug bounty program](https://docs.val.town/contact-us/security/) for reported vulnerabilities – we greatly appreciate the efforts of the community to keep us apprised of any issues.
