# Claude Development Guidelines

## Package Manager
- Always use `bun` as the package manager for this project
- Use `bun run [script]` instead of `npm run [script]`
- Use `bun install` instead of `npm install`
- Use `bun add` instead of `npm install [package]`

## Development Commands
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run linting
- `bun run tsc` - Type check the code