# Deploying and rolling back

Production is two systems that ship in one workflow: Convex holds the backend
functions, Firebase Hosting serves the web bundle. They can be rolled back
independently, which is the part worth understanding before you need it.

## What the workflow actually does

`.github/workflows/deploy.yml` runs on `workflow_dispatch`, and on every push to
`main` touching `apps/web/**`, `convex/**`, `package.json`, `bun.lock`,
`firebase.json`, `.firebaserc`, or the workflow itself. It first runs `ci.yml`
as a gate (see below); then two steps matter:

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
reference from the frontend is `bun run tsc`.

That runs in `ci.yml`, a separate workflow. `needs:` orders jobs within one
workflow and cannot reach across files, so `deploy.yml` gates itself by
*calling* `ci.yml` as a reusable workflow (`uses: ./.github/workflows/ci.yml`)
and hanging the deploy off it with `needs: validate`. A red build now stops the
release. The cost is that a push to `main` touching the deploy paths runs
`bun run ci` twice — once standalone, once as the gate — and the deploy waits
for it.

The committed `convex/_generated/api.d.ts` is the only copy the build sees,
since the push regenerates it afterwards. A stale one is a type-level mismatch
only, caught by `bun run tsc` and nothing else.

`bunx convex deploy --dry-run -y` validates the schema against production data
and reports the config diff without changing anything. It does **not** run the
`--cmd` build: the CLI skips that under `--dry-run` and only prints
`Would have run "…"`. Build the bundle separately if that is what you need to
know.

## Why `index.html` must not be cached

`firebase.json` rewrites `**` to `/index.html`, so a request for a file that
does not exist is answered with the HTML shell at **200**, not a 404. A browser
asking for a JavaScript chunk therefore receives HTML and tries to execute it,
which throws before the app mounts and leaves a blank page with nothing obvious
in the console.

That turns a cached `index.html` into an outage. Every build emits
content-hashed chunk names; a reader holding yesterday's `index.html` asks for
yesterday's chunks, the rewrite hands back HTML, and the page is blank until
the cache expires. Firebase's default is `max-age=3600`, so the window was an
hour after every deploy.

The `headers` block fixes both ends:

- `**` → `no-cache`, so the HTML shell and anything else unhashed
  (`sw.js`, `manifest.json`) is revalidated every load.
- `/assets/**` → `max-age=31536000, immutable`, which is safe precisely because
  those names are content-hashed.

Order matters and is the opposite of the rest of the file: redirects and
rewrites are first-match-wins, but `headers` is **last-match-wins** for a given
header key. The catch-all goes first and the specific rule after it.

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
2. Then move Convex, from a local checkout of the last good commit:

   ```bash
   git checkout <last-good-sha>

   # Paste the production deploy key at the prompt. Passing it inline instead
   # would leave it in shell history, and it can deploy backend code.
   read -rsp 'Convex deploy key: ' CONVEX_DEPLOY_KEY && export CONVEX_DEPLOY_KEY && echo

   bunx convex deploy
   ```

   `-s` and `-p` are bash/zsh, not POSIX `sh`. `-s` hides the key as you paste
   it, `-p` is what actually prints the prompt, and the trailing `echo` puts
   back the newline `-s` swallows.

   The key is the same `CONVEX_DEPLOY_KEY` the workflow takes from repository
   secrets. It selects the deployment by itself, so no target flag is needed.

   No workflow does this for you. Dispatching `Deploy to Production` will not:
   the job is guarded by `if: github.ref == 'refs/heads/main'`, so a dispatch
   from a tag or an older branch is skipped and still reported as a successful
   run, while a dispatch from `main` deploys `main`'s current HEAD — the code
   you are trying to get rid of.

Reverting the commit on `main` and letting the workflow run is *not* the
fast path: it re-runs the same build → Convex → Hosting order, so the old
functions go live underneath the still-served new bundle before Hosting
catches up. That window is exactly the failure above. Use it to settle the
state after the incident, not to end it.

Rolling Convex back far enough also reverts `returns` validators, which is worth
checking first. A validator has to enumerate every field the value it returns
can carry; if it omits one, the query throws `ReturnsValidationError`. The throw
is per call, not per row: one offending row fails the whole response, so a
paginated page dies entirely rather than returning the rest. What is partial is
who it reaches — only callers whose own data carries the undeclared field. That
is why these surface hours or days after the deploy that caused them, spreading
as the data does.

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
Firebase preview channel.

When the repository secret `CONVEX_PREVIEW_DEPLOY_KEY` is set — a **Preview**
deploy key from the Convex dashboard, not the production one — the workflow
creates a Convex preview deployment named `pr-<number>` and builds against it,
so a change to a backend function is exercised by the preview that contains it.
Those deployments start with no data, which is the trade: the preview stops
lying about the backend and stops showing real content.

With the secret unset the workflow falls back to building against
`VITE_CONVEX_URL`, the previous behaviour. In that mode a preview runs new
client code against functions that are already deployed, so a PR adding an
argument to a query shows that call failing in its own preview until it merges.
That is expected, not a defect in the change.
