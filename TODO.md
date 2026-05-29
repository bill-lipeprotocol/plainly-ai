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

## Milestone 3 - Real Model Integration

- [ ] Add hosted Gemma endpoint wrapper
- [ ] Add `.env.local.example`
- [ ] Add server-side API route
- [ ] Add JSON validation and fallback error message
- [ ] Add rate limiting

## Milestone 4 - Launch Prep

- [ ] Update README
- [ ] Add privacy note
- [ ] Add feedback capture
- [ ] Add early access form
- [ ] Deploy to Vercel
