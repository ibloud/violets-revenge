# Veiled Dominion — executable rules decision draft

**Status:** proposal only; not canonical rules  
**Card-text authority:** `CARD-TEXT-DATABASE.md`  
**Prepared on branch:** `phase/veiled-dominion-rules-spec`  
**Purpose:** turn the existing audit into a small set of explicit decisions before any card effect is implemented. This draft does not alter the printed text of any card and must not be treated as adopted gameplay rules.

## Development contract

1. Preserve the 52 card identities and exact rules text in `CARD-TEXT-DATABASE.md`.
2. Keep the current Canvas game and the existing Roomy handoff unchanged.
3. Keep this work isolated from production and do not merge the draft without review.
4. Implement no effect whose preconditions, timing, resolution, or failure behavior are not explicitly specified.
5. Any first playable slice must be labeled as a slice, not represented as the complete Veiled Dominion game.
6. Do not display a Veiled Dominion win or the Roomy reward until a canonical terminal condition exists and is covered by tests.

## Proposed first playable milestone

**Recommendation:** start with a two-sided, local hot-seat prototype, player versus Violet, using a clearly labeled card-combat slice before implementing board/chess mechanics. This is a proposed scope to review, not a decision inferred from the card database.

Why this is the safest first milestone:
- The legacy bot already models two sides and an RP value, so it provides provenance without pretending to implement the 52-card database.
- The full database refers to phases, pieces, hidden information, dice, and a board whose rules are not present. Building those systems all at once would require many unsupported decisions.
- A slice can validate turn ownership, hand/deck/discard integrity, card identity, logging, restart, and accessible UI while keeping deferred effects visibly unavailable.
- No Roomy reward is shown in this milestone. A separate terminal-state review is required before that handoff is enabled.

## Decision register

Each item is **unresolved** until explicitly approved. The suggested default is a recommendation for review, not an implemented rule.

| ID | Decision needed | Suggested default for review | Implementation consequence |
|---|---|---|---|
| VD-01 | Match format | Two sides: human player and Violet; local hot-seat UI for both sides in the first slice | Defines turn owner and privacy boundaries |
| VD-02 | First-slice scope | Card-combat slice only; defer Phase I/II/III board mechanics and mark them unavailable | Avoids inventing chess movement, checks, captures, or phase transitions |
| VD-03 | Starting resources | Start each side at 10 RP only if explicitly approved from legacy behavior; otherwise require a new canonical value | No resource values should be hard-coded before decision |
| VD-04 | Starting deck and hand | Shuffle the 52-card deck; draw 4 per side only if explicitly approved; define whether a shared deck or separate hands are used | Determines conservation tests and setup |
| VD-05 | Turn structure | One primary card play per turn; reaction cards only during a defined response window | Defines action legality and prevents unbounded chains |
| VD-06 | Attack/block resolution | Define whether strength is comparison-only or also RP damage; define ties and card-specific overrides in a precedence table | Enables deterministic combat tests |
| VD-07 | Unavailable card effects | Do not offer an effect until its required subsystem is in scope; never silently substitute a generic effect | Prevents text/database drift |
| VD-08 | Deck exhaustion | No reshuffle unless approved; a draw that cannot be fulfilled draws as many as available and logs the shortfall | Requires approval before implementation |
| VD-09 | Terminal conditions | Do not declare wins/losses/draws in the slice until an explicit condition is approved | Prevents fabricated win screens and Roomy rewards |
| VD-10 | Full game phases | Define phase order, transition triggers, phase reset/persistence, and the legal timing of every phase-specific card | Required before a full-game claim |
| VD-11 | Board system | Specify board dimensions, initial pieces, legal movement, hidden pieces, check, capture, pawn deployment, and board victory | Required before implementing board cards |
| VD-12 | Persistence/restart | First slice is single-session; restart creates a fresh state and resets once-per-game effects | Keeps scope small and testable |

## Minimum card-engine invariants

These are engineering invariants, not new gameplay rules, and should hold regardless of the final match rules:

- The registry contains exactly 52 unique card IDs: four suits × ranks 2–10 plus J/Q/K/A for each suit.
- Every physical card instance has one owner/location at a time (draw pile, hand, discard pile, or explicitly defined in-play zone); no duplicate instance is created by draw, steal, swap, or discard.
- State transitions are deterministic given the same state, action, and any recorded random result.
- Random choices (shuffle, random discard, random theft, dice) are injectable/seedable for tests and recorded in the action log without leaking private information.
- Illegal actions leave state unchanged and return a user-readable reason.
- Restart resets every per-match and once-per-game effect.
- The exact source card text is data; UI labels or implementation notes may clarify status but may not silently rewrite the printed rules.
- Deferred card effects are visibly marked as unavailable in the prototype, rather than treated as playable generic cards.
- No terminal result or Roomy reward is inferred from RP reaching zero, board state, deck exhaustion, or a turn count until that condition is approved.

## Conflict-resolution worksheet

Before the corresponding cards are enabled, approve a deterministic ruling for each interaction:

1. **Spades 6 vs Clubs 10:** does the guaranteed full block override the requirement to exceed 6, or does the stricter threshold override the guarantee?
2. **Attack strength vs RP damage:** are these separate values? If separate, how is damage calculated?
3. **Spades 4:** what is a piece, what is normal movement range, and what precisely is ignored?
4. **Spades 7 / Clubs 5 / Ace Last Stand:** what die is used, what is a confirmation roll/check, and what modifiers apply?
5. **Spades 8 / Clubs 9:** can a combined/free follow-up card trigger additional reactions or chain another free play?
6. **Ace:** when is its mode and declared suit chosen, and can the choice be changed later?
7. **Phoenix Rite:** does “all lost RP from this phase” mean restore to phase-start RP, or restore only RP lost during the current phase, and how is that amount tracked?
8. **Diamonds 3–5:** what information may the local UI show to the active player, and when is it hidden again?
9. **Diamonds 7–10:** what happens if the requested card(s) are not present, the opponent has too few cards, or a swap cannot be completed?
10. **Clubs 8:** what does “permanently” mean across phases and match restarts?

## Implementation gates

### Gate A — rules approval
Approve VD-01 through VD-09 for a clearly labeled card-combat slice, or replace the proposal with an approved alternative. No canonical decisions are made by this document.

### Gate B — pure engine and tests
After Gate A, implement a transport-independent JavaScript state engine and tests for setup, turn ownership, legal/illegal actions, card conservation, random-choice injection, action logs, restart, and each approved effect. Keep the current Canvas page untouched.

### Gate C — browser card-table route
After the pure engine passes, add a separate vanilla HTML/CSS/JS route with accessible hand controls, RP display only if approved, action log, responsive layout, restart, and explicit labels for deferred mechanics.

### Gate D — full Veiled Dominion
Do not claim the full game until phase/board/combat/effect timing and terminal conditions are complete, tested, and reconciled against all 52 exact card texts.

### Gate E — Roomy handoff
Only after a canonical win condition and its tests exist may the new route show the existing Roomy destination on a real win state. Loss, draw, restart, and in-progress states must not show it. This remains a static client-side gameplay reward, not secure win verification.

## Acceptance checklist for this draft

- [ ] Every proposed default is reviewed and explicitly accepted, changed, or rejected.
- [ ] Card text remains unchanged.
- [ ] No new gameplay effect is implemented by this document.
- [ ] The existing Canvas prototype and production branch remain untouched.
- [ ] No Roomy invite, Discord runtime, backend, or credential integration is added.
- [ ] A subsequent implementation PR references the approved decisions and tests each one.
