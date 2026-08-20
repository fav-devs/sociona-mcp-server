---
name: sociona
description: Drive a Sociona social-media workspace through its MCP tools — publish and schedule posts, create/render/publish carousels, talk to the Sociona agents, find viral format inspiration, manage the ideas board, triage comments and DMs, read analytics, and wire webhooks. Use whenever the user mentions Sociona, or wants to post, schedule, or design social content, research content ideas, or automate a creator workflow through a connected Sociona workspace.
---

# Working with Sociona over MCP

Sociona is a social-media workspace (accounts, publishing, an AI design studio,
content intelligence). The MCP server exposes ~50 tools; this skill is the map
and the recipes.

## Before anything

Call `get_accounts` first when a task involves posting. Only accounts with
`status: "ACTIVE"` can publish or schedule — an `ERROR` account means its
platform connection needs re-auth in the Sociona app; tell the user instead of
retrying. Most tools take an optional `profileId`; omit it and the workspace's
first profile is used, which is right for single-profile workspaces.

## Tool map

- **Publishing**: `get_accounts`, `publish_post`, `schedule_post`,
  `get_posts`, `get_scheduled_posts`, `cancel_scheduled_post`,
  `get_post_stats`, `publish_carousel`
- **Agents**: `ask_sociona` (the supervisor agent), `ask_agent`
  (`contentDrafter` | `analyst` | `engagement` | `videoAgent`)
- **Studio**: `create_carousel`, `render_design`, `list_designs`,
  `get_design`, `search_carousel_templates`, `analyze_reference_image`
- **Content AI**: `recast_for_platforms`, `split_into_thread`,
  `generate_draft_ideas`, `analyze_content_strategy`, `generate_image`,
  `generate_video`
- **Discovery**: `find_inspiration`, `get_format_brief`,
  `get_trending_patterns`, `adapt_pattern_to_niche`, `get_trends`,
  `analyze_video_link`, `watch_creator`, `list_watched_creators`,
  `get_competitor_feed`
- **Ideas**: `list_ideas`, `add_idea`, `update_idea`, `delete_idea`
- **Analytics**: `get_analytics_overview`, `get_top_posts`,
  `get_post_analytics`
- **Engagement** (real on-platform writes): `list_comment_inbox`,
  `reply_to_comment`, `hide_comment`, `list_dm_conversations`,
  `get_dm_thread`, `reply_to_dm`
- **Media & workflows**: `search_media_library`, `upload_media_from_url`,
  `get_media_upload_url` + `confirm_media_upload`, `list_workflows`,
  `simulate_workflow`, `run_workflow`
- **Jobs & webhooks**: `get_job_status`, `list_webhooks`, `create_webhook`,
  `delete_webhook`

## Long-running tools: use async

`create_carousel` (~2–5 min), `analyze_video_link` (up to ~5 min), and
`generate_video` accept `async: true` and immediately return
`{jobId, status: "running"}`. Prefer async whenever you can do other work or
the user shouldn't wait on an open call. Poll `get_job_status` with the
`jobId` — space polls ~20–30 s apart; the finished record carries the full
`result` inline. A job stuck `running` far past its normal duration was lost
to a server restart: start it again rather than polling forever. Jobs expire
after 24 h.

Synchronous calls of these tools also work (the connection streams keepalives)
— fine when the carousel is the only thing the user is waiting for.

## Recipes

### Carousel, end to end
1. `create_carousel {topic, slideCount?, notes?, async: true}` → `jobId`.
2. Poll `get_job_status` until `completed` → `result.designId` and an
   `openUrl` the user can open to edit.
3. Show the user the design (openUrl) and ask before publishing.
4. `publish_carousel {designId, accountId, platform, caption}` renders the
   slides to publish-ready JPEGs and posts them in one step. Use an ACTIVE
   Instagram account for carousels.

To match an aesthetic first: `search_carousel_templates {q}` for proven
designs, or `analyze_reference_image {imageUrl}` to turn any slide image into
a design spec, then pass the takeaways via `create_carousel.notes`.

### Research → ideas → drafts → schedule
1. `find_inspiration {q or niche}` for proven formats;
   `get_format_brief {videoId}` for the mechanics of one (a brief can be
   plan-limited — a message about unlock allowance is not an error).
