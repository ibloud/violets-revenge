# Violet's Revenge card demo — mechanics completion plan

**Status:** design proposal updated with project-lead preferences on 2026-10-11; not an adopted ruleset  
**Applies to:** Violet's Revenge card-game / bot / browser demo only  
**Selected direction:** connected rooms/zones with cards, one die plus modifiers against a target number, escape-versus-capture survival objective  
**Related game:** Veiled Dominion remains separate  
**Production impact:** documentation only; no game code or production behavior changes

## Executive recommendation

Complete the demo in two passes:

1. **Rules inventory and source approval.** Identify which cards, actions, resources, board concepts, and outcomes are actually part of Violet's Revenge. Preserve original card wording. Treat legacy code as evidence of prior behavior, not proof of a complete ruleset.
2. **Small, dice-based board-and-card prototype.** Draft a compact baseline for review, with a clearly labeled provisional board, die procedure, survival track, and card timing. Use classic game structures only as generic references; write original Violet's Revenge rules text, terminology, card effects, theme, and balancing.

Do not copy the Veiled Dominion database into the Violet's Revenge demo by default. The repository's CARD-DESIGN-GUIDE.md explicitly calls that deck a Veiled Dominion deck themed for the Violet's Revenge universe. That establishes a lore/art connection, not a shared rules authority.

## What is confirmed today

- violet_bot.py is explicitly labeled as initializing a Veiled Dominion game, not a complete Violet's Revenge rules engine.
- The legacy bot starts each side with four hard-coded cards and 10 RP, accepts a card from the opponent, and has Violet answer with a Spades/Diamonds card while subtracting 1 RP from the opponent.
- That behavior does not establish a complete deck, legal move system, attack/block calculation, draw/discard lifecycle, board setup, phase transitions, or victory conditions.
- CARD-TEXT-DATABASE.md is explicitly the Veiled Dominion database. Its chess-piece, Phase I/II/III, confirmation-dice, RP, and capture language must not silently become Violet's Revenge rules.

## Can public-domain structures fill the gaps?

Yes, selectively. Classic game structures can provide tested patterns, but no single public-domain game supplies all of the custom systems implied by the available documents.

| Missing system | Candidate reference structure | What it can supply | What still needs a Violet's Revenge decision |
|---|---|---|---|
| Alternating turns, legal moves, captures, blocked pieces | Checkers/draughts or chess | Turn alternation, board coordinates, legal-move validation, capture and no-legal-move handling | Whether Violet's Revenge uses a board at all; piece types, movement, capture costs, and what counts as a win |
| Hand, draw pile, discard pile | Traditional card-game structure | Deck setup, draw timing, discard timing, empty-deck handling | Deck composition, hand size, mulligan, draw limit, reshuffle policy |
| Attack vs. defense | Simple deterministic comparison system | One unambiguous formula, tie rule, and reaction window | Attack value, block value, damage, RP costs, whether excess strength matters |
| Resources and upgrades | Generic turn-based resource economy | Explicit starting amount, gains, costs, spending limits | What RP means, when it refreshes, whether it can go below zero, upgrade/token effects |
| Hidden information | Standard hidden-information game pattern | Define exactly who may see which information and when | Whether hidden pieces/cards exist in this game and when they are revealed |
| Phases and timed effects | Explicit finite-state machine | Ordered phases, valid actions per phase, duration and expiration rules | Whether phases exist in Violet's Revenge; phase names and approved effects |
| End of game | Elimination, objective, or score-based model | A machine-checkable terminal state | Violet's Revenge's actual victory, defeat, draw, surrender, and restart rules |

The U.S. Copyright Office explains that game ideas and methods of play are generally not protected by copyright, while original written rules and artwork may be protected. Use classic mechanics as references, write our own rulebook and code, and preserve attribution/licensing for any specific rule text, artwork, or code reused. This is design guidance, not legal advice.

## Proposed minimum playable ruleset (approval required)

This is a proposed scaffold, not canon. The project lead has selected board-and-card play, dice-based combat, and survival as the terminal-condition direction. The exact board topology, movement, die formula, survival values, and card list remain unresolved until sourced or approved.

