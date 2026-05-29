# Gemma Integration Plan

## Current State

Plainly currently uses the `mock` provider only. The API route builds the prompt, calls the local model wrapper, validates the returned JSON shape, and returns the mocked result. No live Gemma call is connected.

## Intended Provider Modes

- `mock`: Returns the local mocked result. This is the default when `PLAINLY_MODEL_PROVIDER` is missing.
- `gemma-hosted`: Future hosted Gemma-compatible endpoint integration.
- `gemma-local`: Future local Gemma runtime integration.

Detailed request and response examples for future provider modes are documented in [provider-contracts.md](provider-contracts.md).

## Environment Variables

Use `.env.local` for local secrets. Do not commit `.env.local`.

Expected variables:

- `PLAINLY_MODEL_PROVIDER=mock`
- `GEMMA_MODE=hosted`
- `GEMMA_API_URL=`
- `GEMMA_API_KEY=`
- `GEMMA_MODEL_NAME=`

For now, `GEMMA_API_URL`, `GEMMA_API_KEY`, and `GEMMA_MODEL_NAME` are placeholders only. They are not read by the app yet.

## No Raw Document Logging

Never log raw `documentText`, generated prompts, model request bodies, model response bodies that may contain user text, or secrets. Debug logs, if added later, must use coarse metadata only, such as provider name, status code, elapsed time, and validation result.

## Timeout Expectations

Future model calls should use a strict timeout. A first implementation should target a short server-side timeout, such as 15 seconds or less, and return the safe fallback error if the provider does not respond in time.

## JSON Output Validation

All provider responses must be validated with `validatePlainlyResult` before returning data to the client. Invalid JSON, missing fields, malformed fields, or unsafe result shapes should be treated as provider failures.

## Fallback Behavior

Provider failures must not expose raw provider errors to users. The client should continue to show the safe user-facing message for unexpected failures:

`Plainly had trouble generating the explanation. Please try again with a shorter section of text.`

Validation errors caused by user input should continue to return `400` with the existing validation-style messages.

## Local Development Steps

1. Run `npm install`.
2. Run `npm run dev`.
3. Keep `PLAINLY_MODEL_PROVIDER` unset or set it to `mock`.
4. Run `npm run test:api` from another terminal to test the mocked local API path.
5. Do not add real secrets until the live integration milestone.

## Production Deployment Notes

- Keep the provider set to `mock` until the live integration milestone is complete.
- Store real secrets only in the deployment platform secret manager.
- Do not commit `.env.local` or real API keys.
- Require JSON validation before enabling a real provider.
- Keep fallback behavior and no-logging rules active for all providers.
