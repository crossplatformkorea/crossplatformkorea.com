---
name: loop-review
description: Run Cross Platform Korea changes from a verified main baseline through implementation, two clean review rounds, an exact-head PR and CI gate, merge, deployment, and production verification. Use when the user asks for loop-review or requests work to be reviewed, merged, deployed, and verified end to end.
---

# Loop Review

Own one change from the current `main` baseline through verified production
delivery. Keep the loop scoped to the user's requested change and preserve
unrelated work.

## Establish The Baseline

1. Read the applicable `AGENTS.md` instructions and snapshot
   `git status --short --branch`.
2. If the worktree is clean, fetch `origin`, fast-forward `main`, verify
   `HEAD == origin/main`, and create a `feat/<kebab-case>` topic branch. Never
   create a `codex/` branch in this repository.
3. If requested work is already present, treat the loop as resumed. Record its
   merge base, preserve the diff, and move it to a topic branch without stashing,
   resetting, or discarding files.

## Implement And Verify

Implement the complete requested behavior before review. Use these checks as
the repository defaults, adding narrower checks when the changed code requires
them:

- TypeScript or Convex changes: `bun run test`, `bun run lint`, and
  `bun run tsc`.
- Frontend or shared dependency changes: `bun run build:web`.
- Documentation changes: `bun run build:docs` and inspect both locales.
- Lockfile or dependency changes: `bun install --frozen-lockfile`.
- Convex functions, schema, auth, or deployment changes: run a production-target
  `bunx convex deploy --dry-run -y`; when deployment builds the frontend, use
  `--cmd "bun run build:web" --cmd-url-env-var-name VITE_CONVEX_URL`, matching
  the production workflow exactly.
- GitHub Actions changes: parse the YAML, run `git diff --check`, and verify the
  trigger paths, required secrets, dependency install, build, deployment order,
  permissions, concurrency, immutable action pins, and failure behavior. Run
  `actionlint` when available.
- Authentication changes: verify provider callback behavior and the relevant
  account-linking invariants without exposing emails, tokens, OTPs, or user IDs.

Do not proceed with a known failing required check.

## Run Two Clean Review Rounds

Review the complete base-to-working-tree diff, including untracked files. For a
cross-cutting or production-sensitive change, use independent read-only
subagents for at least these lenses:

- application correctness, authentication, identity linking, and regressions;
- CI/CD correctness, least privilege, secret handling, and rollback/failure
  behavior.

Validate every finding against current code and the request. Fix all validated
in-scope findings in one batch, rerun affected checks, and reread the full diff.
Reject cosmetic churn and unrelated suggestions.

Use `review-self` as the local review contract. Subagents may review and run
read-only checks, but the primary agent owns every edit and final decision.

Require two consecutive complete clean rounds. Any material diff change resets
the count. Keep review state out of tracked files.

## Commit And Open The PR

Stage only task-owned files. Use an English Angular Conventional Commit message
and a concise English PR title/body. Push the `feat/` branch and open a PR to
`main`. Record the PR number and exact head SHA; every push invalidates earlier
exact-head coverage.

When the user explicitly requests a parentless one-commit history rewrite,
replace this PR step with an exact-tree release gate: create one root commit,
prove that it has no parent and `rev-list --count` is one, and keep it local
until every exact-root gate below is clean. Keep a verified local backup bundle
until delivery completes. Audit the complete old history plus Actions logs,
artifacts, PR refs, and other reachable references before making an existing
repository public. A force-push only rewrites branch history; never claim that
it purges host caches or PR refs. If sensitive data is found, or the user
requires a cryptographic purge rather than a one-commit default branch, stop and
use a new repository or the host's purge process.

For this explicit root-rewrite path, skip the PR-specific sections below.
Instead, gate the exact root SHA with the same local checks, two clean review
rounds, final-tree secret scan, remote lease verification, and proof that the
commit has no parent. After the private force-push, proceed directly to the
exact-commit workflow and public-release gates in the delivery section.

## Gate The Exact PR Head

This section and PR merging apply only to the normal topic-branch path, not the
explicit parentless root-rewrite path described above.

For the current head SHA, require all of the following:

- zero unresolved actionable review threads;
- required CI is terminal and successful;
- the PR is mergeable and up to date with `main` under repository policy;
- the worktree is clean and the final base-to-head diff has been reread;
- one final independent review round is clean for that exact head.

Fix valid feedback, push one coherent batch, reply to the matching inline
comments, and resolve only fixed or outdated threads. Recheck the new head after
every push. Do not bypass branch protection or merge pending/failing code.

## Merge, Deploy, And Verify Production

Immediately before delivery, confirm the exact PR head or reviewed root commit
is unchanged. On the normal path, use the repository-supported merge method,
defaulting to squash merge with branch deletion. On the root-rewrite path,
snapshot the repository Actions policy, temporarily disable Actions to prevent
an unconfigured Pages run, verify the private remote lease, and force-update
`main` once to the reviewed root SHA. Verify the remote default branch contains
that one parentless commit before changing visibility. Then make the repository
public, enable and verify private vulnerability reporting, enable Pages with
GitHub Actions as its source, and create or update the `production` and
`github-pages` environments so their deployment branch policies allow only
`main`. Verify both policies through the host API, restore the recorded Actions
policy, and manually dispatch every affected workflow on the exact root commit.
Keep the legacy docs repository and custom domain serving until the new
`Deploy Docs` run succeeds. Then:

1. Confirm the PR is `MERGED`, or confirm remote `main` is the reviewed
   parentless SHA with exactly one commit, and record the delivered commit.
2. Wait for every workflow affected by that exact commit: `CI`,
   `Deploy to Production` for web/Convex changes, and `Deploy Docs` for docs
   changes. Require Convex to complete before Firebase within production.
   On the normal PR path, an administrator must enable GitHub Pages with GitHub
   Actions as its source before the first docs run.
3. After the new `Deploy Docs` run succeeds, release and transfer
   `doc.crossplatformkorea.com` deliberately from the legacy Pages repository,
   verify HTTPS on the new site, and only then archive the legacy repository.
4. Verify the deployed Convex functions and recent logs, then smoke-test the
   live site behavior changed by the PR. For auth changes, confirm the provider
   callback succeeds and that existing OTP/GitHub account mappings remain one
   user when their verified primary emails match exactly.
5. Verify `https://doc.crossplatformkorea.com` when docs or Pages configuration
   changed, including both locales and browser errors.
6. Return to `main`, fast-forward it to `origin/main`, and finish only when the
   worktree is clean and `HEAD == origin/main`.

Report the PR or root-rewrite delivery, exact commit, checks, two-round review
evidence, deployment runs, production verification, and any remaining manual
constraint.

## Stop Conditions

Stop without merging if a required check fails, a required secret or permission
is unavailable, the same material finding survives two fix attempts, the exact
head cannot become clean, or a new product decision is required. Never describe
a pending or partially deployed result as complete.
