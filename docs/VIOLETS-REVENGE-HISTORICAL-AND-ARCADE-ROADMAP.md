# Violet's Revenge — Narrative Game and Series-Arc Roadmap

**Status:** working roadmap for project-lead review; proposal, not canon  
**Date:** 2026-10-11  
**Supersedes:** the earlier version of this file (historical milestone + arcade gates are retained below)  
**Branch / PR:** `phase/violets-revenge-card-demo-scope`, draft PR #50 (not merged, not deployed)  
**Verified against:** branch head `8b9ed0e`, by reading source and docs.  
**No browser or test run was performed for this document.**  
**Implementer:** written to be executed by ChatGPT (or any contributor) one task card at a time. See §1.  
**Scope boundary:** Violet's Revenge is distinct from Veiled Dominion. Shared time-dimensional lore does not authorize shared decks, rules, or code.

---

## 1. How to use this document (implementer brief)

1. Work one task card (§10) at a time, in order. Do not start a card whose prerequisites are unresolved decisions (§9).
2. Every rule, card, line of story text, and number you add carries a **status label** (§2). If you cannot cite a source, label it `Proposal` or `Unresolved`. Never present either as canon.
3. Do not invent lore. Generated character text is not canon without documented human approval (`docs/AI-AGENT-BOUNDARY.md`). Story changes go through issue + PR + project-lead approval (`docs/STORY-BIBLE.md`).
4. Do not import Veiled Dominion cards, chess pieces, phases, or RP rules. Use clearly labeled placeholder cards until Violet's Revenge cards are sourced or approved.
5. Keep `index.html` unchanged unless a card says otherwise. Build new work on a separate route/folder (§7).
6. Output complete files, not diffs or line-number instructions. The project lead works on an iPad: prefer tap-based UI, avoid copy-paste-heavy or CLI-heavy instructions, and state the result plainly rather than narrating attempts.
7. Verify repo state by reading the file before editing it. Do not assume.
8. Do not merge, deploy, add a Roomy reward, or add dependencies/frameworks without an issue and ADR (`docs/ARCHITECTURE.md`).
9. When blocked on a decision, ask one narrow question and propose a default; do not widen scope.

## 2. Status labels

| Label | Meaning |
| --- | --- |
| Source-confirmed | Present in a cited document or in current code |
| Lead-selected | Direction chosen by the project lead (2026-10-11), details may remain open |
| Proposal | Design option for review; not canon |
| Unresolved | Needs a source, decision, or test |
| Implemented, unverified | Code exists; no fresh test pass recorded |
| Tested | Only with a repeatable recorded test or playtest |

## 3. Verified repo state

### 3.1 Browser prototype (`index.html`, 1,208 lines) — Implemented, unverified

- Canvas 800×600, 20×15 tile grid (`TILE = 40`), one fixed ASCII wall map.
- Named areas drawn: Forensics Office, Records & Lockers, Morgue/Freezers, Autopsy Room, Incinerator, Evidence Storage, Exit Vestibule.
- Objective loop: collect 3 case files (`TOTAL_FILES = 3`) → press `E` in the incinerator → exit unlocks → escape.
- Violet AI states: searching, hunting (follows last known position / trap trigger), chasing (line of sight). Speeds differ per state. A brief "panic" boost triggers when she closes in.
- Nightingale: Violet places up to 3 wall sigils on a ~240-frame cooldown; a player entering the trigger radius plays a song cue and starts a hunt.
- Health 3 (hearts), invulnerability frames, capture overlay ("Autopsy Slab"), escape overlay, restart, touch joystick, keyboard controls.
- Roomy invitation is revealed only on the ESCAPED screen.

### 3.2 Not implemented in the prototype — Unresolved

- Grave Dirt Sachet slow field (franchise roadmap anchor).
- Capture-to-autopsy sequence (capture is currently an overlay, not a traveled sequence).
- Room-specific collision/interaction feedback beyond the wall grid; gamepad support; any automated browser test.
- **Touch gap (verified by reading the code):** destroying evidence at the incinerator requires the keyboard `E` key (`keys['e']`), and the touch UI contains only the drag joystick. On a touch-only device (such as an iPad) the exit cannot be unlocked, so the win and the Roomy invitation are unreachable. Proposed fix (needs lead approval, see T1): trigger the interaction automatically when the player stands in the incinerator with all case files, which also honors the lead's one-touch rule (§8.5).

