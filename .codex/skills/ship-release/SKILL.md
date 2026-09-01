---
name: ship-release
description: Merge an exact reviewed Cross-Platform Korea change, wait for the affected Convex/Firebase and GitHub Pages deployments, verify production behavior, and return to clean current main. Use only when the user explicitly asks to merge, deploy, and verify.
---

# Ship the Site

This workflow performs public production actions. Use only the authority
explicitly present in the active request.

## Gate the exact change

Require a clean reviewed head, terminal successful CI, no unresolved actionable
feedback, an up-to-date mergeable branch, and all path-specific checks. Confirm
the head SHA again immediately before merge. Do not bypass protection or merge a
pending/failing revision.

## Deliver

Use the repository-supported merge method and delete only the merged topic
branch. Record the merge commit. Then monitor the workflows triggered by that
exact commit:

- Web or Convex changes: `Deploy to Production` must complete Convex before
  Firebase Hosting.
- Docs changes: `Deploy Docs` must publish the Pages artifact.
- Mixed changes: both workflows must succeed; one is not evidence for the other.

For a first Pages deployment, enable Pages with GitHub Actions as the source
before dispatching the workflow. If a custom domain is owned by a legacy Pages
repository, build the new artifact first, transfer the domain deliberately,
then verify HTTPS before archiving the legacy repository.

Production and Pages jobs must reject non-`main` refs in workflow code. Keep
the host-side `production` and `github-pages` environment deployment policies
restricted to `main`, and verify those policies before dispatching a release.

Do not manually redeploy around a failing workflow until its root cause is
understood and the retry is authorized.

## Verify production

Check `https://crossplatformkorea.com` and, when affected,
`https://doc.crossplatformkorea.com` with a cache buster. Verify changed flows,
console errors, assets, links, and responsive behavior. For auth changes, use
`auth-e2e` and keep OTP/GitHub account-linking evidence redacted.

Finish on local `main` fast-forwarded to `origin/main` with a clean worktree.
Report the reviewed SHA, merge commit, checks, deployment runs, production
evidence, and any manual constraint.
