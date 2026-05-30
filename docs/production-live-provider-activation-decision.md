# Production Live Provider Activation Decision

## Purpose

This document is a decision plan for whether and when to activate the hosted live provider in Production. It does not activate Production live mode, set hosting environment variables, promote a preview deployment, or change application behavior.

Production remains mock/default until a separate, explicit activation step is approved and executed.

## Current Production Status

- Product: Plainly.ai
- Production URL: https://plainly-ai.vercel.app
- Current Production provider mode: mock/default
- Hosted live provider in Production: not enabled
- Preview live-provider test: passed after retry on 2026-05-30
- Preview promoted to Production: no
- Production environment variables changed for live mode: no

## Decision Boundary

This plan supports a future go/no-go decision. Build 13 is documentation only.

Do not set Production Vercel environment variables yet. Do not promote a preview deployment to Production as part of this build. Do not paste real documents during activation testing. Use only synthetic, non-sensitive text for final smoke tests.

If any secret is exposed, revoke and replace it before continuing.

## Evidence Already Gathered

- Local-only Gemini OpenAI-compatible POC passed.
- Local provider preflight passed.
- Isolated live adapter test passed.
- Local live `/api/explain` regression passed.
- Preview live-provider API test passed after retry.
- Final preview API result: 2 total, 2 passed, 0 failed.
- Browser preview smoke test passed.
- Vercel preview log review passed.
- Production env vars remained unchanged.
- Production remained mock/default.

## What Production Activation Would Mean

Production activation would mean configuring Production hosting environment variables so `/api/explain` uses `PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible` and routes requests to a hosted OpenAI-compatible provider.

After activation, explanation cards in Production would be live provider output instead of mock/sample output. High-risk detection would still run on pasted text. User-facing copy and public docs must continue to make the not-advice boundary clear.

## What Must Remain Unchanged Unless Explicitly Activated

- Production provider mode remains mock/default.
- No Production Vercel live-provider environment variables are set.
- Preview is not promoted to Production.
- Provider routing stays unchanged.
- Model integration behavior stays unchanged.
- Schemas stay unchanged.
- App and API behavior stay unchanged.
- No uploads, accounts, payments, analytics, database, document storage, document history, OCR, PDF parsing, email sending, or contact-form backend are added.

## Pre-Activation Requirements

Before any Production activation decision, confirm:

- Local hosted-provider POC passed and is documented.
- Preview live-provider test passed and is documented.
- Provider cost and rate limits are reviewed.
- Provider data-retention and logging terms are reviewed.
- Hosting secret-management approach is understood.
- Production rollback path is ready.
- Production monitoring and safe log review process is ready.
- Generic error handling is confirmed.
- Public docs and UI copy remain accurate for live mode.
- No pasted text, prompts, raw responses, request bodies, response bodies, headers, Authorization values, API keys, bypass secrets, or other secrets appear in logs.

## Future Production Env Vars

Future Production Vercel environment-variable checklist, placeholders only:

```text
PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible
GEMMA_API_URL=<hosted OpenAI-compatible chat completions URL>
GEMMA_MODEL_NAME=<hosted model name>
GEMMA_API_KEY=<secret, if required>
GEMMA_TIMEOUT_MS=30000
```

Do not set these yet. Store secrets only in the hosting environment if activation is approved later. Do not commit `.env.local`.

## Secret Handling Requirements

- Do not print or document API keys.
- Do not print or document bypass secrets.
- Do not print or document Authorization values.
- Do not commit `.env.local`.
- Do not paste secrets into docs, issue comments, chat, logs, screenshots, or test output.
- Revoke and replace any exposed secret before continuing.

## Privacy And No-Logging Requirements

Do not print, log, or document:

- pasted document text
- prompts
- raw provider responses
- request bodies
- response bodies
- headers
- Authorization values
- API keys
- bypass secrets
- other secrets
- sensitive examples

Production activation testing must use only synthetic, non-sensitive text. Do not paste real household documents.

## Cost And Rate-Limit Review Checklist

- Confirm pricing model for the selected provider.
- Confirm expected cost for demo traffic.
- Confirm rate limits and burst limits.
- Confirm timeout behavior under load.
- Confirm provider behavior when quota is exceeded.
- Confirm whether the provider supports spending limits or alerts.
- Decide whether the operator can observe usage after activation.

## Provider Data-Retention And Logging Review Checklist

- Confirm whether the provider stores prompts or outputs.
- Confirm whether the provider uses inputs for training or improvement.
- Confirm retention duration for request metadata.
- Confirm whether logging can be disabled or minimized.
- Confirm whether sensitive text should ever be sent to the provider.
- Confirm deletion or abuse-report processes if applicable.
- Block activation if retention or logging terms are unknown or unacceptable.

