# Roomy coordination and Discord retirement

**Decision:** October 4, 2026, America/Chicago; approved by Dominique, Loptr Lab project lead.

## Active direction

Roomy is the community coordination center. Discord development and the Discord bridge are discontinued. No Discord login is required for the browser prototype, contributions, or community onboarding.

- Space: https://roomy.space/did:plc:f62tthd7cmjpfvtlet2crpsq
- Community invite: https://roomy.space/join?space=did%3Aplc%3Af62tthd7cmjpfvtlet2crpsq&invite=631116db109c5a7f4c38f03edd57269d
- GitHub is authoritative for scope, decisions, accepted work, rules, and bug reports.
- The space was created invite-only with admin-controlled invitation creation. The end-screen invite is intentionally shareable; invite-only is not a confidentiality guarantee.

## Channel map

| Channel | Purpose |
| --- | --- |
| welcome-and-rules | Orientation, participation boundaries, repository and prototype links |
| lobby | Introductions and general community conversation |
| pixie-lab | Accessibility, stewardship prototypes, methods, and feedback |
| violet-and-story-worlds | Content-labelled creative discussion; bibles remain canon authority |
| games-and-playtesting | Browser links, opt-in scheduling, structured feedback |
| development | Ready issues, sprint scope, blockers, GitHub bug reports and decisions |

Provide text-first instructions and asynchronous participation. Do not require camera use, medical disclosure, or unsolicited character interaction. Sensitive discussion needs content warnings; recording requires advance consent from every participant. Adults-only working/private/voice participation remains the default until an under-18 safeguarding program exists.

## Access and privacy

Joining the community does not grant Playtester, contributor authority, employment, compensation, ownership, mentorship, or academic credit. Discord roles and account-age gates do not transfer to Roomy. Human-approved playtest participation remains separate. Do not collect real intake data until access restrictions, a private reporting route, retention/deletion procedures, and reviewers are verified. Shared channels must contain no private intake, health, accommodation, payment, or moderation records.

## Bot reuse — proposed, not implemented

| Source | Reuse destination | Boundary |
| --- | --- | --- |
| violet_bot.py | Opt-in browser Violet panel | Extract response/state logic; replace Discord transport; preserve stop controls |
| js-bot/threshold-gate.js and intake-modal.js | Browser intake with human review | Replace Discord role and identifier assumptions; no automatic high-stakes decisions |
| ibloud/sewers-and-shadows-bot | Creator OS game windows | Reuse separate rules/move-selection layers; add browser session controls and persistence |
| Persona narration | Optional game narration | Clearly automated, opt-in, rights-cleared, separate from PIXIE and human oversight |

No Roomy bot integration, browser adapter, or migrated game-session history is claimed. The separate Sewers & Shadows repository has not been changed by this transition. Existing third-party-reference rights restrictions remain in force.

## Retirement verification

Discord source and offline tests remain for provenance. The Python bot no longer starts a Discord connection, the Node entry point exits before loading credentials or registering commands, and the legacy `/win-invite` route returns HTTP 410 with the Roomy invite without calling Discord. Do not deploy, expand, or request Discord credentials for new work. The game end screen links directly to Roomy without a Discord invite API or browser-side API secret.

Live server deletion, hosted bot shutdown, credential revocation, billing cleanup, and old-invite revocation are **unverified**. When deployment access becomes available: identify each service, stop Discord-only processes and invite endpoints, disable auto-redeploy, revoke obsolete credentials/invites, check billing, and record evidence without exposing secrets. Preserve game source, attribution, and necessary records. Do not delete the server or historical data as part of this documentation change.

## Completion evidence

All six channels in the map are created, with orientation messages published. `welcome-and-rules` is read-only for members; the other discussion channels allow member participation. The generated invitation resolves to Loptr Lab for the existing owner; fresh-account onboarding has not been tested.

The live GitHub Pages HTML was fetched and verified to contain the actual Roomy invitation and no legacy dynamic Discord invite loader. Local end-state checks passed for both win and lose screens, including restart and safe external-link attributes. The retired endpoint returns 410 with and without legacy credentials and makes no Discord request.

Railway retirement commands and restart policy NEVER were configured for both `violets-revenge` and `sewers-and-shadows-bot`. A watch pattern matching no project files prevents ordinary source changes from triggering deployment. Services and variables are preserved. Running replica shutdown must be verified separately; token revocation and account-wide billing cleanup remain unverified.
