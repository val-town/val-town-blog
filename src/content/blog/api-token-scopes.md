---
title: "API Tokens Scopes"
description: Improving security with granular control over permissions
pubDate: Oct 3, 2024
author: Max McDonnell
---

We're adding scopes to Val Town API tokens. This will give you
more granular control over what your API tokens can do.

We'll also be introducing scopes to vals, so you can control
which resources your vals can access.

We're introducing read/write scopes for five resources:

- `val` – [vals](https://docs.val.town/openapi#tag/vals)
- `user` – [user account details](https://docs.val.town/openapi#tag/me)
- `blob` – [blob storage](https://docs.val.town/openapi#tag/blobs)
- `sqlite` – [sqlite database](https://docs.val.town/openapi#tag/sqlite)
- `email` – [ability to send emails](https://docs.val.town/openapi#tag/emails)

You will be able to configure the scopes of your API tokens from the
[API tokens](https://www.val.town/settings/api) page.

## Scoping vals

Right now, all vals run with a `valtown` environment variable,
which contains an old-style API token that has full access to your account.

Once we have token scopes, you'll be able to configure the scopes
that each of your vals has access to, ensuring that it only has access to the resources that it needs.

Vals will also start using short-lived API tokens when they are running, limiting the potential damage from a compromised val.

## Safer Defaults

The new default scopes for a val will
include everything except `val:write`
to limit potential damage from misconfigurations,
vulnerable libraries, or account compromises.

Without the ability to mutate Val
resources, unauthorized actors cannot execute new code or modify existing code
in your account.

We're also considering even fewer default scopes in the future,
and having a slick UI to let you opt-into extra scopes at runtime
when you code accesses them.

## Github Secret Scanning

We're joining the Github Secret Scanning program,
so if your API token is leaked in a public Github repository,
we'll be notified and can revoke the token.

## Migrating current users

In the coming weeks, we'll update the existing API tokens on people's accounts to
use these safer defaults. Many users use their existing API tokens or Vals to
create/edit/delete existing Vals in their accounts. We've identified those
users, and will hold off on migrating their tokens, and
work with them to upgrade.

We're always looking for ways to make our platform more secure. If you have
security-related feedback or new feature suggestions please make yourself heard
in our [Discussions](https://github.com/val-town/val-town-product/discussions).
