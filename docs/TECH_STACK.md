# Tech Stack

## Authoritative current implementation

The runnable prototype is the static browser application in `index.html`:

- HTML5 Canvas
- vanilla JavaScript
- CSS in `assets/css/style.css`
- no build step

Prototype contributions must preserve this stack unless an approved architecture decision changes it.

## Community coordination

Roomy is the coordination center; GitHub is the durable technical record. Discord integration development and bridging are discontinued. See [ROOMY-TRANSITION.md](ROOMY-TRANSITION.md).

## Retained legacy services

Two separate Discord integrations exist:

- `violet_bot.py`: Python 3.11 with discord.py
- `js-bot/`: Node.js 20 with discord.js

They used separate bot applications and credentials. Retain source and offline tests for provenance and reuse; do not deploy or expand these Discord services. Live shutdown has not been verified. Browser/Creator OS adapters are proposed, not implemented.

## Production engine

**Unresolved architecture decision.**

Earlier documents mention both Unity/URP and Unreal Engine 5. Neither is authoritative today. Do not begin a Unity or Unreal migration, purchase engine-specific assets, or describe either engine as committed until a project lead approves a recorded ADR.

## Phase boundaries

1. **Current:** stabilize, test, and make the browser prototype accessible.
2. **Next:** validate the core loop through documented playtests.
3. **Decision gate:** select a production engine through an ADR using prototype evidence.
4. **Later:** plan online 1v4 networking only after the production engine and local loop are stable.

## Legacy verification commands (offline; no bot login)

```bash
python -m pip install -r requirements.txt
python -m pytest -q
cd js-bot
npm ci
npm test
```
