import { personas } from '../../data/personas';
import { scenariosByPersona } from '../../data/scenarios';
import type { Persona } from '../../lib/types';

export function PersonasRow() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-20 sm:px-8 sm:py-24">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            The students
          </span>
          <h2 className="max-w-3xl text-[26px] font-bold leading-tight text-ltu-navy sm:text-[32px]">
            Three personas, three journey overlays
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ltu-navy/75">
            Drawn from the Komosion Journeys overlays. Each persona has their
            own mock SIS record — the assistant adapts greeting, available
            scenarios, and tone to who's in front of it.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {personas.map((p) => (
            <PersonaCard key={p.id} persona={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonaCard({ persona }: { persona: Persona }) {
  const count = scenariosByPersona(persona.id).length;
  return (
    <article className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className={`absolute inset-x-0 top-0 h-1 ${stripeFor(persona.id)}`} />
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ltu-navy text-[16px] font-semibold text-white"
        >
          {persona.name[0]}
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[16px] font-semibold text-ltu-navy">
            {persona.name}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted">
            {persona.overlayLabel}
          </span>
        </div>
      </div>
      <p className="text-[14px] leading-relaxed text-ltu-navy/80">
        {persona.blurb}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-[11px] uppercase tracking-wider text-muted">
        <span>{count} scenarios</span>
        <span>across the year</span>
      </div>
    </article>
  );
}

function stripeFor(personaId: string): string {
  switch (personaId) {
    case 'aisha':
      return 'bg-ltu-navy';
    case 'mark':
      return 'bg-emerald-600';
    case 'jess':
      return 'bg-amber-600';
    default:
      return 'bg-ltu-red';
  }
}
