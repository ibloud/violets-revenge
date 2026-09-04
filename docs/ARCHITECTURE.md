# Architecture

## Current system

### Browser prototype

- `index.html` is the authoritative playable prototype.
- `assets/css/style.css` owns shared styling.
- No framework or build pipeline is required.
- Gameplay changes should remain small, testable, and accessible.

### Python Discord bot

- `violet_bot.py` manages the existing card-game/community interaction.
- `win_invite_endpoint.py` supports the win/invite flow.
- `test_violet_bot.py` covers state and concurrency behavior.

### Node Discord bot

- `js-bot/index.js` registers bounded server commands and event handlers.
- `js-bot/threshold-gate.js` handles claim gating.
- `js-bot/intake-modal.js` handles moderated intake.
- This process uses a separate Discord application and token from the Python bot.

## Boundaries

- The browser prototype does not depend on either Discord bot to run.
- Bots must not contain authoritative gameplay state for a future production game.
- Applicant/intake data follows `docs/DATA-GOVERNANCE.md`.
- Automated character behavior follows `docs/AI-AGENT-BOUNDARY.md`.
- Story changes require the story and character bibles.
- Sensitive material follows `docs/SENSITIVE-CONTENT-GUIDE.md`.

## Production target

The production engine is undecided. Unity/URP and Unreal Engine 5 are historical candidates, not current commitments. An approved ADR must define the engine, networking approach, migration boundary, asset implications, accessibility requirements, and ownership before production migration begins.

## Contribution rule

Do not introduce a new framework, engine, hosted database, or deployment dependency without an issue and approved ADR. Trainee work should default to the current browser prototype, tests, documentation, or isolated bot improvements.
