---
title: "Leveling Up Our API Tokens: Introducing Scopes"
description: Improving security and allowing more granular control over permissions.
pubDate: Oct 3, 2024
author: Max McDonnell
---

We've added more granular permissions to our API tokens and changed some of the
default behavior of our platform to keep things more secure.

We've added read and read/write scopes for five key resources: `val`, `blob`,
`user`, `sqlite`, `email`. You can browse our API docs to see how these
resources are accessed today: https://docs.val.town/openapi.

## Configuring scopes

There are two ways to configure token scopes. You can visit the
[API tokens](https://www.val.town/settings/api) page and generate a new token
with specific permissions. This token can be used with our API from outside of
the platform, or from within a running Val.

![](./api-token-scopes/val-names-permissions.png)

Additionally, can configure the permissions of each Val in your account to
ensure that it only has access to the resources that it needs.

## Safer Defaults

Vals will now use short-lived API tokens when they are running. Additionally,
the default permissions for a val will only be able to read the `val` resource,
not edit, create, or update any Val.

These new defaults help limit potential damage from misconfigurations,
vulnerable libraries, or account compromises. Without the ability to mutate Val
resources, unauthorized actors cannot execute new code or modify existing code
in your account.

## Migrating current users

Many users use their existing API tokens or Vals to create/edit/delete existing
Vals in their accounts. We've identified those users, We'll hold off on
migrating their tokens over to the new permissions, and work with them to
upgrade.

We're always looking for ways to make our platform more secure. If you have
security-related feedback or new feature suggestions please make yourself heard
in our [Discussions](https://github.com/val-town/val-town-product/discussions)
or reach out to security@val.town.
