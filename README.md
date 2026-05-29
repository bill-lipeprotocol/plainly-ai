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
- No live model call yet

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

To run the mocked Gemma adapter parsing checks:

```bash
npm run test:adapter
```

The adapter test checks valid JSON, invalid JSON, and schema-invalid JSON
without printing document text, prompts, or raw model responses.

## Model Provider

Plainly currently uses a mocked local model provider. Real Gemma integration is
not connected yet.

Provider selection uses `PLAINLY_MODEL_PROVIDER`. If it is missing or set to
`mock`, Plainly returns the local mocked result. `gemma-hosted` routes through a
mocked adapter that still makes no network calls. `gemma-local` and the legacy
`gemma` alias return not-implemented errors.

Copy `.env.local.example` to `.env.local` when local secrets are needed. Keep
real secrets in `.env.local` only, and do not commit them.

## Model Provider Status

The current provider is still mocked. The planned Gemma provider modes and
safety requirements are documented in
[docs/gemma-integration-plan.md](docs/gemma-integration-plan.md).
