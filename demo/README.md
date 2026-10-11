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
- `engine/cases.js` + `data/cases.json`: one placeholder Casebook tutorial, evidence gate, once-per-case Empathy Lens, and Verdict Ledger.
- `engine/series.js` + `data/episodes.json`: `REVEAL_LEVEL = 0` filter and a single public placeholder episode.
- `test/cases.test.js`: confirmation gate, empathy use, audit output, and spoiler-filter tests.
- The `/demo/` page has Board Game and Casebook Tutorial views plus an Open for Review panel listing proposal defaults and unresolved decisions.

## Balance tuning record

The simulation bots use seeded rolls and a simple deterministic strategy. Violet acts only on information available through a revealed location or direct same-room presence. This is simulation evidence, not a human playtest or proof of fairness.

| Stage | Strikes to capture | Catch TN | Search TN | Assailant win rate | Mean rounds | Status |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Scan-secrecy baseline | 3 | 3 | 5 | 76.1% | 9.09 | Proposal simulation, outside win-rate target |
| After strike-count adjustment | 2 | 3 | 5 | 63.7% | 8.24 | Proposal simulation, outside win-rate target |
| After catch-TN adjustment | 2 | 2 | 5 | 57.9% | 7.92 | Proposal simulation, win-rate target met; rounds 0.08 below target |
| Search TN 6 trial | 2 | 2 | 6 | 27.7% | 7.76 | Proposal simulation, reverted: outside win-rate target |
| Selected simulation setting | 2 | 2 (Quiet Steps: 6) | 5 | 57.9% | 7.92 | Proposal simulation, win-rate target met; rounds slightly short |

**Current values are Proposal only:** two strikes; catch `d6 + modifier >= 2` (Quiet Steps sets TN 6); search `d6 + modifier >= 5`. No natural 1/6 effects. The selected local simulation recorded 1,158 Assailant escapes and 842 captures across 2,000 seeds, with a mean of 7.92 rounds and no guarded/conceded games. Human playtesting is still required.

## Known limitations

- The graph, card wording, action costs, and tuning remain proposals.
- The simulation bot does not represent human behavior.
- Arcade mode, CI wiring, and canon-document changes are not included. The Casebook and level-zero episode shell are present but remain Proposal, not canon.
- Local validation of the prototype logic reported 22 passing rule, Casebook, and spoiler-gate tests, plus the 2,000-game simulation. The committed branch files were read back for verification; CI and browser/manual accessibility QA were not completed.
- No audio is emitted; events are represented in the interface and text log.
