# Preview Live Provider Test Plan

This plan describes how to safely test hosted live-provider mode in a Vercel preview deployment later. It does not deploy, set environment variables, add secrets, or enable live provider mode in production.

## Purpose

The local-only Google Gemini OpenAI-compatible proof of concept passed. The next safe step is a preview-deployment test plan that keeps production mock/default while verifying whether the same live-provider path can work in a Vercel preview environment.

## Current Production Status

Production URL:

https://plainly-ai.vercel.app

Current production mode:

- mock/default provider
- hosted live provider not enabled
- no production live-provider Vercel environment variables set
- explanation cards are sample/mock output
- high-risk detection runs on pasted text

Production remains mock/default until a separate production activation decision is made.

## Preview-Test Boundary

Preview testing is allowed only in a Vercel preview deployment later. Do not enable live provider on production yet.

Preview testing must:

- use synthetic, non-sensitive text only
- avoid real documents
- avoid pasted personal information
- keep production environment variables unchanged
- keep production provider mode mock/default
- use preview-only environment variables
- stop immediately if logs expose sensitive content

## Prerequisites

Before preview live-provider testing:

- local-only Gemini OpenAI-compatible POC has passed
- provider key is obtained outside the repo
- provider cost and rate limits are reviewed
- provider data-retention and logging terms are reviewed
- secret-management approach in Vercel preview environment is decided
- rollback to mock/default mode is understood
- production error monitoring plan is current
- operator confirms production must remain mock/default

## What Must Remain Off In Production

- Production live provider mode
- Production `PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible`
- Production `GEMMA_API_URL`
- Production `GEMMA_MODEL_NAME`
- Production `GEMMA_API_KEY`
- Production `GEMMA_TIMEOUT_MS` unless explicitly needed for mock-safe config
- Any monitoring, analytics, storage, upload, OCR, PDF parsing, auth, payment, email, database, or contact-form backend added for this test

## Preview-Only Vercel Env Vars For Later

Use placeholders only in docs. Do not set these yet.

```text
PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible
GEMMA_API_URL=<hosted OpenAI-compatible chat completions URL>
GEMMA_MODEL_NAME=<hosted model name>
GEMMA_API_KEY=<secret, if required>
GEMMA_TIMEOUT_MS=30000
```

These values must be scoped to the preview environment only. Do not set them for production during this test.

## Safe Secret-Handling Rules

- Do not commit `.env.local`.
- Do not paste API keys into docs, issues, screenshots, logs, or chat.
- Do not print or document provider endpoint values if they reveal sensitive configuration.
- Do not print or document model names if they reveal sensitive configuration.
- Do not print or document raw provider responses.
- Do not print or document raw prompts.
- Do not print or document request bodies or response bodies.
- Do not print or document headers, Authorization values, or secrets.
- If any secret is exposed, revoke and replace it before continuing.

## Preview Deployment Checklist

Do this only after prerequisites are complete:

- confirm production remains mock/default
- create or identify a Vercel preview deployment
- configure live-provider variables for preview only
- confirm production variables were not changed
- confirm preview URL is not the production URL
- run preview API smoke test with `npm run test:api:live`
- run browser smoke tests with synthetic text only
- review Vercel preview logs for safe status and generic errors only
- remove preview live-provider variables after testing unless intentionally continuing preview-only review

## Preview API Smoke-Test Checklist

Use the existing live API script against the preview `/api/explain` URL. The script posts synthetic cases and prints safe PASS/FAIL categories.

Terminal:

```powershell
$env:PLAINLY_API_URL="<preview deployment https URL>/api/explain"
npm run test:api:live
Remove-Item Env:PLAINLY_API_URL -ErrorAction SilentlyContinue
```

Expected safe result:

- low-risk synthetic case passes
- high-risk synthetic case passes
- no document text is printed
- no prompt is printed
- no response body is printed
- no request body is printed
- no headers or secrets are printed

## Preview Browser Smoke-Test Checklist

Use the preview URL only. Use synthetic, non-sensitive text only.

- preview URL loads
- page still shows privacy warning before submission
- sample notice fills the form but does not auto-submit
- sample notice submit returns result sections
- synthetic low-risk text returns a result
- synthetic high-risk text triggers the alert
- negated low-risk text does not trigger the alert
- not-advice notice is visible
- footer still says Plainly explains text and is not professional advice
- no stack traces appear
- no raw JSON dumps appear
- no provider output appears
- no prompts appear
- no headers, Authorization values, API keys, or secrets appear

## High-Risk Alert Checks

Use synthetic wording only.

Should alert:

