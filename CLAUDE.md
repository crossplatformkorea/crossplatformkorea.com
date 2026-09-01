# Claude Development Guidelines

Read and follow `AGENTS.md` first. Canonical agent workflows live in
`.codex/skills`; `.claude/skills` provides Claude-compatible entry points.

## Package Manager

- Always use `bun` as the package manager for this project
- Use `bun run [script]` instead of `npm run [script]`
- Use `bun install` instead of `npm install`
- Use `bun add` instead of `npm install [package]`

## Development Commands

- `bun run dev` - Start the community site development server
- `bun run build:web` - Build the community site for production
- `bun run build:docs` - Build the documentation site
- `bun run dev:docs` - Start the documentation site
- `bun run lint` - Run linting
- `bun run tsc` - Type check the code

## Code Conventions

### CSS Class Names

- When combining multiple class names, use `clsx` or `cn` (from `@/lib/utils`)
- Example:

  ```tsx
  // Good
  <div className={cn("flex items-center", isActive && "bg-primary", className)} />

  // Bad - don't use string concatenation
  <div className={"flex items-center " + (isActive ? "bg-primary" : "")} />
  ```
