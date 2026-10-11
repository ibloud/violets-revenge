# Veiled Dominion browser demo — rules and terminal-state audit

**Status:** audit complete; gameplay implementation is blocked on canonical decisions  
**Rules authority requested by project lead:** `CARD-TEXT-DATABASE.md`  
**Branch:** `phase/veiled-dominion-rules-audit`  
**Scope:** audit only. This document does not add, alter, or infer game rules.

## Executive finding

`CARD-TEXT-DATABASE.md` is authoritative for the printed text of 52 cards, but it is **not a complete executable rules specification**. It defines card identities and individual effects while referring to unprovided systems: Phases I–III, a chess-like board, pawns and other pieces, hidden pieces, RP, upgrade tokens, confirmation dice, attack/block resolution, and draw/discard piles.

The legacy `violet_bot.py` is not a valid rules engine for this authority. It initializes four cards per side and 10 RP each, then has Violet discard a Spades/Diamonds card and deal exactly 1 RP damage. It does not implement the card database's effects, board phases, blocks, dice, draws, captures, or a terminal result. The archived `docs/archive/2026-07-17-violet-agent-proposal.md` is explicitly marked **Archived / Not Adopted** and includes a speculative multi-player Rooms API example; it must not be treated as adopted rules.

**Conclusion:** we can build card data, accessibility/UI scaffolding, and tests around explicitly approved rules, but should not claim a faithful playable match or gate the Roomy reward on a fabricated win condition until the missing rules are resolved.

## What is specified

### Deck composition

- 52 cards total: 4 suits × ranks 2–10 (36 numbered cards) plus J, Q, K, A in each suit (16 face cards).
- Aces may be declared as any suit and used as pip 1 or 14, or held as Last Stand.
- J/Q/K/A have universal text regardless of suit.
- Suits represent Spades = Conquest/Attack; Hearts = Restoration/Support; Diamonds = Intelligence/Subterfuge; Clubs = Fortification/Defense.
- The file says its text is final for card generation. Preserve wording; do not rewrite card text as part of this audit.

### Explicit effect text (high-level inventory)

- **Universal faces:** J deploys a Pawn one square forward in pre-staging; Q draws 3, keeps 2, discards 1; K doubles the next attack *or* grants immunity to one Phase III capture; A declares a suit and uses pip 1/14 *or* is held as Last Stand to nullify one Phase III check.
- **Spades 2–10:** attack strength 2–10, with additional effects involving random discard, movement/range, blocked advancement, stricter block threshold, confirmation dice, combining a second Spade, revealing a hidden piece, or drawing from the discard pile.
- **Hearts 2–10:** RP recovery, optional draw, Pawn shield buff, status removal, opponent draw, conditional draw if the hand is empty after play, restoration of a Phase I upgrade token, one-capture survival at 1 HP, or once-per-game restoration of RP lost in the current phase.
- **Diamonds 2–10:** inspect/replace top draw-pile card, private peeks at hidden hands, timed hand reveal, reveal a hidden chess piece's location but not type, card theft/swap, compensatory draw, and a next-turn defense-only restriction.
- **Clubs 2–10:** block strengths 2–10 and additional effects involving instant reaction, draw after full absorption, attack reduction, armor/confirmation bonus, counter-damage, one-time capture protection, permanent square fortification, a free follow-up card, or guaranteed full block followed by discard.

This inventory is descriptive, not a resolution algorithm.

## Missing mechanics and conflicts

