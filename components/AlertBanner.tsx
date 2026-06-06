export function AlertBanner() {
  return (
    <div className="border-2 border-black bg-[var(--coral)] p-5 shadow-[5px_5px_0_#151515]">
      <p className="font-display text-lg font-extrabold">
        This may deserve prompt attention.
      </p>
      <p className="mt-2 text-sm leading-6">
        Plainly noticed words that can appear in time-sensitive or higher-stakes
        paperwork, such as eviction, lawsuit, court, foreclosure, collections,
        denied coverage, termination, subpoena, benefits denial, or emergency
        medical. Plainly can help explain the text, but it is not a substitute
        for guidance from a qualified person.
      </p>
    </div>
  );
}
