# Deployment Prep Checklist

This checklist prepares Plainly.ai for a future public MVP deployment or demo. It does not deploy anything.

## MVP Purpose

Plainly.ai is a text-only MVP that explains confusing household paperwork in simple English. It helps summarize pasted text, identify dates and money, suggest questions to ask the sender, and flag words that may deserve prompt attention.

## MVP Boundaries

- Plainly explains text the user pastes.
- Plainly is not legal, medical, tax, insurance, financial, or professional advice.
- Plainly does not guarantee accuracy, outcomes, eligibility, deadlines, rights, or obligations.
- Plainly does not include accounts, uploads, OCR, PDF parsing, payments, analytics, database, document storage, or document history.
- Default provider behavior must remain mock.
- Live provider behavior must remain opt-in only.

## Environment Modes

Mock mode:

- `PLAINLY_MODEL_PROVIDER` unset or `mock`
- no Gemma variables required
- safest default for demos when live provider behavior is not explicitly needed

Live OpenAI-compatible mode:

- `PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible`
- `GEMMA_API_URL` required
- `GEMMA_MODEL_NAME` required
- `GEMMA_API_KEY` optional for local Ollama
- `GEMMA_TIMEOUT_MS` optional

Do not commit `.env.local`. Do not commit API keys or provider secrets.

## Baseline Commands

Check working tree:

```powershell
git status
```

Clear provider environment variables and return to mock mode:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
```

Check provider configuration:

```powershell
npm run check:provider
```

Run standard checks:

```powershell
npm run lint
npm run build
npm run test:adapter
```

## Default Mock Verification

Terminal 1:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
npm run dev
```

Terminal 2:

```powershell
npm run test:api
```

Expected result: the synthetic API regression passes in mock/default mode.

## Live Verification

Use live mode only when intentionally verifying the OpenAI-compatible provider.

Set live provider variables locally:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
npm run check:provider
```

Run isolated adapter verification:

```powershell
npm run test:gemma:live
```

Run live `/api/explain` verification with the dev server already running in live mode.

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
npm run test:api:live
```

## Return To Mock Mode

After live verification, clear live provider variables:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

## No-Secrets Checklist

- `.env.local` is not modified.
- `.env.local` is not staged.
- No API key appears in source, docs, tests, logs, or screenshots.
- No Authorization header appears in source, docs, tests, logs, or screenshots.
- No raw provider response appears in source, docs, tests, logs, or screenshots.
- `git status` shows only expected files.

## Privacy Checklist

- Tests and docs use synthetic text only.
- No real household document text is included.
- No names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, or other sensitive details are included.
- UI copy reminds users to remove sensitive details before pasting.
- No document storage, history, uploads, OCR, PDF parsing, accounts, analytics, or database behavior is added.

## Error-Safety Checklist

- User-facing errors are generic and actionable.
- API failures do not expose provider details.
- Scripts print safe PASS/FAIL categories only.
- No prompts, document text, request bodies, response bodies, headers, Authorization values, raw model responses, or secrets are logged.

## UI Copy Checklist

- Landing promise is clear: confusing paperwork, explained in simple English.
- Copy does not imply professional advice.
- Form explains what to paste and asks users to remove sensitive details.
- Loading state is calm and does not claim certainty.
- Result view keeps the not-advice notice visible.
- Feedback UI does not ask users to provide sensitive details.

## High-Risk Alert Checklist

Should alert for synthetic examples involving:

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

Should not alert solely for obvious negated/disclaimer phrases:

- does not mention eviction
- does not mention foreclosure
- no collections
- no legal action
- no denied coverage
- not about eviction
- not about denied coverage

Mixed text with a negated disclaimer and a later real risk phrase should alert.

## Go/No-Go Checklist

Go only if:

- `git status` shows only expected changes.
- `.env.local` is unchanged and unstaged.
- `npm run check:provider` passes in the intended mode.
- `npm run lint` passes.
- `npm run build` passes.
- `npm run test:adapter` passes.
- `npm run test:api` passes in mock mode.
- Manual UI review passes with synthetic text.
- The default provider remains mock.
- Live provider is enabled only intentionally.

## Do Not Deploy Yet If

- Any secret, API key, Authorization header, raw prompt, request body, response body, or raw provider response appears in code, docs, logs, or screenshots.
- `.env.local` is modified or staged.
- Default behavior depends on live Gemma.
- Provider preflight is failing.
- Lint, build, adapter tests, or API tests fail.
- User-facing errors expose provider or internal details.
- The UI implies legal, medical, tax, insurance, financial, or professional advice.
- Real personal document text was used in manual testing or documentation.

## Rollback To Mock Mode

Use this immediately if live behavior is unstable or not needed:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Then restart the dev server:

```powershell
npm run dev
```
