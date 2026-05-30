# Coding Agent Workflow

This document outlines the verified safe workflow for using `gemma4:31b-cloud` as a coding assistant within the Plainly.ai repository.

## Verification Status
`gemma4:31b-cloud` has passed the coding-agent reliability check (Milestone 4E). It is approved for use as a coding assistant for repository maintenance and feature development.

## Scope and Restrictions
- **Role**: Used exclusively for repository coding assistance.
- **Production**: This model is NOT to be implemented as Plainly.ai's production document explanation provider.
- **No Live Integration**: Do not add live model calls, API keys, or authentication.
- **No Infrastructure**: Do not add uploads, payments, analytics, databases, document storage, or external APIs.
- **Privacy**: Never log `documentText`, `prompt`, `rawText`, raw model responses, request/response bodies, or secrets.

## Reliability Baseline
The first reliability test for any session consists of running `git status` and stopping immediately to verify environment stability and constraint adherence.

## Pre-Work Verification
Before implementing any changes, the following checks must be performed to ensure a stable baseline:
1. `git status` (Confirm clean state)
2. `npm run lint`
3. `npm run build`
4. `npm run test:adapter`
5. `npm run test:api` (Requires dev server to be running)

## Safety Auditing
After implementation and before finalization, a safety search must be conducted using the following terms to prevent leaks or unauthorized calls:
- `fetch(`
- `http`
- `https`
- `console.log`
- `console.error`
- `documentText`
- `prompt`
- `rawText`
- `GEMMA_API`
- `.env.local`

## Operational Rules
- **Inspection First**: No files shall be edited before the current state is fully inspected.
- **Commit Policy**: No auto-commits without a detailed summary of changes.
- **Push Policy**: No auto-push without explicit user approval.
- **Secrets**: No secrets or `.env.local` files should ever be committed.
- **Logging**: No logging of sensitive document or prompt data.
- **Integration**: No production model integration unless explicitly assigned.
