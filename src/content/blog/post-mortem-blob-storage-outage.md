---
title: "Post-mortem: Blob Storage Outage"
generated: 1701894028874
description: Disclosure, mitigation, and next steps
pubDate: May 2, 2024
author: Steve Krouse
---

Val Town [provides blob storage](https://docs.val.town/std/blob/) for use within Vals. Blob storage is used by many Vals as a quick key value store or as a place to store larger files like images and logs. Here's a basic example:

```tsx
import { blob } from "https://esm.town/v/std/blob";

await blob.setJSON("myKey", { isBlob: true });
const { isBlob } = await blob.getJSON("myKey");
console.log(isBlob)
```

Under the hood, blob storage is backed by [Cloudflare's S3-compatible object storage offering: R2](https://www.cloudflare.com/developer-platform/r2/).

On April 30th at 5:05pm UTC while offboarding a Val Town employee, we removed their user account from our Cloudflare organization. The API keys that we had been using to communicate with R2 were tied to the user account, and stopped working once the account was removed. At 8:00pm we had received a handful of user-reports about unexpected blob storage errors. Over the next hour, we raised an alert internally, identified the issue and replaced the credentials.

### Impact

Blob storage was unavailable from 5:05pm UTC until 9:05pm UTC. During that time 3,492 read requests and and 135 write requests failed to communicate with blob storage.

### Cause

Cloudflare's API credentials are tied to user accounts. When clicking through Cloudflare's R2 dashboard there is an API Tokens section where you can issue S3-compatible API credentials. It is not entirely clear that this page is scoped to an individual user and not the Val Town account itself. We were unaware of the scope of the credentials and did not appropriately ensure that the API credentials were tied to a long-lasting account.

[Cloudflare recommends](https://community.cloudflare.com/t/how-to-create-an-api-token-not-linked-to-a-user/556088/4) that organizations create a system account for credential creation.

### Next Steps

Val Town is taking the following steps to ensure issues like this do not happen in the future:

1. As Cloudflare recommends, we'll create a system account and associate our Cloudflare tokens with that account.
2. Audit our API keys used with other services and ensure they don't face similar issues.
3. We'll set up continually-running integration tests for core Val Town features to make sure we're alerted about downtime like this promptly and directly.
4. We are emailing all affected users to work with them to recover any lost data, or draw their attention to any error logs that might have resulted from the outage.