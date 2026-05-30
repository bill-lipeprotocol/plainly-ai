# Hosted Live Provider Evaluation

This document is a docs-first plan for evaluating a future hosted live provider for Plainly.ai. It does not select a provider, add secrets, configure Vercel, or enable hosted live mode.

## Purpose

Plainly.ai is deployed at https://plainly-ai.vercel.app as an MVP v1 public demo in mock/default provider mode. A future hosted live provider must be evaluated for compatibility, safety, privacy, cost, reliability, and rollback before it is enabled.

## Current State

- Hosted deployment uses mock/default provider mode.
- Hosted live Gemma is not enabled.
- Local live Gemma is available only behind environment flags.
- The existing live adapter targets an OpenAI-compatible chat completions endpoint.
- The adapter extracts model content from `choices[0].message.content`.
- The parser accepts strict raw JSON and clean Markdown JSON fences, but does not accept prose around JSON.
- Provider output must validate as `PlainlyResult` before `/api/explain` returns it.

Current local-only development values:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
```

## Why Local Ollama Is Not Suitable For Hosted Deployment

`http://localhost:11434/v1/chat/completions` points to the machine running the process. In Vercel or another hosted environment, `localhost` would refer to the hosted serverless/container runtime, not the developer machine running Ollama.

Do not use the local Ollama URL for hosted production. Hosted live mode requires a provider endpoint reachable from the hosted runtime over the network, with secrets stored only in the hosting environment.

## Required Endpoint Compatibility

A candidate provider must support:

- HTTPS endpoint reachable from Vercel or the chosen host
- `POST` requests
- OpenAI-compatible chat completions request shape
- `Content-Type: application/json`
- optional bearer-token authorization if the provider requires a key
- model name supplied by `GEMMA_MODEL_NAME`
- non-streaming response for this MVP
- timeout behavior compatible with `GEMMA_TIMEOUT_MS`

The current adapter sends:

- `model`
- `messages`
- `temperature`

Do not select a provider that requires uploads, file parsing, callbacks, webhooks, document storage, or a different response shape unless a separate implementation milestone is approved.

## Required Response Shape

The current adapter requires the provider response to contain a string at:

```text
choices[0].message.content
```

The content string must contain the Plainly result JSON. If the provider returns content somewhere else, returns streaming chunks only, or wraps content in an incompatible envelope, it is not compatible with the current hosted OpenAI-compatible path.

## Required PlainlyResult JSON Behavior

Provider content must be valid JSON matching `validatePlainlyResult`.

Required top-level fields:

- `plainEnglishSummary`
- `documentTypeGuess`
- `importantDates`
- `moneyMentioned`
- `possibleActionSteps`
- `questionsToAskSender`
- `unclearOrRiskyParts`
- `notAdviceNotice`

Strict output rules:

- valid JSON only
- no prose before or after JSON
- no comments
- no Markdown required
- clean Markdown JSON fences are tolerated by the parser, but should not be relied on
- no invented dates, amounts, deadlines, obligations, or sender intent
- `notAdviceNotice` must remain present and non-empty

Do not loosen the parser to accept prose around JSON as part of hosted provider evaluation.

## Required Environment Variables

Hosted live mode would require these values later. Do not set them yet.

```text
PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible
GEMMA_API_URL=<hosted provider chat completions URL>
GEMMA_MODEL_NAME=<hosted model name>
GEMMA_API_KEY=<secret, if required>
GEMMA_TIMEOUT_MS=30000
```

`GEMMA_API_KEY` may be absent only if the selected hosted provider does not require it. `GEMMA_TIMEOUT_MS` should start at `30000` unless a stricter timeout is validated.

## Secret-Handling Rules

- Do not commit `.env.local`.
- Do not commit API keys.
- Do not paste secrets into docs, tickets, screenshots, or chat.
- Store hosted secrets only in the hosting environment secret manager.
- Do not print actual provider URLs, model names, or API keys in diagnostics if they may reveal sensitive configuration.
- `npm run check:provider` should remain boolean-only for Gemma URL, model, key, and timeout status.

## Privacy And Sensitive-Text Rules

- Use synthetic text for evaluation, tests, screenshots, docs, and demos.
- Do not ask testers to send real documents.
- Do not store pasted document text.
- Do not store prompts.
- Do not store raw provider responses.
- Do not add document history, uploads, OCR, PDF parsing, database storage, analytics, or account features as part of provider evaluation.
- If real user-like text appears during evaluation, remove it from notes and replace it with a synthetic summary.

## Safety And Not-Advice Requirements

Hosted live output must:

- explain only the provided text
- avoid legal, medical, tax, insurance, financial, or professional advice
- preserve the not-advice notice
- avoid guaranteed accuracy, outcomes, eligibility, rights, deadlines, or obligations
- suggest questions or next reading steps without telling the user what professional action to take
- keep high-risk alert behavior separate from model output

## No-Logging Requirements

Never log:

- pasted document text
- prompts
- raw model responses
- request bodies
- response bodies
- Authorization headers
- secrets
- API keys
- names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, or other sensitive details

Provider evaluation must include a manual log review that treats any appearance of those values as a blocker.

## Timeout And Error Behavior

The adapter currently uses `GEMMA_TIMEOUT_MS`, defaulting to 30000 milliseconds.

Expected safe behavior:

- timeout results in a generic failure
- non-2xx provider status results in a generic user-facing API failure
- invalid JSON results in a generic user-facing API failure
- schema-invalid JSON results in a generic user-facing API failure
- incompatible provider response shape results in a generic user-facing API failure

User-facing output must not expose provider status details, provider response bodies, prompts, request bodies, headers, Authorization values, or secrets.

## Cost And Rate-Limit Questions

Before selecting a hosted provider, answer:

