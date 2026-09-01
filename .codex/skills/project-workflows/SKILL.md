---
name: project-workflows
description: Route Cross-Platform Korea monorepo work through the correct validation, review, GitHub, deployment, documentation, authentication, and community workflows. Use for broad repo work, audits, PRs, releases, or when the right local procedure is unclear.
---

# Project Workflows

Read `AGENTS.md` first. The repository layout is:

- `apps/web`: React and Vite community site
- `apps/docs`: Docusaurus documentation and blog
- `convex`: backend and authentication

## Route by task

- Documentation or blog work: use `generate-doc`.
- Authentication or identity linking: use `auth-e2e`.
- Showcase submissions: use `add-showcase-app`.
- Community feature regression: use `community-e2e`.
- Review requested work: use `review-self` or `loop-review`.
- Update a branch from main: use `rebase-main`.
- Merge and production delivery: use `ship-release`.
- Announcements and public community copy: use `community-steward`.

## Default validation

```sh
bun install --frozen-lockfile
bun run test
bun run lint
bun run tsc
bun run build:web
bun run build:docs
git diff --check
```

For Convex, schema, auth, or deploy changes, run the production-target dry-run
using the exact production workflow command. For GitHub Actions, run `actionlint`
and verify triggers, permissions, secrets, concurrency, ordering, and failure
behavior.

Keep public GitHub communication in English and Angular Conventional Commits.
Do not edit generated Convex files by hand, expose local environment values, or
perform external writes without authority from the active request.
