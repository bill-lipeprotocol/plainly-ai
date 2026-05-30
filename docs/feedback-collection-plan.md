# Feedback Collection Plan

## Goal

The goal is to learn whether users understand the Plainly.ai product promise:

> Confusing paperwork, explained in simple English.

Feedback should help answer whether the public MVP demo is clear, safe, and useful without collecting documents or sensitive details.

## Current State

The public MVP has local feedback buttons in the UI, but no backend feedback collection. Button selections are not sent to a server.

Do not add a feedback backend, email sending, analytics, database, document storage, document history, or contact-form backend until a privacy-safe plan is approved.

## Safety Rules

- Do not ask users to send real documents.
- Do not ask users to paste sensitive details into feedback.
- Do not collect names, addresses, account numbers, Social Security numbers, claim numbers, medical IDs, or other sensitive details.
- Do not store pasted document text.
- Do not store prompts, request bodies, response bodies, raw provider responses, Authorization headers, or secrets.
- Do not imply that feedback is private or secure unless that process is actually implemented and reviewed.

## Feedback Channels For Now

Use channels that do not require new backend infrastructure:

- direct conversation with testers
- private tester notes written by the operator
- structured review checklist during manual demos
- public issue template later, if the repo/process is ready
- simple email later only if a real address is intentionally chosen

Do not invent an email address. Do not add a contact form until there is an approved handling process.

## Suggested Feedback Questions

Ask about product clarity, not personal document contents:

- Was the promise clear?
- Did the privacy warning make sense?
- Did you understand that this is not professional advice?
- Did the result sections make sense?
- Did any copy feel like legal, medical, tax, insurance, or financial advice?
- What paperwork types are most confusing in general?
- Was the high-risk alert calm and useful?
- Was anything alarming, unclear, or overpromising?
- Was it clear that the hosted demo uses sample/mock explanation output?

## What Not To Ask For

Do not ask for:

- real letters
- bills
- notices
- screenshots
- PDFs
- account numbers
- claim numbers
- medical IDs
- addresses
- names
- Social Security numbers
- full pasted document text
- legal, medical, tax, insurance, or financial details

If a tester starts to share sensitive content, stop and ask them to summarize the issue without the sensitive details.

## Safe Feedback Handling

When recording feedback:

- paraphrase at a high level
- remove any accidental personal details
- use synthetic examples in issues or docs
- separate product-copy feedback from model/provider behavior
- do not paste raw user text into tickets or docs
- do not include screenshots that show user-provided document text

Safe note examples:

- "Tester did not notice the privacy warning before pasting."
- "Tester expected the sample button to submit automatically."
- "Tester thought the high-risk alert sounded too strong."
- "Tester wanted clearer wording around mock/sample output."

## Future Lightweight Options

Possible future feedback options, still without storing pasted documents:

- issue template that explicitly says not to include document text
- short static feedback checklist in docs
- email channel after a real address and handling policy are chosen
- client-side copy that explains feedback is not submitted yet
- manual interview script using synthetic examples

Do not add analytics, event tracking, document storage, or a database as part of feedback collection without a separate privacy review.

## Go/No-Go For Feedback Implementation

Go only if:

- feedback channel is intentionally chosen
- users are told not to send documents or sensitive details
- storage and access rules are documented
- no document text is collected
- no analytics or tracking is added without review
- no backend is added without explicit approval

No-go if:

- feedback requires users to send real documents
- feedback form stores pasted text
- an email address is invented
- a backend is added without a privacy plan
- analytics is added by default
