# Cross-Platform Korea

[Cross-Platform Korea](https://crossplatformkorea.com)는 여러 기술 생태계에
흩어진 경험과 지식을 연결하는 한국 크로스플랫폼 개발자 커뮤니티입니다.

## Monorepo

```text
apps/
  web/   # React + Vite community site
  docs/  # Docusaurus documentation and blog
convex/  # Convex backend and authentication
```

## Development

Install [Node.js 20.20.2](https://nodejs.org/) and
[Bun 1.2.21](https://bun.sh/), then install dependencies:

```sh
bun install
```

For the first local web/backend setup, connect a Convex development deployment
and initialize Convex Auth:

```sh
bun run setup
```

Follow the interactive prompts, then configure the development deployment with
the provider/runtime variable names listed in [`.env.example`](.env.example).
Convex writes local client/deployment values such as `VITE_CONVEX_URL` to
`.env.local`; configure provider and server secrets such as GitHub and Resend on
the target Convex development deployment through its dashboard or CLI. Never
commit either kind of value.

Run the community site and Convex backend together:

```sh
bun run dev
```

Run the documentation site separately:

```sh
bun run dev:docs
```

## Validation

```sh
bun run test
bun run lint
bun run tsc
bun run build:web
bun run build:docs
```

## Deployment

- `apps/web` and `convex` deploy automatically to Firebase Hosting and Convex
  after relevant changes land on `main`.
- `apps/docs` deploys automatically to GitHub Pages after documentation changes
  land on `main`.

Production variable names are also documented in [`.env.example`](.env.example).
Secrets must be stored in Convex or GitHub environment settings and must never
be committed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues should be reported using
the process in [SECURITY.md](SECURITY.md).

## License

Software is available under the [MIT License](LICENSE). Imported editorial
documentation, blog posts, translations, and media retain their existing
rights; see [apps/docs/CONTENT_RIGHTS.md](apps/docs/CONTENT_RIGHTS.md).
