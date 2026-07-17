# Violet's Revenge — Repo Consolidation Report

*Prepared from a review of `ibloud/violets-revenge` against Google Drive lore docs and design material shared in-session.*

---

## 1. Current Repo State

As of the latest commit (`Merge pull request #1`), the repo contains:

```
violets-revenge/
├── .github/
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE                    (MIT)
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CHARACTER-BIBLE.md
│   ├── COMMUNITY.md
│   ├── EXTERNSHIP-AGREEMENT.md
│   ├── SENSITIVE-CONTENT-GUIDE.md
│   ├── STORY-BIBLE.md
│   └── TECH_STACK.md
└── index.html                 (playable 1v1 prototype)
```

This is a solid foundation — CI-adjacent docs (Code of Conduct, Contributing, Externship Agreement), a working prototype, and a real docs structure are all in place.

---

## 2. Gaps Identified

| Gap | Detail | Status |
|---|---|---|
| **Asset license file** | README splits code (MIT) from assets (CC BY-NC 4.0), but only one `LICENSE` file existed | ✅ Fixed — `LICENSE-ASSETS.md` and `LICENSE-CODE.md` drafted (Section 3) |
| **Broken link** | README's Character Bible line links to `CHARACTER-BIBLE.md`, but the file lives at `docs/CHARACTER-BIBLE.md` | ⚠️ Needs a one-line fix (Section 4, Step 3) |
| **Thin CHARACTER-BIBLE.md / STORY-BIBLE.md** | Both exist but only sketch Violet at a high level. Richer canon (Jenny, Screech, the Nightingale painting, jersey #88, the Part One/Two/Three beats) lives in your Drive doc and the pasted Franchise Roadmap, but hasn't been folded into the bibles yet | ⚠️ Not yet drafted — flagging for a follow-up if wanted |
| **No Open Ledger** | README's Tier 1 revenue waterfall promises expenses are "documented in our Open Ledger" — no such file/sheet exists | ⚠️ Not yet drafted |
| **No Rev-Share Point tracking** | The 50/20/10-point PR system has no log, template, or issue-label scheme behind it | ⚠️ Not yet drafted |
| **Card deck design docs** | Not yet in repo | ✅ Drafted — `CARD-DESIGN-GUIDE.md`, `CARD-TEXT-DATABASE.md` |
| **Franchise roadmap** | README has a condensed 3-phase roadmap; a fuller version with more mechanics wasn't in repo | ✅ Drafted — `FRANCHISE-ROADMAP.md` (has more detail than the README's version — worth deciding which is canonical) |
| **Duplicate prototype file** | A pasted `prototype/index.html` was character-for-character identical to the existing root `index.html` | ℹ️ No action needed unless you want to physically relocate the file and update GitHub Pages config |

---

## 3. Files Ready to Add

All five files below have been generated this session and are ready to drop into the repo as-is:

| File | Target location | Purpose |
|---|---|---|
| `LICENSE-ASSETS.md` | repo root | CC BY-NC 4.0 summary + link, for art/audio/lore |
| `LICENSE-CODE.md` | repo root | MIT text, mirrors existing `LICENSE`, for the two-file split the README describes |
| `CARD-DESIGN-GUIDE.md` | `docs/` | Veiled Dominion × Violet's Revenge card deck art direction |
| `CARD-TEXT-DATABASE.md` | `docs/` | Full 52-card rules text for the same deck |
| `FRANCHISE-ROADMAP.md` | `docs/` | Fuller Phase 1–3 roadmap with mechanics not yet in the README |

---

## 4. Step-by-Step Implementation

### Step 1 — Download the files
All five are attached to this conversation. Save them locally.

### Step 2 — Add them to your local clone
```bash
cd violets-revenge

# License files go in the root
cp ~/Downloads/LICENSE-ASSETS.md .
cp ~/Downloads/LICENSE-CODE.md .

# Design/roadmap docs go in docs/
cp ~/Downloads/CARD-DESIGN-GUIDE.md docs/
cp ~/Downloads/CARD-TEXT-DATABASE.md docs/
cp ~/Downloads/FRANCHISE-ROADMAP.md docs/
```

*(No local clone? Use GitHub's web UI instead: **Add file → Upload files**, select the two license files for the root, then navigate into `docs/` and repeat for the three doc files.)*

### Step 3 — Fix the broken Character Bible link
In `README.md`, find this line (~line 111):
```
...are maintained in CHARACTER-BIBLE.md. If it is not in the Bible...
```
Change `CHARACTER-BIBLE.md` to `docs/CHARACTER-BIBLE.md`.

### Step 4 — Update README's "Project Documentation" list
Add the three new docs so they're discoverable (README already lists `docs/STORY-BIBLE.md` etc. around line 130):
```markdown
- docs/CARD-DESIGN-GUIDE.md
- docs/CARD-TEXT-DATABASE.md
- docs/FRANCHISE-ROADMAP.md
```

### Step 5 — Commit and push
```bash
git add LICENSE-ASSETS.md LICENSE-CODE.md docs/CARD-DESIGN-GUIDE.md docs/CARD-TEXT-DATABASE.md docs/FRANCHISE-ROADMAP.md README.md
git commit -m "Add asset/code license split, card deck design docs, and full franchise roadmap"
git push
```

### Step 6 (optional) — Decide on roadmap canonicity
You now have two roadmaps: the condensed one in `README.md` and the fuller `docs/FRANCHISE-ROADMAP.md`. Pick one:
- **Option A:** Trim the README's roadmap section to a summary + "full roadmap: docs/FRANCHISE-ROADMAP.md" link.
- **Option B:** Keep both, but note in the README that the docs version is authoritative if they ever conflict.

### Step 7 (not yet drafted — flag for next session)
These three still need content and weren't built this round:
1. **Enriched `docs/CHARACTER-BIBLE.md`** — pull in Jenny, Screech, the Nightingale painting, and jersey #88 from your Drive lore doc.
2. **Open Ledger** — a template file or spreadsheet for tracking pre-approved expenses per the Tier 1 revenue waterfall.
3. **Rev-Share Point tracking** — a log or issue-label scheme so PR point values (50/20/10) are actually recorded somewhere.

Say the word if you want any of these three drafted next.
