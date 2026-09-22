# Discord governance and Agile teaching-case proposal

**Status:** proposed operating design and external-event concept

**Project:** *Violet's Revenge*

**Last reviewed:** September 22, 2026

**Decision authority:** Loptr Lab project lead for internal governance; any external host controls its own event and community

This document translates the repository's contributor, privacy, AI, playtest, and rights controls into a Discord operating model. It also defines a bounded proposal for using *Violet's Revenge* as a real-team Agile teaching case.

It does **not** document an agreement, invitation, endorsement, mentorship, sponsorship, curriculum placement, or partnership with Benjamin Carcich, Building Better Games, ICAgile, or any other third party.

## 1. Evidence and limits

### Verified internal controls

The repository currently provides:

- conduct, confidential reporting, non-retaliation, and enforcement rules in [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md);
- contribution scope, issue-first work, review, credit, and canon gates in [`CONTRIBUTING.md`](../CONTRIBUTING.md);
- Discord and playtest rules, content warnings, recording consent, and feedback routing in [`PLAYTEST-GUIDELINES.md`](PLAYTEST-GUIDELINES.md);
- data minimization, restricted access, retention prerequisites, human decisions, logging limits, and incident response in [`DATA-GOVERNANCE.md`](DATA-GOVERNANCE.md);
- bounded bot behavior and human approval requirements in [`AI-AGENT-BOUNDARY.md`](AI-AGENT-BOUNDARY.md); and
- trainee stop conditions in [`TRAINEE-ONBOARDING.md`](TRAINEE-ONBOARDING.md).

### Publicly verified external context

- On September 22, 2026, the public invitation at <https://discord.com/invite/nRWkh6QJa> identified the destination as **Building Better Games**. Displayed membership counts are dynamic and do not verify moderation quality, safeguarding, availability, or endorsement.
- Building Better Games publicly describes its Discord as a place for game-development leaders and producers to discuss, question, and improve how they solve production and leadership problems: <https://www.linkedin.com/posts/benjamin-carcich_join-the-building-better-games-discord-server-activity-7183916657877078016-RT6Q>.
- Its public Agile Fundamentals page lists a remote, live, hands-on course for October 19–22, 2026, 9:00 a.m.–1:00 p.m. Mountain Time, taught by Benjamin Carcich. The page says participants practice estimation, retrospectives, collaboration, prioritization, and planning with a real team: <https://www.buildingbettergames.gg/agilefundamentals>.

### Unverified external safeguards

The public invite and course pages do not expose Building Better Games' current server rules, moderator roles, age policy, reporting route, retention policy, incident process, or private-channel controls. Do not claim that its internal safeguards are stronger, weaker, or equivalent until an authorized member or moderator provides current evidence.

An informal community conversation, repository visit, or offer to inspect work is not approval to use this project in the course and does not assign the other person a mentor, monitor, reviewer, presenter, introducer, or technical role.

## 2. Discord operating model

GitHub remains the source of truth. Discord may coordinate people, but it must not become the only record of scope, decisions, contributions, approvals, or incidents.

### Required entry points

| Channel or function | Minimum content | Control served |
| --- | --- | --- |
| `#start-here` | Purpose, current phase, links to rules, project ownership, relationship boundary, and exit route | Informed participation |
| `#roles-and-decisions` | Current owner, producer, moderators, reviewers, facilitators, contributors, observers, and bots; authority of each role | No assumed authority |
| `#safety-and-reporting` | Named primary and backup responder, at least one private route outside Discord DMs, acknowledgment target, confidentiality limits, and emergency limitations | Reachable human escalation |
| `#good-first-issues` | Links to ready GitHub issues only | No invisible or duplicative labor |
| `#current-sprint` | Sprint goal, linked issues, owners, review status, and blockers | Observable Agile work |
| `#playtest-signups` | Build, schedule, content warning, age/access rules, consent choices, and capacity | Informed playtesting |
| `#playtest-feedback` | Structured prompts and GitHub triage route | Actionable evidence |
| `#decision-log` | Decision, authority, evidence, dissent, date, and revisit condition | Traceable governance |
| `#bot-and-ai-policy` | Bot identity, channels, commands, data limits, escalation, and opt-out | Human autonomy |

The exact channel names may change. The functions and controls must remain discoverable.

### Roles and relationship labels

- **Project owner/creative authority:** approves canon, public project positioning, and final creative decisions.
- **Producer:** coordinates approved scope and evidence; does not acquire ownership merely by coordinating.
- **Moderator:** enforces community rules and routes reports; moderation access does not create a therapist, attorney, benefits adviser, or emergency-response role.
- **Reviewer:** evaluates a named deliverable within an accepted scope. A reply, reaction, or repository visit does not create an ongoing review duty.
- **Facilitator/instructor:** leads an agreed learning activity. Participants retain authorship and decision rights defined by the applicable agreement.
- **Contributor:** works only from an approved issue or written scope. Feedback alone does not create authorship or ownership.
- **Observer/playtester:** may provide feedback but does not receive canon or production authority.
- **AI bot:** must identify itself and may not imply that a named human has reviewed, approved, supervised, or accepted responsibility for its output.

Every person may accept, narrow, pause, or leave a role without retaliation. A person cannot be assigned as a mentor, adviser, monitor, partner, employee, or care provider merely because an AI, administrator, or community member suggested the relationship.

