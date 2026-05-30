# Hosted Live Provider POC Plan

This plan defines a gated proof-of-concept path for testing a future hosted OpenAI-compatible provider for Plainly.ai. It does not select a provider, add secrets, configure Vercel, deploy, or enable hosted live mode.

## Purpose

Plainly.ai is currently deployed at https://plainly-ai.vercel.app in mock/default mode. The goal of this POC is to prove that a future hosted provider can safely satisfy the existing OpenAI-compatible adapter contract before any production activation is considered.

The proof of concept may test a hosted provider locally using environment variables. Production Vercel hosted live mode must remain off until the POC passes and the operator intentionally enables it later.

## Strict Boundaries

- Do not make live provider the default.
- Do not enable hosted live mode on Vercel.
- Do not set Vercel environment variables during this POC planning step.
- Do not add API keys to the repo.
- Do not edit or commit `.env.local`.
- Do not add a paid provider without separate approval.
- Do not add auth, uploads, payments, analytics, database, document storage, document history, OCR, PDF parsing, email sending, or a contact-form backend.
- Do not change provider routing, model integration behavior, schemas, or API behavior for this plan.
- Use synthetic text only.

## Provider-Selection Criteria

A candidate provider must:

- expose an HTTPS endpoint reachable from local development and later from hosted deployment
- support OpenAI-compatible chat completions
- support non-streaming responses
- return message content at `choices[0].message.content`
- allow the app to supply a model name
- support a low-temperature request
- work without uploads, files, callbacks, webhooks, document storage, or custom backend infrastructure
- have clear cost, rate-limit, reliability, and data-retention terms
- allow safe use without logging pasted document text, prompts, raw responses, headers, or secrets

## Required Endpoint Compatibility

The current adapter sends a JSON chat-completions request with:

- `model`
- `messages`
- `temperature`

The provider must accept:

- `POST`
- `Content-Type: application/json`
- optional bearer-token authorization if a key is required
- timeout behavior compatible with `GEMMA_TIMEOUT_MS`

Do not continue the POC with a provider that requires a different request shape unless a separate implementation milestone is approved.

## Required Response Shape

The provider response must include a string at:

```text
choices[0].message.content
```

That string must contain the Plainly result JSON. Providers that return only streaming chunks, a different field, tool-call structures only, or non-text content are not compatible with the current POC path.

## Required Strict PlainlyResult JSON Behavior

The model output must validate as `PlainlyResult`.

Required fields:

- `plainEnglishSummary`
- `documentTypeGuess`
- `importantDates`
- `moneyMentioned`
- `possibleActionSteps`
- `questionsToAskSender`
- `unclearOrRiskyParts`
- `notAdviceNotice`

Required behavior:

- valid JSON only
- no prose before or after JSON
- no comments
- no invented facts, dates, amounts, deadlines, sender intent, or user obligations
- not-advice notice remains present
- parser remains strict and must not be loosened to accept prose around JSON

Clean Markdown JSON fences are tolerated by the existing parser, but the preferred provider behavior is JSON only.

## Required Environment Variables

Local POC variables:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="<hosted provider chat completions URL>"
$env:GEMMA_MODEL_NAME="<hosted model name>"
$env:GEMMA_TIMEOUT_MS="30000"
```

If the provider requires a key, set it only in the local shell or local secret file that is not committed:

```powershell
$env:GEMMA_API_KEY="<secret, if required>"
```

Do not put real provider URLs, model names, or secrets in committed files. Keep `.env.local.example` placeholders only and keep the default provider mock.

## Secret-Handling Rules

- Store secrets only in local shell variables during the POC.
- Do not commit `.env.local`.
- Do not paste keys into docs, issues, screenshots, chat, or logs.
- Do not print actual provider URLs, model names, API keys, headers, or secrets in diagnostics.
- Use `npm run check:provider` for boolean-only configuration status.
- Clear local environment variables after testing.

## Local-Only POC Path

Use this path first. It can target a hosted candidate provider from local development, but it must not change production hosted mode.

Terminal 1:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="<hosted provider chat completions URL>"
$env:GEMMA_MODEL_NAME="<hosted model name>"
$env:GEMMA_TIMEOUT_MS="30000"
# Set GEMMA_API_KEY only if the selected provider requires it.
npm run check:provider
npm run dev
```

Terminal 2:

```powershell
npm run test:gemma:live
npm run test:api:live
```

