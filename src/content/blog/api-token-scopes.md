---
title: "API Tokens Scopes"
description: Improving security with granular control over permissions
pubDate: Nov 1, 2024
author: Max McDonnell
---

We've added API scopes to Val Town API tokens
to improve security and give you more granular
control over your use of our [REST API](https://docs.val.town/openapi).

We have read/write scopes for:

- `val` – [vals](https://docs.val.town/openapi#tag/vals)
- `user` – [user account details](https://docs.val.town/openapi#tag/me)
- `blob` – [blob storage](https://docs.val.town/openapi#tag/blobs)
- `sqlite` – [sqlite database](https://docs.val.town/openapi#tag/sqlite)
- `email` – [ability to send emails](https://docs.val.town/openapi#tag/emails)

The [API tokens page](https://www.val.town/settings/api)
now lets you view and configure the scope of each token.

## Scoping vals

This change also lets you configure the scope of vals.
When a val runs, we inject an API token into a `valtown` environment variable,
which that val uses to access Val Town Standard Library functions, such as
blob storage, sqlite, and email sending.

We are now allowing you to configure the scope of that injected `valtown`
API token environment variable, effectively scoping the permissions of the val,
ensuring that it only has access to the
resources that it needs.

![](./api-token-scopes/val-names-permissions.png)

Additionally, vals now receive short-lived API tokens when they are running, limiting the
potential damage from a compromised val.

## Safer Defaults

Starting today, the default scope for vals will include every scope
except `val:write` and `user:write` to limit potential damage from
misconfiguration, vulnerable libraries, or account compromises.
Without the ability to mutate val resources, unauthorized actors now cannot execute
new code or modify existing code in your account.

Further down the road, we're considering even fewer default scopes,
and having a slick UI to let you opt-into extra scopes at runtime
when your code accesses them. Think of the way iOS apps ask for
permissions when they need them.

## Github Secret Scanning

We're joining the [Github Secret Scanning program](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning), so if your API token is leaked
in a public Github repository, we'll be notified and can revoke the token.

## Migrating current users

We've updated 99% of existing API tokens to use these safer
defaults.

We identified which users are using the `val:write` scope, and have held off migrating their tokens, and work with them to upgrade. If you're one of these users,
expect an email shortly.

We're always looking for ways to make our platform more secure. If you have
security-related feedback or new feature suggestions please make yourself heard
in our [Discussions](https://github.com/val-town/val-town-product/discussions)
or reach out to security@val.town.