## Monitoring And Log Review Requirements

Before activation, the operator must be ready to review:

- Production status codes.
- Generic server errors.
- API availability.
- UI availability.
- High-risk alert behavior.
- Provider-mode behavior through safe smoke tests.

Log review must treat any appearance of pasted text, prompts, raw provider responses, request bodies, response bodies, headers, Authorization values, API keys, bypass secrets, or other secrets as a launch blocker.

Do not add analytics or a monitoring SDK until a separate privacy review is complete.

## User-Facing Safety Requirements

Before activation, confirm:

- Privacy warning is visible before submission.
- Not-advice notice remains visible.
- High-risk alert remains calm and non-directive.
- Error messages remain generic and actionable.
- The UI does not promise legal, medical, tax, insurance, financial, or other professional advice.
- The UI does not overclaim accuracy, privacy, or outcomes.

## Production Smoke-Test Checklist

Use synthetic, non-sensitive inputs only.

- Public page loads.
- Sample notice fills the form but does not auto-submit.
- Synthetic low-risk submit returns a result.
- Synthetic high-risk submit triggers the alert.
- Negated low-risk synthetic text does not trigger the alert.
- Privacy warning remains visible.
- Not-advice notice remains visible.
- Generic failure language appears if a safe failure is forced.
- No stack traces, raw JSON, provider output, prompts, headers, Authorization values, API keys, bypass secrets, or other secrets appear in the browser.
- Production logs show only safe status codes or generic errors.

## Rollback Plan

If Production live mode is activated later and must be rolled back:

1. Remove or change Production `PLAINLY_MODEL_PROVIDER` back to mock/default.
2. Remove live-provider Production env vars if they are no longer needed.
3. Redeploy if required by the hosting platform.
4. Verify Production behavior indirectly through safe smoke tests with synthetic inputs.
5. Confirm explanation cards are back to mock/default behavior.
6. Review logs for status codes and generic errors only.
7. Document the rollback result without secrets, raw outputs, prompts, request bodies, response bodies, headers, or pasted text.

## Stop Conditions

Stop and do not activate Production live mode if:

- Cost or rate limits are unknown.
- Provider data-retention or logging terms are unknown or unacceptable.
- Rollback path is unclear.
- Monitoring or log review is not ready.
- Generic error handling is not confirmed.
- Preview test result is not documented.
- Any log reveals pasted text, prompts, raw provider responses, request bodies, response bodies, headers, Authorization values, API keys, bypass secrets, or other secrets.
- The operator is not ready to observe Production after activation.
- Tests fail without a safe, understood reason.

## Go/No-Go Decision Table

| Decision item | Status |
| --- | --- |
| Local POC passed | yes |
| Preview API test passed | yes |
| Browser preview smoke test passed | yes |
| Preview logs clean | yes |
| Production env vars unchanged so far | yes |
| Provider cost/rate limits reviewed | pending |
| Provider data retention/logging reviewed | pending |
| Rollback plan ready | must be yes |
| Production monitoring/log review ready | must be yes |
| Decision | pending |

## Activation-Day Checklist

Future only. Do not execute as part of Build 13.

- Reconfirm Production is mock/default before changes.
- Reconfirm selected provider endpoint compatibility.
- Reconfirm cost, rate limits, and data-retention review.
- Reconfirm secrets are ready for hosting environment storage only.
- Set Production env vars only after explicit approval.
- Deploy or redeploy only after explicit approval.
- Run Production smoke tests with synthetic text only.
- Review Production logs for safe status codes and generic errors only.
- Confirm no prohibited content appears in logs.
- Document pass/fail result using safe categories only.

## Post-Activation Observation Checklist

If Production live mode is activated later:

- Watch for unexpected 500 responses.
- Watch for provider timeout categories.
- Watch for schema-validation failures.
- Watch for user-facing stack traces or raw JSON.
- Watch for high-risk alert regressions.
- Review logs for prohibited content.
- Roll back immediately if secrets or sensitive text appear.

## Result Documentation Template

Use this template after any future activation decision or activation attempt:

```text
Decision date:
Decision:
Production provider mode after decision:
Production env vars changed:
Preview promoted to Production:
Smoke test result:
Log review result:
Rollback needed:
Rollback result:
Safe failure categories, if any:
Secrets/raw outputs/prompts/request bodies/response bodies/headers documented: no
Pasted document text or sensitive examples documented: no
Next step:
```
