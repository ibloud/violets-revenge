# Violet's Revenge — Historical Development and Adaptation Roadmap

**Status:** working roadmap for review  
**Applies to:** the Violet's Revenge browser prototype, lore/ink presentation, tactical demo direction, and possible future arcade adaptation  
**Scope boundary:** Violet's Revenge remains distinct from Veiled Dominion. Shared time-dimensional lore does not authorize shared decks, rules, or implementation.  
**Production boundary:** this roadmap is being added to the isolated `phase/violets-revenge-card-demo-scope` draft branch. It does not merge or deploy the prototype.

## Purpose

Preserve the current prototype as a historical development milestone, connect future iterations to the series arc and ink/lore material, and plan an arcade adaptation without losing Violet's defining investigative ethic.

The project has several compatible presentation modes, but they should not be collapsed into one control scheme:

1. **Historical action prototype:** the existing real-time browser horror game.
2. **Lore/ink presentation:** story passages, case-file material, character motives, and series-arc context.
3. **Tactical strategy demo:** a proposed slower, turn-based or turn-resolved experience that makes choices, evidence, and consequences easy to read.
4. **Future arcade adaptation:** a possible faster, score/challenge-oriented version derived from the action prototype, only after the core loop and accessibility/readability have been evaluated.

These are development lanes and possible adaptations, not claims that all are already implemented or approved as canon.

## Historical milestone: current browser prototype

The existing `index.html` Canvas prototype is an important historical artifact. It should be preserved and described as the real-time action-horror starting point, not rewritten out of the record merely because a tactical demo is being explored.

The current prototype includes these established code-level elements:

- Real-time movement using keyboard controls.
- A compact, top-down, tiled precinct/morgue environment with named areas such as the Forensics Office, Records & Lockers, Morgue/Freezers, Autopsy Room, Incinerator, Evidence Storage, and Exit Vestibule.
- Case files as visible objectives.
- An incinerator interaction that unlocks the exit after the required case files are collected.
- Violet as an active pursuer with searching/hunting/chase behavior.
- Nightingale wall sigils, a visible trigger radius, singing cue, and a hunt response.
- A health display, trap status, escape/capture overlays, restart flow, and optional community/event links.

The franchise roadmap also defines Grave Dirt Sachet as a doorway slow effect and the autopsy table as the capture destination. Those remain roadmap anchors; the current prototype still needs the Sachet slow field, room-specific movement/collision, interaction feedback, and capture-to-autopsy sequence implemented or validated as separate work items.

**Historical record rule:** preserve the prototype and its known behavior as a dated milestone. Label proposed, incomplete, or untested behavior accurately. The current repository source has not been represented here as having passed a new browser QA run.

## Narrative and character foundation

### Violet's defining rule

Violet is a forensic investigator and hunter of the Guilty. She acts only once guilt is procedurally confirmed, never on suspicion alone. Evidentiary rigor is both her method and her armor.

Her central weakness is structural rather than a detachable hidden trauma: her empathy helps her read victims and culprits, but can pull her away from the strict procedure she believes protects her judgment. She sees herself as having no personal blind spot because she applies evidentiary scrutiny to everyone, including herself. The blind spot is that she has not audited her own certainty with the same rigor.

This is a character-sheet premise supplied for the working roadmap. Preserve it as a source note and do not turn it into a new game rule without design review.

### Season 2 pressure point

The proposed Season 2 "slip" is Violet hearing her guardian's ritual closing phrase used outside its ritual context for the first time. The impact is not simply discovering that a loved one has a flaw; it contradicts Violet's belief that she can detect every relevant variable except that she has never examined herself as one.

The guardian's sweets tell is visible, acknowledged, and low-stakes. Violet's tell—empathy overriding procedure—is largely invisible to her and surfaces under pressure. The Clerk's resentful description of Violet as a "gifted empath" can function as a competing character interpretation, not an objective system notification.

### Story themes to express through play

- Evidence is different from suspicion.
- Empathy can illuminate evidence and also bias interpretation.
- Power and judgment require accountability.
- A procedural failure should be legible after the fact without making Violet omniscient.
- Players should be able to distinguish what was known, what was inferred, and what remained hidden.

The demo should not force a Season 2 reveal into an early-game scene. It can foreshadow the underlying tension through optional case notes, dialogue, or a post-encounter reflection while protecting the chronology of the series arc.

## Ink/lore presentation and gameplay relationship

The ink version should be the optional narrative layer for audiences who prefer reading, character interpretation, and clues. It should deepen the game, not interrupt every action with exposition.

Recommended structure:

- **Case file:** a short, readable piece of in-world evidence or testimony.
- **Evidence status:** clearly label observed fact, witness claim, inference, contradiction, and unresolved question.
- **Player decision:** choose which room to inspect, which lead to follow, or whether the available evidence is sufficient to act.
- **Resolution:** show the consequence and explain which evidence supported it; do not imply that a suspicion alone confirms guilt.
- **Lore note:** offer an optional passage about character motive or series-arc relevance.
- **Archive:** let lore-focused players revisit unlocked documents outside the active encounter.

Do not expose Violet's hidden knowledge or future Season 2 information prematurely. Keep optional lore skippable, readable on small screens, and separate from urgent action cues.

