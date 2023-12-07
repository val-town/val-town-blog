---
title: Expanding the Vals API - RFC
generated: 1701894028847
description: Our REST API lets you do a lot - and soon it will enable more
pubDate: June 30, 2023
author: André Terron
---

We're excited to share that we're expanding our API! After many requests and some tools built (like a [chrome extension](https://github.com/pomdtr/val-town-web-extension), [terminal cli](https://github.com/pomdtr/val), [raycast extention](https://github.com/pomdtr/val-town-raycast-extension) and [trpc vals](https://www.val.town/u/valTownTrpc)) using our undocumented, unstable, internal API, we decided to enable more programmatic use of Val Town, and we want your input on what the API will look like.

Our long-term goal is that every resource and action in the platform will be accessible in our API, but the plan is to start small, and get the structure right first. In addition to our existing APIs to run code (Eval, Run, and Express), we will be adding a Vals APIs to:

- List a user’s vals (`/v1/users/{handle}/vals`)
- Retrieve vals by name (`/v1/users/{handle}/vals/{name}`)
- Search for vals (`/v1/vals/search`)
- Get the current user’s information (`/v1/me`)

Our focus for this initial Vals API is to provide the bare minimum needed to support a VSCode plugin and other tools to help you write and manage your vals outside of Val Town.

Let us know what you think of the URL scheme, the provided actions, return types, and pagination methods. If you need other capabilities, please let us know your needs and use-cases on Discord in our [#general](https://discord.com/channels/1020432421243592714/1020432421243592717) channel. We’re always open to feedback, but please share your thoughts by Sunday July 9th so we can consider them before we build the first version!

Note: The User and Vals API routes have not been implemented yet. The Eval, Run, and Express endpoints remain unchanged.

<div class="not-content">
  <iframe src="https://www.val.town/docs/rfc-1.html#/operations-tag-Vals" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>
