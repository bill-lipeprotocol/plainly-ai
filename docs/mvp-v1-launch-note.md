# Plainly.ai MVP v1 Launch Note

## Release

- Product: Plainly.ai
- Production URL: https://plainly-ai.vercel.app
- Release label: MVP v1 public demo
- Current hosted provider mode: mock/default

## What Is Live

Plainly.ai is deployed as a public MVP demo. Users can:

- open the public site
- try a fully synthetic sample notice
- paste one section of household paperwork text
- select a document type
- optionally ask a short question
- receive a structured sample explanation card
- see a high-risk alert when keyword detection finds higher-stakes language
- use local feedback buttons in the page UI

In the hosted deployment, the explanation cards are mock/sample output. The high-risk alert runs on the pasted text.

## Provider Status

The hosted deployment uses mock/default mode.

Hosted live Gemma is not enabled. The local OpenAI-compatible Gemma integration exists behind environment flags for local verification only. The local Ollama URL used during development is not suitable for hosted deployment.

## What Is Intentionally Excluded

MVP v1 does not include:

- production live AI explanations
- accounts
- uploads
- OCR
- PDF parsing
- payments
- analytics
- database storage
- document storage
- document history
- email sending
- contact-form backend
- professional legal, medical, tax, insurance, or financial advice

## Safety And Privacy Boundaries

- Plainly explains pasted text only.
- Users should remove names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, and other sensitive details before pasting.
- The MVP does not add document storage or document history.
- Do not treat the public demo as a secure document vault.
- Do not add logs for document text, prompts, request bodies, response bodies, headers, Authorization values, raw provider output, or secrets.
- Do not commit `.env.local` or API keys.

## Not-Advice Boundary

Plainly can help users understand text, but it is not a substitute for a qualified professional. It does not provide legal, medical, tax, insurance, financial, or other professional advice.

## Known Limitations

- Hosted explanations are mock/sample output in this release.
- High-risk detection is deterministic and keyword-based.
- High-risk detection can still have false positives or false negatives.
- The app is text-only.
- Long documents should be shortened to one important section.
- There is no upload, storage, account, saved history, analytics, OCR, PDF parsing, or database feature.
- Live Gemma provider behavior is not enabled in production.

## Verification Completed

The deployment smoke test is documented in [deployment-smoke-test.md](deployment-smoke-test.md).

Completed checks include:

- public page loads
- sample notice fills the form
- sample submit returns a result
- privacy warning is visible
- not-advice notice is visible
- high-risk synthetic alert appears
- negated low-risk sample does not trigger the alert
- public `/api/explain` smoke test passes
- no secrets or raw provider output are visible

Local verification commands remain:

```powershell
npm run check:provider
npm run lint
npm run build
npm run test:adapter
```

With a local mock-mode dev server running:

```powershell
npm run test:api
```

## Rollback Note

If hosted behavior becomes confusing or unsafe, keep or return the hosted environment to mock/default mode. Do not enable hosted live Gemma until a hosted provider evaluation, privacy review, error-monitoring plan, and live-provider regression plan are complete.

Local rollback to mock mode:

```powershell
Remove-Item Env:PLAINLY_MODEL_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_URL -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_MODEL_NAME -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:GEMMA_TIMEOUT_MS -ErrorAction SilentlyContinue
npm run check:provider
```

## Next Safe Upgrade Path

Recommended next milestones:

1. Hosted live-provider evaluation using a provider reachable from production.
2. Docs-first production error monitoring plan that avoids document text, prompts, request bodies, response bodies, headers, Authorization values, and secrets.
3. Domain and branding polish.
4. User feedback collection plan that does not store documents.
5. Privacy review before enabling any real provider in hosted production.
6. Live-provider regression checklist for hosted `/api/explain`.

Do not enable production live AI explanations until those steps are complete.