## Tactical demo direction

A turn-based or turn-resolved tactical mode is a proposed companion to the current real-time prototype. Its purpose is to make strategic logic and cause-and-effect visible to players who prefer to think through a move rather than track rapid animation.

Candidate turn rhythm:

1. **Observe:** inspect rooms, known evidence, routes, threats, and previously revealed intentions.
2. **Choose:** move, investigate, use a tool/card, process evidence, or attempt an objective.
3. **Resolve:** show the applicable check, modifier, target number, result, and consequence where a check is part of the approved rules.
4. **Violet responds:** communicate her action and its cause with clear animation, sound, and event-log feedback.
5. **Review:** let players inspect what changed and what remains uncertain.

Turn order, action economy, dice formula, card timing, capture, and terminal rules remain subject to the mechanics plan and project-lead approval. Do not treat the separate Veiled Dominion deck or rules as a substitute.

## Future adaptation: arcade version

A future arcade version should be treated as a **separate adaptation target**, not as a replacement for the lore-rich or tactical experience. It can preserve the immediacy of the current real-time prototype while making objectives and threat states readable at arcade pace.

Potential arcade pillars, subject to validation:

- Short, repeatable runs with a clear objective: locate case files, process/destroy evidence at the incinerator if that objective remains approved, and reach the exit before Violet captures the player.
- Readable threat telegraphs: clear Nightingale sigils and trigger feedback; consistent signals for Violet searching, hunting, and chasing.
- Fast restart and minimal downtime between runs.
- Score or grade based on defensible play criteria such as time, evidence collected, trap awareness, and successful escape—not on treating unconfirmed suspicion as guilt.
- Optional difficulty modifiers that change pressure, visibility, or resource scarcity without obscuring basic cause-and-effect.
- Controller-friendly movement and interaction, configurable controls, pause, audio/visual cue options, and accessibility testing.
- Short post-run summaries that explain which signals the player missed and which decisions affected the outcome.
- Optional lore unlocks or ink passages between runs, so arcade players can engage with the series arc at their own pace.

Avoid adding score bonuses for arbitrary violence or framing a fast reaction as proof of sound judgment. If an arcade mode depicts Violet acting as investigator/judge, the fiction and mechanics should preserve the distinction between suspicion and procedural confirmation. If the arcade mode remains an Assailant escape experience, its score should reward navigation, evidence objectives, and risk management instead.

### Arcade adaptation gates

1. **Baseline gate:** document and test the existing real-time loop and the known missing mechanics.
2. **Readability gate:** test whether new players can identify objectives, Violet's state, Nightingale triggers, and escape requirements without relying on color alone.
3. **Arcade prototype gate:** build a separate branch or mode with fast restart, short-session pacing, controller support, and a small set of measured score criteria.
4. **Playtest gate:** gather evidence on comprehension, fairness, replayability, and accessibility; do not infer success from visual polish alone.
5. **Lore gate:** review every unlockable passage against the series chronology and character sheets.
6. **Release gate:** only after explicit review should the arcade adaptation be integrated into a broader release plan. Do not merge or deploy production changes through this documentation task.

## Phased roadmap

| Phase | Deliverable | Main question | Exit criterion |
|---|---|---|---|
| A. Historical baseline | Preserve and describe the current Canvas action prototype | What already exists, and what is incomplete? | Features and known gaps are recorded without overstating testing |
| B. Lore alignment | Series-arc and character-sheet map, including Violet, the Guardian, and the Clerk | What is canon, what is foreshadowing, and what is still unresolved? | Each lore beat has a source and chronology label |
| C. Tactical slice | Small, readable room-to-room encounter with evidence decisions | Can players understand strategy and consequences? | A representative turn can be completed and explained |
| D. Ink integration | Optional case files and narrative passages linked to evidence | Does lore enrich play without blocking it? | Players can skip, revisit, and understand each passage |
| E. Arcade proof of concept | Separate short-run real-time mode | Can action be fast and still readable/fair? | Playtests validate objective comprehension, restart flow, and controls |
| F. Adaptation review | Compare action, tactical, and ink modes | Which audiences and platforms does each serve? | Project lead approves scope before further integration |

## Source and status labels

Use these labels in future implementation and documentation:

- **Source-confirmed:** explicitly present in a cited source document or current code.
- **Project-lead direction:** explicitly requested or approved by the project lead.
- **Proposal:** a design option for review, not canon.
- **Unresolved:** needs a source, decision, or test.
- **Implemented, unverified:** code exists but has not been validated in a fresh test pass.
- **Tested:** only use when a repeatable test or playtest result is recorded.

## Boundaries and open questions

- This roadmap does not establish the complete series arc; the current Google Drive source documents still need to be supplied or directly reviewed before chronology is finalized.
- The character sheet is a working document and should remain labeled as such.
- The tactical board/card demo and the real-time arcade adaptation may share setting, evidence vocabulary, and lore, but should not be forced to share movement or action timing.
- Veiled Dominion is a distinct game. Its deck, chess-piece mechanics, phases, and resource rules must not be imported into Violet's Revenge by assumption.
- Preserve the existing prototype as a historical milestone and keep new work isolated until approved.
