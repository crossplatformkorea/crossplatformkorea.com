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
   `HEAD == origin/main`, and create a `codex/` topic branch.
3. If requested work is already present, treat the loop as resumed. Record its
   merge base, preserve the diff, and move it to a topic branch without stashing,
   resetting, or discarding files.

## Implement And Verify

Implement the complete requested behavior before review. Use these checks as
the repository defaults, adding narrower checks when the changed code requires
them:

- TypeScript or Convex changes: `bun run lint` and `bun run tsc`.
- Frontend or shared dependency changes: `bun run build`.
- Convex functions, schema, auth, or deployment changes: run a production-target
  `bunx convex deploy --dry-run -y`; when deployment builds the frontend, use
  the exact workflow command and `--cmd-url-env-var-name VITE_CONVEX_URL`.
- GitHub Actions changes: parse the YAML, run `git diff --check`, and verify the
  trigger paths, required secrets, dependency install, build, deployment order,
  and failure behavior.
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

Require two consecutive complete clean rounds. Any material diff change resets
the count. Keep review state out of tracked files.

## Commit And Open The PR

Stage only task-owned files. Use an English Angular Conventional Commit message
and a concise English PR title/body. Push the `codex/` branch and open a PR to
`main`. Record the PR number and exact head SHA; every push invalidates earlier
exact-head coverage.

## Gate The Exact PR Head

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

Immediately before merging, confirm the PR head is still the reviewed SHA. Use
the repository-supported merge method, defaulting to squash merge with branch
deletion. Then:

1. Confirm the PR is `MERGED` and record the merge commit.
2. Wait for the production GitHub Actions run associated with that merge and
   require both Convex and Firebase deployment steps to succeed.
3. Verify the deployed Convex functions and recent logs, then smoke-test the
   live site behavior changed by the PR. For auth changes, confirm the provider
   callback succeeds and that existing OTP/GitHub account mappings remain one
   user when their verified primary emails match exactly.
4. Return to `main`, fast-forward it to `origin/main`, and finish only when the
   worktree is clean and `HEAD == origin/main`.

Report the PR, merge commit, checks, two-round review evidence, deployment run,
production verification, and any remaining manual constraint.

## Stop Conditions

Stop without merging if a required check fails, a required secret or permission
is unavailable, the same material finding survives two fix attempts, the exact
head cannot become clean, or a new product decision is required. Never describe
a pending or partially deployed result as complete.
