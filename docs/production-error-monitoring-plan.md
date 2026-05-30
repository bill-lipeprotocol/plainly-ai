# Production Error Monitoring Plan

This plan defines what to watch for the Plainly.ai public MVP before adding any monitoring vendor, analytics, or observability SDK.

## Purpose

Plainly.ai is deployed at https://plainly-ai.vercel.app as an MVP v1 public demo. The hosted deployment uses mock/default provider mode. Explanation cards are sample/mock output, while high-risk detection runs on pasted text.

The purpose of this plan is to keep production checks safe and useful without collecting document text, prompts, provider output, secrets, or user-identifying details.

## Current Monitoring Posture

- No monitoring vendor is installed.
- No analytics are installed.
- No Sentry, Logtail, Datadog, or third-party observability SDK is installed.
- Hosted live Gemma is not enabled.
- Local live Gemma remains opt-in behind environment flags only.
- Production health is checked manually with browser smoke tests, API smoke tests, Vercel dashboard review, and local regression checks.

## MVP Monitoring Principles

- Watch behavior, status codes, and safe failure categories.
- Use only synthetic, non-sensitive text for checks.
- Keep hosted provider mode intentional.
- Treat mock/default mode as the safe production baseline.
- Do not add analytics until there is a privacy plan.
- Do not add a monitoring SDK until a privacy review defines what data is collected, retained, and visible.
- Do not enable hosted live provider without a reachable hosted provider URL and a secret-handling plan.

## What To Watch Manually

- Production page loads successfully.
- `/api/explain` returns a result for synthetic low-risk text.
- High-risk alert appears for synthetic high-risk text.
- High-risk alert does not appear for obvious negated low-risk disclaimer text.
- Generic errors do not expose internals.
- Vercel logs show only status codes and generic errors.
- Hosted provider mode remains mock/default unless live mode is intentionally evaluated later.

## Production Smoke-Test Cadence

Run a manual smoke test:

- after each deployment
- after environment variable changes
- after changes to copy, validation, high-risk detection, provider routing, or API handling
- before public demos
- when a user reports a production issue

## Production API Smoke Test

Use synthetic text only. This command prints only safe summary fields and status.

```powershell
$uri = "https://plainly-ai.vercel.app/api/explain"
$body = @{
  documentType = "General"
  userQuestion = "What is the main point?"
  documentText = "This is a synthetic household notice for production smoke testing only. It says a fictional service plan will renew on June 30 unless the customer contacts the sender before that date. It includes no real personal information."
} | ConvertTo-Json
try {
  $response = Invoke-WebRequest -Uri $uri -Method Post -ContentType "application/json" -Body $body
  $data = $response.Content | ConvertFrom-Json
  "status=$($response.StatusCode)"
  "result=$([bool]$data.result)"
  "summary=$([bool]$data.result.plainEnglishSummary)"
  "notAdvice=$([bool]$data.result.notAdviceNotice)"
  "highRisk=$($data.showHighRiskAlert)"
} catch {
  "status=$($_.Exception.Response.StatusCode.value__)"
  "category=production-api-smoke-failed"
}
```

Do not print the request body, response body, pasted text, prompts, raw provider responses, headers, Authorization values, or secrets.

## Local Mock Regression Commands

Clear provider variables:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
```

Run safe local checks:

```powershell
npm run check:provider
npm run lint
npm run build
npm run test:adapter
```

Run mock API regression with a local dev server.

Terminal 1:

```powershell
npm run dev
```

Terminal 2:

```powershell
npm run test:api
```

## Live Local-Only Checks

Use these only for local live-provider verification. Do not use the local Ollama URL for hosted production.

Terminal 1:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
npm run dev
```

Terminal 2:

```powershell
npm run check:provider
npm run test:gemma:live
npm run test:api:live
```

## Return To Mock Mode

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Check working tree:

```powershell
git status
```

## Browser Smoke-Test Checklist

Use https://plainly-ai.vercel.app and synthetic text only.

- Page loads without a blank screen.
- The headline and safety copy are visible.
- The sample notice button fills the form but does not auto-submit.
- Submitting the sample returns result sections.
- Privacy warning is visible before submission.
- Not-advice notice is visible in the result.
- High-risk synthetic text triggers the alert.
- Negated low-risk synthetic text does not trigger the alert.
- Generic failures do not show stack traces, raw JSON, provider output, prompts, headers, Authorization values, or secrets.

Synthetic high-risk browser check:

```text
This is a synthetic court notice for testing only. It says a court date is scheduled for July 15 and missing the date may affect available options. It contains no real personal information.
```

Synthetic negated low-risk browser check:

```text
This is a synthetic service notice for testing only. It does not mention eviction, foreclosure, collections, legal action, court action, denied coverage, medical issues, or taxes. It contains no real personal information.
```

## Vercel Dashboard And Manual Log Review Checklist

Inspect Vercel logs for:

- HTTP status code patterns
- route-level failures
- generic server errors
- repeated 500s
- repeated failed requests to `/api/explain`
- build or deployment errors

Do not use logs to inspect user content.

Treat any appearance of the following in production logs as a launch blocker:

- pasted document text
- prompts
- raw model responses
- request bodies
- response bodies
- Authorization headers
- API keys
- secrets
- names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, or other sensitive details

## Safe Error Categories

Use these categories in manual notes and future tooling:

- page-load-failure
- api-http-status
- api-invalid-json
- api-missing-result
- api-missing-not-advice-notice
- high-risk-mismatch
- provider-misconfigured
- provider-unexpected-live-mode
- unsafe-log-content
- unknown

