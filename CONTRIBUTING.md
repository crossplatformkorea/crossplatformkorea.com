# Contributing to Cross-Platform Korea

Thank you for helping Cross-Platform Korea connect knowledge across developer
ecosystems.

## Project structure

```text
apps/
  web/   # React + Vite community site
  docs/  # Docusaurus documentation and blog
convex/  # Convex backend and authentication
```

## Getting started

Install Node.js 20.20.2 and Bun 1.2.21, then install dependencies:

```sh
bun install
```

For first-time web/backend setup, connect a Convex development deployment and
initialize Convex Auth:

```sh
bun run setup
```

Convex writes generated client/deployment values such as `VITE_CONVEX_URL` to
`.env.local`. Configure the server/provider secrets named in `.env.example` on
the target Convex deployment. Never commit real environment values.

Run the community site and backend together:

```sh
bun run dev
```

Run the documentation site separately:

```sh
bun run dev:docs
```

## Development workflow

1. Create a branch named `feat/<kebab-case-description>` for feature work.
2. Keep each change focused and add relevant tests or documentation.
3. Open a pull request to `main` after local validation passes.
4. Use Angular Conventional Commits, for example:

```text
feat(docs): add expo router guide
fix(auth): preserve destination after sign in
```

## Project rules

Preserve the original monochrome identity and logo when changing the community
site. Keep authentication prompts explicit and return people to their intended
destination after sign-in.

Code contributions are covered by the root MIT license. Documentation and
media follow [apps/docs/CONTENT_RIGHTS.md](apps/docs/CONTENT_RIGHTS.md); submit
third-party text, images, logos, or recordings only when you have permission.

## Validate

Run the checks relevant to your change. Before opening a pull request, run the
full suite when possible:

```sh
bun run test
bun run lint
bun run tsc
bun run build:web
bun run build:docs
```

## Deployment

- Changes to `apps/web` or `convex` on `main` deploy through Convex and Firebase.
- Changes to `apps/docs` on `main` deploy through GitHub Pages.
- Production workflows only accept the `main` branch and use protected GitHub
  environments.