- court date
- eviction may occur
- foreclosure notice
- sent to collections
- benefits denial
- coverage has been denied
- appeal deadline
- subpoena
- wage garnishment
- emergency medical
- termination notice

Should not alert solely because of obvious negated wording:

- does not mention eviction
- does not mention foreclosure
- does not mention collections
- does not mention denied coverage
- no legal action
- no court action
- not about denied coverage

Mixed text should still alert if a real risk phrase appears elsewhere.

## Privacy And No-Logging Checks

During preview testing, verify that neither UI nor logs expose:

- pasted document text
- prompts
- raw provider responses
- request bodies
- response bodies
- headers
- Authorization values
- API keys
- secrets
- names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, or other sensitive details

Do not paste real documents. Do not use real personal data. Do not save screenshots that contain user-provided text.

## Vercel Log Review Checklist

Inspect only:

- status codes
- route names
- generic errors
- safe failure categories
- timing or timeout categories if available

Verify that logs do not include:

- pasted text
- prompts
- raw responses
- request bodies
- response bodies
- Authorization headers
- API keys
- secrets
- sensitive personal details

Any leak is a blocker and requires immediate rollback plus key revocation and replacement.

## Safe Pass/Fail Categories

Use these categories when documenting results:

- pass
- server-unreachable
- http-status
- invalid-json-response
- missing-result
- missing-summary
- missing-not-advice-notice
- high-risk-mismatch
- provider-status
- provider-response-shape
- invalid-json
- schema-invalid-json
- timeout
- missing-env
- unsafe-log-content
- unknown

Do not attach request bodies, response bodies, provider output, prompts, headers, Authorization values, secrets, or pasted text to result notes.

## Stop Conditions

Stop preview testing immediately if:

- production environment variables were changed
- production no longer appears to be mock/default
- any secret appears in logs, screenshots, docs, issues, or chat
- pasted text appears in logs
- prompts appear in logs
- raw provider responses appear in logs
- request or response bodies appear in logs
- Authorization headers appear in logs
- provider returns unsafe advice-like output
- live API test fails for both synthetic cases
- rollback path is unclear

If a secret is exposed, revoke and replace it before any further testing.

## Rollback Plan

Preview rollback:

- remove preview `PLAINLY_MODEL_PROVIDER`
- remove preview `GEMMA_API_URL`
- remove preview `GEMMA_MODEL_NAME`
- remove preview `GEMMA_API_KEY`
- remove preview `GEMMA_TIMEOUT_MS`
- redeploy or restart preview as needed
- verify preview returns to mock/default if it remains active
- verify production was not changed

Local cleanup after preview testing:

```powershell
Remove-Item Env:PLAINLY_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Production rollback should not be needed because production must not be changed for this test. If production was changed accidentally, remove production live-provider variables and restore mock/default immediately.

## Production Activation Blockers

Do not activate production live provider if:

- preview test has not passed
- preview logs have not been reviewed
- logs contain pasted text, prompts, raw responses, request bodies, response bodies, headers, Authorization values, API keys, or secrets
- provider cost and rate limits are not accepted
- provider data-retention and logging terms are not accepted
- monitoring and privacy posture are not decided
- rollback has not been rehearsed
- public README and launch note still describe output as mock/sample
- production activation owner has not explicitly approved the change

## Go/No-Go Checklist

Go for preview only if:

- local POC passed
- preview env vars are scoped to preview only
- secrets are ready for Vercel preview storage only
- production remains mock/default
- cost, rate-limit, retention, and logging reviews are complete enough for preview
- rollback plan is understood

Go for production only if:

- preview test passes
- Vercel log review passes
- production activation blockers are cleared
- docs are updated honestly
- operator intentionally approves production live mode

No-go if:

- any secret is exposed
- any sensitive text is exposed
- any required test fails without explanation
- production would be changed unintentionally
- rollback path is unclear

## Result Documentation Template

Use this template after preview testing. Fill with safe categories and counts only.

```text
Date:
Preview URL checked: yes/no
Production URL changed: no
Production provider mode: mock/default
Preview provider mode: gemma-hosted-openai-compatible
Preview env vars scoped to preview only: yes/no
test:api:live result:
test:api:live cases:
Browser smoke test result:
High-risk alert checks:
Negated low-risk checks:
Vercel log review result:
Secrets exposed: no
Pasted text in logs: no
Prompts in logs: no
Raw provider responses in logs: no
Request/response bodies in logs: no
Headers or Authorization in logs: no
Rollback performed: yes/no
Safe conclusion:
Next gated step:
```

Do not include API keys, raw outputs, raw prompts, request bodies, response bodies, headers, Authorization values, secrets, pasted text, or sensitive examples in the result.
