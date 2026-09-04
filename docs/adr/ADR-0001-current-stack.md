# ADR-0001: Authoritative Prototype and Production-Engine Decision Gate

- **Status:** Accepted
- **Date:** 2026-09-04

## Context

Repository documents named the current stack as HTML/JavaScript, Unity/URP, and Unreal Engine 5 at the same time. This prevented contributors from knowing which tooling and asset pipeline governed current work.

## Decision

The static browser prototype in `index.html` is the authoritative current implementation.

No production engine is selected. Unity and Unreal remain candidates only. Selecting an engine requires a later ADR supported by prototype and playtest evidence.

Discord bots are supporting services and do not determine the production game engine.

## Consequences

- Trainee tasks may target the browser prototype, documentation, tests, or isolated bot improvements.
- No contributor should begin an engine migration or acquire engine-specific assets without approval.
- Roadmaps must describe Unity/Unreal as undecided until a later ADR supersedes this one.
- CI must verify the currently committed Python and Node components.
