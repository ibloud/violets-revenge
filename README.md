# 🟣 Violet's Revenge: Asymmetrical Horror Externship Project

**Tagline:** *An original 1v4 asymmetrical horror concept grounded in gothic forensics and built through supervised emerging-talent contributions.*

> **Are you a laid-off game developer looking for a structured portfolio project?**  
> **Are you a university student needing a documented externship/practicum for graduation?**  
> *Join our open-source development team and help us build a meaningful horror franchise from prototype to publication.*

---

## 📖 The Lore

Play as Violet—a brilliant forensics examiner in London whose life is shattered by a brutal attack that costs her everything, including her unborn child. Driven by a dark ritual on Hallows Eve, Violet returns as an unstoppable supernatural force, wielding forensic science as her weapon.

In *Violet's Revenge*, you don't play as innocent survivors escaping a random monster. **You play as the Guilty.** Masked culprits are dragged into a purgatory dimension where they must process crime scenes and confront the evidence of what they did, while Violet hunts them through blood-soaked halls and moonlit ruins.

---

## 🎮 The Gameplay Concept

A 1v4 multiplayer horror game (PC first, console later).

*   **The Guilty (Survivors):** Must locate case files, sanitize crime scenes, and feed evidence into incinerators to power the exit doors before Violet finds them.  
*   **Violet (Killer):** Uses forensic tools (Luminol to track footsteps, Nightingale audio traps, Grave Dirt to slow targets) to hunt down the Guilty and drag them to Autopsy Slabs (the "hook" equivalent).

---

## 🧰 Current Implementation and Local Setup

The authoritative runnable prototype is `index.html`, supported by `assets/css/style.css`. Unity and Unreal are unselected future candidates, not current requirements.

### Browser prototype

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

