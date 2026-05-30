# Deployment Smoke Test

## Date
2026-05-30

## Mode
Mock/default provider. Live Gemma provider not enabled in hosted deployment.

## Deployment URL
https://plainly-ai.vercel.app

## Checks
- Page loads: pass
- Sample notice fills form: pass
- Sample submit returns result: pass
- Privacy warning visible: pass
- Not-advice notice visible: pass
- High-risk synthetic alert appears: pass
- Negated low-risk sample does not trigger alert: pass
- Public /api/explain smoke test passes: pass
- No secrets or raw provider output visible: pass

## Notes
Live Gemma was not enabled because local Ollama URLs are not reachable from hosted deployment.
