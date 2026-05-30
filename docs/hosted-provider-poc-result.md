# Hosted Provider POC Result

## Purpose

This document records the safe result of the local-only hosted provider proof of concept for Plainly.ai.

It records status, boundaries, and next steps only. It does not include API keys, provider endpoint values, raw provider responses, raw prompts, request bodies, response bodies, headers, Authorization values, secrets, pasted document text, or sensitive examples.

## POC Boundary

- Date: 2026-05-30
- Candidate: Google Gemini API OpenAI-compatible endpoint
- Scope: local-only hosted provider proof of concept
- Production Vercel environment variables: not set
- Hosted production mode: mock/default
- Hosted live provider: not enabled
- Default app behavior: unchanged

Any key accidentally pasted outside the local shell must be revoked and replaced. Do not include the key value in docs, issues, screenshots, logs, or chat.

## Safe Result Summary

Conclusion: local-only POC passed.

Safe summary:

- `npm run check:provider`: passed
- `npm run test:gemma:live`: passed
- `npm run test:api:live`: passed
- `npm run test:api:live` cases: 2 total, 2 passed, 0 failed

No production behavior was changed.

## Tests Run

The following local checks were run with the hosted candidate configured only in the local shell:

- provider preflight
- isolated OpenAI-compatible adapter live test
- local live `/api/explain` regression script

The live API regression used synthetic, non-sensitive cases and printed only safe status and counts.

## What Was Not Done

- No deployment was performed.
- No Vercel environment variables were set.
- Hosted live mode was not enabled.
- No API keys were added to the repo.
- `.env.local` was not edited or committed.
- No app behavior changed.
- No provider routing changed.
- No model integration behavior changed.
- No schemas changed.
- No monitoring, analytics, auth, uploads, payments, database, document storage, OCR, PDF parsing, email sending, or contact-form backend was added.

## Privacy And No-Logging Confirmation

This result document does not include:

- API keys
- provider endpoint values
- raw provider responses
- raw prompts
- request bodies
- response bodies
- headers
- Authorization values
- secrets
- pasted document text
- sensitive examples

The POC result should continue to be discussed only through safe categories, counts, and boolean configuration status.

## Production Status

Production URL:

https://plainly-ai.vercel.app

Production remains mock/default mode.

The hosted deployment still serves sample/mock explanation output. High-risk detection continues to run on pasted text. Hosted live Gemini is not enabled.

## Known Remaining Blockers Before Preview Or Live Production

Before any preview deployment or production live-provider activation:

- choose whether to continue with the Gemini candidate
- review provider cost and rate limits
- review provider data-retention and logging terms
- decide secret-management approach in the hosting environment
- run a preview deployment live-provider test before production
- inspect logs to ensure no pasted text, prompts, raw responses, headers, or secrets appear
- decide monitoring and privacy posture before broader release

## Rollback To Mock/Default Mode

Use this local rollback command after any live-provider testing:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

Expected result:

- provider reports mock/default
- no live provider variables are required
- production remains mock/default

## Next Gated Steps

1. Decide whether to continue with the Gemini candidate.
2. Review Gemini provider cost and rate limits.
3. Review Gemini provider data-retention and logging terms.
4. Document the hosting secret-management approach.
5. Prepare a preview-deployment live-provider test plan.
6. Run preview live testing only after the local POC result and reviews are accepted.
7. Decide on production live-provider activation only after preview passes and rollback is rehearsed.