The scripts must print only safe booleans, PASS/FAIL status, and failure categories. They must not print document text, prompts, raw provider responses, request bodies, response bodies, headers, Authorization values, or secrets.

Return to mock mode after local POC testing:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

## Preview-Only POC Path For Later

Do not execute this yet.

Only consider a preview deployment after:

- local hosted-provider POC passes
- provider data-retention terms are reviewed
- cost and rate limits are understood
- provider logging behavior is acceptable
- rollback path is rehearsed
- production error monitoring plan is current
- secrets are ready to be stored only in the hosting environment

Later preview environment-variable checklist:

```text
PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible
GEMMA_API_URL=<hosted provider chat completions URL>
GEMMA_MODEL_NAME=<hosted model name>
GEMMA_API_KEY=<secret, if required>
GEMMA_TIMEOUT_MS=30000
```

Do not set these yet.

Later preview test:

- run a preview deployment only after approval
- set `PLAINLY_API_URL` to the preview `/api/explain` URL in the test terminal
- run `npm run test:api:live`
- inspect hosting logs for status codes and generic errors only
- confirm no pasted text, prompts, raw responses, request bodies, response bodies, headers, Authorization values, or secrets appear
- remove preview live variables after testing unless live mode is intentionally kept for further preview review

## Production Activation Blockers

Do not activate production hosted live mode if:

- local hosted-provider POC has not passed
- preview live test has not passed
- provider cannot return strict `PlainlyResult` JSON
- provider response shape is incompatible
- provider requires logging prompts or document text
- provider retention terms are unacceptable or unknown
- cost or rate limits are unknown
- error handling exposes provider details
- logs show pasted text, prompts, raw responses, request bodies, response bodies, headers, Authorization values, or secrets
- rollback to mock/default mode is unclear
- public README, launch note, and UI copy still describe hosted output as mock/sample

## Manual Test Checklist

Use synthetic text only.

- `npm run check:provider` reports live OpenAI-compatible mode when local POC vars are set.
- `npm run test:gemma:live` returns a validated `PlainlyResult`.
- `npm run test:api:live` passes low-risk synthetic case.
- `npm run test:api:live` passes high-risk synthetic case.
- Invalid provider env configuration fails safely.
- Generic UI/API errors do not reveal provider details.
- Logs do not contain pasted text, prompts, raw responses, request bodies, response bodies, headers, Authorization values, or secrets.
- Returning to mock mode works and `npm run check:provider` reports mock/default.

## Expected Safe Failure Modes

Expected safe categories include:

- missing environment
- timeout
- provider non-success status
- provider response shape mismatch
- invalid JSON
- schema-invalid JSON
- server unreachable
- missing result
- missing summary
- missing not-advice notice
- high-risk mismatch

These failures should be safe and actionable without printing sensitive content.

## Rollback Plan

Local rollback:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Preview or production rollback later:

- remove or unset hosted live provider variables
- redeploy or restart as required by the host
- run production smoke test
- confirm the public deployment is mock/default mode
- update public docs if the live-mode wording had changed

## Cost And Rate-Limit Checklist

Before preview or production activation, answer:

- expected cost per request
- billing unit
- free-tier limits
- rate-limit behavior
- hard spending cap availability
- whether failed requests are billed
- whether timeouts are billed
- expected cost for demo traffic
- emergency shutoff path

## Data-Retention And Privacy Checklist

Before preview or production activation, confirm:

- whether prompts are stored
- whether completions are stored
- whether submitted data is used for training
- whether training can be disabled
- retention period
- log access controls
- deletion process
- jurisdictions and subprocessors
- whether headers or keys are logged
- whether zero-retention or enterprise privacy options exist

No-go if any required retention or privacy answer is unacceptable or unknown.

## Logging Review Checklist

Review local and hosted logs for:

- status codes
- generic route errors
- generic provider categories
- timeout categories
- configuration categories

Treat these as blockers if present:

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

## Go/No-Go Checklist

Go to preview only if:

- candidate provider is selected
- local hosted-provider POC passes
- strict `PlainlyResult` JSON behavior is verified
- cost and rate limits are understood
- data retention is reviewed
- logging review is clean
- rollback to mock/default mode works

Go to production only if:

- preview live test passes
- production activation blockers are cleared
- public docs are updated honestly
- production error monitoring plan is updated
- operator intentionally enables hosted live mode

No-go if:

- any test fails
- any secret appears in files or logs
- any sensitive content appears in logs
- provider behavior requires schema, parser, or routing changes outside an approved milestone
- production would no longer be mock/default unintentionally
