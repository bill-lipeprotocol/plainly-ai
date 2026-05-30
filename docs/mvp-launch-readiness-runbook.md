# MVP Launch-Readiness Runbook

This runbook is for safely running, verifying, and troubleshooting the Plainly.ai MVP locally before any launch, demo, or deployment work.

## Purpose

Plainly.ai is a text-only MVP that helps people understand confusing household paperwork in simple English. It summarizes pasted text, highlights dates and money, suggests questions to ask the sender, and flags words that may deserve prompt attention.

## MVP Boundaries

- Plainly explains pasted text only.
- Plainly does not provide legal, medical, tax, insurance, financial, or other professional advice.
- Plainly does not guarantee accuracy, outcomes, eligibility, rights, deadlines, or obligations.
- Plainly does not upload files, parse PDFs, store documents, keep history, manage accounts, take payments, or send analytics.
- Default local behavior is mock mode.
- Live Gemma behavior is opt-in only with `PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible`.

## Do Not Commit

Never commit:

- `.env.local`
- API keys
- Authorization headers
- real household document text
- real personal data
- prompts
- raw provider responses
- request or response bodies

Check before any handoff:

```powershell
git status
```

## Privacy And Sensitive Text Rules

Use synthetic examples for tests and demos. Before pasting any user-like text into the UI, remove names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, and other sensitive details.

Do not add logs for `documentText`, prompts, raw model responses, request bodies, response bodies, headers, Authorization values, or secrets.

## Provider Modes

Mock/default mode:

- `PLAINLY_MODEL_PROVIDER` unset or `mock`
- no live provider environment variables required
- `/api/explain` returns the local mocked Plainly result

Live OpenAI-compatible Gemma mode:

- `PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible`
- `GEMMA_API_URL` required
- `GEMMA_MODEL_NAME` required
- `GEMMA_API_KEY` optional for local Ollama
- `GEMMA_TIMEOUT_MS` optional

Other provider values:

- `gemma-hosted` currently uses the mocked hosted adapter
- `gemma-hosted-custom-prompt`, `gemma-local`, and legacy `gemma` are not implemented for live use
- unknown providers should fail safely

## Provider Preflight

Clear provider environment variables and verify mock mode:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Verify live OpenAI-compatible configuration:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
npm run check:provider
```

The preflight prints boolean-only Gemma configuration status. It must not print actual URLs, model names, API keys, prompts, document text, bodies, headers, or secrets.

## Standard Verification

Run these before demo or handoff:

```powershell
npm run lint
npm run build
npm run test:adapter
npm run check:provider
```

## Default Mock Verification

Terminal 1:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run dev
```

Terminal 2:

```powershell
npm run test:api
```

Expected result: all synthetic API samples pass, including low-risk samples, high-risk samples, negated-disclaimer samples, and mixed real-risk samples.

## Isolated Live Adapter Verification

Use this when the OpenAI-compatible provider is running locally and you want to test only the adapter, not `/api/explain`.

```powershell
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
npm run test:gemma:live
```

Expected result: the script reports a validated `PlainlyResult`. It should print only safe status and category diagnostics, not prompts, raw model content, request bodies, response bodies, headers, or secrets.

## Live API Verification

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
npm run test:api:live
```

Expected result: the live API regression posts synthetic low-risk and high-risk examples to `/api/explain` and reports safe PASS/FAIL categories only.

## Return To Mock Mode

Use this after live testing:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

## Manual UI Review Checklist

Use synthetic text only.

- Landing page clearly says: confusing paperwork, explained in simple English.
- The UI does not imply legal, medical, tax, insurance, or financial advice.
- Paste box shows a visible warning to remove sensitive details before submitting.
- Empty and short-text guidance is clear and non-technical.
- Loading state is calm and does not claim certainty.
- Generic error asks the user to try a shorter section, remove unusual formatting, or try again.
- Result sections render summary, document type guess, dates, money, possible next steps, questions, unclear parts, and not-advice notice.
- Not-advice notice is visible but not alarming.
- Feedback UI does not ask for sensitive details.

## High-Risk Alert Test Cases

Use synthetic examples only.

Should show the alert:

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

Should not show the alert solely because of a negated disclaimer:

- does not mention eviction
- does not mention foreclosure
- does not mention denied coverage
- does not include eviction
- no eviction
- no foreclosure
- no collections
- no court action
- no legal action
- no denied coverage
- not about eviction
- not about foreclosure
- not about collections
- not about denied coverage

Mixed text should still show the alert when real risk appears later, for example: the FAQ does not mention eviction, but a later section says eviction may occur.

## Safe Failure Handling

User-facing failures should stay generic and actionable. They should not expose provider errors, prompts, raw model output, request bodies, response bodies, headers, Authorization values, or secrets.

Safe user action guidance:

- try a shorter section
- remove unusual formatting
- try again in a moment

Safe script diagnostics:

- pass/fail status
- HTTP status code when needed
- failure category
- boolean provider configuration status

## Troubleshooting

Provider preflight fails in mock mode:

- Clear provider environment variables.
- Run `npm run check:provider` again.

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Live adapter fails with missing environment:

- Set `GEMMA_API_URL`.
- Set `GEMMA_MODEL_NAME`.
- Leave `GEMMA_API_KEY` unset for local Ollama unless the provider requires it.

Live API test reports `server-unreachable`:

- Confirm `npm run dev` is running.
- Confirm the live dev server is on `http://localhost:3000`.
- If using another port, set `PLAINLY_API_URL` in the test terminal.

```powershell
$env:PLAINLY_API_URL="http://localhost:3000/api/explain"
npm run test:api:live
```

Live API returns HTTP 500:

- Do not print the response body.
- Run `npm run check:provider`.
- Run `npm run test:gemma:live` to isolate adapter/provider behavior.
- Return to mock mode if the demo does not require live provider behavior.

## Known Limitations

- Text-only MVP.
- No file upload or OCR.
- No document storage or history.
- No accounts or payments.
- No production deployment workflow in this runbook.
- High-risk alert is keyword-based and may still have false positives or false negatives.
- Live provider output must match the `PlainlyResult` shape exactly.
- Live provider is opt-in only and should not be treated as default behavior.

## Rollback Plan

If live provider behavior is unstable, return to mock mode:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Then restart the dev server in mock mode:

```powershell
npm run dev
```

Verify default API behavior:

```powershell
npm run test:api
```

## Go/No-Go Checklist

Go only if all are true:

- `git status` shows only expected documentation or approved changes.
- `.env.local` is not modified or staged.
- No secrets are present in the working tree.
- `npm run lint` passes.
- `npm run build` passes.
- `npm run test:adapter` passes.
- `npm run check:provider` passes.
- `npm run test:api` passes in mock mode.
- Manual UI review passes with synthetic examples.
- High-risk alert appears for true high-risk synthetic text.
- High-risk alert does not appear for obvious negated disclaimer text.
- Generic failure copy is safe and non-technical.
- Live provider is only enabled intentionally for live verification.

No-go if any are true:

- Any real personal document text was used in tests or docs.
- Any secret, API key, Authorization header, prompt, request body, response body, or raw provider output appears in logs or files.
- `.env.local` is changed or staged.
- Default provider behavior is no longer mock.
- `/api/explain` exposes internal provider errors.
- Required checks fail.