### 1. Establish the game mode

**Selected: board-and-card duel using connected rooms/zones.** This is the project lead's provisional design preference, not a claim that this board is established in franchise canon. Model the board as a graph: rooms are nodes and doors/passages are edges. This suits a horror setting and lets the demo show navigation without assuming a chessboard or importing Veiled Dominion's piece movement.

Still unresolved: the map layout, starting rooms, number and role of units, whether doors can lock, movement limits, occupancy, line-of-sight, capture procedure, and how cards modify movement. Do not import Veiled Dominion's chess pieces, three phases, or card rules merely because that database references a board.

### 2. Define the canonical state

The engine should represent, at minimum:

- current player and turn number;
- each player's hand, resource pool, and any status effects;
- draw pile and discard pile;
- board and pieces only if the approved mode uses them;
- pending attack/reaction, if reactions are allowed;
- event log and terminal result.

All state changes should pass through one rules engine; the browser UI and bot must not independently calculate outcomes.

### 3. Define the turn state machine

Write a transition table before coding. For the selected board-and-card direction, a candidate sequence is:

1. Start turn and apply start-of-turn effects.
2. Draw according to the approved draw rule.
3. Take the permitted board action(s) and/or play card(s), in the approved order.
4. Resolve any response or reaction.
5. Resolve dice checks and apply movement, damage, recovery, and effect timing exactly once.
6. Check the survival terminal condition.
7. Pass turn.

This sequence is a proposed workflow, not adopted canon; action count, order, and draw timing still require a decision.

Every step must say which actions are legal, whether the step can be skipped, and when the next player acts. If a board/phase system is confirmed, define those states separately rather than assuming that Phase I/II/III from Veiled Dominion carries over.

### 4. Make dice-based combat explicit and testable

**Selected: dice-based combat.** A die is part of the chosen design, not an excuse for unresolved outcomes. The rules must specify:

- die type/range and how it is rolled;
- which action/card/unit modifiers apply and when;
- target number or opposing roll, including tie handling;
- whether attack and defense both roll, and whether either side may spend a card to react;
- how success changes survival, position, status, or resources;
- whether a roll can be rerolled or modified, and whether a result can trigger multiple effects;
- how the browser/bot records the result and how tests inject a fixed roll.

**Selected approach:** one die plus modifiers against a target number. **Provisional design recommendation, not approved canon:** begin playtests with one six-sided die (d6). A test succeeds when `d6 + applicable modifier >= target number`. For a first balance pass, playtest target numbers 4 (routine) and 6 (difficult); these are placeholders, not final values. Define whether a natural 1 or 6 has any special meaning (recommend no special result in the first pass), how modifiers stack, whether a card must be committed before rolling, and whether failed actions consume the action/resource. Keep the die result injectable in tests so the same scenario can be replayed.

### 5. Define resource and card lifecycle

Specify starting resources, legal costs, resource gain timing, whether costs can be refunded, card draw timing, maximum hand size, discard destination, and what happens when the draw pile is empty. No card effect should rely on undefined phrases such as “on success,” “next,” “permanent,” or “free” without a timing definition.

### 6. Define survival as the terminal condition

**Selected: escape versus capture.** This replaces a generic life-points-only interpretation of survival for the current design draft. The franchise roadmap's existing asymmetry—Violet hunts the Guilty while the Guilty seek evidence and escape—is a thematic anchor, but it does not prove these exact tabletop win rules.

**Provisional playtest strawman, not approved canon:** the Guilty side wins if an eligible Guilty unit reaches an exit after meeting the still-to-be-defined evidence requirement; Violet wins if all Guilty units are captured or otherwise rendered unable to escape under an explicit rule. Define what counts as capture, whether capture is automatic or requires a successful die test, whether captured units can be rescued, how many exits exist, whether evidence is required, and what happens if an exit and capture occur in the same resolution. Decide whether any survival/health track supplements this objective or is unnecessary in the first demo. The engine must emit one testable terminal result. Until this is approved and tested, do not claim an official win or award a Roomy reward.

## Required mechanics decision record

Before implementation, mark each item as **source-confirmed**, **lead-approved proposal**, or **unresolved**:

