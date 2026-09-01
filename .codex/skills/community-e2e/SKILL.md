---
name: community-e2e
description: Run Cross-Platform Korea community-flow E2E checks for posts, comments, likes, showcases, feature requests, profiles, notifications, and authentication gates. Use for production smoke tests or cross-feature regressions.
---

# Community E2E

Choose the smallest lane that proves the requested behavior.

## Read-only smoke

Verify home, posts, post details, showcase, feature requests, docs navigation,
theme, locale, and responsive sidebar behavior. Check browser errors and broken
images or links. This lane must not create content, vote, like, or send email.

## Authenticated interaction

Creating or editing content, commenting, liking, voting, or changing a profile
is visible community activity. Run only actions the user explicitly authorized.
Use a clearly temporary title when testing creation and record the exact object
owned by the run.

Before cleanup, confirm the object is the temporary one created by this run and
ask immediately before a live delete. Never delete pre-existing posts,
showcases, comments, feature requests, notifications, or user data.

## Assertions

- Auth-required actions lead to a clearly labeled sign-in step and preserve the
  destination.
- Ownership controls prevent another user from editing or deleting content.
- Likes and votes are idempotent toggles and do not create duplicate counts.
- Pagination, search, filters, and empty/error/loading states remain usable.
- Notifications refer to the correct actor and entity without leaking private
  identifiers.

For implementation changes run lint, TypeScript, the web build, and any focused
Convex dry-run required by the changed path. Report read-only and live results
separately.
