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
        Confusing letter? Plainly explains it in simple English.
      </h1>

      <p className="mt-6 text-lg leading-8 text-slate-700">
        Paste a bill, notice, school letter, insurance letter, rental letter, or
        other paperwork. Plainly summarizes what it appears to say, highlights
        dates and money, and suggests questions to ask the sender.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
        <p>No account required. No document storage in this first version.</p>
        <p className="mt-2">
          Plainly explains text. It does not provide legal, medical, tax, or
          financial advice.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onPrimaryClick}
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Paste your document
        </button>

        <button
          type="button"
          onClick={onSecondaryClick}
          className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          See an example
        </button>
      </div>
    </section>
  );
}
