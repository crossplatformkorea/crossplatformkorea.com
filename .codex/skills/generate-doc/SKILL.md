---
name: generate-doc
description: Create or update Cross-Platform Korea Docusaurus documentation and blog content with correct English/Korean locations, navigation, edit links, and production validation. Use for docs, guides, blog posts, or documentation-site fixes.
---

# Generate Documentation

Documentation lives in `apps/docs` and deploys to
`https://doc.crossplatformkorea.com`.

## Place content correctly

- English docs: `apps/docs/docs`
- Korean docs: `apps/docs/i18n/ko/docusaurus-plugin-content-docs/current`
- English blog: `apps/docs/blog`
- Korean blog: `apps/docs/i18n/ko/docusaurus-plugin-content-blog`
- Navigation: `apps/docs/sidebars.js` and `apps/docs/docusaurus.config.js`

Preserve stable document IDs and URLs. When moving content, add a redirect
instead of silently breaking inbound links. Keep translated pairs aligned when
the request affects both audiences; do not invent a translation when accuracy
requires a fluent review.

## Write for readers

Lead with the outcome or concept, use concrete examples, and remove repository
mechanics that do not help the reader. Verify technical claims against primary
sources when they may have changed. Do not claim an event, release, or feature
has shipped until it is verifiable.

Use image assets only with known permission and meaningful alt text. Keep the
original Cross-Platform Korea logo intact.

## Validate

Run Prettier on touched configuration or prose files, then:

```sh
bun run build:docs
git diff --check
```

Open the generated page, exercise locale and navigation links, and check browser
errors before reporting it complete.
