# Domain And Branding Plan

## Current Public URL

Plainly.ai is currently available at:

https://plainly-ai.vercel.app

Keep the Vercel URL for the current MVP public demo unless there is a deliberate decision to attach a custom domain later.

## Domain Direction

No domain has been purchased or configured as part of this plan.

Possible future domain criteria:

- easy to spell after hearing it once
- close to the product name Plainly.ai
- short enough for a footer, social profile, or support note
- does not imply legal, medical, tax, insurance, or financial advice
- does not imply official government, insurance, court, or medical affiliation
- does not imply guaranteed privacy, storage, accuracy, or outcomes

Do not claim a domain is available until it has been checked through a registrar.

## Brand Positioning

Core positioning:

> Confusing paperwork, explained in simple English.

Plainly should feel:

- calm
- plain-spoken
- practical
- non-alarming
- non-advisory
- built for everyday household paperwork

Plainly should not sound like:

- a lawyer
- a doctor
- an insurer
- a tax professional
- a financial advisor
- a government agency
- a secure document vault

## Language To Avoid

Avoid:

- legal advice
- medical advice
- tax advice
- insurance advice
- financial advice
- guaranteed accuracy
- guaranteed privacy
- guaranteed outcomes
- upload your documents
- store your documents
- official review
- approved by experts
- replaces a professional

Preferred language:

- explains pasted text
- helps you understand what the text appears to say
- suggests questions to ask the sender
- remove sensitive details before pasting
- not a substitute for professional advice

## Public Demo Disclaimer

Public MVP demo wording should remain honest:

- Hosted deployment is mock/default mode.
- Hosted live Gemma is not enabled.
- Explanation cards are sample/mock output in the hosted demo.
- High-risk detection runs on pasted text.
- Users should remove sensitive details before pasting.
- Plainly is not legal, medical, tax, insurance, financial, or other professional advice.

## Favicon And Metadata Checklist

Current metadata:

- title: Plainly.ai
- description: Confusing paperwork, explained in simple English.

Future polish checklist:

- review favicon for brand fit
- add a simple social preview image only if it does not imply advice or official status
- keep metadata plain and non-advisory
- do not claim live AI explanations unless production live provider is enabled
- do not claim uploads, storage, accounts, or saved history

## Future Custom-Domain Checklist

Do not perform these steps until a domain is intentionally chosen.

Before setup:

- confirm domain availability
- confirm ownership and renewal responsibility
- confirm DNS access
- confirm Vercel project target
- confirm hosted provider mode remains intentional
- confirm no secrets are committed

Setup checklist for later:

- add domain in Vercel
- configure DNS records through the domain registrar
- wait for TLS certificate provisioning
- verify `https://` works
- run production smoke test
- update README production URL
- update launch note production URL if changed
- check `git status`

Rollback checklist for later:

- remove custom domain from Vercel if needed
- return public references to the Vercel URL
- verify the Vercel URL still works

## Open Questions

- Keep `plainly-ai.vercel.app` for the next demo cycle, or choose a custom domain?
- Should the public name remain `Plainly.ai` if the custom domain differs?
- What contact or feedback channel should be used once a privacy-safe process is approved?
