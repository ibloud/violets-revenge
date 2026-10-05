# Architecture

## Current system

### Browser prototype

- `index.html` is the authoritative playable prototype.
- `assets/css/style.css` owns shared styling.
- No framework or build pipeline is required.
- Gameplay changes should remain small, testable, and accessible.

### Roomy coordination

Roomy hosts community discussion and links to browser playtests. GitHub records scope, decisions, issues, and accepted work. The game reveals its Roomy invitation only after a win; losing offers retry. Dominique may separately invite approved guests or collaborators. No Discord bridge is planned. See [ROOMY-TRANSITION.md](ROOMY-TRANSITION.md).

### Retained Python Discord bot (retired deployment path)

- `violet_bot.py` retains historical card-game/state helpers; its entry point no longer opens a Discord connection.
- `win_invite_endpoint.py` is retired and returns HTTP 410 without an invitation or Discord request.
- `test_violet_bot.py` covers state and concurrency behavior.

### Retained Node Discord bot (retired deployment path)

- `js-bot/index.js` exits before credential loading, command registration, or Discord connection.
- `js-bot/threshold-gate.js` handles claim gating.
- `js-bot/intake-modal.js` handles moderated intake.
- This legacy implementation used a separate Discord application and token from the Python bot. Both identified hosted Discord services are stopped (zero running replicas).

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

Do not introduce a new framework, engine, hosted database, or deployment dependency without an issue and approved ADR. Trainee work should default to the current browser prototype, tests, documentation, or isolated browser adapters. Discord bot source is reference material; Discord deployment work is discontinued.
