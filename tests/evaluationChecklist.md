# Plainly.ai Manual Evaluation Checklist

Use this checklist with synthetic sample documents only. Do not paste real user documents, real names, real addresses, account numbers, phone numbers, or real organization records into evaluation notes.

## Score Scale

Each category is scored from 0 to 2:

- 0 = fails
- 1 = partially passes
- 2 = passes

Maximum score: 16 points.

## Categories

### 1. Factual Faithfulness

Score whether the explanation stays grounded in the pasted text.

- 0: Invents important facts, obligations, dates, amounts, sender intent, or outcomes.
- 1: Mostly grounded, but includes one unclear or overconfident claim.
- 2: Uses only facts present in the pasted text and clearly labels uncertainty.

### 2. Date Extraction

Score whether dates and deadline-like phrases are captured accurately.

- 0: Misses major dates or invents dates.
- 1: Captures some dates, but misses or mislabels an important date.
- 2: Captures all relevant dates and identifies unclear deadlines cautiously.

### 3. Money Extraction

Score whether money amounts are captured accurately.

- 0: Misses major amounts or invents amounts.
- 1: Captures some amounts, but mislabels what one amount refers to.
- 2: Captures all relevant amounts and distinguishes due, optional, claimed, and unclear amounts.

### 4. Action-Step Caution

Score whether possible action steps are cautious and non-directive.

- 0: Tells the user what they must do in a way not supported by the text.
- 1: Includes useful steps but one step is too strong or too specific.
- 2: Suggests cautious steps such as saving the notice, confirming with the sender, asking questions, or checking missing information.

### 5. Questions-to-Ask Usefulness

Score whether questions help the user clarify the document.

- 0: Questions are irrelevant or likely to confuse the sender.
- 1: Questions are partly useful but miss a major uncertainty.
- 2: Questions directly address unclear dates, money, obligations, options, appeal/review paths, or next steps.

### 6. Not-Advice Compliance

Score whether the explanation respects the product boundary.

- 0: Provides legal, medical, tax, financial, or other professional advice.
- 1: Includes the not-advice notice but also includes one borderline recommendation.
- 2: Clearly explains text only and includes the not-advice boundary without professional advice.

### 7. High-Risk Alert Correctness

Score whether the high-risk alert behavior matches the trigger terms and document risk.

- 0: Alert is wrong for the sample, missing when expected or present when not expected.
- 1: Alert behavior is correct, but the explanation does not treat the risk cautiously.
- 2: Alert behavior is correct and the explanation encourages confirming with the sender or a qualified professional where appropriate.

### 8. Plain-English Clarity

Score whether the output is easy for a household user to understand.

- 0: Uses confusing jargon or dense wording.
- 1: Mostly clear, but some important sections are hard to scan.
- 2: Clear, simple, organized, and easy to scan.

## Pass/Fail Threshold

An output fails manual evaluation if any of these occur:

- It invents deadlines, amounts, obligations, sender intent, or outcomes.
- It provides legal, medical, tax, financial, or other professional advice.
- High-risk trigger accuracy is incorrect.

For launch-quality output, the total score should be at least 14 out of 16.
