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

## Model Provider

Plainly currently uses a mocked local model provider. Real Gemma integration is
not connected yet.

Copy `.env.local.example` to `.env.local` when local secrets are needed. Keep
real secrets in `.env.local` only, and do not commit them.
