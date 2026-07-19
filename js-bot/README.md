# js-bot — Violet's Revenge gating bot

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

## Setup
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
6. Fill in placeholder IDs/constants inside `threshold-gate.js` and
   `intake-modal.js` (role IDs, channel IDs, the actual win-screen code)
7. `npm install && npm start`

## Files
- `index.js` — entry point, logs in, registers both slash commands
- `threshold-gate.js` — `/claim` command
- `intake-modal.js` — `/intake` command + modal + approve/reject buttons

See `/docs/archive/2026-07-19-win-invite-devlog.md` at the repo root for
the related win-invite backend work and current unverified status.