- [ ] Canonical Violet's Revenge card list and exact text
- [x] Board-and-card duel selected as design direction
- [x] Connected rooms/zones selected as provisional board topology; exact map and movement unresolved
- [ ] Player count and turn order
- [ ] Starting hand, draw, discard, and reshuffle rules
- [ ] Starting RP and all RP costs/gains
- [ ] Legal actions per turn
- [ ] Attack, block, damage, tie, and reaction rules
- [ ] Card effect timing, stacking, duration, and target legality
- [ ] Any board, piece types, movement, capture, and hidden-information rules
- [x] Escape-versus-capture selected as provisional survival objective; evidence, exits, capture, rescue, and tie/terminal precedence unresolved
- [x] One die plus modifiers against a target number selected as design direction; d6 and TN 4/6 are playtest placeholders only
- [ ] Surrender and restart behavior
- [ ] Whether any cross-game lore/card reference is intentional

## Test gates

1. **Rule-level unit tests:** every approved rule and every card effect has at least one success case, failure case, boundary case, and interaction test.
2. **State-transition tests:** illegal actions leave state unchanged; turns cannot be skipped or duplicated; a reaction cannot resolve twice.
3. **Invariant tests:** resources obey the approved minimum/maximum; cards exist in exactly one legal zone; captured/removed pieces cannot act; terminal games cannot accept ordinary moves.
4. **Replay tests:** a fixed sequence of actions yields the same result on repeated runs.
5. **Bot tests:** Violet chooses only legal actions and handles empty hands, insufficient resources, and no legal actions.
6. **Browser tests:** restart clears all state, accessible controls expose legal actions, and the UI agrees with the engine's event log.
7. **Review gate:** no production merge or Roomy reward integration until the lead approves the rules and the test suite passes.

## Suggested implementation order

1. Inventory original Violet's Revenge materials and label each source by game identity.
2. Resolve the mechanics decision record with the project lead.
3. Write a compact rules specification with examples and edge cases.
4. Implement a pure, transport-independent rules engine.
5. Add card definitions as structured data with unique IDs, effect types, timing, and validation.
6. Write deterministic tests before connecting the browser UI or bot.
7. Build the separate Violet's Revenge browser card table and bot adapter around the same engine.
8. Playtest, adjust balance, document changes, then consider any Roomy integration.

## Public references

- U.S. Copyright Office, Games: https://www.copyright.gov/register/tx-games.html
- U.S. Copyright Office, 17 U.S.C. § 102: https://www.govinfo.gov/content/pkg/USCODE-2024-title17/html/USCODE-2024-title17-chap1-sec102.htm
- Project source distinction: CARD-DESIGN-GUIDE.md, CARD-TEXT-DATABASE.md, and violet_bot.py.


## Project-lead decision update — 2026-10-11

The lead selected these directions for the Violet's Revenge card demo:

- **Connected rooms/zones with cards** — selected provisionally; the map, unit roles, movement, doors, and capture procedure remain unresolved.
- **One die plus modifiers against a target number** — selected; d6 with test target numbers 4 and 6 is only a playtest starting point, not canon.
- **Escape versus capture** — selected provisionally; evidence requirements, exits, capture/rescue procedure, and terminal precedence remain unresolved.

These are design preferences, not proof of original canon. They supersede the generic card-only/deterministic options above. Veiled Dominion remains a separate game and is not a source of default rules for this demo.

## Source inventory finding

The current repository's franchise roadmap and README describe Violet's Revenge as an asymmetrical horror experience: Violet hunts the Guilty, while the Guilty search for case files, process evidence, and seek escape. Those sources provide thematic and objective references, but the files inspected so far do not establish a canonical Violet's Revenge tabletop board, card list, die formula, or survival-track rules. The legacy `violet_bot.py` names Veiled Dominion in its game setup and must not be treated as the canonical card-duel engine.

Therefore, this card-table experience should be documented as a **Violet's Revenge card-game demo/prototype** whose mechanics are proposed and testable, not presented as existing franchise canon unless further source material confirms them.

## Next mechanics draft — board, dice, survival