### 3.3 Documentation on the branch

- `VIOLETS-REVENGE-CARD-DEMO-SCOPE.md`: primary deliverable is a separate Violet's Revenge card/board demo; Canvas prototype stays untouched.
- `VIOLETS-REVENGE-MECHANICS-PLAN.md`: Lead-selected — precinct floor plan with morgue, one die plus modifiers vs target number, escape-versus-capture. d6 and target numbers 4/6 are playtest placeholders only. Decision record has many unchecked items (§9).
- `FRANCHISE-ROADMAP.md`, `CHARACTER-BIBLE.md`, `STORY-BIBLE.md`, `SENSITIVE-CONTENT-GUIDE.md`, `MUSIC-LICENSING.md`, `LADY_VIOLET_LINEAGE.md`, `AI-AGENT-BOUNDARY.md`, `ARCHITECTURE.md`, ADR-0001.

### 3.4 Legacy and infrastructure

- `violet_bot.py` is labeled as a Veiled Dominion initializer; it is evidence of prior behavior, not a Violet's Revenge rules engine. No canonical Violet's Revenge card list exists in the repo.
- CI (`ci.yml`) runs Python checks and Node checks **only inside `js-bot/`**. A new engine test suite will not run in CI until a workflow step is added (needs an issue).
- No production engine is selected (ADR-0001). `node --test` is built in, so it needs no new dependency.

## 4. Source hierarchy and canon conflicts

**Authority order for story:** (1) project-lead decisions and statements; (2) Drive "Revised Arc (Final Draft)", which states it supersedes the original pitch/origin doc, and the Drive "Season 2 Arc: Closing Time" treatment; (3) repo Story/Character Bibles; (4) `FRANCHISE-ROADMAP.md` (older game-jam framing). The Drive documents were read directly on 2026-10-11. The lead's later canon statements resolve several conflicts, but the repo docs still carry the older text and need a PR (T2).

