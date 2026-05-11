export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted">
              What this is not
            </h3>
            <ul className="flex flex-col gap-1.5 text-[13px] leading-relaxed text-ltu-navy/80">
              <li>· Not production code or a finished product.</li>
              <li>· Not connected to any real LLM, API, LMS, or SMS provider.</li>
              <li>
                · Not a real wellbeing escalation — handoff state is UI-only.
              </li>
              <li>· No authentication, no session persistence, no analytics.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted">
              Source basis
            </h3>
            <ul className="flex flex-col gap-1.5 text-[13px] leading-relaxed text-ltu-navy/80">
              <li>· Komosion Journeys output (17 October 2025)</li>
              <li>· Charlie workshop briefing v1.2</li>
              <li>· Pattern architecture v0.5</li>
              <li>
                · Improving from the existing Charlie LiveChat on{' '}
                <span className="font-medium text-ltu-navy">
                  ASK La Trobe
                </span>
                .
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 border-t border-border pt-6 text-[11px] uppercase tracking-wider text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>La Trobe assistant — workshop prototype</span>
          <span>Mock data only · validation scope</span>
        </div>
      </div>
    </footer>
  );
}
