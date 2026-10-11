# Violet's Revenge card demo — mechanics completion plan

**Status:** design proposal updated with project-lead preferences on 2026-10-11; not an adopted ruleset  
**Applies to:** Violet's Revenge card-game / bot / browser demo only  
**Selected direction:** board-and-card duel, dice-based combat, survival terminal condition  
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

Choose one before coding:

**Selected: board-and-card duel.** This is the project lead's design preference for the demo, not a claim that a board-and-card duel is already established in the franchise canon. Before implementation, specify the board's shape and coordinates, which units occupy it, each unit's movement, whether units block or capture one another, and how cards alter legal actions. Do not import Veiled Dominion's chess pieces, three phases, or card rules merely because that database references a board.

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

Write a transition table before coding. For a card-only mode, a candidate sequence is:

1. Start turn.
2. Apply start-of-turn effects.
3. Draw according to the approved draw rule.
4. Take the permitted action(s).
5. Resolve any response or reaction.
6. Apply damage, recovery, and end-of-effect timing.
7. Check the approved terminal condition.
8. Pass turn.

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

**Provisional design recommendation, not approved canon:** begin playtests with one six-sided die (d6) and a transparent formula such as `d6 + applicable modifier vs. a published target number`. Avoid simultaneous opposed rolls until the first version works; they add tie and sequencing cases. Keep the die result injectable in tests so the same scenario can be replayed. Do not set final modifiers, target numbers, damage, or costs until the source inventory and balance pass support them.

### 5. Define resource and card lifecycle

Specify starting resources, legal costs, resource gain timing, whether costs can be refunded, card draw timing, maximum hand size, discard destination, and what happens when the draw pile is empty. No card effect should rely on undefined phrases such as “on success,” “next,” “permanent,” or “free” without a timing definition.

### 6. Define survival as the terminal condition

**Selected: survival.** The engine needs a clear survival state for each side and a precise rule for when that state reaches its failure threshold. The design record must still resolve what is being survived (for example, a shared match survival track, each player's vitality, or a survival objective), how damage and recovery alter it, whether a player can be rescued, and what happens if both sides fail on the same resolution.

**Provisional design recommendation, not approved canon:** represent each player's survival as an explicit numeric track; the match ends when a player's track reaches its defined failure threshold. Choose the starting value and damage scale only after card effects and dice math are inventoried. The engine must emit a terminal result that tests can verify. Until the survival definition is approved and tested, do not claim an official win, award a Roomy reward, or infer a win merely because a hand is empty.

## Required mechanics decision record

Before implementation, mark each item as **source-confirmed**, **lead-approved proposal**, or **unresolved**:

- [ ] Canonical Violet's Revenge card list and exact text
- [x] Board-and-card duel selected as design direction (board topology and movement unresolved)
- [ ] Player count and turn order
- [ ] Starting hand, draw, discard, and reshuffle rules
- [ ] Starting RP and all RP costs/gains
- [ ] Legal actions per turn
- [ ] Attack, block, damage, tie, and reaction rules
- [ ] Card effect timing, stacking, duration, and target legality
- [ ] Any board, piece types, movement, capture, and hidden-information rules
- [ ] Survival track, failure threshold, simultaneous failure, surrender, and restart behavior
- [x] Dice-based combat selected as design direction; die type, formula, modifiers, ties, and reproducible tests unresolved
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

- **Board-and-card duel** — selected; board layout, units, and movement are still to be designed or recovered from Violet's Revenge-specific sources.
- **Dice-based combat** — selected; exact die, target/contest formula, modifiers, tie rules, and damage remain unresolved.
- **Survival terminal condition** — selected; what survival measures, starting value, failure threshold, and simultaneous-failure rule remain unresolved.

These are design preferences, not proof of original canon. They supersede the generic card-only/deterministic options above. Veiled Dominion remains a separate game and is not a source of default rules for this demo.

## Source inventory finding

The current repository's franchise roadmap and README describe Violet's Revenge as an asymmetrical horror experience: Violet hunts the Guilty, while the Guilty search for case files, process evidence, and seek escape. Those sources provide thematic and objective references, but the files inspected so far do not establish a canonical Violet's Revenge tabletop board, card list, die formula, or survival-track rules. The legacy `violet_bot.py` names Veiled Dominion in its game setup and must not be treated as the canonical card-duel engine.

Therefore, this card-table experience should be documented as a **Violet's Revenge card-game demo/prototype** whose mechanics are proposed and testable, not presented as existing franchise canon unless further source material confirms them.

## Next mechanics draft — board, dice, survival

The next specification should define these in order:

1. **Board contract:** grid dimensions or other topology; coordinates; spawn/setup; unit identities and roles; movement distance; blocked squares; occupancy; capture/removal; and any escape/goal spaces. Start with the smallest board that supports meaningful choices, but do not select final dimensions until a source review or playtest rationale is recorded.
2. **Turn/action contract:** player order; number of movement and card actions per turn; when cards can be played; legal targets; response windows; and whether playing a card consumes an action or resource.
3. **Dice contract:** one explicit die procedure, target or opposed-roll formula, modifiers, ties, rerolls, and exactly when damage/effects are applied. Use an injectable deterministic roll source in tests.
4. **Survival contract:** define the track(s), starting value, failure threshold, damage, healing, prevention, rescue, and simultaneous failure. A survival track reaching its threshold must create a single authoritative terminal result.
5. **Card contract:** every card has a unique ID, original text/source, legal target, timing, action/resource cost, effect type, duration, and test cases. Until Violet's Revenge-specific cards are found or approved, do not fill the demo with Veiled Dominion cards.
6. **Prototype acceptance:** a complete sample match can start, accept only legal movement/card actions, resolve fixed and random dice rolls, update survival, reach a tested terminal state, and restart cleanly. The bot and browser must use the same rules engine.