The next specification should define these in order:

1. **Room graph contract:** define rooms and connecting passages; setup/start rooms; exits; evidence locations; doors/locks if any; legal movement; occupancy; and how a capture can occur. Prefer a small, readable map for the demo, but keep the final layout unresolved until source review/playtesting.
2. **Turn/action contract:** player order; number of movement and card actions per turn; when cards can be played; legal targets; response windows; and whether playing a card consumes an action or resource.
3. **Dice contract:** d6 plus modifiers against a target number; define which actions roll, TN selection, modifier stacking, whether failure consumes an action, and whether cards are committed before a roll. Use an injectable deterministic roll source in tests.
4. **Escape/capture contract:** define who can escape, whether evidence is required, how capture works, whether rescue exists, and which outcome takes precedence if conditions are met simultaneously. Emit one authoritative terminal result.
5. **Card contract:** every card has a unique ID, original text/source, legal target, timing, action/resource cost, effect type, duration, and test cases. Until Violet's Revenge-specific cards are found or approved, do not fill the demo with Veiled Dominion cards.
6. **Prototype acceptance:** a complete sample match can start, accept only legal movement/card actions, resolve fixed and random dice rolls, update survival, reach a tested terminal state, and restart cleanly. The bot and browser must use the same rules engine.



## Provisional rules skeleton for review (not canon)

This skeleton turns the lead's preferences into something that can be playtested while leaving important choices visibly unresolved.

### Board model

- Represent the location map as a graph: each room is a node; each open connection is an edge.
- A unit may move only along a connection declared open by the board data.
- **Provisional movement candidate:** one room transition per movement action. Whether this is free, costs the turn's movement action, or requires a roll is unresolved.
- Each room should carry explicit tags where relevant: `start`, `exit`, `evidence`, `hazard`, or `locked`. Tags do not themselves define behavior; rules must define what each one does.
- The first board should be small enough to inspect at a glance. Exact room count, layout, and start/exit positions are unresolved.

### Turn model

A candidate turn sequence for playtesting:

1. Apply start-of-turn effects.
2. Draw a card if the approved draw rule says to.
3. Take the allowed movement and card actions in the approved order.
4. Resolve any required d6 checks.
5. Apply effects and update board/evidence/capture state.
6. Check escape and capture terminal conditions.
7. Pass the turn.

The number of actions, whether a player can move and play a card in one turn, reaction windows, and draw timing remain unresolved.

### Dice check

For the first prototype only, test `d6 + modifier >= target number`. Use target number 4 for a routine check and 6 for a difficult check during early playtests. These values are provisional tuning handles, not canonical rules. No automatic critical success/failure on a natural 6/1 is recommended in the first pass; revisit only if playtests show a need.

A rules definition must name: who rolls; what triggers the roll; the target number; allowed modifiers; whether a card is spent before or after the roll; what happens on success/failure; and whether the action/resource is consumed on failure. If a card adds a modifier, it must specify its timing and whether it stacks with other modifiers.

### Escape versus capture

A candidate asymmetric objective:

- **Guilty side:** locate/secure any required evidence, then reach a designated exit and satisfy the escape condition.
- **Violet side:** prevent escape by capturing all eligible Guilty units or meeting another explicitly approved capture objective.
- **Unresolved:** evidence count/handling, whether every Guilty must escape or one is enough, capture distance/roll, captured-unit status, rescue, and simultaneous escape/capture precedence.
- Do not add a generic HP track unless the source inventory or playtest shows it is needed. Escape versus capture can be the primary terminal system by itself.

### Minimum vertical-slice acceptance criteria

A first browser prototype is ready for review when a tester can:

- start a match on a small connected-room map;
- move only along legal room connections;
- play at least one approved card with clear cost, timing, and target;
- resolve a d6 check against a visible target number;
- see a logged roll, modifier, and outcome;
- test an escape and a capture path to a terminal result;
- restart without leftover state;
- replay fixed-roll test cases deterministically.

Until Violet's Revenge-specific card sources are identified or the lead approves original demo cards, use clearly labeled placeholder cards for mechanics tests rather than importing Veiled Dominion's deck.

