# Contributing

Thank you for helping Cross-Platform Korea connect knowledge across developer
ecosystems.

## Before you start

1. Create a branch named `feat/<kebab-case-description>` for feature work.
2. Install Node.js 20.20.2, Bun 1.2.21, and dependencies with `bun install`.
3. For web/backend work, run `bun run setup` once and follow the Convex prompts.
4. Use `.env.local` only for generated client/deployment values. Configure the
   server/provider secrets named in `.env.example` on the target Convex
   deployment, and never commit real values.

## Make a change

- Community site: `apps/web`
- Documentation and blog: `apps/docs`
- Backend and authentication: `convex`

Preserve the original monochrome identity and logo when changing the community
site. Keep authentication prompts explicit and return people to their intended
destination after sign-in.

Code contributions are covered by the root MIT license. Documentation and
media follow [apps/docs/CONTENT_RIGHTS.md](apps/docs/CONTENT_RIGHTS.md); submit
third-party text, images, logos, or recordings only when you have permission.

## Validate

Run the checks relevant to your change. Before opening a pull request, the full
suite is preferred:

```sh
bun run test
bun run lint
bun run tsc
bun run build:web
bun run build:docs
```

Use Angular Conventional Commits, for example:

```text
feat(docs): add expo router guide
fix(auth): preserve destination after sign in
```
