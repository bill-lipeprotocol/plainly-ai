# Hosted Provider Candidate Selection

This note selects the first hosted live-provider candidate for local proof-of-concept testing. It does not add keys, configure Vercel, deploy, or enable hosted live mode.

## Current Production Mode

Production URL:

https://plainly-ai.vercel.app

Current hosted mode:

- mock/default provider
- hosted live provider not enabled
- explanation cards are sample/mock output
- high-risk detection runs on pasted text

Production must remain mock/default until local POC, preview testing, privacy review, cost review, logging review, and operator approval are complete.

## Selected First POC Candidate

First candidate:

- Google Gemini API OpenAI-compatible endpoint

Rationale:

- Google documents an OpenAI-compatible chat completions path for Gemini.
- The current Plainly adapter already sends a chat completions-style request.
- The current adapter already supports bearer-token authorization when `GEMMA_API_KEY` is configured.
- The current adapter extracts content from `choices[0].message.content`, matching the OpenAI-compatible response path Plainly expects.
- The POC can be run locally through existing scripts without changing production hosted mode.

Use the current Google Gemini OpenAI compatibility documentation to confirm the exact endpoint and supported model before running the POC.

## Fallback Candidate

Fallback if strict JSON adherence becomes the primary blocker:

- OpenAI API with Structured Outputs

Reason:

- Structured Outputs may provide stronger schema adherence if prompt-only strict JSON is not reliable enough.
- Using it would require a separate reviewed implementation decision because the current adapter is named and scoped around the Gemma/OpenAI-compatible path.

Do not switch providers or change implementation behavior inside this candidate-selection step.

## Later Alternatives

Later alternatives only:

- Together AI
- OpenRouter

Evaluate these only if the first candidate and fallback do not meet compatibility, safety, privacy, cost, or reliability requirements.

## Compatibility Requirements

A candidate must support:

- `POST` chat completions endpoint
- optional Authorization bearer token if needed
- model name supplied through `GEMMA_MODEL_NAME`
- response path compatible with `choices[0].message.content`
- strict `PlainlyResult` JSON output
- non-streaming response for this MVP
- timeout behavior compatible with `GEMMA_TIMEOUT_MS`

The provider must not require uploads, files, callbacks, webhooks, analytics, database storage, document storage, OCR, PDF parsing, or a custom backend.

## Required PlainlyResult Behavior

The provider message content must be valid JSON that passes `validatePlainlyResult`.

Required fields:

- `plainEnglishSummary`
- `documentTypeGuess`
- `importantDates`
- `moneyMentioned`
- `possibleActionSteps`
- `questionsToAskSender`
- `unclearOrRiskyParts`
- `notAdviceNotice`

Output requirements:

- valid JSON only
- no prose before or after JSON
- no comments
- no invented dates, amounts, deadlines, obligations, or sender intent
- not-advice notice remains present
- parser remains strict and must not be loosened to accept prose around JSON

Clean Markdown JSON fences are tolerated by the parser, but the desired provider behavior is JSON only.

## Local-Only POC Commands

Use placeholders only. Do not paste real keys into docs, tickets, screenshots, or chat.

Terminal 1:

```powershell
$env:PLAINLY_MODEL_PROVIDER="gemma-hosted-openai-compatible"
$env:GEMMA_API_URL="<hosted OpenAI-compatible chat completions URL>"
$env:GEMMA_MODEL_NAME="<hosted model name>"
$env:GEMMA_API_KEY="<provider API key>"
$env:GEMMA_TIMEOUT_MS="30000"
npm run check:provider
npm run test:gemma:live
```

If the isolated adapter test passes, start local `/api/explain` in live mode:

```powershell
npm run dev
```

Terminal 2:

```powershell
npm run test:api:live
```

Do not run these commands with real credentials unless the operator intentionally obtained the key outside the repo and is ready to test locally.

## Required Environment Variables

Use local shell variables only for the POC:

```text
PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible
GEMMA_API_URL=<hosted OpenAI-compatible chat completions URL>
GEMMA_MODEL_NAME=<hosted model name>
GEMMA_API_KEY=<provider API key>
GEMMA_TIMEOUT_MS=30000
```

Do not set Vercel environment variables yet. Do not commit `.env.local`. Keep production mock/default.

## Safe Failure Categories

Expected safe failure categories:

- missing-env
- timeout
- provider-status
- provider-response-shape
- invalid-json
- schema-invalid-json
- server-unreachable
- http-status
- invalid-json-response
- missing-result
- missing-summary
- missing-not-advice-notice
- high-risk-mismatch
- unknown

Scripts should report safe categories and booleans only.

## Do-Not-Enable Blockers

Do not enable hosted live mode if:

- local POC fails
- provider cannot return strict `PlainlyResult` JSON
- provider response path is not compatible with `choices[0].message.content`
- provider requires logging prompts or document text
- provider returns unsafe advice-like output
- provider data-retention terms are unknown or unacceptable
- cost or rate limits are unknown
- logs contain pasted document text, prompts, raw model responses, request bodies, response bodies, headers, Authorization values, or secrets
- rollback to mock/default mode is unclear
- production docs still say output is mock/sample but live mode would be enabled

## Provider Questions Before Production

Cost:

- What is the cost per request or token?
- Are failed requests billed?
- Are timeouts billed?
- Is there a hard spending cap?

Rate limits:

- What are request and token limits?
- What happens when limits are exceeded?
- Can limits be lowered for safety?

Data retention:

- Are prompts stored?
- Are completions stored?
- Are request or response bodies used for training?
- Can training on submitted data be disabled?
- What is the retention period?
- Who can access logs?

Logging:

- Are request bodies logged?
- Are response bodies logged?
- Are headers logged?
- Are Authorization values redacted?
- Can provider-side logging be disabled or minimized?

Prompt and model-output handling:

- Does the provider use inputs or outputs for training?
- Can data use be disabled?
- Can stored data be deleted?
- Are there zero-retention options?

Abuse and safety policies:

- Are household paperwork explanations allowed?
- Are legal, medical, tax, insurance, and financial-adjacent documents allowed for plain-English explanation?
- What policy categories could trigger blocking?
- What error shape is returned when safety filters block a request?

## Privacy Rules

- Do not paste real documents during POC.
- Use only synthetic, non-sensitive text.
- Do not collect names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, or other sensitive details.
- Do not store pasted document text.
- Do not print provider URL, model name, API key, prompts, document text, raw responses, headers, or secrets.
- Do not add analytics, storage, uploads, or document history.

## Rollback To Mock/Default Mode

After local POC testing:

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
- no live provider env vars are required
- production remains mock/default

## Next Steps

1. Obtain candidate provider key outside the repo.
2. Confirm current Gemini OpenAI-compatible endpoint and model in official docs.
3. Run the local-only POC.
4. Document safe pass/fail result without secrets, document text, prompts, raw responses, request bodies, response bodies, headers, or Authorization values.
5. Review provider cost, rate limits, data retention, logging, and safety policies.
6. Consider preview deployment only after local POC passes.