| ID | Conflict | Sources | Status and handling |
| --- | --- | --- | --- |
| C-01 | Does Violet survive the attack? | Franchise roadmap Phase 2: she died; "The Purge". Revised Arc: she survives, is injured, returns to work, hunts the Guilty. | **Resolved by lead statement:** Revised Arc governs. Franchise roadmap Phase 2 lore is stale; update via issue + PR. Attack remains implied, never shown. |
| C-02 | Names tied to the origin | Franchise roadmap: "Jenny" (and "Screech"). Revised Arc, `MUSIC-LICENSING.md`: Sophia and Solomon. | **Resolved by lead statement:** Sophia and Solomon. Do not use the old names. Repo update needed. |
| C-03 | Placement of the father/lineage reveal | Revised Arc: reveal triggers Stage 3. `MUSIC-LICENSING.md`: placed after the Coroner. Lead statement: separate story/season/episode from the Coroner; after defeating the Coroner, Violet chooses not to pursue her past. | **Partly resolved:** not part of the Coroner thread. Exact season/episode slot is Unresolved; keep as a locked placeholder. |
| C-04 | Story Bible's fixed three acts (Examiner / Attack / Executioner) vs. a multi-season arc ending in Stage 3 "stops needing the hunt" | `STORY-BIBLE.md` vs. Revised Arc | Unresolved. Treat the acts as Season 1 structure only until the lead decides (D-04). |
| C-05 | Epitaph "Here lies Violet… gone but not forgotten" and the Ren Gill lyric reference | Revised Arc draft lists an open IP flag; lead later stated it is resolved via the Season 2 Guardian retcon (the line is the Guardian's own private ritual). | **Resolved by lead statement.** Record the clearance basis in the repo before any public release. The line is a Season 2 reveal, so it stays out of the `REVEAL_LEVEL=0` bundle regardless. |
| C-06 | Guilty are "archetypes, no backstories, no redemption" vs. a named four-role chain (Witness, Clerk, Undertaker, Coroner) | `CHARACTER-BIBLE.md` vs. `MUSIC-LICENSING.md` and lead statements | Compatible if the four are roles in one evidentiary chain. Never humanize or redeem them. |
| C-07 | Representation of a character's condition | Lead statements give the Coroner a hidden neurological condition; `MUSIC-LICENSING.md` warns that no cue may suggest a medical, disability, or neurological condition causes violence | Unresolved handling. Do not write player-facing text that links a condition to violence. Route any such text to the lead for review. |

Until a conflict is resolved, write no player-facing text that depends on it.

## 5. Design pillars and balance

The project has four lanes. They share one **evidence vocabulary** and one **rules engine**, but they do **not** share timing or controls.

| Lane | Purpose | Timing | Status | Priority |
| --- | --- | --- | --- | --- |
| A. Historical action prototype | Preserved real-time milestone | Real-time | Implemented, unverified | Preserve; baseline-test only |
| B. Board-and-card demo | Primary demo deliverable; makes dice, evidence, and consequences legible | Turn-based | Lead-selected, rules unresolved | **Core spine** |
| C. Casebook (ink + investigation) | Carries the series arc; teaches Violet's method | Player-paced | Proposal | **Core spine** |
| D. Arcade adaptation | Fast replayable runs derived from Lane A | Real-time, short | Proposal | Last, gated |

**Balance rules**

1. **Story never gates play.** Every lane is playable with all lore skipped; lore is optional, skippable, and revisitable.
2. **Mechanics never contradict canon.** If a mechanic implies a story fact, that fact needs a source or approval.
3. **Procedure over speed.** No lane rewards acting on unconfirmed suspicion. Fast play rewards navigation and objectives, not "guilt".
4. **One lane's rules are never silently another's.** Shared: evidence labels, room names, case IDs. Separate: movement, action economy, card timing.
5. **Spoiler safety.** Season-gated content is tagged and excluded by default (§8.3).
6. **Sensitive content.** Assault is implied through forensic aftermath, never depicted; clinical, restrained language; content warnings on public material (`SENSITIVE-CONTENT-GUIDE.md`).

## 6. Core mechanics (all Proposal unless noted)

### 6.1 Procedural Confirmation — Violet's defining mechanic

Source-confirmed rule: Violet acts against the Guilty only after guilt is procedurally confirmed, never on suspicion.

**Evidence statuses** (labels already adopted in the prior roadmap): `observed_fact`, `witness_claim`, `inference`, `contradiction`, `unresolved`.

**Confirmation gate (placeholder values):** a case reaches `confirmed` only if it has at least 3 `observed_fact` items from at least 2 independent sources and 0 open `contradiction` items. `witness_claim` and `inference` items never count toward the threshold. The engine emits one authoritative result: `confirmed`, `insufficient`, or `contradicted`.

**Action gate:** a hunt/capture action is legal only against a `confirmed` case. Acting early is not blocked silently; the engine rejects it with a logged reason so the player learns the rule.

### 6.2 Empathy Lens and Bias Audit — the character flaw as a mechanic

Source-confirmed premise (character sheet, per prior roadmap): empathy helps Violet read victims and culprits but can pull her away from procedure; she applies scrutiny to everyone except her own certainty.

- **Empathy Lens (optional action):** reveals a hint about motive or hidden state. The hint is stored as `inference` with tag `empathic`. It never counts toward confirmation.
- **Bias Audit (post-case review):** the ledger shows, per decision, which evidence was fact vs. empathic inference, and flags any decision where an empathic inference was treated as if it were fact. This makes procedural failure legible after the fact without making Violet omniscient.
- **No punishment for using the Lens.** It is a trade: faster leads, but audited later. Do not tune it as a pure penalty.
- Tuning handles (all placeholders): hints per case, audit severity, whether flagged decisions affect score.

### 6.3 Guilty-side escape (Lane A/B)

- **Lane B (Lead-selected):** small rectangular precinct floor plan with a morgue; rooms as graph nodes for validation, drawn as a floor plan. One die plus modifiers vs. a target number. Escape-versus-capture is the terminal condition, with one authoritative terminal result.
- **Placeholders only:** d6, `d6 + modifier >= TN`, TN 4 (routine) / 6 (difficult), no special natural 1/6, one room transition per move action.
- **Unresolved:** action count, card timing, evidence requirement to escape, how many exits, capture roll, rescue, simultaneous escape/capture precedence (§9).

### 6.4 How the lanes connect (Proposal)

A Casebook result (`confirmed` case, with its evidence quality) can parameterize a Lane B encounter: which Guilty role is hunted, how many case files exist on the board, and which rooms hold them. After the encounter, the Verdict Ledger explains the outcome in evidence terms. This keeps story and mechanics causally linked without forcing shared controls.

### 6.5 Season-gated mechanic: Self-Audit (Season 2 only, Proposal)

Season 2 turns the method inward: Violet notices a "technique" being used on her (the Guardian's closing phrase used outside its ritual) and gathers evidence, gently and reluctantly, on someone she loves. Mechanically this is the Bias Audit applied to a relationship case, where she must hold "she loves me" and "she has been managing me" as both true. The central question (Season 2 doc): can something be real love and a mechanism of control at once.

- **Do not build or reference this before the spoiler policy (§8.3) and lead approval.**
- **Never** force a Season 2 beat into an early-game scene.

### 6.6 Per-Guilty verbs, residue, and provenance (Lead-stated direction; details Proposal)

Lead-stated genre direction: "Being Human"-style, where the supernatural is literal and treated matter-of-factly beside mundane life, not metaphorical and not deliberately ambiguous. Lead-stated loop direction: one continuous real environment (not discrete teleported levels) where psychic residue overlays the present as small spatial wrongness; the core mechanic is **alignment versus misalignment**. Each Guilty role gets a distinct verb in the same world, and all four feed one persistent case file so evidence from one read becomes leverage against the next target.

| Role | Verb (Lead-stated) | Casebook hook (Proposal) |
| --- | --- | --- |
| The Witness | Catch the contradiction | Compare statements against observed facts; contradictions block confirmation |
| The Clerk | Navigate the ledger-maze | Records and provenance; find the entry that cannot be explained away |
| The Undertaker | De-escalate rather than flee | Non-flight resolution actions; Empathy Lens is most useful here |
| The Coroner (finale) | Distrust the room itself | UI and dialogue may assert false narratives; only corroborated evidence counts |

Two evidence attributes support this loop (Proposal):

- **`residue` reading:** a perceptual cue from the psychic overlay. It is a lead, not proof; it counts toward confirmation only after documentary or physical corroboration. This keeps procedure primary in a world where the supernatural is literal.
- **`provenance` (`clean` / `tainted`):** evidence obtained through improper surveillance is tainted and cannot satisfy the gate. This reflects the stated Clerk-Coroner origin, where information was obtained through the Clerk's surveillance.

## 7. Architecture (Proposal; no new framework)

```
/demo/                      separate route; Lane A index.html untouched
  index.html                vanilla JS card-table / casebook shell
  engine/
    rng.js                  injectable, seedable roll source
    rules.js                pure state machine; the only place state changes
    cases.js                evidence statuses + confirmation gate
    events.js               append-only event log
  data/
    rooms.json              room graph + tags (start, exit, evidence, incinerator, autopsy)
    cards.placeholder.json  clearly labeled placeholder cards (no Veiled Dominion text)
    cases.json              case modules (by role, not personality)
    episodes.json           episode/season skeleton with spoiler_level tags
  test/
    rules.test.js           node --test, fixed-roll scenarios
docs/
  rules-spec.md             approved rules only, with examples and edge cases
```

- One rules engine; browser UI and any bot are adapters. Neither calculates outcomes on its own.
- Every card/room/case has a unique ID, status label, source note, and tests.
- Roomy is a community destination, not game state. No win reward in Lane B until a terminal condition is approved and tested.
- CI: add a `node --test` step for `/demo` (needs an issue); until then, tests run locally and results are recorded in the PR.

## 8. Series-arc and visual presentation

### 8.1 Season 1 skeleton

Sources: four-role chain (Witness, Clerk, Undertaker, Coroner) from `MUSIC-LICENSING.md`; Violet as a forensics intern researching children of women killed by domestic violence, Sophia and Solomon, the attack, her return as examiner (Revised Arc). Episode order, count, and runtime are **Proposal**.

| Slot | Beat | Source | Mechanic hook (Proposal) |
| --- | --- | --- | --- |
| S1-0 | Origin: research, Sophia and Solomon, the attack (implied) | Revised Arc | Prologue ink only; no gameplay depiction of the attack |
| S1-1 | Violet becomes the examiner | Revised Arc | Tutorial case: Procedural Confirmation gate |
| S1-2 | The Witness | MUSIC-LICENSING | Case module; teaches witness_claim vs. observed_fact |
| S1-3 | The Clerk | MUSIC-LICENSING | Case module; institutional records and contradictions |
| S1-4 | The Undertaker | MUSIC-LICENSING | Case module; Empathy Lens introduced |
| S1-5 | The Coroner | MUSIC-LICENSING; Season 2 doc (defeated at end of S1) | Capstone case; "distrust the room" verb; Bias Audit on a hard call |
| S1-6 | Violet chooses not to pursue her past | Season 2 doc; lead statement | Quiet closing scene; no gameplay depiction of origin material |
| Later | Father/lineage reveal (Stage 3 trigger) | Revised Arc; lead statement (separate from the Coroner thread) | **Slot unresolved (C-03)**; locked placeholder, `spoiler_level` 2 |

Violet's psychological stages (Source-confirmed, Revised Arc): Stage 1 reactive, absorbs others' suffering; Stage 2 evidence-gated hunting persona, refined perception without destabilization; Stage 3 holds the truth of her origin without absorbing it as identity, authority shifts from procedural to self-sovereign. Use stages to pace which mechanics unlock; do not show stage names to players.

Supporting personas (Source-confirmed, Revised Arc): the police liaison (non-transactional presence), the nemesis (Dexter-archetype skeleton, trait-level only; Violet's clearest Stage 3 moment is refusing to fix or redeem him), Solomon posthumously (hunt turning from vengeance toward stewardship). Use only at the level written; add no detail without approval.

### 8.2 Season 2 skeleton — "Closing Time" (Source-confirmed treatment; gated)

Five movements: (I) Violet declines to open a file about her origin; (II) a warm, funny October with the Guardian; (III) an ordinary morning where the closing phrase is used out of context; (IV) Violet quietly gathers evidence on the Guardian; (V) the thread stays open, with one look in the final beat. The biological-mother thread is not resolved in Season 2. **Excluded from all public/demo builds by default.**

### 8.3 Spoiler and canon gating

Each entry in `episodes.json`, `cases.json`, and ink passages carries `season`, `episode`, `spoiler_level` (0 = safe for public demo, 1 = Season 1 late, 2 = Season 2), `source`, and `status`. The build has one constant, `REVEAL_LEVEL`, default `0`. Anything above it is not shipped in the bundle, not merely hidden in the UI. Archive/lore unlocks only show content at or below the level.

### 8.4 Television-style presentation (Proposal)

Data-driven, text-first, using existing repo art only (asset license is CC BY-NC 4.0; credit and keep non-commercial):

- **Title card** per episode (season, episode, case role, content warning line).
- **Cold open** as a short ink passage (skippable, small-screen readable).
- **Case board** showing evidence with status labels.
- **Resolution** with a Verdict Ledger recap (what was known, inferred, hidden).
- **Archive** to revisit unlocked documents outside play. Do not generate or imply new imagery, music, voices, or real-person likenesses. No music is licensed; `MUSIC-LICENSING.md` is a pitching reference only. No lyric text in code, data, or passages.

### 8.5 Accessibility and input

**Lead-stated rule:** the HTML game's controls stay one-touch/single-input (drag-to-move joystick). No hold-to-sprint, double-tap, or other added inputs without lead approval. Lane D and any new interaction must be designed within this rule. Touch-first (iPad), keyboard secondary, controller for Lane D. No information by color alone; every sound cue (e.g., Nightingale) has a visual and text-log equivalent; respect reduced-motion; pause available; targets sized for touch; skippable text.

### 8.6 Branching delivery (Lead-stated direction; implementation Proposal)

The lead's distribution direction is to let the game build lead toward a Bandersnatch-style interactive/branching narrative rather than pursuing traditional streaming distribution first. In `episodes.json`, model episodes as a node graph (`id`, `choices[]`, `next`, `spoiler_level`, `source`, `status`). Every branch must be labeled, canon-safe, and playable with lore skipped. Branch content is not canon until approved.

## 9. Decision register (lead approval needed)

Mark each Source-confirmed, Lead-selected, or Unresolved before the dependent card starts.

| ID | Decision | Blocks |
| --- | --- | --- |
| D-01 | Violet survives the attack (C-01) — **resolved by lead statement**; approve the repo update PR | Repo doc update (T2) |
| D-02 | Sophia/Solomon replace the old names (C-02) — **resolved by lead statement**; approve the repo update PR | Repo doc update (T2) |
| D-03 | Season/episode slot for the father/lineage reveal (C-03; separate from the Coroner thread) | Later-season data |
| D-04 | Do Story Bible's three acts apply to Season 1 only? (C-04) | Arc pacing |
| D-05 | Record the epitaph clearance basis in the repo (C-05, **resolved by lead statement**) | Public release only |
| D-06 | Canonical Violet's Revenge card list and text, or approval of original cards | Cards beyond placeholders |
| D-07 | Player count, turn order, actions per turn, card timing | Lane B engine |
| D-08 | Hand/draw/discard/reshuffle, starting resources and costs | Lane B engine |
| D-09 | Escape/capture details: evidence requirement, exits, capture roll, rescue, simultaneous-resolution precedence | Terminal state |
| D-10 | Confirmation-gate thresholds and Empathy Lens tuning (§6.1–6.2) | Casebook |
| D-11 | Final room count, adjacency, start positions; which rooms are canon vs. prototype | Board |
| D-12 | Surrender and restart behavior; any Roomy reward trigger | Lane B UX |
| D-13 | Episode count/order and which slots ship in a public demo | Series data |
| D-14 | Whether any cross-game lore reference to Veiled Dominion is intentional | Lore docs |
| D-15 | Approve auto-trigger for the incinerator on touch (touch gap, §3.2) | T1 fix |
| D-16 | Handling of the Coroner's condition in player-facing text (C-07) | Coroner case text |

## 10. Phased roadmap and task cards

| Phase | Deliverable | Exit criterion |
| --- | --- | --- |
| A. Baseline | Record Lane A behavior and gaps; browser QA pass | Findings written, no overstated testing |
| B. Lore alignment | Source map of every lore beat (C-01…C-07 logged) | Each beat has a source, chronology label, and status |
| C. Rules spec | `rules-spec.md` for approved items only | Every rule has an example and edge case |
| D. Engine | Pure rules engine + deterministic tests | Fixed-roll scenarios pass; illegal actions leave state unchanged |
| E. Board demo | Separate-route card/board vertical slice | Meets §11 acceptance list |
| F. Casebook | Evidence statuses, confirmation gate, Bias Audit, one tutorial case | Gate and audit tested; skippable ink |
| G. Series layer | `episodes.json`, spoiler gating, title cards, archive | `REVEAL_LEVEL=0` bundle contains no gated content |
| H. Arcade proof of concept | Separate short-run real-time mode | Playtest evidence on comprehension, fairness, accessibility |
| I. Adaptation review | Compare all lanes | Lead approves scope before further integration |

**Task cards (execute in order)**

| Card | Task | Needs | Done when |
| --- | --- | --- | --- |
| T1 | Baseline report for `index.html`: features, gaps (including the touch gap), manual QA checklist; propose the incinerator touch fix as a separate small PR | D-15 for the fix | Report lists implemented/unverified/missing; QA steps are tap-friendly; `index.html` untouched unless D-15 is approved |
| T2 | Lore source map with conflict log (C-01…C-07) and a proposed PR updating the stale franchise-roadmap and story text | D-01, D-02 | Table of beats with source + status; no invented facts; changes proposed via issue + PR |
| T3 | Rooms and placeholder cards as JSON with IDs, labels, sources | D-11 (default: current prototype rooms, labeled) | Schema-valid; no Veiled Dominion text |
| T4 | `rng.js` + `rules.js` skeleton: state, turn state machine, event log | D-07, D-08 | Illegal actions leave state unchanged; one terminal result |
| T5 | Dice check (`d6 + mod >= TN`) with injectable rolls, logged | T4 | Tests with fixed rolls for success, failure, boundary |
| T6 | Escape/capture terminal logic | D-09 | Escape path and capture path reach one tested terminal result |
| T7 | `cases.js`: statuses (including `residue` and `provenance`), confirmation gate, action gate | D-10 (default: placeholders in §6.1) | Tests: confirmed, insufficient, contradicted, tainted and uncorroborated evidence rejected, early-action rejected |
| T8 | Bias Audit + Verdict Ledger output | T7 | Ledger distinguishes fact from empathic inference; no auto-penalty |
| T9 | Board-and-card browser shell on `/demo` | T4–T6 | §11 list passes manually; restart clears all state |
| T10 | `episodes.json`, `REVEAL_LEVEL` build filter, title cards, archive | D-13 | Level-0 bundle verified free of gated content |
| T11 | CI step for `/demo` tests | Issue + approval | CI runs `node --test` for `/demo` |
| T12 | Arcade readability prototype (Lane D) | A–E complete | Fast restart, controller input, measured score criteria |

## 11. Minimum vertical-slice acceptance (Lane B)

A tester can: start a match on a small connected-room precinct map; move only along legal connections; play at least one approved or clearly placeholder card with visible cost, timing, and target; resolve a d6 check against a visible target number; see a logged roll, modifier, and outcome; reach an escape path and a capture path to a single terminal result; restart with no leftover state; and replay fixed-roll test cases deterministically. All of this runs on touch. The UI and any bot agree with the engine's event log.

## 12. Test gates

1. **Rule-level:** every approved rule and card has success, failure, boundary, and interaction cases.
2. **State-transition:** illegal actions change nothing; turns cannot be skipped or duplicated; reactions resolve once.
3. **Invariants:** a card exists in exactly one zone; captured units cannot act; terminal games reject ordinary moves.
4. **Replay:** fixed action + roll sequences give identical results.
5. **Casebook:** empathic inferences, uncorroborated residue readings, and tainted evidence never satisfy the gate; early action is rejected with a reason.
6. **Spoiler:** the `REVEAL_LEVEL=0` bundle contains no Season 2 or gated strings.
7. **Browser/accessibility:** controls are tappable, cues have visual equivalents, restart is clean.
8. **Review gate:** no production merge or Roomy reward until the lead approves rules and tests pass.

## 13. Arcade adaptation gates (retained)

Treat arcade as a separate adaptation, not a replacement.

1. **Baseline:** document and test the existing real-time loop and known gaps.
2. **Readability:** new players can identify objectives, Violet's state, Nightingale triggers, and escape requirements without relying on color.
3. **Prototype:** separate branch/mode with fast restart, short sessions, controller input, a few measured score criteria.
4. **Playtest:** evidence on comprehension, fairness, replayability, accessibility; polish is not evidence.
5. **Lore:** every unlock reviewed against series chronology and the spoiler policy.
6. **Release:** only after explicit review. Score on navigation, evidence objectives, and risk management. Never reward arbitrary violence or treat fast reaction as proof of sound judgment.

## 14. Boundaries

- Violet's Revenge and Veiled Dominion are not the same game.
- Unknown rules are recorded as questions, not guessed.
- The Canvas prototype is preserved as a dated historical milestone and not rewritten.
- Roomy hosts community coordination; it is not game state or an authorization backend.
- Adult-only working/voice participation until a safeguarding plan exists (`PLAYTEST-GUIDELINES.md`).
- This document does not merge or deploy anything.
