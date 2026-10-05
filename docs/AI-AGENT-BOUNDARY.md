# AI and Automation Boundary Policy

**Status:** Active  
**Last updated:** 2026-10-04

## Purpose

This policy separates bounded opt-in application automation from autonomous public character publishing.

## Allowed with documented controls

- Deterministic responses inside explicitly approved browser tools. Roomy automation requires a separately reviewed integration; none is currently implemented.
- Low-frequency, bounded in-character messages in explicitly configured project channels.
- Moderated intake routing after privacy and human review controls are implemented; community joining alone does not confer eligibility.
- Test or development output that cannot reach public accounts.

Allowed automation must:

- identify itself as automated and distinguish generated guidance from a human decision;
- remain limited to named channels and documented triggers;
- provide rate limits or anti-spam controls;
- avoid exposing secrets or submitted access codes;
- avoid making employment, payment, eligibility, or safety decisions;
- never state or imply that a named human is watching, reviewing, supervising, or available unless that human has accepted the role and current check-in obligation;
- never assign a mentor, adviser, partner, monitor, or care role based only on a response, follow, reaction, invite, or repository visit;
- avoid unsolicited private messages and provide a visible stop or opt-out path;
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
- Training or fine-tuning on private messages, applications, voice, likeness, unpublished work, or accommodation information without separate informed permission and lawful authority.
- Automated applicant rejection based on protected, sensitive, or inferred traits.
- Treating generated character text as canon without documented human approval.

## Current implementation note

Discord development and bridging are discontinued. `violet_bot.py` and `js-bot/` remain legacy source for reference and offline tests. Their handlers are not Roomy integrations. Browser reuse must preserve explicit opt-in, automation disclosure, stop controls, privacy, and human decisions. Both identified Railway Discord services have zero running replicas; remaining credential and billing cleanup is documented in `docs/ROOMY-TRANSITION.md`.

Historical proposals remain archived under `docs/archive/`.
