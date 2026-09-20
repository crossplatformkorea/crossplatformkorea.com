# Deploying and rolling back

Production is two systems that ship in one workflow: Convex holds the backend
functions, Firebase Hosting serves the web bundle. They can be rolled back
independently, which is the part worth understanding before you need it.

## What the workflow actually does

`.github/workflows/deploy.yml` runs on `workflow_dispatch`, and on every push to
`main` touching `apps/web/**`, `convex/**`, `package.json`, `bun.lock`,
`firebase.json`, `.firebaserc`, or the workflow itself. Two steps matter:

```yaml
- name: Build and deploy Convex
  run: bunx convex deploy --cmd "bun run build:web" --cmd-url-env-var-name VITE_CONVEX_URL

- uses: FirebaseExtended/action-hosting-deploy@... # channelId: live
```

`convex deploy --cmd` runs the build **before** it pushes the functions, not
after. The order on the runner is therefore:

1. `bun run build:web` produces the bundle, with `VITE_CONVEX_URL` and
   `CONVEX_SITE_URL` injected.
2. Convex pushes the new functions to the production deployment.
3. Firebase Hosting publishes the bundle.

Building is not serving, so that order is still safe. The bundle sits on the
runner until step 3, and the job has no `continue-on-error`: if the Convex push
fails, the workflow stops and Hosting never publishes. What users experience is
old bundle → new functions → new bundle, so new functions must keep accepting
whatever the old bundle still sends.

## What the gates do and do not catch

`bun run build:web` is `vite build`, which strips types without checking them,
and Convex resolves `api.*` through runtime proxies. A call to a function that
no longer exists, or with arguments it no longer accepts, therefore bundles
happily and fails at the server.

`convex deploy`'s own typecheck is scoped to `convex/` by `convex/tsconfig.json`,
so it does not see `apps/web`. The only thing that catches a dangling backend
reference from the frontend is `bun run tsc`, which runs in `ci.yml` — and
`deploy.yml` has no `needs:` on it, so CI and the production deploy race rather
than gate.

The committed `convex/_generated/api.d.ts` is the only copy the build sees,
since the push regenerates it afterwards. A stale one is a type-level mismatch
only, caught by `bun run tsc` and nothing else.

`bunx convex deploy --dry-run -y` validates the schema against production data
and reports the config diff without changing anything. It does **not** run the
`--cmd` build: the CLI skips that under `--dry-run` and only prints
`Would have run "…"`. Build the bundle separately if that is what you need to
know.

## Rolling back

**Roll back Firebase Hosting first, then Convex.** It is the mirror of the
deploy order, and the reason is the same: a bundle must never be newer than the
functions it talks to.

A newer bundle against older functions fails in two shapes — arguments the old
signature does not declare, and calls to functions that did not exist yet.
Reverting only the backend produces both while the new bundle is still being
served, which is the state neither half was in before.

Practically:

1. Roll Hosting back to the previous release from the Firebase console's
   Hosting release history. This is the step that stops the bleeding, and it
   needs no build.
2. Then move Convex, by deploying from the last good commit.

Reverting the commit on `main` and letting the workflow run is *not* the
fast path: it re-runs the same build → Convex → Hosting order, so the old
functions go live underneath the still-served new bundle before Hosting
catches up. That window is exactly the failure above. Use it to settle the
state after the incident, not to end it.

Rolling Convex back far enough also reverts `returns` validators, which is worth
checking first. A validator has to enumerate every field the value it returns
can carry; if it omits one, the query throws `ReturnsValidationError` — but only
for the rows that actually carry the undeclared field. That is why these
surface hours or days after the deploy that caused them, and why the symptom can
be partial rather than total.

Two in-repo examples, both times the field reached the data without reaching the
validator:

- `displayNameLower` was added to `userProfiles` by #22; the failures began when
  its backfill ran, not when it deployed. Fixed in `82ea64c`.
- `updatedAt` is written on every notification insert but was never declared on
  `getUserNotifications`, so that query failed for anyone holding a
  notification. Fixed in #24; see the comment at
  `convex/notifications/query.ts`.

## Previews

`.github/workflows/deploy-preview.yml` builds a PR bundle and publishes it to a
Firebase preview channel. It has no `convex deploy` step, so a preview runs new
client code against whatever functions are already deployed. A PR that adds an
argument to a Convex function will show that call failing in its own preview
until it merges. That is expected, not a defect in the change.