### Age and safeguarding gate

**Current recommendation:** keep working contribution, voice, and private project spaces limited to adults until the project documents and implements an under-18 program.

Before admitting anyone under 18, record the responsible organization and safeguarding lead; eligible ages; supervision and background-check requirements; guardian permission and participant assent where applicable; messaging and transportation rules; emergency and mandatory-reporting duties; data retention; accessibility; and separate consent for participation, recording, likeness, portfolio use, publication, AI use, and commercial reuse.

An open Discord invite is not a youth-safety plan. No adult should move a minor into a private one-to-one project conversation outside the approved safeguarding system.

### AI and parasocial safeguards

- Bots disclose that they are automated at the start of an interaction.
- Bots do not initiate private mentorship, emotional dependency, or professional-advice relationships.
- Bots do not state or imply that the human whose material informed the bot is watching, reviewing, or available.
- High-stakes or relationship-defining questions receive a human handoff option, but the human must explicitly accept the role.
- Users can stop, decline a referral, or leave without being pressured to maintain engagement.
- Private messages, applications, voice, likeness, unpublished work, and accommodation information are not used for model training without separate informed permission and lawful authority.
- Community observation supplements rather than replaces qualified legal, medical, mental-health, safeguarding, financial, employment, or accessibility review.

## 3. Agile teaching-case proposal

### Proposed title

**Agile Without Losing the Artist: Developing *Violet's Revenge* Through Consent, Iteration, and Creator Autonomy**

### Learning question

How can a small, accessibility-conscious independent team turn a narrative-rich 1v4 horror concept into testable increments while preserving creator authority, contributor boundaries, rights provenance, and voluntary participation?

### Why the project fits

The repository already contains a browser prototype, phased roadmap, issue-first contribution process, canon controls, playtest procedure, data rules, and documented unresolved engine choice. That makes it useful for demonstrating Agile as a learning system rather than presenting Agile as a rigid tool set.

The case must not ask students or community members to provide free production labor. Classroom exercises should use a sanitized brief, fictional alternatives, or clearly non-production practice artifacts unless a separate contribution agreement defines scope, credit, payment, rights, review, and acceptance.

### Four-session case map

| Session | Practice | *Violet's Revenge* activity | Output |
| --- | --- | --- | --- |
| 1. Direction | Product goal and decision authority | Define the desired player experience, current prototype boundary, audience, and creative non-negotiables | Product goal, authority map, and assumption list |
| 2. Prioritization | Backlog design, slicing, and estimation | Break the 1v1 proof-of-loop into testable player outcomes before attempting 1v4 networking | Prioritized backlog, estimates, dependencies, and definition of done |
| 3. Collaboration | Small experiment and evidence review | Plan or run a bounded test of one mechanic, interface, or playtest question using controlled assets | Sprint plan, experiment record, accessibility check, and risk register |
| 4. Learning | Review, retrospective, and next decision | Compare the evidence with the product goal without overriding creator authority | Retrospective, decision log, and 30-day experiment plan |

### Accessibility requirements

- Provide a text-first case brief before the session.
- State roles, timing, decisions, and deliverables in writing.
- Caption live material and provide transcripts or equivalent notes.
- Offer keyboard-accessible, low-bandwidth, and asynchronous participation routes.
- Schedule breaks and avoid requiring camera use, spontaneous disclosure, or performance of trauma.
- Use fictional or public-safe examples; do not require disability, financial, academic, employment, or personal-history disclosure.

### Rights and participation gate

Before the case is announced, recorded, taught, or promoted, document:

1. the event owner and instructor;
2. the exact role, if any, accepted by a community contact or introducer;
3. permission to use names, logos, course titles, and promotional language;
4. confirmation that *Violet's Revenge* project rights remain governed by this repository and applicable written agreements;
5. the status of participant suggestions, exercises, and production contributions;
6. instructor and third-party teaching-material ownership;
7. compensation, enrollment, scholarship, or volunteer status;
8. confidentiality and access to unreleased material;
9. separate recording, editing, publication, likeness, and reuse permissions;
10. accessibility responsibilities; and
11. adult-only status or a complete under-18 safeguarding plan.

Missing evidence remains **pending**. Public conversation, an open invite, repository access, course enrollment, or attendance does not create permission or partnership.

## 4. Approval sequence

1. Keep the proposal internal until the project lead approves the sanitized case brief.
2. Ask a prospective introducer only whether they are willing to route the proposal to the correct event decision-maker; do not ask them to approve a course they do not control.
3. Send the decision-maker a one-page proposal with the learning goal, four-session map, participant boundaries, accessibility requirements, and requested role.
4. Obtain written acceptance, requested revisions, or a clear decline.
5. If accepted, create an event-specific agreement and recording decision before promotion.
6. After the event, publish only cleared, de-identified outcomes and the actual relationship status.

## 5. Success criteria

The design is ready for external review when:

- Discord displays the rules, relationship labels, human reporting route, bot limits, age gate, and exit path before participation;
- each project task has a GitHub issue, decision authority, acceptance criteria, verification method, privacy boundary, and reviewer;
- the case brief contains no private messages, applicant data, protected records, secrets, or uncleared third-party material;
- the external host has accepted the project and scope in writing; and
- no public language implies mentorship, monitoring, endorsement, certification, or partnership beyond the accepted terms.
