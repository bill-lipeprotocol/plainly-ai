# Plainly.ai

Plainly.ai is a text-only MVP that explains confusing household paperwork in simple English.

## Current Scope

Plainly.ai is currently a launch-prep MVP. The default provider remains mocked,
and live Gemma routing is opt-in only for local verification.

Users can:

- select a document type
- try a fully synthetic sample notice
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

## MVP Status

- Default provider: mock.
- Public MVP demo: https://plainly-ai.vercel.app
- Hosted deployment mode: mock/default.
- Live provider: opt-in with `PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible`.
- Hosted live Gemma is not enabled. Local live Gemma verification remains available behind environment flags.
- No uploads, accounts, payments, analytics, database, document storage, or document history.
- Do not commit `.env.local` or secrets.

Key local checks:

```powershell
npm run check:provider
npm run lint
npm run build
npm run test:adapter
```

Operational docs:

- [MVP v1 launch note](docs/mvp-v1-launch-note.md)
- [Deployment smoke test](docs/deployment-smoke-test.md)
- [MVP launch-readiness runbook](docs/mvp-launch-readiness-runbook.md)
- [Deployment prep checklist](docs/deployment-prep-checklist.md)

## Public MVP Demo

The public MVP demo is available at https://plainly-ai.vercel.app.

The hosted deployment runs in mock/default mode. Explanation cards in the hosted
demo are sample output, while high-risk detection runs on the pasted text. Hosted
live Gemma is not enabled because the local Ollama URL used for development is
not suitable for hosted deployment.

See [docs/mvp-v1-launch-note.md](docs/mvp-v1-launch-note.md) for the public
launch note and [docs/deployment-smoke-test.md](docs/deployment-smoke-test.md)
for the production smoke test.

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



