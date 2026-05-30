# Plainly.ai TODO

## Milestone 1 - Mocked Front-End MVP

- [x] Replace default `app/page.tsx`
- [x] Add `LandingHero`
- [x] Add `DocumentForm`
- [x] Add `ResultView`
- [x] Add `FeedbackButtons`
- [x] Add `AlertBanner`
- [x] Add `mockResult`
- [x] Add `detectHighRisk`
- [x] Add validation for short and long pasted text
- [x] Test locally with `npm run dev`

## Milestone 2A - Mocked API Layer

- [x] Add `app/api/explain/route.ts`
- [x] Accept `documentType`, `userQuestion`, and `documentText`
- [x] Validate required document type and document text length
- [x] Return `mockResult` and `showHighRiskAlert`
- [x] Keep model call mocked

## Milestone 2B - Shared Schemas and Prompt Contract

- [x] Add `lib/plainlyPrompt.ts`
- [x] Add `lib/plainlySchema.ts`
- [x] Add shared request validation
- [x] Add shared result validation
- [x] Build but do not send the prompt
- [x] Keep model call mocked

## Milestone 2C - Synthetic Samples and Manual Evaluation

- [x] Add `tests/plainlySamples.ts`
- [x] Add 12 fully synthetic sample documents
- [x] Include ordinary and high-risk document examples
- [x] Add `tests/evaluationChecklist.md`
- [x] Add 0-2 scoring categories and launch-quality threshold

## Milestone 3A - Mocked Model Wrapper Interface

- [x] Add non-network `callPlainlyModel`
- [x] Add shared `PlainlyModelInput` type
- [x] Route `/api/explain` through the mocked model provider
- [x] Validate model result before returning it
- [x] Add `.env.local.example` placeholders
- [x] Document mocked provider status in README

## Milestone 3B - Mocked Provider Routing

- [x] Route `callPlainlyModel` by `PLAINLY_MODEL_PROVIDER`
- [x] Default missing provider to `mock`
- [x] Return `mockResult` for `mock`
- [x] Throw not-implemented error for `gemma`
- [x] Throw unsupported-provider error for unknown values
- [x] Keep Gemma URL and key placeholders unused

## Milestone 3C - Safe Model/API Failure Handling

- [x] Preserve 400 validation-style error messages
- [x] Show a safe generic message for 500 and unexpected API errors
- [x] Avoid exposing raw provider or server error details
- [x] Preserve loading, success, high-risk alert, and feedback behavior

## Milestone 3D - Local API Regression Script

- [x] Add local synthetic API regression script
- [x] Post synthetic samples to local `/api/explain`
- [x] Report sample status, result presence, and high-risk alert match
- [x] Print total passed and failed counts
- [x] Avoid printing full document text or prompts
- [x] Add `npm run test:api`

## Milestone 4A - Gemma Integration Contract and Documentation

- [x] Add Gemma environment placeholders
- [x] Document future provider modes: `mock`, `gemma-hosted`, `gemma-local`
- [x] Add Gemma integration plan
- [x] Document no raw document or prompt logging rule
- [x] Document timeout, JSON validation, and fallback expectations
- [x] Keep live model calls inactive

## Milestone 4B - Gemma Adapter Scaffolding

- [x] Add `lib/gemmaAdapter.ts`
- [x] Add mocked hosted Gemma adapter path
- [x] Parse raw model-like JSON strings
- [x] Validate adapter output with `validatePlainlyResult`
- [x] Add adapter parsing test script
- [x] Keep adapter disconnected from production `/api/explain`

## Milestone 4C - Mocked Gemma Provider Routing

- [x] Route `gemma-hosted` through `callGemmaHostedMock`
- [x] Keep `mock` provider returning `mockResult`
- [x] Keep `gemma-local` as a safe not-implemented path
- [x] Keep legacy `gemma` alias as a safe not-implemented path
- [x] Add provider routing coverage to adapter tests
- [x] Keep live Gemma calls inactive

## Milestone 4D - Provider Contract Examples

- [x] Add OpenAI-compatible hosted provider contract
- [x] Add custom prompt endpoint contract
- [x] Add local runtime endpoint contract
- [x] Document extraction paths for model JSON text
- [x] Document provider safety rules
- [x] Link provider contracts from README and Gemma plan

## Milestone 5 - Live Gemma Integration

- [x] 5A: Document OpenAI-compatible provider check
- [x] 5B: Harden parseGemmaJsonResponse for fenced JSON
- [x] 5C: Add isolated OpenAI-compatible Gemma adapter and live test
- [x] 5D: Tighten isolated live test prompt and diagnostics
- [x] 5E: Wire OpenAI-compatible Gemma routing behind environment flag
- [x] 5F: Add safe live API regression script for `/api/explain`
- [x] 5G: Add safe provider preflight script/checklist

- [ ] Add hosted Gemma endpoint wrapper
- [ ] Add `.env.local.example`
- [ ] Add server-side API route
- [ ] Add JSON validation and fallback error message
- [ ] Add rate limiting

## Milestone 6 - MVP Polish

- [x] 6A: Polish user-facing safety copy, empty states, loading state, and generic error language
- [x] 6B: Reduce obvious high-risk alert false positives from negated disclaimer text

## Milestone 7 - Launch Readiness

- [x] 7A: Add MVP launch-readiness operating runbook
- [x] Launch Build 1: Add deployment prep checklist, README MVP status, and truthful metadata
- [x] Launch Build 2: Polish public MVP page, CTA, and synthetic sample flow
- [x] Launch Build 4: Add public MVP launch note and README deployment status
- [x] Launch Build 5: Add domain/branding plan and privacy-safe feedback plan
- [x] Launch Build 6: Add production error monitoring plan, docs-only first
- [x] Launch Build 7: Add hosted live-provider evaluation plan
- [x] Launch Build 8: Add hosted live-provider POC plan and gated test path

## Launch Track - Remaining

- [ ] Manual UI review using synthetic examples
- [ ] Manual mock-mode demo rehearsal
- [ ] Manual live-provider rehearsal only if intentionally needed
- [ ] Final no-secrets audit before any deployment work
- [ ] Deployment plan and hosting decision
- [ ] Custom domain setup
- [ ] Public feedback channel implementation only after privacy plan
- [ ] Monitoring tool evaluation only after docs plan
- [ ] Select candidate hosted provider
- [ ] Run local hosted-provider POC
- [ ] Review provider data-retention, cost, and rate limits
- [ ] Preview-deployment live test only after local POC passes
- [ ] Production live activation only after preview passes

## Milestone 4 - Launch Prep`n- [x] 4E: Verify coding-agent workflow`n- [x] 4F: Document coding-agent workflow

- [ ] Update README
- [ ] Add privacy note
- [ ] Add feedback capture
- [ ] Add early access form
- [ ] Deploy to Vercel