2. `get_trending_patterns` + `adapt_pattern_to_niche {patternId, niche}` for
   a concrete angle, or `analyze_video_link {url, async: true}` when the user
   pastes a specific IG/TikTok/YouTube link.
3. Save keepers with `add_idea`; generate ready-to-post copy with
   `generate_draft_ideas {topics, platform}` — it writes in the creator's own
   voice.
4. Adapt one piece everywhere: `recast_for_platforms {text, platforms}`;
   `split_into_thread {text}` for X/Threads threads.
5. `schedule_post` per platform with ISO-8601 `scheduledFor`.

### Talking to the agents
`ask_sociona {message}` reaches the workspace's main agent (it can draft,
look things up, and publish — it confirms before posting). The response
includes a `conversationId`: pass the same one on follow-ups to continue that
conversation with memory. Use `ask_agent` for specialists — `analyst` for
performance deep-dives (read-only), `engagement` for inbox work,
`contentDrafter` for copy, `videoAgent` for video concepts. Prefer direct
tools when the task is mechanical; agents shine on open-ended asks.

### Engagement triage
`list_comment_inbox` → summarize what needs attention → for replies the user
approves, `reply_to_comment {commentId, text}`. Same shape for DMs via
`list_dm_conversations` → `get_dm_thread` → `reply_to_dm`. These post real,
public replies from the user's account — always show the drafted reply and
get explicit approval before sending.

### Weekly analytics review
`get_analytics_overview {days: 7}` + `get_top_posts` + `get_post_stats`, then
`analyze_content_strategy` for pillars/gaps when the user wants direction,
not just numbers.

### Webhooks (for integrations that shouldn't poll)
`create_webhook {url, events}` — events like `carousel.completed`,
`analysis.completed`, `video.completed`, `job.completed`/`job.failed`, or
`["*"]`. The signing secret is returned exactly once; tell the user to store
it. Deliveries are HMAC-signed (`x-sociona-signature: sha256=HMAC(secret,
"<x-sociona-timestamp>.<body>")`) and endpoints auto-disable after 20
consecutive failures.

### Getting media in

Never base64 file bytes into a tool argument — they'd flow through the
conversation. Pick by where the file lives:

- **On the web** (or any public URL): `upload_media_from_url {url}` — the
  server fetches and stores it; returns a hosted URL for `mediaUrls`.
- **On the user's machine** (Claude Code): `get_media_upload_url {filename,
  mimeType, size}` → upload the file with the returned presigned URL —
  `curl -X PUT --upload-file <file> -H "Content-Type: <mimeType>"
  "<uploadUrl>"` (send every returned header) → `confirm_media_upload
  {key, filename, mimeType, size}` → hosted URL. Bytes go straight to
  storage, never through the model.
- **AI-generated**: `generate_image` / `generate_video` / carousel renders
  already return hosted URLs — no upload step.

## Always surface the links

Tool results carry URLs meant for the user — hand them over as markdown
links, don't bury them:

- `publish_post` / `publish_carousel` → `viewUrl` is the LIVE post on the
  platform ("View it on Instagram"); `appUrl` opens the post list in
  Sociona. If `viewUrl` is absent the post is still publishing — say so and
  offer to check `get_posts` in a moment.
- `create_carousel` → `openUrl` opens the design in the Studio editor.
- `schedule_post` → `appUrl` opens the content calendar.
- `add_idea` → `appUrl` opens the ideas board; `get_analytics_overview` →
  the dashboard; `list_comment_inbox` → the engagement inbox.
- `find_inspiration` results carry `source_url` — the original post on its
  platform.

## Costs and safety

- Tools marked as spending an AI action (`create_carousel`,
  `analyze_video_link`, `generate_draft_ideas`, `generate_image`,
  `generate_video`, `recast_for_platforms`, `split_into_thread`,
  `analyze_content_strategy`, agent chats) draw from the workspace's monthly
  AI-action allowance. An "out of AI actions" reply means the plan cap is
  reached — surface it, don't retry.
- `publish_post`, `publish_carousel`, `reply_to_comment`, `reply_to_dm`,
  `hide_comment`, and `run_workflow` have real, public side effects. Confirm
  content with the user before calling unless they've explicitly
  pre-approved. `simulate_workflow` is the safe dry-run.
- A scope-denial reply ("missing the X scope") means the API key was created
  with limited permissions — the user can mint a broader key in Sociona's
  developer settings.
