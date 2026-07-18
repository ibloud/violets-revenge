# Tech Stack

## Current Prototype

- Single-file HTML5 Canvas + vanilla JavaScript (`index.html`).
- No build pipeline required.

## Production Target

- **Engine:** Unreal Engine 5, per the Phase 1 roadmap in the README. (Unity was listed as an alternative — confirm which one this section should commit to once Phase 1 tooling is finalized.)
- **Networking:** Dedicated servers for 1v4 online multiplayer (Phase 2 scope). Specific netcode/backend provider TBD.
- **Language:** Blueprint-first for iteration speed during prototyping, migrating core and network-sensitive systems to C++ before release — see `docs/ARCHITECTURE.md`.
- **Bot/tooling infrastructure:** Python (Discord bot, currently deployed on Railway).

## Open Questions

This section is a draft based on the roadmap in the README — the following still need a project-lead decision and should be filled in here once confirmed:

- Final engine commitment (Unreal Engine 5 vs. Unity)
- Backend/server hosting provider for Phase 2 dedicated servers
- Networking library/framework (e.g. Unreal's built-in replication vs. a third-party solution)
- Build/CI pipeline once the project moves past the single-file prototype stage