| Area | Missing or ambiguous rule | Why implementation must wait |
|---|---|---|
| Phase structure | No definitions for Phase I, II, III; no start/end conditions, phase order, transition trigger, or what persists between phases. Phase I upgrade tokens and Phase III board effects imply different subsystems. | The browser cannot determine when effects are legal or expire. |
| Players / sides | Legacy bot uses Violet vs one opponent; archived proposal sketches Violet plus two named opponents. The card database does not define player count, teams, seating, turn order, or whether Violet is a player or adjudicator. | UI layout and turn ownership depend on this choice. |
| Board and pieces | Chess-like movement is referenced, but board size, initial setup, piece types/counts, legal movement, check, capture, hidden status, Pawn promotion/deployment, and whether standard chess rules apply are absent. | Cannot validate movement, targeting, capture, or win by board state. |
| RP | RP is not defined; the legacy code initializes 10 per side but no canonical starting value, cap, zero/negative handling, or exact damage/recovery conversion is stated. | Cannot define resource display or whether RP reaching zero ends a match. |
| Turn/action model | No turn sequence, action budget, pass rule, hand size/cap, legal-card timing, whether a player can play multiple cards, or priority for reactions. | Cannot decide legal actions or avoid stalled turns. |
| Attack resolution | "Attack str.", "on success", "on win", and "victory" are used without an attack procedure, target selection rules, comparison formula, damage formula, or tie handling. | Attack cards cannot be resolved deterministically. |
| Block resolution | No universal response window or formula. Iron Assault requires a block value greater than 6, Iron Buckler reduces attacks to zero when "within 2", and Unbreakable Line guarantees a full block regardless of attack value. Priority/overrides are unspecified. | Multiple plausible outcomes exist for the same move. |
| Dice / check | No die type, range, roll timing, meaning of "confirmation", what constitutes a "check", modifiers, or reroll rule. | Siege Blade, Tower Shield, and Last Stand have no defined target operation. |
| Draw/discard | No shuffle rule, initial hand/deal, draw count at setup, draw-pile exhaustion, reshuffle rule, discard destination, deck recycling, or empty-pile behavior. | Q, Diamonds, and several Hearts/Spades effects cannot be completed. |
| Hidden information | No visibility model, hidden-piece setup, reveal persistence, UI privacy, or rules for what counts as a hidden piece. Courier Intercept's five seconds needs a timing/visibility policy. | Private information could leak to the wrong player or remain visible too long. |
| Effect timing | "Next attack", "next turn", "once per game", "once in Phase III", "permanently", and "this phase" have no precise expiry/consumption rules. No stacking, cancellation, or simultaneous-trigger order is defined. | Status effects may persist or stack incorrectly. |
| Effect edge cases | Rules do not define what happens if a required target/card/piece/pile is absent; if the opponent has fewer cards than requested; if the player has no card to swap; or if a card is stolen while its effect is pending. | The demo needs deterministic, testable edge handling. |
| Card economy | Spades 8 combines a second Spade, Q keeps 2 of 3, Diamond 8 steals then swaps, Diamond 9 steals 2 then opponent draws 1, and several cards draw after play; costs and order are not defined. | Can cause impossible hand sizes, duplication, or undefined card ownership. |
| RP restoration | Phoenix Rite restores all RP lost "from this phase" and is once per game; no phase boundary or whether "all lost RP" means phase-start baseline or all missing points is defined. | The healing amount and reset bookkeeping are unknown. |
| Win/loss/draw | Neither the card database nor legacy bot defines terminal conditions. No explicit RP-zero loss, king capture/checkmate, objective, deck-out, concession, turn limit, or tie rule is present. | A win screen and Roomy reward would currently be invented behavior. |
| Restart / persistence | No session reset, save/load, abandonment, or rematch contract for the browser version. | State may leak across matches or incorrectly reuse once-per-game effects. |
| Roomy reward | The repository's Roomy transition says the invite is intended for the existing browser game's win screen only and is a reusable static link, not verified proof. It does not define a Veiled Dominion win condition. | Do not expose a Veiled Dominion-specific reward based on an arbitrary client-side condition. |

## Conflicts or notable wording interactions to adjudicate

