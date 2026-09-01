# YouTube companion posts

Cross-Platform Korea publishes a site post the same calendar day as the YouTube video, not at the same instant.

## Timing (Asia/Seoul)

| Step                            | When                       |
| ------------------------------- | -------------------------- |
| YouTube video goes public       | **04:00 KST**              |
| Site companion post goes public | **16:00 KST** the same day |

Store `publishAt` as UTC ISO. Naive datetimes sent by the worker are interpreted as Asia/Seoul (KST, UTC+9, no DST). Example: `2026-09-02 16:00` and `2026-09-02T16:00+09:00` both become `2026-09-02T07:00:00.000Z`.

A Convex cron runs every minute and flips due `scheduled` rows to `published`. Slack/Discord notifications fire at publish time, not at insert time.

## Category

News, briefings, and YouTube companions use **정보 공유** (`INFO_SHARE` / slug `info-share`). Do not invent extra categories or fake CPK users/comments for these posts.

## HTTP admin API

Base URL is the Convex HTTP site (`CONVEX_SITE_URL`), for example `https://<deployment>.convex.site`.

Authenticate with **one** of:

1. `Authorization: Bearer <CPK_WORKER_TOKEN>` — shared secret configured on the Convex deployment (placeholder only in `.env.example`; never commit the real value).
2. A Convex Auth JWT for a user who exists in the `admins` table.

| Method | Path                | Purpose                                                     |
| ------ | ------------------- | ----------------------------------------------------------- |
| `GET`  | `/admin/categories` | Category keys/slugs for the worker                          |
| `POST` | `/admin/posts`      | Create a scheduled companion post                           |
| `GET`  | `/admin/posts`      | Admin list (`?status=draft\|scheduled\|published&limit=50`) |

`POST /admin/posts` JSON body:

```json
{
  "title": "string",
  "content": "markdown",
  "authorEmail": "existing-user@example.com",
  "category": "INFO_SHARE",
  "tags": ["youtube"],
  "youtubeUrl": "https://www.youtube.com/watch?v=...",
  "publishAt": "2026-09-02T16:00"
}
```

- `authorEmail` is required for worker-token calls. It must match an existing `userProfiles.email`. Signed-in admins may omit it and post as themselves.
- Omit `publishAt` to default to **16:00 KST today**, or tomorrow 16:00 KST if that instant has already passed.
- `status: "draft"` skips scheduling and stays unpublished.

Do not create fake community users or comments from this API.

## MCP

There is no extra MCP wrapper. The HTTP API above is the automation surface; adding a stdio MCP around it would only duplicate these routes. Use `curl` or any worker against `CONVEX_SITE_URL`.
