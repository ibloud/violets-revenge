# Tech Stack

## Authoritative current implementation

The runnable prototype is the static browser application in `index.html`:

- HTML5 Canvas
- vanilla JavaScript
- CSS in `assets/css/style.css`
- no build step

Prototype contributions must preserve this stack unless an approved architecture decision changes it.

## Supporting services

Two separate Discord integrations exist:

- `violet_bot.py`: Python 3.11 with discord.py
- `js-bot/`: Node.js 20 with discord.js

They use separate bot applications and credentials. They are supporting community/playtest tools, not the game runtime.

## Production engine

**Unresolved architecture decision.**

Earlier documents mention both Unity/URP and Unreal Engine 5. Neither is authoritative today. Do not begin a Unity or Unreal migration, purchase engine-specific assets, or describe either engine as committed until a project lead approves a recorded ADR.

## Phase boundaries

1. **Current:** stabilize, test, and make the browser prototype accessible.
2. **Next:** validate the core loop through documented playtests.
3. **Decision gate:** select a production engine through an ADR using prototype evidence.
4. **Later:** plan online 1v4 networking only after the production engine and local loop are stable.

## Verification commands

```bash
python -m pip install -r requirements.txt
python -m pytest -q
cd js-bot
npm ci
npm test
```
