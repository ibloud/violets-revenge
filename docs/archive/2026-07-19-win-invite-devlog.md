# Win-invite update — pre-alpha, unverified (2026-07-19)

## Summary
The game's win screen previously showed a permanent static Discord invite (`discord.gg/zemqccGdf`) as both plain link and static QR image. This has now been switched to a **dynamic per-win invite flow**:

- Frontend calls backend endpoint `POST /win-invite` on win
- Backend mints a fresh Discord invite (`max_uses=1`, `unique=true`)
- Frontend renders returned URL as QR code client-side (`qrcode.js`)

Because this could not be tested locally end-to-end today, it ships with a safety fallback:

- If backend fetch fails, frontend falls back to old static invite + static QR image
- Fallback logs warning: `[win-invite] Dynamic invite fetch failed — falling back to static invite.`

## Important status note
**Not yet verified live.**
Until verification is done, assume old static invite may still circulate.

## Files touched
- `index.html` (replaced static ENCORE HTML block with dynamic container + `loadWinInvite()`)
- `win_invite_endpoint.py` (new Flask endpoint)

## TODO checklist

### Backend
- [ ] Set `LOBBY_CHANNEL_ID` env var
- [ ] Confirm `DISCORD_TOKEN` available in endpoint runtime
- [ ] Deploy endpoint to Railway
- [ ] Ensure bot has **Create Instant Invite** permission on target channel

### Frontend
- [ ] Add `qrcode.js` CDN script in `<head>`
- [ ] Replace `YOUR-BACKEND-URL` with deployed URL
- [ ] Deploy updated game build

### Verification (live)
- [ ] Win game and verify `/win-invite` returns fresh code (not `zemqccGdf`)
- [ ] Confirm single-use behavior (second join fails)
- [ ] Temporarily break backend URL and verify fallback + warning
- [ ] Revert break, redeploy clean

### Discord-side wiring
- [ ] Fill placeholders in `js-bot/threshold-gate.js`
- [ ] Fill placeholders in `js-bot/intake-modal.js`
- [ ] Register and test `/claim` and `/intake`

### Before opening to real playtesters
- [ ] Revoke old static invite or explicitly keep as controlled fallback
- [ ] Decide whether fallback events need server-side logging beyond browser console
