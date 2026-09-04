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

Do not use private Discord instructions as the sole specification.

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

### Node bot checks

```bash
cd js-bot
npm ci
npm test
```

Running a Discord bot requires separate test credentials. Never place tokens in source, screenshots, issues, logs, or pull requests.

## Pull requests

- Use a focused branch.
- Link the issue.
- Explain what changed and why.
- Include exact verification commands and results.
- Add screenshots only when they contain no private Discord or applicant data.
- Request review; do not merge your own trainee PR unless instructed.

## Stop and ask

Pause when a task involves:

- production credentials or deployment;
- applicant or playtester data;
- Discord role/permission changes;
- payment, revenue share, employment, or academic-credit claims;
- new canon or sensitive narrative content;
- a new framework or production engine.
