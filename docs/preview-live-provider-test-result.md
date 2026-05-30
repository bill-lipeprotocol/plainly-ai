# Preview Live Provider Test Result

## Purpose

This document records the safe result of the preview-only live-provider test for Plainly.ai.

It records status, counts, safe failure categories, and next steps only. It does not include API keys, bypass secrets, provider endpoint values, raw provider responses, raw prompts, request bodies, response bodies, headers, Authorization values, secrets, pasted document text, or sensitive examples.

## Preview-Test Boundary

- Test date: 2026-05-30
- Scope: Vercel preview deployment live-provider test
- Preview deployment URL: not documented
- Production environment variables changed: no
- Preview promoted to production: no
- Production provider mode: mock/default
- Hosted production live provider: not enabled

Production remains mock/default until a separate production activation decision is made.

## Safe Result Summary

Conclusion: pass.

The preview live-provider test passed after retry.

Safe summary:

- preview API test final result: pass
- `npm run test:api:live` total cases: 2
- `npm run test:api:live` passed: 2
- `npm run test:api:live` failed: 0
- browser preview smoke test: pass
- Vercel preview log review: pass
- secrets or raw outputs documented: no
- production remains mock/default: yes

## Tests Run

The preview test included:

- live `/api/explain` regression against the preview deployment
- browser preview smoke test
- high-risk alert check through preview UI
- Vercel preview log review
- production status check confirming production remained mock/default

All test content was synthetic and non-sensitive.

## Retry Notes

Only safe categories are recorded.

- First API attempt: `http-status 401`, likely automation access/protection.
- Later attempt: one high-risk synthetic case returned `http-status 500`.
- Final retry: passed 2/2.

No raw logs, raw provider responses, request bodies, response bodies, prompts, headers, Authorization values, API keys, bypass secrets, pasted document text, or sensitive examples are included here.

## What Was Not Done

- No production deployment was performed.
- Preview was not promoted to production.
- Production live provider mode was not enabled.
- Production Vercel environment variables were not changed.
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
- bypass secrets
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

The preview result should continue to be discussed only through safe categories, pass/fail status, counts, and boolean configuration status.

## Production Status

Production URL:

https://plainly-ai.vercel.app

Production remains mock/default mode.

The hosted production deployment still serves sample/mock explanation output. High-risk detection continues to run on pasted text. Hosted production live provider is not enabled.

## Remaining Blockers Before Production Live Activation

Before any production live-provider activation:

- decide whether to proceed from preview success to production activation planning
- review Gemini provider cost and rate limits
- review Gemini provider data-retention and logging terms
- decide monitoring and privacy posture before broader release
- confirm production secret-management approach
- rehearse rollback to mock/default mode
- update public docs if production live mode is intentionally enabled later
- confirm logs do not contain pasted text, prompts, raw responses, request bodies, response bodies, headers, Authorization values, API keys, bypass secrets, or other secrets

## Rollback And Removal Notes

Preview live-provider variables should be removed if preview live testing is not continuing.

If any secret was exposed outside the approved secret store, revoke and replace it.

Production rollback should not be needed because production was not changed. If production is ever changed accidentally, remove production live-provider variables and restore mock/default immediately.

Local cleanup command:

```powershell
Remove-Item Env:PLAINLY_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

## Next Gated Steps

1. Remove preview live-provider environment variables if preview testing is not continuing.
2. Review Gemini provider cost and rate limits.
3. Review Gemini provider data-retention and logging terms.
4. Decide monitoring and privacy posture before broader release.
5. Prepare a production live-provider activation decision document if live production mode is still desired.
6. Keep production mock/default until that separate activation decision is made.
