# Next demo phase: original card-table port and Roomy handoff

**Status:** implementation gate / source audit  
**Scope:** Violet's original card-game path from the retired Discord bot, with Roomy as the community destination. This document does not authorize a replacement game, a new ruleset, or a Roomy bot/API integration.

## Current verified state

- `index.html` is the current runnable static browser prototype: a Canvas-based Morgue game. It is not yet a browser port of the card-table state machine in `violet_bot.py`.
- The retired Python module describes its game as **Veiled Dominion**. Its implemented state is limited: each side starts with four named cards; both RP pools start at 10; the opponent plays a card, then Violet responds by selecting a Spades or Diamonds card when available and dealing 1 RP damage to the opponent. It has turn labels, a slab field, and a log string.
- The legacy bot does **not** implement the complete card rules, a complete Violet turn, RP loss for Violet, draw/discard effects, or an explicit terminal win/loss rule. The separate `CARD-TEXT-DATABASE.md` describes a broader 52-card system with board/phase mechanics; those mechanics must not be silently assumed to be implemented by the legacy bot.
- Roomy is already linked in the current browser game's win-state content through `ROOMY_INVITE_URL`. The invite is static/reusable, not server-verified proof of a win. The loss state should not expose the invitation.
- Discord runtime retirement is already in place: the Python entry point exits without connecting, the Node entry point exits before loading credentials or registering commands, the old `/win-invite` endpoint returns HTTP 410, and the two identified Railway services were reported stopped with zero replicas.
- Remaining retirement items documented in `docs/ROOMY-TRANSITION.md` are unverified: revoke/rotate Discord credentials, revoke old Discord invites, decide whether to delete the old Discord server/history, and verify account-wide billing cleanup. Do not delete historical records or retained source as a side effect of the browser migration.

## Confirmed boundaries

1. Preserve Violet's original card-game direction and its provenance; do not replace it with Float Chess, Pennywise, another game's mechanics, or an unrelated demo.
2. Keep the current Canvas prototype intact while the card-table demo is developed as a separate browser route until the lead approves replacing or combining them.
3. Use the current static stack (HTML, CSS, vanilla JavaScript); no new framework, database, backend, Discord dependency, or Roomy API is required for the first playable demo.
4. Roomy is the community destination, not gameplay state or an authorization backend. The intended reward is shown on the demo's actual win screen only; loss/retry does not show it. Because the invite is embedded in a static client, describe this as a gameplay reward, not secure win verification.
5. Any future Roomy automation would need a separate reviewed integration and opt-in controls. Do not create a bot or scrape/import Roomy discussions as part of this phase.

## Rules gate before gameplay implementation

The browser card table must not invent the missing rules. Before treating it as a faithful playable game, the lead must confirm:

- Which rules authority is canonical: the minimal behavior in `violet_bot.py`, or the broader 52-card rules in `CARD-TEXT-DATABASE.md` (including chess/phase mechanics).
- Whether the player controls the opponent side against Violet, and how Violet's RP/health changes.
- What card effects actually resolve in this phase, including response/defense timing and draw/discard behavior.
- Exact end conditions and tie/no-cards behavior.
- Whether the Roomy reward is tied to the demo's locally simulated win or should remain a non-claiming community link until a stronger verification mechanism exists.

Until those questions are resolved, the first code milestone can safely extract transport-independent state logic and tests, but must not claim full rules fidelity.

## Implementation sequence

1. **Retirement audit:** keep the old bots non-runnable; inventory remaining Discord strings, deployment manifests, secrets references, and legacy invite routes. Separate retained source/history from dependencies needed by the active prototype.
2. **Transport-independent game model:** extract the minimal legacy card state and legal turn transitions into a pure module with deterministic tests. No Discord imports, channel names, usernames, embeds, or network calls in the model.
3. **Separate browser card-table route:** port only confirmed rules into vanilla JavaScript; provide visible hands, whose turn it is, RP pools, current slab, action log, restart, keyboard/screen-reader labels, and mobile layout.
4. **Roomy win-state handoff:** reuse the approved Roomy destination on the card demo's confirmed win state only. Loss/retry never exposes it. Include an explanatory label and safe external-link attributes. Do not put the invite in logs or send user data to Roomy.
5. **Validation:** run Python and Node offline tests; add browser checks for legal/illegal moves, turn transitions, RP changes, empty hands, restart, win/loss states, and Roomy gating; verify no Discord connection or invite API remains in the active demo path.
6. **Preview then review:** deploy the isolated branch to Vercel, inspect the actual preview, and merge only after acceptance checks pass.

## Acceptance criteria

- Existing `index.html` remains functional and unchanged by the first card-table PR.
- The new card-table route uses no Discord SDK, token, endpoint, or backend.
- State transitions are deterministic and covered by tests; unknown rules are visibly marked as prototype limitations rather than silently invented.
- Roomy is a plain external destination, not an implied account integration. Only a win state displays the invitation; a loss/retry state does not.
- README and transition docs distinguish completed shutdown from unverified credential, invite, server, and billing cleanup.
