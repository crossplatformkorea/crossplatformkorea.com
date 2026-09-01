---
name: review-self
description: Independently review the current Cross-Platform Korea diff or PR, fix validated in-scope issues, rerun relevant checks, and confirm stability. Use when asked for review-self, a self-review loop, simplification, or an exact-head fallback review.
---

# Review Self

Review the complete target immediately. Invocation permits local in-scope fixes
and verification, but does not add permission to commit, push, comment, merge,
deploy, release, or mutate live data.

## One round

1. Reconstruct the request and acceptance criteria.
2. Snapshot the full base-to-head diff plus staged, unstaged, and untracked
   overlays; never review only the latest commit.
3. Read surrounding code and instructions for every changed path.
4. Check end-to-end wiring, failure paths, concurrency, idempotency, data safety,
   security, accessibility, responsive behavior, public contracts, docs, tests,
   deployment, and KISS/SSOT.
5. Validate findings against current code. Reject taste-only churn and unrelated
   improvements.
6. Fix validated findings in one coherent batch, reread the full diff, and run
   path-specific checks plus `git diff --check`.

For a large or production-sensitive diff, use independent read-only reviewers
for application/auth and CI/security lenses when available and authorized.

Two consecutive complete clean rounds establish stability. Any material change
resets the count. If the user requested a timed interval, use the product's real
wake-up mechanism; never emulate monitoring with shell sleep loops.

Stop without calling the result clean when authority or a product choice is
missing, the same finding survives two fix attempts, the same tool blocker
repeats three rounds, or required verification cannot pass.
