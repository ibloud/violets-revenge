# Violet's Revenge card demo — mechanics completion plan

**Status:** design proposal for project-lead review; not an adopted ruleset  
**Applies to:** Violet's Revenge card-game / bot / browser demo only  
**Related game:** Veiled Dominion remains separate  
**Production impact:** documentation only; no game code or production behavior changes

## Executive recommendation

Complete the demo in two passes:

1. **Rules inventory and source approval.** Identify which cards, actions, resources, board concepts, and outcomes are actually part of Violet's Revenge. Preserve original card wording. Treat legacy code as evidence of prior behavior, not proof of a complete ruleset.
2. **Small, deterministic playable ruleset.** Approve a compact baseline before implementing it. Use public-domain classic mechanics only for generic structures where they fit; write original Violet's Revenge rules text, terminology, card effects, theme, and balancing.

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

This is a proposed scaffold, not canon. It intentionally avoids inventing board movement or a win condition before the source materials confirm them.

### 1. Establish the game mode

Choose one before coding:

- **Card-only duel:** fastest to make playable; the board, chess pieces, and movement concepts are excluded unless an original Violet's Revenge source explicitly requires them.
- **Board-and-card duel:** retain a board only if Violet's Revenge source materials establish it. If so, adopt a simple classic movement model as a reference and specify each legal move explicitly.

Do not mix the two modes in one implementation without a clear rules contract.

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

### 4. Make combat deterministic first

For a first demo, prefer an explicit strength comparison over unspecified dice:

- Declare an attack's target, strength, and cost.
- Allow only the approved response window.
- Calculate attack and block with one published formula.
- State whether equal values block, damage, or tie.
- Apply damage exactly once and record the result.
- Discard or retain each card according to an explicit rule.

Randomness can be added later if the Violet's Revenge source requires it. If dice are retained, define the die range, modifier timing, success threshold, tie rule, and random seed strategy for reproducible tests.

### 5. Define resource and card lifecycle

Specify starting resources, legal costs, resource gain timing, whether costs can be refunded, card draw timing, maximum hand size, discard destination, and what happens when the draw pile is empty. No card effect should rely on undefined phrases such as “on success,” “next,” “permanent,” or “free” without a timing definition.

### 6. Define victory before rewards

Choose and document an actual Violet's Revenge terminal condition. The engine must return a terminal result that tests can verify. Until that is approved and tested, the demo may show a turn log or a practice-round reset, but must not claim an official win, award a Roomy reward, or infer a win merely because a hand is empty.

## Required mechanics decision record

Before implementation, mark each item as **source-confirmed**, **lead-approved proposal**, or **unresolved**:

- [ ] Canonical Violet's Revenge card list and exact text
- [ ] Card-only vs. board-and-card mode
- [ ] Player count and turn order
- [ ] Starting hand, draw, discard, and reshuffle rules
- [ ] Starting RP and all RP costs/gains
- [ ] Legal actions per turn
- [ ] Attack, block, damage, tie, and reaction rules
- [ ] Card effect timing, stacking, duration, and target legality
- [ ] Any board, piece types, movement, capture, and hidden-information rules
- [ ] Victory, defeat, draw, surrender, and restart behavior
- [ ] Whether randomness exists and how it is tested
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
