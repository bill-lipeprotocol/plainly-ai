const feedbackOptions = [
  "Yes, this helped",
  "Something was wrong",
  "I still feel confused",
  "The wording was unclear",
  "I wanted a shorter summary",
];

type FeedbackButtonsProps = {
  feedback: string;
  onFeedbackChange: (value: string) => void;
};

export function FeedbackButtons({
  feedback,
  onFeedbackChange,
}: FeedbackButtonsProps) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold">Was this explanation helpful?</h3>

      <p className="mt-1 text-sm text-slate-600">
        These buttons are for this demo screen only and do not submit feedback
        yet. Do not include personal details in feedback.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {feedbackOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onFeedbackChange(option)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-800 hover:bg-slate-50"
          >
            {option}
          </button>
        ))}
      </div>

      {feedback ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          Thanks. You selected: <strong>{feedback}</strong>
        </p>
      ) : null}
    </section>
  );
}
