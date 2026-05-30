type LandingHeroProps = {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
};

export function LandingHero({
  onPrimaryClick,
  onSecondaryClick,
}: LandingHeroProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="mb-3 text-sm font-medium text-slate-500">Plainly.ai</p>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Confusing paperwork, explained in simple English.
      </h1>

      <p className="mt-6 text-lg leading-8 text-slate-700">
        Paste one section from a bill, notice, school letter, insurance letter,
        rental letter, or other household paperwork. Plainly summarizes what the
        text appears to say, highlights dates and money, and suggests questions
        you may want to ask the sender.
      </p>

      <div className="mt-6 grid gap-3 text-left text-sm leading-6 text-slate-700 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-950">Text only</p>
          <p className="mt-1">Paste one section at a time. No uploads.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-950">Privacy reminder</p>
          <p className="mt-1">Remove sensitive details before pasting.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-950">Not advice</p>
          <p className="mt-1">Plainly helps explain text, not decisions.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onPrimaryClick}
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Paste a section below
        </button>

        <button
          type="button"
          onClick={onSecondaryClick}
          className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Try it with a sample notice
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        No account required for this MVP. Plainly is not a substitute for legal,
        medical, tax, insurance, financial, or other professional advice.
      </p>
    </section>
  );
}
