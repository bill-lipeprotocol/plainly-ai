# Provider Contracts

This document defines future model provider contracts for Plainly. These are examples for the next live integration milestone only. The current app must stay on mocked responses until live provider work is explicitly enabled.

## Comparison

| Provider mode | Easiest to deploy | Privacy level | Expected response field | Recommended first live target |
| --- | --- | --- | --- | --- |
| `gemma-hosted-openai-compatible` | High, if the host supports chat completions | Depends on hosted provider | `choices[0].message.content` | Yes |
| `gemma-hosted-custom-prompt` | Medium, depends on provider shape | Depends on hosted provider | `text` | No |
| `gemma-local` | Lower, requires local runtime setup | Highest if fully local | `response` | No |

## A. OpenAI-Compatible Chat Completions

Intended provider value: `gemma-hosted-openai-compatible`

Example environment variables:

```env
PLAINLY_MODEL_PROVIDER=gemma-hosted-openai-compatible
GEMMA_API_URL=https://example.com/v1/chat/completions
GEMMA_API_KEY=
GEMMA_MODEL_NAME=gemma-model-name
```

Example request body:

```json
{
  "model": "gemma-model-name",
  "messages": [
    {
      "role": "user",
      "content": "<Plainly prompt>"
    }
  ],
  "temperature": 0.1,
  "response_format": { "type": "json_object" }
}
```

Example response body:

```json
{
  "choices": [
    {
      "message": {
        "content": "{...PlainlyResult JSON...}"
      }
    }
  ]
}
```

Plainly should extract `choices[0].message.content` and pass that string to `parseGemmaJsonResponse`.

## B. Custom Prompt Endpoint

Intended provider value: `gemma-hosted-custom-prompt`

Example environment variables:

```env
PLAINLY_MODEL_PROVIDER=gemma-hosted-custom-prompt
GEMMA_API_URL=https://example.com/generate
GEMMA_API_KEY=
GEMMA_MODEL_NAME=gemma-model-name
```

Example request body:

```json
{
  "model": "gemma-model-name",
  "prompt": "<Plainly prompt>",
  "temperature": 0.1,
  "max_tokens": 1200
}
```

Example response body:

```json
{
  "text": "{...PlainlyResult JSON...}"
}
```

Plainly should extract `text` and pass that string to `parseGemmaJsonResponse`.

## C. Local Runtime Endpoint

Intended provider value: `gemma-local`

Example environment variables:

```env
PLAINLY_MODEL_PROVIDER=gemma-local
GEMMA_API_URL=http://localhost:11434/api/generate
GEMMA_MODEL_NAME=gemma-model-name
```

Example request body:

```json
{
  "model": "gemma-model-name",
  "prompt": "<Plainly prompt>",
  "stream": false,
  "options": {
    "temperature": 0.1
  }
}
```

Example response body:

```json
{
  "response": "{...PlainlyResult JSON...}"
}
```

Plainly should extract `response` and pass that string to `parseGemmaJsonResponse`.

## Required Safety Rules

- Never log `documentText`.
- Never log prompts.
- Never log raw model responses.
- Never log model request bodies or response bodies.
- Never log or commit secrets.
- Never commit `.env.local`.
- Validate all provider outputs with `validatePlainlyResult`.
- Route all parsing through `parseGemmaJsonResponse`.
- Fail safely with the existing user-facing generic error.
- Use timeouts for live calls.
- Do not store documents in this MVP.
