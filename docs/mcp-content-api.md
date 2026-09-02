# MCP content API — design

**Status:** proposal, not implemented. Nothing in this document exists in the
codebase yet.

Lets a community member connect Cross-Platform Korea to Claude or ChatGPT and
draft a post, showcase entry, or feature request through conversation instead of
the web form.

The whole design question is not "how do we accept writes over MCP" — that part
is small. It is **how we accept writes from an agent without turning the
community into a spam target**. Every decision below follows from that.

## Threat model first

An MCP write endpoint differs from the web form in three ways that matter:

| | Web form | MCP |
| --- | --- | --- |
| Effort per submission | A human types it | A loop can emit hundreds |
| Attribution | A signed-in session in one browser | A token that can be copied anywhere |
| Content origin | The person | A model, possibly steered by a third party |

The third is the subtle one. If a member asks their assistant to "summarize this
page and post it", the page's content — which the member has not read closely —
reaches our database. Prompt injection on that page becomes a posting primitive.
So **content arriving over MCP is never more trusted than anonymous input**, no
matter how trusted the account behind the token is.

## Authentication

Do **not** extend `CPK_WORKER_TOKEN` ([convex/posts/http.ts](../convex/posts/http.ts)).
It is a single shared secret with full admin authority, appropriate for one
first-party worker and nothing else.

Instead, per-user tokens:

```
mcpTokens: defineTable({
  userId: v.id('users'),
  tokenHash: v.string(),        // SHA-256; the plaintext is shown once, never stored
  label: v.string(),            // "Claude desktop", so a user can revoke one client
  createdAt: v.number(),
  lastUsedAt: v.optional(v.number()),
  revokedAt: v.optional(v.number()),
  scopes: v.array(v.string()),  // e.g. ['posts:draft', 'showcase:draft']
})
  .index('by_hash', ['tokenHash'])
  .index('by_user', ['userId'])
```

- Generated from profile settings, shown once, prefixed `cpk_mcp_` so leaked
  tokens are greppable by secret scanners.
- Compared with the constant-time helper already in
  [convex/posts/http.ts](../convex/posts/http.ts) (`sha256Equal`).
- Scoped and revocable per client. Revocation must be instant.

OAuth 2.1 is what the MCP spec prefers and what gives the nicest install flow,
but it is a much larger build. Tokens first; keep the authorization check behind
one function so OAuth can replace it without touching the tools.

## Tools

Read tools are safe and immediately useful:

| Tool | Notes |
| --- | --- |
| `list_categories` | Mirrors `/admin/categories` |
| `search_posts` | Public posts only, honours `isPublicPost` |
| `get_post` | Public posts only |

Write tools, and the rule that makes them safe:

| Tool | Lands as |
| --- | --- |
| `create_post` | `status: 'draft'` — **never** published |
| `create_showcase` | `pending` — invisible until approved |
| `create_feature_request` | `pending` |

**A write over MCP never produces publicly visible content.** It produces a
draft the author must open on the site and publish themselves. That single
constraint removes most of the incentive to abuse the endpoint at all: spam that
nobody can see is not worth sending. It also means a prompt-injected agent
cannot publish on a member's behalf.

The response returns a deep link (`https://crossplatformkorea.com/post/<id>`)
so the assistant can hand the member a "review and publish" URL.

## Spam and abuse controls

Layered, cheapest first, so the expensive check only runs on what survives:

**1 · Identity gate.** Token maps to a real account with a completed profile.
Accounts younger than N days, or without a verified email, cannot use write
tools. Cheap, and it forces an attacker to age accounts.

**2 · Rate limits.** Token bucket in Convex, keyed per token *and* per account
(so minting ten tokens buys nothing):

```
mcpUsage: defineTable({
  subjectKey: v.string(),   // "user:<id>" or "token:<id>"
  windowStart: v.number(),
  count: v.number(),
}).index('by_subject', ['subjectKey'])
```

Suggested: 10 drafts/hour, 30/day per account. Generous for real use, useless
for flooding. Exceeded limits return an MCP error the assistant can relay.

**3 · Content heuristics.** Deterministic, no model call — reject or flag on
link density, non-community domains, near-duplicate of the account's recent
submissions (normalized hash), repeated-character runs, and known spam patterns.
Reuse [convex/validators.ts](../convex/validators.ts) where it already applies.

**4 · Model moderation.** For what survives, one Claude call in a Convex action
scoring spam / off-topic / abusive. Store the score and reasoning on the row —
a human reviewer needs to see *why* something was flagged, and we need the data
to tune the earlier layers. Fail closed: if the moderation call errors, the
submission stays a draft and is queued, never auto-approved.

**5 · Review queue.** Showcase and feature-request submissions enter
`moderationQueue` for an admin (`admins` table) to approve. Posts do not need
this — they are drafts only their author can see, and publishing them goes
through the normal path.

**6 · After the fact.** Provenance on every row:

```
source: v.optional(v.union(v.literal('web'), v.literal('mcp'))),
sourceClient: v.optional(v.string()),   // the token's label
```

Shown in the UI. Members should be able to tell what a person wrote from what an
agent drafted — that is a transparency obligation, not just an anti-abuse
measure. It also makes cleanup after an incident a single indexed query.

Plus: user reports, auto-unpublish past a report threshold, an audit log of every
MCP write, and a `MCP_WRITES_ENABLED` env flag as a kill switch that does not
need a deploy.

## Transport

MCP Streamable HTTP as a Convex `httpAction` at `/mcp` on `CONVEX_SITE_URL`,
registered in [convex/http.ts](../convex/http.ts) beside the existing routes.
Convex actions can hold a streaming response, so no new infrastructure.

Discovery doc at `/.well-known/mcp` so clients can self-configure.

## Build order

Each step is independently shippable and useful:

1. Read-only tools + token auth. No write risk at all; proves the transport and
   the auth model against real clients.
2. `create_post` as draft, with layers 1–3 and provenance.
3. Model moderation (layer 4) and the audit log.
4. `create_showcase` / `create_feature_request` with the review queue.
5. OAuth 2.1, replacing tokens behind the same authorization boundary.

Stopping after step 2 still leaves a genuinely useful feature.

## Open questions

- Account age threshold for write access — needs a look at real signup patterns.
- Does a drafted post notify the author (push/email), or only appear in their
  profile? A notification makes the flow work when the assistant runs elsewhere.
- Should read tools require a token at all? Anonymous reads are simpler, but a
  token gives per-client rate limiting and usage visibility.
- Which model for moderation, and what does it cost per submission at expected
  volume?
