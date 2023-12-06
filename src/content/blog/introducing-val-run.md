---
title: Introducing val.run
generated: 1701894028864
description: Increasing the security of Val Town by isolating domains.
pubDate: June 23, 2023
author: Steven Krouse
---

Today we are introducing a new API scheme under the new `val.run` domain. In addition to an urgent security upgrade, the new API scheme is subdomain-based to leave the URL path clear for arbitrary webhook handlers. For example, this is what’s needed to create a [ChatGPT plugin](https://platform.openai.com/docs/plugins/getting-started), [Matrix Push Gateway](https://spec.matrix.org/unstable/push-gateway-api/#post_matrixpushv1notify), or [Bluesky Feed Generator](https://github.com/bluesky-social/feed-generator#overview).

We had planned to roll this out more gradually over the coming months, but were recently alerted to a potential exploit with our Express API, so we rolled out this new API effective immediately. Going forward all requests to our v0 and v1 Express API redirect to `val.run`.

This will require no change if:

1. You are using our Eval or Run APIs
2. Your Express API usage is in a browser (which automatically follow redirects)
3. You have `redirect: "follow"` in your fetch requests to our Express API

If not, it is a simple URL scheme switch - our Upgrade Guide below will walk you through it. We attempted to contact our API users ahead of this change, but we apologize if you were caught unawares and this causes breaking changes for you. We take breaking changes seriously, and only choose this path reluctantly to protect against the new exploit that was reported. The vulnerability was not exploited to the best of our knowledge.

## Overview

Val Town is a website for users to write and run JavaScript. User code can also be run via the API. The v0 API was launched in late 2022. The v1 API was launched on May 4th, 2023, along with [Restricted Library Mode](https://blog.val.town/blog/restricted-library-mode) semantics. The v1 API has three modes, Express, Run, and Eval, which give various levels of convenience and customizability, depending on your needs.

Today’s new `val.run` API change only applies to our Express API. The exploit (explained below) relies running a client-side script on an HTML page, which is only possible in our Express API. The other two APIs (Eval and Run) only return JSON, thus are not affected, and are not being changed.

## Upgrade Guide

The changes to the Express API:

1. The domain is `express.val.run` instead of `api.val.town`
2. The username and val name are specified in the subdomain, not the URL path
3. Requests old Express API are redirected to the new scheme, effective immediately.

These changes provide an isolated security model and allow for fully-customizable API paths, as required by some webhook specs.

| Before                           | Now                      |
| -------------------------------- | ------------------------ |
| api.val.town/v1/express/user.val | user-val.express.val.run |

The share menus on vals now automatically point to the new Express API.

![valDotRunURLexample.png](./introducing-val-run/valdotrunurlexample.png)

## Exploit

The exploit was caused by how cookies are shared from parent domains to subdomains. It was responsibly reported by [easrng](https://easrng.net).

1. A malicious user makes an Express API val with the exploit (explained below)
2. Another user that’s logged into val.town visits `api.val.town/v1/express/username.exploitVal`
3. The exploit val returns a page with a client-side script
4. The script authenticates to our authentication provider (Clerk)
5. This succeeds because cookies from val.town are sent with requests made on api.val.town
6. The user who made the exploit val now has the logged in user’s access token
7. They could send it to themselves and gain full control over the Val Town account

This exploit was not taken advantage of to the best of our knowledge.

## Contact

We at Val Town will be on call for the next couple days, so please reach out if you have any questions or concerns. [Discord](https://discord.com/invite/dHv45uN5RY) is great if it’s a public question and the community might be able to help. You can contact me personally at `steve@val.town` for anything at all.

Thanks for your help and patience through this change. We’re looking forward to seeing all your cool new [GPT Plugins](https://www.val.town/v/stevekrouse.chatGPTPlugin) and other integrations this new API scheme enables!