### Python checks

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m pytest -q
```

### Node bot checks

```bash
cd js-bot
npm ci
npm test
```

See `docs/TRAINEE-ONBOARDING.md` before claiming work. Production credentials, applicant data, Discord permissions, canon changes, and engine migrations are not trainee starter tasks.

---

## 🗺️ Development Roadmap

We are building this franchise in iterative, achievable phases to ensure quick portfolio results for our team.

### Phase 1: The Game Jam Prototype (MVP) - *Target: 3 Months*
*   **Scope:** 1v1 local multiplayer.
*   **Map:** The Morgue (tight corridors, forensics lab).
*   **Goal:** Prove the core loop—Violet places audio traps; the Guilty searches for keys to escape.
*   **Tech:** Current browser prototype. A production-engine decision requires an approved ADR after prototype and playtest evidence.

### Phase 2: The Early Access Full Game - *Target: 9 Months*
*   **Scope:** 1v4 online multiplayer, dedicated servers.
*   **Features:** Progression system (The Forensics Tree), 3 maps (The Morgue, London Alley, The Hockey Arena), full cosmetic unlocks.
*   **Launch:** Steam Early Access.

### Phase 3: The Franchise - *Target: Year 2+*
*   **Scope:** Console ports, new Killer roster (The Intern, The Arsonist), transmedia lore expansion (web comics, ARG puzzles).

---

## 📦 Fab Asset & Tech Strategy

> **Current implementation:** Static HTML5 Canvas + vanilla JavaScript  
> **Production engine:** Undecided pending an approved architecture decision. Do not purchase engine-specific assets yet.

Assets are sourced strictly in dependency order as outlined in our [`Fab Asset Reference`](https://github.com/ibloud/violets-revenge/blob/main/Fab-Asset-Ref):

1. **Environment:** Sets the visual grammar and architectural tone.
2. **Downstream Categories:** Textures, Sound, VFX, and Animations.

*Do not purchase or acquire downstream assets before locking the environment.*

---

## 💼 Contributor Learning and Practicum Path

This repository welcomes supervised contributors, including students and professionals rebuilding portfolio evidence. Participation begins with a scoped GitHub issue and review—not with an employment promise.

What the project can provide when capacity allows:

- public issue and pull-request history;
- code or design review;
- credited contributions under an approved written agreement;
- factual verification of accepted repository work.

Academic credit, practicum sign-off, recommendation letters, employment verification, compensation, revenue share, and commercial credit are **not automatic**. Each requires separate written approval from the appropriate institution and an authorized project representative before work begins.

Read `docs/TRAINEE-ONBOARDING.md`, `docs/EXTERNSHIP-AGREEMENT.md`, and `docs/DATA-GOVERNANCE.md`.

## 💰 Compensation and Revenue-Share Status

This public repository does not itself create a compensation or revenue-share agreement. Do not rely on task points, projected sales, or roadmap language as a promise of payment.

Any paid work, revenue share, vesting, ownership, portfolio use, or commercial credit must be defined in a separate signed agreement. Until then, contributions are voluntary and governed by the repository licenses.

---

## ⚖️ Licensing & Intellectual Property

### Code License
All gameplay code, mechanics, and systems are licensed under the **MIT License**.

### Asset License
All original art, audio, lore, and character designs are licensed under **Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)**.

### 🚫 Character Non-Interference Declaration

**IMPORTANT: Regarding "Violet" and Ren Gill's "Violet's Tale"**

The character "Violet" in *Violet's Revenge* is an **original creation** developed solely for this project. 

Ren Gill (independent musician) is the creator of **"Violet's Tale"**, a separate and wholly distinct creative work. 

By contributing to, forking, or distributing this project, **all parties irrevocably agree** to the following:

1. **No Intersection.** No elements of Ren Gill's "Violet's Tale" — including but not limited to lyrics, narrative themes, character traits, visual designs, musical compositions, or promotional materials — may be used, referenced, adapted, sampled, or remixed in any form.
2. **Explicit Separation.** The "Violet" of this project is a forensics examiner turned supernatural executioner. Her backstory, visual design, personality, and narrative arc are original. Any coincidence in naming is incidental.
3. **Contributor Obligation.** Any contributor who proposes lore, dialogue, visual assets, or mechanics that could be construed as derivative of Ren Gill's work must disclose this to the team lead **before** inclusion.
4. **No Affiliation.** *Violet's Revenge* is not affiliated with, endorsed by, or connected to Ren Gill or his estate/publishers in any capacity.
5. **Character Bible.** All approved character details for "Violet" and future roster characters are maintained in `docs/CHARACTER-BIBLE.md`. If it is not in the Bible, it is not canon. Do not expand the character in-game or in promotional material unless the change is documented there first.

### 🎭 Character Development Guidelines

| Principle | Rule |
|-----------|------|
| **Originality** | All characters must be original. No real persons, living or dead. |
| **Trauma-Informed Writing** | Sensitive themes (assault, abuse, loss) must be handled with care. |
| **Anonymized Assailants** | The "Guilty" (survivors) are masked, anonymized archetypes. They are never given names, backstories, or humanizing traits. |
| **Violet's Arc** | Violet's story follows a defined 3-act structure. |
| **No Crossover** | No character may reference, allude to, or parody characters from existing horror franchises. |

---

## 🚀 How to Contribute

1. Read `CONTRIBUTING.md` and `docs/TRAINEE-ONBOARDING.md`.
2. Choose an open issue labeled `good-first-issue` or `trainee-ready`.
3. Comment on the issue before beginning work.
4. Use a focused branch and submit a pull request with verification results.
5. Wait for review before merging or treating a change as canon.

Public social posting and Discord participation are optional unless a specific, approved role agreement says otherwise. Merging a PR does not automatically grant Discord access, academic credit, employment status, compensation, or revenue share.

[Play the current browser prototype](https://ibloud.github.io/violets-revenge/)

---

## Project Documentation
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- docs/STORY-BIBLE.md
- docs/CHARACTER-BIBLE.md
- docs/SENSITIVE-CONTENT-GUIDE.md
- docs/TECH_STACK.md
- docs/ARCHITECTURE.md
- docs/COMMUNITY.md
- docs/EXTERNSHIP-AGREEMENT.md
- docs/AI-AGENT-BOUNDARY.md
- docs/TRAINEE-ONBOARDING.md
- docs/DATA-GOVERNANCE.md
- docs/adr/ADR-0001-current-stack.md
