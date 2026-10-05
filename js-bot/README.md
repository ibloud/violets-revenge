# js-bot — retained legacy gating bot

**Retired deployment path — October 4, 2026.** Discord development and bridging are discontinued. Do not follow the historical setup below for new deployments. Preserve source and offline tests for browser intake reuse. See [Roomy transition](../docs/ROOMY-TRANSITION.md). Both identified Railway Discord services have zero running replicas; see the transition record for evidence and remaining cleanup.

A **separate Discord bot application** from `violet_bot.py`. Handles the
playtester "labyrinth" gating: `/claim` (win-code + account-age check,
moves someone from Lobby → Person of Interest) and `/intake` (screening
questionnaire modal, moves Person of Interest → full Playtester on mod
approval).

## Why a separate bot instead of extending violet_bot.py?
`violet_bot.py` is Python (discord.py). This is Node (discord.js v14).
Rather than bridge two languages inside one bot process, this runs as
its own bot application with its own token — avoids two processes
fighting over the same gateway session, and keeps this gating logic
fully independent of Violet's own bot.

## Historical setup — do not deploy
1. Create a new application at https://discord.com/developers/applications
2. Add a Bot user to it, copy its token
3. Under OAuth2 → URL Generator, select `bot` + `applications.commands`
   scopes, and at minimum: **Manage Roles**, **Send Messages**,
   **Use Application Commands**, **View Channels**
4. Invite it to the Violet's Revenge server using the generated URL
5. Set env vars (Railway → this service → Variables):
   - `JS_BOT_TOKEN` — the bot token from step 2
   - `JS_BOT_CLIENT_ID` — the application's client ID
   - `GUILD_ID` — Violet's Revenge server ID
   - `WIN_CODE` — the code shown on the game win screen
   - `MOD_ROLE_ID` (optional) — moderator role ID allowed to approve/reject intake
6. Ensure role/channel names in code match your server naming
7. `npm install && npm start`

## Files
- `index.js` — retired entry point; exits before loading credentials or registering commands
- `threshold-gate.js` — `/claim` command
- `intake-modal.js` — `/intake` command + modal + approve/reject buttons

See `/docs/archive/2026-07-19-win-invite-devlog.md` at the repo root for
the historical win-invite backend work. That flow is superseded; the endpoint now returns HTTP 410 without an invite.
