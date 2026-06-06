type LandingHeroProps = {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
};

export function LandingHero({
  onPrimaryClick,
  onSecondaryClick,
}: LandingHeroProps) {
  return (
    <>
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a
          href="#top"
          className="font-display text-xl font-extrabold tracking-[-0.05em] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          plainly<span className="text-[var(--coral)]">.</span>
        </a>
        <button
          type="button"
          onClick={onPrimaryClick}
          className="rounded-full border-2 border-black bg-[var(--lime)] px-5 py-2.5 text-sm font-bold shadow-[3px_3px_0_#151515] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#151515] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Explain my document
        </button>
      </header>

      <section
        id="top"
        className="relative mx-auto grid min-h-[760px] w-full max-w-7xl items-center gap-14 overflow-hidden px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-20"
      >
        <div className="relative z-10">
          <div className="mb-7 inline-flex rotate-[-2deg] items-center gap-2 border-2 border-black bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] shadow-[3px_3px_0_#151515]">
            <span className="h-2 w-2 rounded-full bg-[var(--coral)]" />
            Your paperwork translator
          </div>

          <h1 className="font-display max-w-3xl text-[clamp(3.6rem,8vw,7.6rem)] font-extrabold leading-[0.88] tracking-[-0.075em]">
            Paperwork,
            <span className="relative mt-2 block w-fit text-[var(--violet)]">
              without the
              <svg
                aria-hidden="true"
                className="absolute -bottom-3 left-0 h-4 w-full text-[var(--coral)]"
                viewBox="0 0 500 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 13C120 2 310 2 497 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="mt-2 block">headache.</span>
          </h1>

          <p className="mt-9 max-w-xl text-lg leading-8 text-black/70 sm:text-xl">
            Drop in the confusing part. Get back the dates, money, meaning, and
            questions that matter, in language that sounds human.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onPrimaryClick}
              className="group inline-flex items-center justify-center gap-3 rounded-full border-2 border-black bg-black px-7 py-4 font-bold text-white shadow-[5px_5px_0_var(--coral)] transition hover:-translate-y-1 hover:shadow-[7px_7px_0_var(--coral)] focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Make it make sense
              <span
                aria-hidden="true"
                className="text-xl transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </button>
            <button
              type="button"
              onClick={onSecondaryClick}
              className="rounded-full px-6 py-4 font-bold underline decoration-2 underline-offset-4 hover:text-[var(--violet)] focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Try a sample first
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-black/60">
            <span>✓ No account</span>
            <span>✓ Text is not stored</span>
            <span>✓ Plain English</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl py-12 lg:py-0">
          <div className="absolute -left-4 top-5 h-32 w-32 rounded-full bg-[var(--lime)] blur-[1px] sm:-left-12" />
          <div className="absolute -right-8 bottom-8 h-44 w-44 rounded-full bg-[var(--coral)] opacity-90 sm:-right-16" />
          <div className="float-slow relative rotate-2 border-2 border-black bg-[var(--paper)] p-6 shadow-[12px_14px_0_#151515] sm:p-8">
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/50">
                Service notice
              </span>
              <span className="rounded-full bg-[var(--coral)] px-3 py-1 text-xs font-bold">
                Confusing
              </span>
            </div>
            <div className="paper-noise mt-5 space-y-3 py-2">
              <div className="h-3 w-full bg-black/15" />
              <div className="h-3 w-11/12 bg-black/15" />
              <div className="h-3 w-4/5 bg-black/15" />
              <p className="relative my-5 border-l-4 border-[var(--violet)] bg-[#eeeaff] p-4 text-sm leading-6">
                The base charge will increase by{" "}
                <strong className="bg-[var(--lime)] px-1">$15 per month</strong>{" "}
                after June 1, 2026...
              </p>
              <div className="h-3 w-full bg-black/15" />
              <div className="h-3 w-3/4 bg-black/15" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="border-2 border-black bg-[var(--lime)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider">
                  Date found
                </p>
                <p className="mt-1 font-display text-xl font-extrabold">
                  June 1
                </p>
              </div>
              <div className="border-2 border-black bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider">
                  Increase
                </p>
                <p className="mt-1 font-display text-xl font-extrabold">
                  $15 / mo
                </p>
              </div>
            </div>
            <div className="absolute -right-5 -top-6 rotate-6 rounded-full border-2 border-black bg-[var(--violet)] px-5 py-3 font-display text-sm font-extrabold text-white shadow-[3px_3px_0_#151515]">
              Ohhh, got it.
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y-2 border-black bg-[var(--lime)] py-3">
        <div className="marquee-track flex w-max gap-8 font-display text-sm font-extrabold uppercase tracking-[0.16em]">
          {[0, 1].map((group) => (
            <div key={group} className="flex gap-8" aria-hidden={group === 1}>
              <span>Bills decoded</span><span>✦</span>
              <span>Deadlines spotted</span><span>✦</span>
              <span>Fine print translated</span><span>✦</span>
              <span>Questions prepared</span><span>✦</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
