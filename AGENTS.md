# Repository Guidelines

## Monorepo Layout

- `apps/web` contains the React and Vite community site.
- `apps/docs` contains the Docusaurus documentation and blog.
- `convex` contains the shared backend and authentication functions.
- Use Bun from the repository root for installs, validation, and builds.

## Branch Names

- Feature branches must use `feat/<kebab-case-description>`.
- Do not prefix feature branches with `codex/`.
- Example: `feat/site-renewal`.

## Commit Messages

- Use Angular Conventional Commits: `<type>(<scope>): <subject>`.
- Keep the subject imperative, lowercase, and without a trailing period.

## Agent Skills

- Canonical project skills live in `.codex/skills`.
- `.claude/skills` and `.grok/skills` contain thin compatibility adapters only.
- Change workflow behavior in the canonical Codex skill first, then keep each
  adapter pointed at the matching canonical file.
- Use `project-workflows` to route broad work and `loop-review` for a requested
  review-to-production loop.

## UI and UX Rules

- Preserve the monochrome brand and the original logo.
- Use subtle surfaces, borders, or a small marker for selected navigation; do not use full color inversion as a selection state.
- Reserve solid high-contrast buttons for the single primary action in a region. Prefer outline or ghost treatments for secondary and authentication prompts, especially in dark mode.
- Do not disable an action only because authentication is required. Label the next step explicitly (for example, `Sign in to write`) and take the user to sign-in.
- Preserve the user's intended destination through sign-in and return them there after authentication.
- Use disabled controls only for temporary processing or incomplete/invalid input, and keep the reason evident from nearby context.
