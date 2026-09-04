# Applicant and Playtester Data Governance

**Status:** Required operating policy  
**Last updated:** 2026-09-04

## Scope

Applies to Discord claim attempts, intake forms, moderation records, practicum inquiries, contact details, and any information used to approve access or document participation.

## Data minimization

Collect only information required for the stated purpose. Do not request medical history, diagnosis, protected traits, government identifiers, financial credentials, passwords, or unnecessary personal history through Discord intake.

## Access

- Intake responses may be viewed only by designated reviewers.
- Bot tokens and invite secrets belong in deployment secrets, never repository content or logs.
- Trainees must use synthetic data for development and screenshots.
- Private Discord content must not be copied into public issues or PRs.

## Retention

Before collecting real intake data, project leads must publish a concrete retention period and deletion procedure in the operational environment. Until then, use intake only for controlled testing with synthetic data.

## Applicant rights and escalation

Provide a human contact for correction or deletion requests. Automated tooling may route information, but a human must make access, practicum, compensation, and participation decisions.

## Logging

- Never log submitted win codes, tokens, invite secrets, or full intake answers to general-purpose logs.
- Security events may record user ID, timestamp, outcome category, and attempt count.
- Restrict moderation logs to authorized roles.

## Incident response

If private data or a credential enters git history, an issue, a PR, or a public log:

1. revoke or rotate affected credentials;
2. restrict further access;
3. notify the project lead;
4. remove public exposure where possible without pretending history never existed;
5. document the remediation without repeating the secret.
