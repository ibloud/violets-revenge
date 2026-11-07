# Trainee Onboarding

## Read first

1. `CODE_OF_CONDUCT.md`
2. `CONTRIBUTING.md`
3. `docs/SENSITIVE-CONTENT-GUIDE.md`
4. `docs/DATA-GOVERNANCE.md`
5. `docs/TECH_STACK.md`
6. The story or character bible only if the issue touches narrative canon

## Choose work

Start only from an open GitHub issue labeled `good-first-issue` or `trainee-ready`. A ready issue must name:

- the relevant files;
- acceptance criteria;
- verification steps;
- content or privacy boundaries;
- a reviewer or escalation path.

Do not use private chat instructions as the sole specification.

## Local setup

### Browser prototype

Serve the repository root with any local static server:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. Do not open `index.html` through a `file://` URL when testing browser behavior.

### Python checks

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pytest -q
```

On Windows PowerShell, activate with `.venv\\Scripts\\Activate.ps1`.

### Retained Node bot checks (offline only)

```bash
cd js-bot
npm ci
npm test
```

Discord deployment and bridging are discontinued. These checks preserve legacy behavior without login. Do not request Discord credentials for new work. Never place tokens in source, screenshots, issues, logs, or pull requests. See `docs/ROOMY-TRANSITION.md`.

## Pull requests

- Use a focused branch.
- Link the issue.
- Explain what changed and why.
- Include exact verification commands and results.
- Add screenshots only when they contain no private community or applicant data.
- Request review; do not merge your own trainee PR unless instructed.

## Stop and ask

Pause when a task involves:

- production credentials or deployment;
- applicant or playtester data;
- community role/permission changes;
- payment, revenue share, employment, or academic-credit claims;
- new canon or sensitive narrative content;
- a new framework or production engine.


## Inspect one browser behavior

At the audited main snapshot (7 November 2026), `/index.html` immediately redirects to `/pitch/#money`; the retained fallback markup only selects cards and displays a commit notice. Older “Canvas prototype at root” guidance is stale. The historical Canvas implementation remains at `/archive/v0.1/`; the precinct gameplay review prototype is `/demo/`. A maintainer must confirm the long-term canonical gameplay entry before broader route changes.

Serve the root with `python -m http.server 8000`, then open `http://localhost:8000/demo/`. Observe **Concede → Confirm action → terminal outcome → Restart**. In `demo/index.html`, the Concede button calls `setPending`, Confirm calls `execute`, and `execute` calls `act` in `demo/engine/rules.js`. The `concede` branch sets `terminal` and appends an event; `render` shows `Terminal outcome: conceded`. Restart calls `start`, which creates a new state with `createGame`.

Run `node --test demo/test/*.test.js` from the repository root. The existing `concede and restart terminal states` test in `demo/test/rules.test.js` covers the engine result; manually check the actual buttons too. Rules, room graph and placeholder content in this lane remain proposals. Do not copy Veiled Dominion mechanics or change bibles as part of a navigation fix.

Junior and experienced reviewers can inspect this same behavior; the latter can go directly to `docs/ARCHITECTURE.md`, `docs/adr/ADR-0001-current-stack.md` and the relevant tests. On an iPad, inspect source in GitHub and use the published `/demo/` route; local Python/Node and a tested Codespaces workflow are not assumed.

If instructions or a first-issue label do not match current behavior, ask on that existing issue before coding. Include the exact route/build, observed result, source function and question; a complete proposed fix is not required. Record findings and a next action if handing off.