Do not attach raw request bodies, response bodies, provider output, prompts, or pasted text to incident notes.

## What Must Never Be Logged

Do not log:

- pasted document text
- prompts
- raw model responses
- request bodies
- response bodies
- Authorization headers
- secrets
- API keys
- provider URLs when they include sensitive parameters
- names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, or other sensitive details

## Privacy And Sensitive-Text Handling

- Use synthetic examples for monitoring, tests, screenshots, issues, and docs.
- If a tester reports an issue with real paperwork, ask for a high-level description without document text or sensitive details.
- Do not paste user-provided document text into tickets, docs, logs, or chat.
- Do not store screenshots that contain user-provided document text.
- Do not claim privacy or storage guarantees beyond what is implemented.

## API Health Checks

Healthy production API behavior:

- `POST /api/explain` accepts valid synthetic text.
- Response status is 200 for valid synthetic input.
- Response includes `result`.
- Response includes `result.plainEnglishSummary`.
- Response includes `result.notAdviceNotice`.
- Response includes `showHighRiskAlert`.
- 400-style failures are generic validation failures.
- 500-style failures use safe generic language.

Unhealthy API behavior:

- repeated 500s for valid synthetic input
- stack traces in responses
- raw JSON dumps in UI
- provider details in responses
- prompts, pasted text, headers, secrets, request bodies, or response bodies in logs

## UI Health Checks

Healthy UI behavior:

- page loads
- form is usable on desktop and mobile
- privacy warning appears before submission
- sample text is synthetic
- sample fill does not auto-submit
- loading state is calm
- result sections are readable
- not-advice notice remains visible
- feedback buttons do not imply a backend submission

## High-Risk Alert Health Checks

Should show alert for synthetic text involving:

- eviction may occur
- court date
- lawsuit
- foreclosure notice
- sent to collections
- coverage has been denied
- benefits denial
- appeal deadline
- subpoena
- wage garnishment
- emergency medical
- termination notice

Should not show alert solely for obvious negated disclaimer text:

- does not mention eviction
- does not mention foreclosure
- does not mention collections
- does not mention denied coverage
- no court action
- no legal action
- not about denied coverage

Mixed text should still alert when a real risk phrase appears elsewhere.

## Provider-Mode Checks

Production expected mode:

- Hosted deployment uses mock/default provider.
- Hosted live Gemma is not enabled.
- Explanation cards are sample/mock output.
- High-risk detection runs on pasted text.

Local live checks are separate and opt-in:

- `PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible`
- `GEMMA_API_URL` configured
- `GEMMA_MODEL_NAME` configured
- `GEMMA_API_KEY` optional for local Ollama

Do not enable hosted live provider without:

- reachable hosted provider URL
- secret-handling plan
- production error-monitoring plan update
- live-provider regression plan
- privacy review

## No-Secrets Checks

Before and after monitoring work:

- `.env.local` is not modified or staged.
- No API key appears in code, docs, logs, issues, or screenshots.
- No Authorization header appears in code, docs, logs, issues, or screenshots.
- No real provider secret appears in Vercel logs.
- `git status` shows only expected changes.

## Launch Blocker Criteria

Block launch or demo if any are true:

- production page does not load
- production API fails for valid synthetic smoke-test input
- high-risk alert fails obvious true-positive synthetic checks
- negated low-risk text triggers obvious false-positive alerts after a detector change
- user-facing errors show stack traces or raw JSON
- Vercel logs contain pasted text, prompts, raw provider output, request bodies, response bodies, headers, Authorization values, or secrets
- hosted provider mode is live unintentionally
- `.env.local` or secrets are modified or staged
- README, launch note, or UI claims live production AI when hosted mode is mock/default
- analytics or monitoring SDK is added without privacy review

## Incident Response Steps

1. Do not copy user-provided document text into notes.
2. Record the safe category, route, time window, and status code if available.
3. Run the production API smoke test with synthetic text.
4. Review Vercel logs for status codes and generic errors only.
5. Check provider mode and environment variables.
6. Run local mock regression checks.
7. If live provider mode is involved, return to mock mode until live behavior is reviewed.
8. Update docs or tests only with synthetic examples.

## Rollback Plan

If production behavior is unsafe or confusing:

- keep or return hosted deployment to mock/default mode
- remove any unintended live-provider environment variables
- redeploy the last known safe build if needed
- rerun production smoke test
- rerun browser checklist
- document the incident with safe categories only

Local rollback:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

## Future Monitoring Options, Docs-Only Evaluation

Evaluate options in documentation before installing anything:

- Vercel built-in dashboard review
- server-side safe counters without document text
- generic route health checks
- error category aggregation
- privacy-reviewed monitoring vendor

Evaluation must answer:

- what data is collected
- whether request or response bodies are captured
- whether headers are captured
- whether IPs or user identifiers are captured
- who can access logs
- retention period
- redaction controls
- opt-out or disable process
- whether analytics are included

## Go/No-Go For Adding A Monitoring Tool Later

Go only if:

- privacy review is complete
- collected fields are documented
- request bodies and response bodies are disabled or redacted
- headers and Authorization values are disabled or redacted
- document text and prompts are not collected
- raw provider output is not collected
- secrets are not collected
- analytics are intentionally reviewed before enabling
- rollback and disable steps are documented

No-go if:

- tool captures request or response bodies by default and cannot be disabled
- tool captures headers or Authorization values by default and cannot be disabled
- tool captures pasted document text, prompts, or raw provider output
- tool adds analytics without a privacy plan
- tool requires storing sensitive user content
- hosted live provider would be enabled without reachable provider and secret-handling plans
