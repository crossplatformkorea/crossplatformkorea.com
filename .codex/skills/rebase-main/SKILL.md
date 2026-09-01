---
name: rebase-main
description: Safely fast-forward local main, rebase the current feature branch, resolve conflicts without losing staged, unstaged, untracked, or ignored local work, and verify the result. Use when asked to pull main, update from main, or rebase-main.
---

# Rebase Main

Do not commit or push unless separately authorized.

## Preflight

Record the current branch, `HEAD`, upstream, worktrees, staged/unstaged changes,
untracked files, ignored environment paths, and any active Git operation. Stop
for a detached head, current `main`, an active operation, a divergent local main,
or a base branch checked out elsewhere when it cannot be updated safely.

## Preserve local work

If dirty, create one named stash with `--include-untracked`, never `--all`.
Ignored environment files must remain in place. Record the stash object and do
not drop it until restoration is verified. Stop if any target tree would
overwrite an ignored local path.

## Update and rebase

Fetch `origin/main`, check out main without overwriting ignored files, and
fast-forward only. Verify local main equals `origin/main`, return to the recorded
feature branch, and rebase onto that exact commit.

Resolve each conflict by inspecting both intents. Do not blanket-select ours or
theirs, and regenerate generated files with their official generator.

## Restore and verify

Apply the stash with its index, compare staged/unstaged/untracked fingerprints,
and drop only the recorded stash after exact restoration. Run `git diff --check`
and affected validation. Report old/new SHAs and whether a published branch will
later require an authorized `--force-with-lease` push.

Never use `reset --hard`, `git clean`, or destructive checkout shortcuts.
