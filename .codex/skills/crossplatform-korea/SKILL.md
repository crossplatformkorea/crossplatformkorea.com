---
name: crossplatform-korea
description: Inspect, implement, or troubleshoot the Cross-Platform Korea monorepo, including the community web app, Convex backend and auth, Docusaurus docs, Firebase, GitHub Pages, and local agent workflows.
---

# Cross-Platform Korea

Start with `AGENTS.md` and preserve the monochrome brand and original logo.

## Architecture

- `apps/web`: React 19, Vite, Tailwind, Convex client
- `convex`: data, auth, email OTP, notifications, and server actions
- `apps/docs`: Docusaurus documentation and blog
- `.github/workflows`: CI, Firebase/Convex production, web previews, docs Pages

Use Bun 1.2.21 from the repository root. Keep root and workspace packages
`private: true`; public GitHub visibility must never imply npm publication.

## Operating rules

- Read-only inspection first; mutate only the surfaces the user placed in scope.
- Keep local and production environment values out of output and Git.
- Use explicit sign-in CTAs with safe `returnTo`; do not disable actions merely
  because authentication is required.
- Preserve verified-email account-linking invariants.
- Keep docs-only changes from deploying Convex/Firebase and web-only changes from
  redeploying Pages.
- Use `feat/<kebab-case>` for feature branches and Angular Conventional Commits.

Route complex work through `project-workflows` and the specialized local skill
whose description matches the request.
