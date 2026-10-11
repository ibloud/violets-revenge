# Violet's Revenge — Lane B review prototype

**Status:** Proposal prototype; not canon. **Pass:** 1 (Lane B). **Branch:** `phase/violets-revenge-card-demo-scope`. No merge or deployment is authorized by this README.

## Run locally

Serve the repository with a static HTTP server that supports browser ES modules and JSON module imports, then open `/demo/`. No framework or third-party dependency is required. From the repository root, run tests with:

```sh
node --test demo/test/*.test.js
```

The interface is touch-first and uses tap-to-select, tap-to-confirm. The root `/index.html` is not modified by this pass.

## Pass 1 contents

- `index.html`: hot-seat board-and-card UI, graph floor plan, visible rolls, event log, restart, and concede.
- `data/rooms.json`: eight-room placeholder graph; every room has a Proposal status and source note.
- `data/cards.placeholder.json`: 24 placeholder cards; every card has a Proposal status and source note. No Veiled Dominion card text is used.
- `engine/rng.js`: injectable deterministic seeded RNG and fixed-roll helper.
- `engine/events.js`: append-only event log and rejection events.
- `engine/rules.js`: authoritative action/turn rules, cards, hidden-information view, file loop, and terminal outcomes.
- `test/rules.test.js`: deterministic rule and card-effect checks.
- `test/sim.test.js`: 2,000 seeded bot-versus-bot games.

## Balance tuning record

The simulation bots use seeded rolls and a simple deterministic strategy. Violet acts only on information available through a revealed location or direct same-room presence. This is simulation evidence, not a human playtest or proof of fairness.

| Stage | Strikes to capture | Catch TN | Search TN | Assailant win rate | Mean rounds | Status |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Corrected-route baseline | 3 | 4 | 4 | 86.5% | 8.32 | Proposal simulation, outside win-rate target |
| After strike-count adjustment | 2 | 4 | 4 | 73.3% | 7.61 | Proposal simulation, outside both targets |
| After catch-TN adjustment | 2 | 3 | 4 | 65.0% | 7.20 | Proposal simulation, outside both targets |
| After search-TN adjustment | 2 | 3 | 5 | 40.1% | 6.63 | Proposal simulation, win-rate target met; rounds too short |
| Selected simulation setting | 3 | 3 (Quiet Steps: 6) | 5 | 56.8% | 8.06 | Proposal simulation, within both target ranges |

**Current values are Proposal only:** three strikes; catch `d6 + modifier >= 3` (Quiet Steps sets TN 6); search `d6 + modifier >= 5`. No natural 1/6 effects. The selected local simulation recorded 1,136 Assailant escapes and 864 captures across 2,000 seeds, with a mean of 8.06 rounds and no guarded/conceded games. Human playtesting is still required.

## Known limitations

- The graph, card wording, action costs, and tuning remain proposals.
- The simulation bot does not represent human behavior.
- Pass 1 does not include the Casebook, episode spoiler filter, `REVEAL_LEVEL`, CI wiring, arcade mode, or canon-document changes.
- Browser/manual accessibility QA was not completed. Automated Node tests are the recorded checks.
- No audio is emitted; events are represented in the interface and text log.
