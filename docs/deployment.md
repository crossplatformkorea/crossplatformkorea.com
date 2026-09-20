# Deploying and rolling back

Production is two systems that ship in one workflow: Convex holds the backend
functions, Firebase Hosting serves the web bundle. They can be rolled back
independently, which is the part worth understanding before you need it.

## What the workflow actually does

`.github/workflows/deploy.yml` runs on every push to `main` that touches
`apps/web/**`, `convex/**`, `package.json`, `bun.lock`, `firebase.json`,
`.firebaserc`, or the workflow itself. Two steps matter:

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
old bundle → new functions → new bundle, and new functions must therefore keep
accepting whatever the old bundle sends.

Two consequences:

- The committed `convex/_generated/api.d.ts` has to be current. The build runs
  before the push regenerates it, so a stale file fails the deploy's build step.
- `bunx convex deploy --dry-run -y --cmd "bun run build:web" --cmd-url-env-var-name VITE_CONVEX_URL`
  reproduces the whole thing locally, including schema validation against
  production data, without changing anything.

## Rolling back

**Roll back Firebase Hosting first, then Convex.** It is the mirror of the
deploy order, and the reason is the same: a bundle must never be newer than the
functions it talks to.

Convex rejects arguments its function signatures do not declare, so rolling the
backend back underneath a newer bundle breaks every call that sends a field the
old signature lacks — the client keeps sending it, and the old function keeps
refusing. Reverting only Convex is the one move that reliably produces an
outage that neither half was in before.

If only the backend is at fault, the safe sequence is still Hosting first: put
the matching older bundle back, then move Convex.

Rolling Convex back far enough also reverts `returns` validators, which is worth
checking before you do it. A validator has to enumerate every field the value it
returns can carry; if it omits one the query throws `ReturnsValidationError` for
every caller. This has broken production twice — commit `82ea64c` and PR #24 —
both times because a field reached the data without reaching the validator.

## Previews

`.github/workflows/deploy-preview.yml` builds a PR bundle and publishes it to a
Firebase preview channel. It has no `convex deploy` step, so a preview runs new
client code against whatever functions are already deployed. A PR that adds an
argument to a Convex function will show that call failing in its own preview
until it merges. That is expected, not a defect in the change.