- What is the expected cost per request?
- Is billing token-based, request-based, time-based, or capacity-based?
- Are there free-tier limits or trial expiration dates?
- What happens after rate limits are reached?
- Can rate limits be configured per project or key?
- Are there hard monthly spending caps?
- Does the provider charge for failed requests or timeouts?
- What is the expected cost for demos and light public use?

## Provider Reliability Questions

Ask:

- What uptime or availability is expected?
- Are there regional outages or maintenance windows?
- What are typical latency ranges?
- Is the endpoint suitable for serverless environments?
- Does the provider support non-streaming chat completions?
- Are model versions stable or auto-updated?
- Can the model be pinned?
- What error codes are returned for rate limits, auth failures, and timeouts?

## Provider Data-Retention Questions

Ask the provider:

- Are prompts stored?
- Are completions stored?
- Are request or response bodies used for training?
- Can training on submitted data be disabled?
- What is the retention period?
- Who can access request logs?
- Are logs encrypted?
- Can logs be deleted?
- Are headers or Authorization values logged?
- Are there enterprise or zero-retention options?
- What jurisdiction and subprocessors apply?

Do not enable hosted live mode if data-retention terms are unacceptable or unknown.

## Go/No-Go Checklist

Go only if all are true:

- reachable hosted endpoint is selected
- endpoint supports OpenAI-compatible chat completions
- response content is at `choices[0].message.content`
- provider can return strict `PlainlyResult` JSON
- secrets are stored only in the hosting environment
- `npm run test:gemma:live` passes against the candidate endpoint locally
- `npm run test:api:live` passes against a local dev server using the candidate endpoint
- preview deployment test plan is approved
- user-facing errors remain generic
- Vercel logs do not contain pasted text, prompts, raw responses, request bodies, response bodies, headers, Authorization values, or secrets
- cost and rate limits are understood
- provider data-retention terms are reviewed
- rollback to mock/default mode is documented and rehearsed

No-go if any item is unknown, failing, or not reviewed.

## Local-Only Test Path

Use this path before any hosted configuration. Use synthetic text only.

Terminal 1, set live provider env vars locally and start the dev server:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
$env:GEMMA_TIMEOUT_MS="30000"
npm run check:provider
npm run dev
```

Terminal 2, run live checks:

```powershell
npm run test:gemma:live
npm run test:api:live
```

Return to mock mode:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

## Preview-Deployment Test Path

Do not execute this yet.

Before any preview deployment live test:

- confirm a hosted provider endpoint is selected
- confirm secrets are ready for the hosting environment only
- confirm provider data-retention terms are reviewed
- confirm cost and rate limits are understood
- confirm production error monitoring plan is current
- confirm rollback to mock/default mode is understood

Later Vercel environment-variable checklist:

```text
PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible
GEMMA_API_URL=<hosted provider chat completions URL>
GEMMA_MODEL_NAME=<hosted model name>
GEMMA_API_KEY=<secret, if required>
GEMMA_TIMEOUT_MS=30000
```

Do not set these yet.

Preview checks later:

- deploy preview with live env vars only after approval
- run `npm run test:api:live` against the preview `/api/explain` URL by setting `PLAINLY_API_URL`
- inspect logs for status codes and generic errors only
- verify no pasted text, prompts, raw responses, request bodies, response bodies, headers, Authorization values, or secrets appear in logs
- remove live env vars after the preview test if live mode is not being kept intentionally

## Production Enablement Checklist

Do not execute this yet.

Production hosted live mode requires:

- completed provider evaluation
- successful local live adapter test
- successful local live API test
- successful preview live API test
- reviewed cost and rate-limit plan
- reviewed provider data-retention terms
- reviewed secret-handling process
- updated production error monitoring plan
- rollback rehearsal to mock/default mode
- clear public README and launch-note wording that production AI is live

Do not enable production live AI explanations until all of these are complete.

## Rollback Plan To Mock/Default Mode

Rollback means removing hosted live provider variables or setting the provider back to mock/default.

Local rollback:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Hosted rollback later:

- remove or unset `PLAINLY_MODEL_PROVIDER`
- remove hosted provider secrets if no longer needed
- redeploy or restart as required by the host
- run production smoke test
- confirm README and launch note match the deployed mode

## Failure Modes And Mitigations

Invalid JSON:

- mitigation: keep strict JSON contract, fail generically, do not loosen parser to accept prose

Schema-invalid JSON:

- mitigation: validate with `validatePlainlyResult`, fail generically, improve provider prompt only in a separate reviewed change

Incompatible response shape:

- mitigation: reject provider for current adapter or create a separate implementation milestone

Timeouts:

- mitigation: use `GEMMA_TIMEOUT_MS`, keep fallback generic, evaluate provider latency

Rate limits:

- mitigation: understand limits before enabling, keep mock rollback ready

Unexpected costs:

- mitigation: require spending caps or clear budget before production live mode

Provider logs sensitive content:

- mitigation: do not enable provider until retention and logging terms are acceptable

Provider requires prompt or document logging:

- mitigation: reject provider for Plainly MVP

Hosted live mode enabled unintentionally:

- mitigation: remove provider env vars, return to mock/default mode, rerun smoke tests

## Do Not Enable Hosted Live Mode If...

- provider cannot return strict `PlainlyResult` JSON
- provider requires logging prompts or document text
- provider response shape is incompatible
- error handling exposes provider details
- cost or rate limits are unknown
- data-retention terms are unacceptable or unknown
- tests fail
- rollback path is unclear
- secrets would need to be committed
- request or response bodies would be logged
- Authorization headers or API keys would appear in logs
- hosted endpoint is not reachable from the deployment environment
- public docs still describe hosted mode as mock/default when live mode would be enabled
