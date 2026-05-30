# Plainly.ai

Plainly.ai is a text-only MVP that explains confusing household paperwork in simple English.

## Current Scope

The first version is a mocked front-end prototype.

Users can:

- select a document type
- paste document text
- optionally ask what they are trying to understand
- receive a mocked structured explanation
- click feedback buttons

## Not Included in V1

- No accounts
- No PDF upload
- No image upload
- No document storage
- No saved history
- No payments
- No professional legal, medical, tax, or financial advice
- No live model call by default

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Development

```bash
npm install
npm run dev
```

To run the local synthetic API regression check, keep the dev server running and
use another terminal:

```bash
npm run test:api
```

The API test posts synthetic samples to local `/api/explain` and reports
pass/fail status without printing full document text or prompts.

For the full local launch-readiness checklist, including mock mode, live Gemma
mode, rollback, and go/no-go steps, see
[docs/mvp-launch-readiness-runbook.md](docs/mvp-launch-readiness-runbook.md).

To run the mocked Gemma adapter parsing checks:

```bash
npm run test:adapter
```

The adapter test checks valid JSON, invalid JSON, and schema-invalid JSON
without printing document text, prompts, or raw model responses.

## Model Provider

Plainly defaults to the mocked local model provider. With no `.env.local` and no
`PLAINLY_MODEL_PROVIDER`, the app returns the local mocked result.

Provider selection uses `PLAINLY_MODEL_PROVIDER`:

- missing or `mock`: returns the local mocked result
- `gemma-hosted`: routes through the mocked hosted adapter with no network call
- `gemma-hosted-openai-compatible`: opts into the live OpenAI-compatible Gemma adapter
- `gemma-hosted-custom-prompt`: not implemented yet
- `gemma-local`: not implemented yet
- legacy `gemma`: not implemented

To opt into live OpenAI-compatible routing locally, set:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
```

`GEMMA_API_KEY` is optional for local Ollama. `GEMMA_TIMEOUT_MS` is optional and
defaults to 30000.

Copy `.env.local.example` to `.env.local` when local secrets are needed. Keep
real secrets in `.env.local` only, and do not commit `.env.local`.

### Provider Preflight

Run the safe provider preflight before manual tests:

```powershell
npm run check:provider
```

The preflight makes no network calls. It prints the provider value, boolean-only
Gemma configuration status, timeout validity, inferred mode, and pass/fail
status. It does not print URLs, model names, API keys, prompts, document text,
request or response bodies, headers, or secrets.

For default mock verification:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
npm run check:provider
```

For live OpenAI-compatible verification:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
npm run check:provider
```

### Manual Live Adapter Testing

To test only the isolated OpenAI-compatible Gemma adapter manually:

```powershell
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
npm run test:gemma:live
```

This isolated test does not change normal app behavior.

### Manual Live API Testing

To test the full `/api/explain` route with the live OpenAI-compatible provider,
start the dev server with live provider environment in one PowerShell terminal:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="http://localhost:11434/v1/chat/completions"
$env:GEMMA_MODEL_NAME="gemma4:31b-cloud"
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
npm run dev
```

Then run the live API regression from a second PowerShell terminal:

```powershell
npm run test:api:live
```

The live API regression posts synthetic low-risk and high-risk examples to
`/api/explain`, reports safe PASS/FAIL categories, and does not print document
text, prompts, response bodies, headers, or secrets. Set `PLAINLY_API_URL` only
if the dev server is not using the default `http://localhost:3000/api/explain`.

The default provider is still mocked. Additional Gemma provider plans and safety
requirements are documented in
[docs/gemma-integration-plan.md](docs/gemma-integration-plan.md). Concrete
future request and response examples are documented in
[docs/provider-contracts.md](docs/provider-contracts.md).



