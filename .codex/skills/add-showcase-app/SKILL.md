---
name: add-showcase-app
description: Add or update a Cross-Platform Korea community showcase entry, validate its public links and artwork, preserve author ownership, and verify the rendered card. Use when someone asks to submit, edit, or troubleshoot an app on the Showcase page.
---

# Add a Showcase App

Showcases are community-owned Convex records, not static repository data.

## Collect the entry

Require a title, valid category, image URL, and at least one website, App Store,
or Play Store URL. A description, tags, and extra links are optional. Confirm
that the submitter owns the entry or has permission to list it; a third-party
mention alone is not permission.

Validate external links read-only before entry. Do not download or republish an
icon when the remote image URL is stable and permitted.

## Choose the safe path

- For product or code changes, edit the form in
  `apps/web/src/components/pages/showcase`, validators in `convex/validators.ts`,
  and mutations in `convex/showcases` as required.
- For a real submission, use the site's authenticated form. Do not insert or
  patch production Convex records from a shell or dashboard shortcut.
- A live create, edit, or delete is an external community action. Perform it
  only when the user authorized that exact entry and confirm immediately before
  a destructive delete.

Never set `featured` or impersonate an author as part of ordinary submission.
Only the original author may edit or delete an entry under the current model.

## Verify

Check the unauthenticated sign-in CTA and `returnTo`, authenticated form
validation, normalized HTTPS links, image loading, category/search rendering,
and owner-only edit controls. For code changes run:

```sh
bun run lint
bun run tsc
bun run build:web
```

Report the entry URL or local evidence without exposing account or user IDs.
