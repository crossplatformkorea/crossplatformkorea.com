# Documentation

The source for [doc.crossplatformkorea.com](https://doc.crossplatformkorea.com).

From the repository root:

```sh
# Requires Node.js 20.20.2 and Bun 1.2.21.
bun install
bun run dev:docs
```

Build the production site with:

```sh
bun run build:docs
```

The site is deployed to GitHub Pages whenever documentation changes land on
`main`.

Software in this app follows the repository MIT license. Editorial content and
media follow [CONTENT_RIGHTS.md](CONTENT_RIGHTS.md).
