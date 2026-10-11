# Violet's Revenge card-game demo — project scope and lore boundary

**Status:** project-lead clarification recorded 2026-10-11  
**Primary deliverable:** a Violet's Revenge card deck / bot / browser demo for presentation in ChatGPT  
**Related but distinct:** Veiled Dominion  
**Production status:** this document does not change the production game or merge any code.

## Canonical project distinction

Violet's Revenge is the primary project being developed for the demo: its own card deck, card-game/bot behavior, and browser card-table experience.

Veiled Dominion is related through the project's time-dimensional lore, but it is a distinct game. The relationship is not permission to merge the games, assume they share a deck, rename one as the other, or copy mechanics across them. Shared-universe connections should be represented deliberately in lore documentation, while game identity, card text, rules, and implementation remain separate unless the project lead explicitly approves a shared element.

## Source-of-truth boundaries

- The Violet's Revenge card game must be grounded in the original Violet's Revenge card-game materials, legacy bot behavior, and project-lead decisions that specifically apply to that game.
- `CARD-TEXT-DATABASE.md` explicitly names the Veiled Dominion deck. It must not be treated as the canonical Violet's Revenge card database merely because the projects are lore-related.
- The retired Discord bot source is historical evidence, not automatically a complete or canonical rules engine. Extract its behavior faithfully and label gaps rather than inventing rules.
- The current `index.html` Canvas horror prototype remains a separate existing experience. Build the card-table demo on a separate route until the lead approves a change.
- Roomy is a community destination, not game state or an authorization backend. Do not add a card-game reward or claim a win condition until the Violet's Revenge card-game rules define one.

## Development path

1. Inventory and classify existing source materials by game identity: Violet's Revenge, Veiled Dominion, or shared-universe lore. Do not silently merge ambiguous material.
2. Identify the original Violet's Revenge deck and bot behavior, including card identities/text, setup, turn flow, state, and any explicitly defined outcomes.
3. Record missing rules as questions. Seek approval rather than borrowing Veiled Dominion rules by default.
4. Implement a transport-independent Violet's Revenge game model and deterministic tests for the approved behavior.
5. Build a separate, accessible, responsive vanilla-JavaScript card-table demo around that model.
6. Validate the browser flow, restart, state transitions, and any approved terminal states. Keep the Canvas horror prototype unchanged.
7. Treat Veiled Dominion's card registry/rules audit as a separate workstream unless the lead explicitly requests a cross-game integration.

## Acceptance criteria

- The demo is named and presented as Violet's Revenge.
- Violet's Revenge and Veiled Dominion are not represented as the same game.
- Every card and mechanic in the Violet's Revenge demo has a traceable source or explicit approval.
- Unknown rules are documented rather than guessed.
- Existing production behavior remains unchanged while the demo is reviewed on an isolated branch.
- No Roomy win reward is shown until a Violet's Revenge card-game terminal condition is explicitly defined and tested.