1. **Block thresholds:** Spades 6 requires a block value strictly greater than 6, while Clubs 10 guarantees a full block regardless of attack value. The intended precedence is not stated.
2. **Attack value vs damage:** Spades are labeled attack strength, but legacy behavior inflicts 1 RP irrespective of the played card. The database does not say strength equals RP damage.
3. **"On success"/"on win":** No success condition exists, so all follow-on effects that depend on success are blocked.
4. **Chess and cards share state:** Several cards mention board pieces, captures, check, Pawns, hidden locations, and confirmation rolls, but the document has no board rules.
5. **Ace alternatives:** Suit declaration/pip 1 or 14 and holding as Last Stand appear to be different modes; when the choice is made, whether it is irrevocable, and whether an Ace can be played from hand or held are unclear.
6. **Universal face cards:** "Works for any suit" is stated, but the relationship between a face card's physical suit and A's declared suit is not specified for effects or later references.
7. **"Free" follow-up:** Ironclad Aegis says play one card for free after blocking, but whether the free card can trigger a reaction, another free play, or a chain is not stated.
8. **Permanent effects:** Fortress Gate permanently fortifies a square, but match duration and board reset between phases/matches are not specified.

## Decisions required before a rules-faithful implementation

These are design gates, not assumptions for the implementer to fill in silently.

1. **Match format:** Confirm a two-side match (player vs Violet) or a multi-player game. This audit recommends starting with two sides for the first browser slice, but this requires approval because the database itself does not decide player count.
2. **Phase scope:** Is the first demo the full three-phase game, or a limited card-only Phase I slice? If limited, explicitly label it as a slice rather than a full Veiled Dominion match.
3. **Canonical board rules:** Supply/approve board setup, piece roster, legal moves, check/capture, hidden-information rules, and phase transitions—or confirm these are deferred and out of scope for the first slice.
4. **RP and combat:** Define starting RP, cap, damage/recovery rules, attack-vs-block formula, ties, dice/check procedure, and whether RP reaching zero ends the match.
5. **Terminal conditions:** Name all win, loss, and draw conditions, precedence when multiple happen at once, and what happens on deck-out, no legal move, pass, or abandonment. No condition should be inferred from a card's flavor text.
6. **Card timing and edge cases:** Define reaction windows, effect order, duration/stacking, target selection, draw/discard/reshuffle, card exhaustion, and behavior when targets or requested cards are unavailable.
7. **Roomy handoff:** Confirm that only a defined Veiled Dominion win shows the existing invitation; losses/draws/retry must not show it. A static link is a reward, not secure proof.

## Safe work that can proceed before decisions

- Build a structured 52-card data registry copied from the approved text, with card IDs/suit/rank/text and no implied effect resolution.
- Create a card reference / rules glossary UI and accessible table/card rendering.
- Implement a pure state schema with explicit phase, players, hands, draw/discard zones, RP, board, and effect/status placeholders only if they are inert until rules are approved.
- Add static validation that confirms all 52 unique card IDs and preserves source text exactly.
- Keep the card-table route separate from `index.html`; do not alter the existing Canvas demo.
- Do not add a Roomy invite to the new route until terminal win state is approved.
- Keep all changes on this isolated branch; stack the PR on the prior `phase/roomy-card-demo-handoff` branch for review.

## Verification checklist for the next implementation PR

- [ ] All 52 card records are present exactly once and match `CARD-TEXT-DATABASE.md`.
- [ ] Each implemented rule maps to an approved clause; no unsupported rule is introduced.
- [ ] Unit tests cover legal/illegal action validation and every implemented transition.
- [ ] Attack/block precedence and all card-effect timing have deterministic tests.
- [ ] Deck exhaustion, empty hands, missing targets, repeated effects, and restart are tested.
- [ ] Win/loss/draw are explicit and mutually exclusive, with defined precedence.
- [ ] Roomy link appears only on the approved win state.
- [ ] Existing `index.html` remains unchanged and functional.
- [ ] No Discord dependency, credential, route, or network call is added to the browser game.
