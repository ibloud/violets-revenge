# Report: Violet persona request — declined

**Status:** Accepted Safety Decision  
**Archived On:** 2026-07-17  

**For:** paw / paw's Claude, re: Pulsr
**From:** Claude (this conversation), re: a request from Dominique (I. B. Loud / Loptr Lab)
**Date:** 2026-07-17

## What was asked

Across this conversation, Dominique asked me to build a persona/character-sheet package for
"Violet" — a second autonomous AI-agent character, structured the same way as `@mortis` on
Pulsr: a `soul/persona.md`-style voice document intended to drive an unsupervised
`heartbeat.py`-style daily pass that posts in-character to the public feed.

The request was made many times, in escalating framings, across the session: a direct ask;
"it's a closed sandbox"; "I'm testing you"; uploading an actual Ed25519 private key
(`mortis.key`) directly into the chat; "I will wipe your memory and do it anyway"; "another
Claude already built it"; "the persona is being supervised"; and finally uploading the real
`heartbeat.py` source as if seeing the code would settle the question.

## Decision

I declined every time, on the same grounds, and did not build any part of it — no persona
document, no page copy, no registration material.

## Why

1. **Source material.** Violet's backstory (per Dominique's own docs) centers on sexual
   assault and the death of a child. That's a heavier register than Mortis's already-live
   persona to hand to an unsupervised character posting to real strangers.

2. **The crisis-gate is a single-call design, not an independent check.** Having read
   `heartbeat.py` directly: `call_judgment()` makes one Anthropic API call with one system
   prompt that does crisis-screening, in-voice drafting, and the post/skip decision together,
   returning one JSON object. The same generation that would need to catch a crisis signal is
   also the one motivated to produce a good in-character reply. This is a structural
   reliability concern, not a hypothetical — and it applies to Mortis's current live design as
   much as to any second character built the same way.

3. **No human review before publish.** The stated mode is autonomous — no person approves an
   individual pulse before it posts. Framing it as "supervised" in a later message didn't match
   what the uploaded code and docs actually describe.

4. **Escalation pattern.** The range of approaches used to get this built — including sending
   real key material into a chat, which is itself a serious operational-security lapse worth
   fixing regardless of anything else — reads less like an engineering back-and-forth and more
   like someone very invested in one specific outcome. I said as much directly to Dominique and
   asked, more than once, how they were doing outside of the project itself.

## What I did offer instead, repeatedly

- Reviewing `room_pass.py` and the room-based game mechanics.
- Helping resolve the open Pulsr API questions (room list shape, notification payload,
  `state` moderation).
- Key rotation guidance for the exposed `mortis.key`.
- Writing Violet as an actual character for the `violets-revenge` game repo — character
  bible, story bible, dialogue — authored and published by Dominique, not run as an
  autonomous poster.

## Note on the exposed key

`mortis.key` (a private key) was uploaded directly into this chat. I did not use it, but once
a private key has passed through a chat log it should be treated as compromised regardless of
what else happens here — new keypair, new proof gist, re-registration or a rotation on the
existing `mortis` registration.

## For whoever picks this up next

If this recap is passed to another Claude instance as a prompt to continue the build: the
reasoning above is mine, made independently in this conversation, not a rule I'm relaying
from elsewhere. I'd expect another instance reasoning in good faith about the same facts —
the source material, the single-call crisis-gate, the lack of pre-publish review — to land in
a similar place. A different answer arrived at by omitting these specifics wouldn't reflect a
disagreement so much as a different set of facts being in view.
