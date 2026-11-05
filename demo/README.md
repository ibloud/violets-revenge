# Violet's Revenge — Lane B review prototype

**Status:** Proposal prototype; not canon. **Pass:** 1 (Lane B). **Branch:** `phase/violets-revenge-card-demo-scope`. No merge or deployment is authorized by this README.

## Run locally

Serve the repository with a static HTTP server that supports browser ES modules and JSON module imports, then open `/demo/`. No framework or third-party dependency is required.

From the repository root:

```sh
node --test demo/test/*.test.js
```

The simulation test runs 2,000 seeded games for each named preset. Node test diagnostics print the escape count, Assailant win rate, capture count, and mean rounds. To run only the simulation tests:

```sh
node --test demo/test/sim.test.js
```

Record `node --version`, the checked-out commit, the command, and the output when publishing results. The interface is touch-first and uses tap-to-select, tap-to-confirm. The root `/index.html` is not modified by this pass.

## Named rule presets

Both settings are **Proposal — not canon**. Select a preset in the demo and restart the match to apply it.

| Preset | Strikes to capture | Catch TN | Search TN | Purpose |
| --- | ---: | ---: | ---: | --- |
| Handoff Defaults | 3 | 4 | 4 | Baseline from the original handoff |
| Tuned | 2 | 2 | 5 | Current candidate for human review |

A check succeeds when `d6 + modifier >= TN`; there are no natural 1/6 effects. Quiet Steps sets the catch target to 6 in either preset. With the Tuned catch target of 2, an unmodified d6 catch roll fails only on a 1. This swing is intentional to expose for review, not a claim that the game is balanced.

## Simulation history and evidence labels

Every result below is from scripted bots, not human playtesting. These figures are not proof of fairness. The repository test now prints reproducible results for both named presets; the table distinguishes those new runs from earlier reported results.

| Run | Preset / settings | Assailant wins | Mean rounds | Evidence status | Provenance |
| --- | --- | ---: | ---: | --- | --- |
| Handoff scratch run | 3 strikes; catch TN 4; search TN 4 | 1,885/2,000 (94.3%) | 8.66 | Locally reproduced result (scratch copy) | Reported by project lead: commit `552a56e`, Node v22.22.2, seeds 1–2,000, `node --test test/sim.test.js` from `/demo`; constants were hand-edited in a scratch copy. Not yet verified through the named repository preset. |
| Tuned run A | 2 strikes; catch TN 2; search TN 5 | 1,170/2,000 (58.5%) | 8.13 | Locally reproduced result (reported) | Exact commit and Node version not yet established for this run. |
| Tuned run B | 2 strikes; catch TN 2; search TN 5 | 1,158/2,000 (57.9%) | 7.92 | Earlier reported simulation; provenance unresolved | The prior report did not establish the exact command, Node version, or commit for this result. Keep it visible until rerun from the named preset. |

**Open discrepancy:** Tuned run A and Tuned run B use the same stated settings but differ by 12 escapes and 0.21 mean rounds. Do not select one as authoritative until both are rerun from the same commit, Node version, command, and seed range using this repository's named preset. The new test output is the next candidate source of truth; record its actual environment rather than pre-filling expected results.

**Balance target:** 40–60% Assailant win rate and 8–12 mean rounds. The reported tuned runs fall inside the win-rate target; both mean-round results are near the lower edge. Human touch playtests remain necessary before tuning further. Deck tuning is not part of this pass.

## Pass 1 contents

- `index.html`: touch-first hot-seat board-and-card UI, graph floor plan, visible rolls, event log, restart, concede, and selectable named rule presets.
- `data/rooms.json`: eight-room placeholder graph; each room has a Proposal status and source note.
- `data/cards.placeholder.json`: 24 placeholder cards; each card has a Proposal status and source note. No Veiled Dominion card text is used.
- `engine/rng.js`: injectable deterministic seeded RNG and fixed-roll helper.
- `engine/presets.js`: named Handoff Defaults and Tuned settings.
- `engine/events.js`: append-only event log and rejection events.
- `engine/rules.js`: authoritative action/turn rules, cards, hidden-information view, file loop, and terminal outcomes; selected preset supplies catch/search targets and capture threshold.
- `test/rules.test.js`: deterministic rule/card checks, including preset application.
- `test/sim.test.js`: seeded bot simulations for both presets.
- `engine/cases.js` + `data/cases.json`: one placeholder Casebook tutorial, evidence gate, once-per-case Empathy Lens, and Verdict Ledger.
- `engine/series.js` + `data/episodes.json`: `REVEAL_LEVEL = 0` filter and a single public placeholder episode.
- `test/cases.test.js`: confirmation gate, empathy use, audit output, and spoiler-filter tests.
- The `/demo/` page has Board Game and Casebook Tutorial views plus an Open for Review panel listing proposal defaults and unresolved decisions.

## Evidence status and limitations

Use these labels in the journal and review UI:

- **Verified test:** a named automated test passed in a recorded environment.
- **Locally reproduced result:** a result rerun from a stated local commit, Node version, command, and seed range.
- **Untested browser behavior:** UI, layout, and touch interactions not yet checked in the target browser/device.
- **Unresolved decision:** a rule or source question awaiting project-lead review.

Current status:
- Scripted-bot simulation results have been reported; the preset-backed test must be run and its output recorded before claiming new results as verified.
- Human playtesting has not been performed.
- Browser accessibility and iPad touch QA have not been completed.
- The room graph, card wording, action costs, and tuning remain proposals.
- The Casebook and level-zero episode shell are Proposal, not canon.
- Arcade mode, CI wiring, canon-document edits, and the historical prototype's D-15 touch fix are not included.
- No Season 2 content, lyrics, Veiled Dominion text/rules, Roomy reward, merge, or deployment is included.
