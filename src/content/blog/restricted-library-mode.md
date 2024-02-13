---
title: Restricted Library Mode
generated: 1701894028886
description: Evolving Val Town’s security model
pubDate: May 4, 2023
author: Steve Krouse
---

[Val Town](https://val.town) is a social programming environment to write, run,
and share code.

Today we’re announcing a large breaking change: _Restricted Library Mode_.
You’ll still be able to do what you were doing before, but you’ll need to spend
a couple minutes upgrading your vals to our new semantics. We’re actually quite
excited: in addition to a much-needed security upgrade, we think our new
semantics are much clearer and a stronger foundation for us to build on.

We expect 90% of you will have zero or one affected vals. We're only changing
the semantics of what happens when one user calls another user’s function in Val
Town. Nothing is changing if you are only calling your own functions or calling
functions that refer only to public state. The changes affect functions that
access private data or mutate state across user accounts.

Due to security concerns, _we are rolling out these changes immediately_. If you
have vals running in production,
[please read the upgrade guide](../restricted-library-mode) to upgrade with
minimal downtime. It should only take a couple of minutes.

We apologize for this no-warning rollout. We are committed to maintaining a
stable **and** secure platform. Unfortunately those commitments were at odds
today: advance warning of these change could invite attacks to the very
vulnerabilities we are closing. We had to choose between these two priorities,
and we chose security.

We will be all-hands-on-deck over the next couple days to help you all upgrade
your affected vals over to the new semantics. You can reach me by email at
[steve@val.town](mailto:steve@val.town) or get help from
[me, our team, and our community on Discord](https://discord.gg/dHv45uN5RY).

This post is part security disclosure, part breaking change, and part upgrade
guide. They are all very tightly coupled, so we felt a single post made the most
sense.

### API Mode

The old semantics of Val Town were incredibly powerful, but not intuitive nor
easy to secure. We refer to those semantics as “API Mode.” When user `@A` called
user `@B`’s function, it was like `@A` was calling `@B`’s API. For the execution
of `@B`’s function, `@B`'s permissions would take over:

- the function could access and mutate `@B`’s private vals
- access `@B`’s secrets
- email `@B` using `console.email`

In some ways this was very powerful and intuitive: functions as APIs. However,
it was too magical. We estimate that the majority of our users had the wrong
mental model about how this worked. Most importantly, API Mode was fundamentally
difficult to secure.

### Security concerns

In the old API Mode semantics, when `@A` called `@B`'s function, we attempted to
adhere to the semantics of _both_ a function call and an API call. This allowed
`@A` and `@B` to pass each other arbitrary, rich, dynamic JavaScript objects to
each other. For example, user `@A` could pass user `@B` a _function_ which,
because it was created by user `@A`, would have user `@A`'s permissions. It was
wild: a whole permission model could be built out of constructing arbitrary
functions that one could voluntarily pass to other users!

There was a more mundane reason that we needed to support passing rich objects
between users: most of our users expected calling a function to act like calling
a function, not like calling an API. An earlier version of Val Town tried only
allowing JSON to be passed between function calls, but that was way too limiting
and unexpected. For example, if you called a function that returned even a `Set`
or `Response`, getting back JSON would be incredibly frustrating.

If you are familiar with the challenges of
[sandboxing user code](https://healeycodes.com/sandboxing-javascript-code), you
might realize that we set ourselves a herculean task: keeping user secrets
sandboxed while also allowing them to pass arbitrarily rich computational
objects between each other. After playing and losing this cat-and-mouse game
with the fantastic exploit-finder [Andrew Healey](https://healeycodes.com/) one
too many times, we decided to admit defeat and race to a more securable
semantics ASAP. Specifically, we needed semantics that allowed for process
isolation and serialization between all user code.

### Has your private data been leaked?

No! Your private data and secrets are secure to the best of our knowledge.

We are confident that our former semantics were not exploited to access your
private data. All Val Town executions are meticulously logged. We combed through
them, and did not find a single instance of a user accessing another user’s
private data or secrets. It is possible that there are unknown exploits that
were taken advantage of, but we think this is unlikely.

### Everything is still possible, now securely

We were able to find a scheme that allows for virtually all former uses of the
platform to continue to exist, but in a secure way:

- _If you want to use another person’s function with access to \_your own_
  secrets, pass those secrets as arguments.\_
- _If you want to use another person’s function with access to \_the other
  person’s_ secrets, call it via API.\_

The limitations of this scheme are:

- It is a breaking change, so it requires manual upgrades
- It prevents the power of passing rich objects between users with their
  separate permissions
- It is more verbose: instead of implicitly referring to secrets (ie
  `@me.secrets.openai`), you have to explicitly pass your secrets to functions
  that need them.

We refer to our new semantics as “Restricted Library Mode”, but first you should
understand what we mean by “Library Mode”, and why we needed to restrict it
further.

### Library Mode

“Library Mode” is the normal behavior you’d expect when using code written by
someone else: the code runs with the permissions of the _caller_ of the function
(unlike API Mode, which ran functions with the permissions of the function
_author_)_._

Library Mode allows foreign code to access and affect the consumer’s private
resources. For example, when I run an npm module on my local computer, that
module has access to my `ENV` and can even read and write arbitrary files on my
computer. This opens an attack vector: library authors can publish malicious new
versions that read the user’s private data and sends it to themselves. Package
ecosystems have built up a number of ways to combat this threat, such a version
pinning, package scanning, and reporting. As a four-person startup, we don’t
have the resources to detect and combat this. We needed a more restrictive
permission model.

### Restricted Library Mode

Restricted Library Mode prevents foreign code from accessing secrets and private
vals or mutating vals. The semantics for when `@A` calls `@B`'s function:

| Code in @B's function (called by @A) | API Mode       | Library Mode   | Restricted Library Mode |
| ------------------------------------ | -------------- | -------------- | ----------------------- |
| @me.secrets.foo                      | @B.secrets.foo | @A.secrets.foo | undefined               |
| @A.secrets.foo                       | Error          | @A.secrets.foo | undefined               |
| @B.secrets.foo                       | @B.secrets.foo | undefined      | undefined               |
| @me.privateFoo                       | @B.privateFoo  | @A.privateFoo  | undefined               |
| @A.privateFoo                        | Error          | @A.privateFoo  | undefined               |
| @B.privateFoo                        | @B.privateFoo  | undefined      | undefined               |
| @me.publicFoo                        | @B.publicFoo   | @B.publicFoo   | @B.publicFoo            |
| @A.publicFoo                         | @A.publicFoo   | @A.publicFoo   | @A.publicFoo            |
| @B.publicFoo                         | @B.publicFoo   | @B.publicFoo   | @B.publicFoo            |
| @me.foo = x                          | @B.foo = x     | @A.foo = x     | No-op                   |
| @A.foo = x                           | Error          | @A.foo = x     | @A.foo = x              |
| @B.foo = x                           | @B.foo = x     | No-op          | No-op                   |
| console.email                        | Emails B       | Emails A       | Emails A                |

In case it wasn’t clear: when you create your own vals and call your own code,
you have access to all of your own private vals and secrets, and can mutate your
own vals. This remains unchanged. The change to our semantics only applies when
you call other others’ code from your own: their code can’t access secrets or
private vals, and if it sends an email, the email goes to you, the _caller_.

_Val Town has moved to Restricted Library Mode, effective immediately._

We moved away from API Mode to provide a more secure sandbox for your secrets.
We moved to Restricted Library Mode to preemptively protect your secrets from
malicious library writers. This breaks vals that call other user’s vals that
read or mutate that user’s private state.

For example, this breaks some calls to one of my personal favorite
vals:`@patrickjm.gpt3`. It is a relatively simpler wrapper around GPT3’s API,
but we at Val Town decided to “sponsor” this function (up to $2 / day), such
that anyone could call it for free gpt3 access, without any API key. We intended
it as a fun way to allow folks to play with APIs quickly and easily.

<div class="not-content">
  <iframe src="https://www.val.town/embed/@patrickjm.gpt3" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

However this function refers to `@me.openAiFreeUsageConfig.key`, which is a val
private to `@patrickjm`. Now any calls to `@patrickjm.gpt3` that rely on this
key (ie don’t pass their own) will fail, because `@me.openAiFreeUsageConfig`
will return `undefined`.

We have created a secure method to enable these sorts of use-cases, and we hope
it’s even more intuitive than before!

<div class="not-content">
  <iframe src="https://www.val.town/embed/@stevekrouse.apiExample" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

### API v0 → v1

We are now introducing a new API that provides a secure way for you to expose
your Val Town functions as APIs. It has API Mode semantics, but it’s secure (and
hopefully intuitive), because under the hood it’s a _traditional API call_.
There is process isolation and JSON-serialization between all user’s private
data.

The v0 API had two routes:

- `/eval/:code` - evaluates code passed in through the URL bar
- `/express/:expressHandler` - runs the passed in function as an ExpressJS
  handler, allowing you to return arbitrary HTTP responses

_The v0 API is now deprecated_, but will continue to work, under the new
Restricted Library Semantics.

The v1 API has three routes:

- `/v1/eval/:code` - evaluates arbitrary code, in Restricted Library Mode, with
  a simpler return type
- `/v1/run/:user.:val` - runs the val as in API Mode
- `/v1/express/:user.:val` - runs the val as an Express handler in API Mode

So now when `@A` wants to call `@B`'s API, instead of making a function call to
`@B.foo("bar")`, `@A` makes an API request to
`https://api.val.town/v1/run/@B.foo`.

We also made a convenience function, `api`, which accomplishes the same thing
from within Val Town: `api(@B.foo, "bar")`.

### When should you use `api()`?

For the vast majority of the time, when you are calling someone else’s val, you
are likely calling it as a normal _function_, so you’d like the semantics of
Restricted Library Mode. The most popular val (so far) `@stevekrouse.fetchJSON`
is a perfect example! You should never use `api` when calling it because it’s a
true library function that doesn’t access any state. You should reserve `api`
for when you are truly using another’s function as an API, which means that
you’re using state stored in their namespace, or wanting to alert them via
`console.email`.

| Code run as @A | Tracing & Logs (”Evaluations”) | Permissions                      | Return Type  |
| -------------- | ------------------------------ | -------------------------------- | ------------ |
| @B.foo()       | Viewable only to A             | Can not access any private state | Any JS Value |
| api(@B.foo)    | Viewable only to B             | Accesses @B’s Private State      | Only JSON    |

### Passing secrets as arguments

The new pattern for using _your_ secrets in conjunction with foreign code is to
pass them as arguments to other’s functions.

<div class="not-content">
  <iframe src="https://www.val.town/embed/@stevekrouse.librarySecretEx" width="100%" frameborder="no" style="height: 400px;">
    &#x20;
  </iframe>
</div>

This will be safe as long as the function’s author doesn’t decide to be
malicious and change the code to send your secrets to themselves. You open
yourself to this attach vector whenever you import someone else’s code (like
from npm) and don’t pin to a version of their function. We plan to add version
pinning to Val Town in the coming months to improve the security story here as
well. Until then, be wary about passing your secrets as arguments to others’
code, like you would about using unpinned npm dependencies. You can get
increased security by forking others’ functions to your account, which is like a
manual pinning operation.

### Upgrade Guide

Most usage of Val Town will be unaffected by these breaking changes. If you were
already using vals like libraries (not like APIs), you might not need to take
any action.

### 1. Find broken call sites

The easiest and quickest way to find broken call sites is to check if any of
your vals have stopped working.

One way to do that is to visit your global tracing log:
[https://www.val.town/settings/evaluations](https://www.val.town/settings/evaluations)
and look for evaluations marked with an ❌ to indicate that the run threw an
error.

This only works for vals that _have already run._ You may need to trigger vals
to run now to test if they are still working.

You can also find broken call sites by simply reading your code and checking if
they call someone else’s function, which in turn refers to that person’s private
state, recursively. This does take time, so it can be faster to just try to run
all your running vals and see which throw new errors.

### 2. Upgrade function calls with API calls

The vast majority of broken function calls can be seamlessly replaced by an API
call to that user’s val:

```tsx
@B.foo("hi") // old
// ->
await api(@B.foo, "hi") // new
```

The main gotcha to watch out for here is that where `@B.foo` function calls
could be synchronous or asynchronous, `api(@B.foo)` calls are always
asynchronous, so you’ll need to `await` them where appropriate, just like normal
API calls.

The `api` function is simply calling the API under the hood:

```tsx
async function api(valName, ...args) {
  const response = await fetch(`https://api.val.town/v1/run/${valName}`, {
    method: "POST",
    body: JSON.stringify(args),
  });
  const data = await response.json();
  return data;
}
```

Side note: you may notice that there’s something suspicious about the `valName`
parameter, because we actually accept the val’s name without you needing to pass
it as a string, ie `@B.foo`, not `"@B.foo"`. This wouldn’t be possible in normal
JavaScript but we own the runtime, so we can do compiler transformations like
this internally.

### 3. Upgrade API v0 calls with API v1 calls

If you are using Val Town’s v0 API to call functions that mutate your state or
access your private state, you will need to upgrade to the v1 API:

```
// v0 eval
https://api.val.town/eval/@B.foo("hi")
// v1 eval
https://api.val.town/v1/run/B.foo?args=["hi"]

// v0 express
https://api.val.town/express/@B.foo
// v1 express
https://api.val.town/v1/express/B.foo
```

Note that the new API removes the `@` symbol and has a totally new scheme for
passing arguments.
[Please refer to our new API docs for the full scheme.](https://val.town/docs/openapi.html)
It’s a bit less intuitive but simpler and more expressive.

### Contact

We're here to help! Please reach out over the next day or two if you have any
questions or concerns about these new semantics. You can reach me by email at
[steve@val.town](mailto:steve@val.town) or get help from
[me, our team, and our community on Discord](https://discord.gg/dHv45uN5RY).
