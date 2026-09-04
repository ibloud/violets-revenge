# AI and Automation Boundary Policy

**Status:** Active  
**Last updated:** 2026-09-04

## Purpose

This policy separates bounded in-server automation from autonomous public character publishing.

## Allowed with documented controls

- Deterministic command responses inside the project Discord.
- Low-frequency, bounded in-character messages in explicitly configured project channels.
- Moderated intake routing and role assignment.
- Test or development output that cannot reach public accounts.

Allowed automation must:

- remain limited to named channels and documented triggers;
- provide rate limits or anti-spam controls;
- avoid exposing secrets or submitted access codes;
- avoid making employment, payment, eligibility, or safety decisions;
- provide a human escalation path;
- follow `docs/DATA-GOVERNANCE.md`.

## Requires human approval before publication

- Posts to public social-media accounts.
- Marketing copy presented as Violet or another character.
- New lore, dialogue, or character claims.
- Announcements about applicants, contributors, compensation, credits, or externship status.

## Prohibited

- Unsupervised autonomous public social posting.
- Impersonation of real people.
- Publishing private intake information.
- Automated applicant rejection based on protected, sensitive, or inferred traits.
- Treating generated character text as canon without documented human approval.

## Current implementation note

`violet_bot.py` contains bounded autonomous Discord responses in named project channels. That behavior is permitted only under the controls above and is not authorization for external social posting.

Historical proposals remain archived under `docs/archive/`.
