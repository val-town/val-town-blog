---
title: "Post-mortem: SQLite data sharing"
generated: 1701894028874
description: Disclosing and fixing a recent security issue
pubDate: November 24, 2023
author: Steve Krouse
---

Val Town launched a SQLite integration with Turso leveraging their [new multitenancy feature](https://turso.tech/multitenancy) in private beta on Sept 11, 2023. We relaunched the integration as Val Town SQLite on Nov 15, 2023. On Nov 20th we became aware that all of our users’ queries were hitting the same SQLite database, instead of their own private databases.

We contacted Turso and after their investigation, learned that this was the case since Oct 17th. It had gone unnoticed by us and our users – luckily the integration is new and hadn’t been yet heavily used. We only noticed the issue when we started working on a lightweight SQLite data explorer that rendered a list of all the tables in a schema, and noticed table names that we didn’t create.

### Impact

Customers all shared a single SQLite database during the Oct 17th - Nov 20th period. All data was shared, visible and mutable, to any customer. Upon reviewing the queries that were written during this time, we found very few queries run against other user’s tables. Most collisions were on a test `kv` table that was used in our examples, and was mostly to test out the integration.

### Cause

Val Town’s SQLite integration was built on top of Turso database groups when the feature was in early beta. On Oct 17th, their system changed the way they recognized a group vs individual database to rely on a flag that never got set in our group database, because of how early it was created. From then on all queries were routed to the same database file, sharing schemas and data.

Upon learning of the issue, the Turso team fixed the issue immediately. They also assured us that it did not affect any other Turso users, as we were the only ones who had adopted the groups feature that early in their closed beta, and brought that same group to production.

> Turso takes data privacy extremely seriously. That’s why even one of our users having an issue like this is one too many, even if in private beta. We’ve taken steps to ensure this never happens again & are excited that our partnership with Val Town continues strong and mutually beneficial.

- Glauber Costa, Turso Founder & CEO

>

We at Val Town also take data security extremely seriously. Turso is a new but trusted vendor. We wouldn’t have adopted new features from them in an early state if we didn’t have a high degree of trust. We were confident that any potential issues would be quickly and thoroughly addressed. They have not broken that trust, and we look forward to continuing a fruitful partnership with them.

### Timeline

- Sep 11th - We launched our first Turso integration, on an early private beta of [multitenancy](https://turso.tech/multitenancy)
- Sep 25th - Turso’s [multitenancy](https://turso.tech/multitenancy) is officially launched
- Oct 17th - A Turso update that relied on an invariant that was not true for databases created before the launch caused the early private beta version we had started on to share all of all of our users’ databases.
- Nov 15th - We relaunched our integration as Val Town SQLite
- Nov 20th - We discovered and fixed the issue
