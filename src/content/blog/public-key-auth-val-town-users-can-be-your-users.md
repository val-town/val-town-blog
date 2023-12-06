---
title: "Public Key Auth: Val Town users can be your users"
generated: 1701894028878
description: A novel authorization scheme for Val Town
pubDate: June 27, 2023
author: Steven Krouse
---

Every public function in Val Town has [an API endpoint](https://docs.val.town/api#c9dc919e5001468f8c678d279e8532be). Some vals wrap premium APIs ([openai](https://www.val.town/v/patrickjm.gpt3), [rime](https://www.val.town/v/stevekrouse.rime)) that you can use for free. The idea is that sometimes you want to just try an API or use it a tiny amount (\<$0.10) and we’re happy to cover that.

But what about abuse? It’s easy enough to add a [rate-limit](https://www.val.town/v/stevekrouse.rimeRateLimitExceeded) to these functions to ensure that the total usage is below some maximum, but it would be nice if we could make this rate-limit per-user. If “borrow my API key” becomes a pattern, you could imagine a marketplace of premium functions on Val Town that somehow charge for usage… but we’re getting ahead of ourselves.

First, we need a way for Val Town users to authenticate themselves to third-parties. This is distinct from authenticating to Val Town, the platform. That’s a much easier problem - we provide [api auth tokens](https://www.val.town/settings/api) to authenticate with _us_. The challenge is authenticating with another Val Town _user_. You need to prove that you are who you say you are, that you made this very request, and that you’re making it now. The generic way to solve this sort of problem is public key cryptography:

1. Create a public/private key pair
2. Publish the public key under your Val Town username
3. Whenever you want to make an authenticated request, collect the request package:
   1. the endpoint
   2. the data you’re sending
   3. the time you’re making the request
   4. your Val Town username
4. Sign the package & send along the signature with your request
5. The API you’re calling can then do the reverse of this:
   1. fetch your public key from your Val Town account
   2. verify the signature against the provided data
   3. confirm the timestamp is recent enough.

It took an afternoon to get it working, and the main issue was struggling to understand the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) and get them properly encoded into a format that can persist on Val Town. I learned a lot about encoding ArrayBuffers into base64 and back again. But the whole point of Val Town is that now that I’ve written these vals, you don’t have to worry about any of that - you just call [`@stevekrouse.generateKeys`](https://www.val.town/v/stevekrouse.generateKeys) and viola you get keys in beautiful JSON. Let me take you through how to set yourself up to both authenticate with this system and accept authenticated requests.

## 1. Generate your keys

Click **\*\***Run**\*\*** to generate keys and see them in JSON. If you’re logged into Val Town, this will save those keys to your account.

<div class="not-content">
  <iframe src="https://www.val.town/embed/new?code=import+%7B+set+%7D+from+%22https%3A%2F%2Fesm.town%2Fv%2Fstd%2Fset%22%3B%0Aimport+%7B+generateKeys+%7D+from+%22https%3A%2F%2Fesm.town%2Fv%2Fstevekrouse%2FgenerateKeys%22%3B%0A%0Alet+keys+%3D+await+generateKeys%28%29%0A%0Aexport+let+exportedKeySetter+%3D+Promise.all%28%5B%0A++set%28%22exportedKeys%22%2C+keys%29%2C%0A++set%28%22publicKey%22%2C+keys.publicKey%29%0A%5D%29" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

## 2. Publish your public key

Above we generated a public and private key pair. We want your private key to remain private always but we need to publish your public key.

1. [Go to your public key](https://www.val.town/v/me/publicKey)
2. Press the 🔒 icon toggle and publish that val

## 3. Make an authenticated request

To make an authenticated API request you need to pass:

1. The Val you want to call
2. The args you want to pass
3. Your handle
4. Your keys

[`@stevekrouse.runValAPIAuth`](https://www.val.town/v/stevekrouse.runValAPIAuth) packages all this up with a timestamp, signs it, and makes the request. Here’s how you’d use it:

<div class="not-content">
  <iframe src="https://www.val.town/embed/stevekrouse.authRequestEx" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

## 4. Verify the request

To make an API that verifies the request, you can use [`@stevekrouse.verifyAPIAuth`](https://www.val.town/v/stevekrouse.verifyAPIAuth):

<div class="not-content">
  <iframe src="https://www.val.town/embed/stevekrouse.exampleAuthApi" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

## Further directions

This scheme uses the Val Town Run API, but it can easily be adapted to the Val Town Express API. These keys and this scheme works only for signing/authorizing. We could also build an end-to-end encrypted version of this scheme by encrypting the request with the public key of the recipient. One could also imagine naming these schemes and passing your scheme’s protocol name to its recipient so that it knows how to properly authenticate you.

It’d be cool to add payment primitives on top of these authentication ones. One issue is that vals are not thread-safe and thus aren’t a good data store for payments. However this would be a perfect use for a regular sql database in conjunction with Val Town ([Neon](https://docs.val.town/persistence-databases/neon-postgres), [PlanetScale](https://docs.val.town/planetscale), Supabase, etc). An Val Town user could have a whole payment system in their own namespace. Anyone could register a payment with them and then they would follow up with the payer and recipients later (by email?) to actually collect and distribute the payment.

We might one day adopt authentication and payment into Val Town as a first-class primitives, but it’s fun to keep them in userspace for as long as possible to encourage experimentation and innovation.

You may have noticed that Val Town has many of the the best parts of web3 — a global runtime of code and data — but for good and ill, there’s no blockchain. We keep everyone’s data in a handy Postgres instance, which means it’s super fast and cheap, but you’ve gotta trust us at Val Town. We also lack any sort of authentication or payment primitives… but maybe not for long!
