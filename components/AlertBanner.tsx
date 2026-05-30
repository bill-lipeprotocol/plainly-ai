export function AlertBanner() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <p className="font-semibold">This may deserve prompt attention.</p>
      <p className="mt-1">
        Plainly noticed words that can appear in time-sensitive or higher-stakes
        paperwork, such as eviction, lawsuit, court, foreclosure, collections,
        denied coverage, termination, subpoena, benefits denial, or emergency
        medical. Plainly can help explain the text, but it is not a substitute
        for guidance from a qualified person.
      </p>
    </div>
  );
}
