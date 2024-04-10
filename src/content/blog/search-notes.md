---
title: Researching Search at Val Town
description: Searching code at scale without creating the need for a search team is hard
pubDate: April 10, 2024
author: Tom MacWright
---

Val Town's search functionality isn't very good. Right now it's built on the Postgres [ILIKE](https://www.postgresql.org/docs/current/functions-matching.html) functionality, which just performs a substring search: if your search term is in the Val, it should appear in search results. There's virtually no ranking involved, and queries with multiple words are pretty poorly supported.

I'm working on improving this, but we haven't found a solution that fits our needs yet. Here are some notes from our research.

### Code search versus natural language search

A common issue with off-the shelf search solutions is that they're designed to work with English and other natural languages. For example, here are some of the algorithms you get by default with a usual FTS setup:

- **Stop words removal**: words like "the" and "it" are removed from text before it is indexed, because they're so common that they cause more problems for performance than they're worth.
- **Stemming**: this mostly [reverses conjugation](https://en.wikipedia.org/wiki/Grammatical_conjugation), turning a word like "running" into "run" before it is added to the index, and doing the same for search queries, so that you can search for "runs" and get a search result for a document with the term "running."
- **Lemmatization**: some search indexes are even fancy enough to substitute synonyms for more common words, so that you can search for "excellent" and get results for documents including "great."

All together, this means that the vector derived from a document that you're storing in the index does not look like the document at all:

```sql
select * from to_tsvector('english', 'I am writing this example sentence');
--- 'exampl':5 'sentenc':6 'write':3
```

The problem with all of these rules is that they wreak havoc on code. `the` is not a stop-word in TypeScript: it's a valid variable name that you might want to search for. Word boundaries aren't the same, and stemming function names doesn't make much sense.

```sql
select * from to_tsvector('english',
  'function stringifyNumber(a: number): string { return a.toString() }');
-- 'a.tostring':7 'function':1 'number':4 'return':6 'string':5 'stringifynumb':2
```

This is a pretty bad index: it has words that should be stop words, like `function`, and won't split `a.toString()` into two tokens because `.` is not a default word boundary.

### Full Text Search

Postgres has a [Full Text Search](https://www.postgresql.org/docs/current/textsearch.html) extension which is supported by our hosting provider, [Render](https://docs.render.com/postgresql-extensions). I've used FTS in previous projects, and for certain scales, it works great. You can try and [use Postgres for everything](https://www.amazingcto.com/postgres-for-everything/), and frankly, so far we have: we've been using the heck out of Postgres. It's a fantastic piece of technology with great documentation that is well-supported by our hosting provider.

If we can use Postgres for something, we will: keeping infrastructure as simple as possible is essential with a small team.

However, the previous projects I've used FTS for have run into performance problems and struggled to scale. We have a ton of vals, and are testing the limits of a single-node Postgres cluster. It's hard to find any accounts of code-search using FTS, though people might be quietly succeeding with it. I wanted to avoid this as a first option but keep it in my back pocket.

### pg_trgrm

The solution that we've soft-launched as the v2 search algorithm is based on [`pg_trgrm`](https://www.postgresql.org/docs/current/pgtrgm.html), which implements [trigram search](https://en.wikipedia.org/wiki/Trigram_search) in Postgres. Code search _does_ seem to succeed with trigrams: [Russ Cox's famous (to me?) piece from 2012 tells the story of how Google Code Search](https://swtch.com/~rsc/regexp/regexp4.html) used trigram indexes and a special regex implementation to succeed, technically. GitHub's [new search system](https://github.blog/2023-02-06-the-technology-behind-githubs-new-code-search/) uses trigram search too, in addition to a lot of technology that I'm jealous of. [Sourcegraph](https://github.com/sourcegraph/zoekt) has a trigram-based search tool that they've inherited from Google, too.

Our work with the Postgres `pg_trgrm` approach has been heavily informed by [Stephen Gutekanst’s blog post series about indexing repositories locally](https://devlog.hexops.com/2021/postgres-regex-search-over-10000-github-repositories/) in Postgres. We've created a [GIN](https://www.postgresql.org/docs/current/gin.html) index with `gin_trgm_ops` on a column containing search text.

The conclusion so far is that this is a great solution for regex search, but we're not doing regex search: most searches are more freeform. We're using [word_similarity](https://www.postgresql.org/docs/current/pgtrgm.html#PGTRGM-FUNCS-OPS) for search ranking, and it has been very hard to coax the algorithm into giving us anything like a reasonable ranking.

### The universe of options

| Option                                        | Architecture       | Language | Stars |
| --------------------------------------------- | ------------------ | -------- | ----- |
| [Meilisearch](https://www.meilisearch.com/)   | Standalone         | Rust     | 41k   |
| [Typesense](https://typesense.org/)           | Standalone         | C++      | 17k   |
| [Zoekt](https://github.com/sourcegraph/zoekt) | Standalone         | Go       | 406   |
| [ParadeDB](https://www.paradedb.com/)         | Postgres extension | Rust     | 3.2k  |

There are code-specific tools that exist, but most of them are closed-source: GitHub's search is excellent, but is obviously the work of a dedicated team with a real time budget.

- Sourcegraph's maintained fork of [Zoekt](https://github.com/google/zoekt) is pretty cool, but is pretty fearfully niche and would be a big, new infrastructure commitment.
- [Elasticsearch](https://github.com/elastic/elasticsearch) might be the eventual, unavoidable solution to this problem. It doesn't have code-specific handling, but can be tuned in nearly infinite ways. We're not excited to start learning about Java memory tuning and to introduce the first persistent disk storage to our application, as well as an additional source of truth for our data.
- [Mellisearch](https://github.com/meilisearch/meilisearch) seems like a promising ES alternative with the shininess of ✨Rust✨, but they [seem to emphasize latency over scalability](https://blog.meilisearch.com/meilisearch-vs-elasticsearch/), and we're not sure if the infrastructure commitment would be any lower.
- [ParadeDB](https://www.paradedb.com/) promises to be like Elasticsearch but "just Postgres," which is very appealing, but we [can't use their extension in Render yet](https://docs.render.com/postgresql-extensions).

---

In short, we're still working on it. Searching code instead of English makes the difficulty level a bit higher. For a small team, with an incentive to keep infrastructure simple, development environments easy to set up, and data in the same place, we're trying to be careful not to commit to something that requires constant upkeep. There's a reason why most mid and large-sized companies have a search "team," not just a search service.
