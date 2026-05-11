import type { Lifecycle, PersonaId, Scenario } from '../../lib/types';
import { personas } from '../../data/personas';
import { scenarios } from '../../data/scenarios';
import { patternMeta, isProactive } from '../../lib/patterns';
import { Sprout, Sun, Trophy, Inbox, PlayCircle } from 'lucide-react';

const stages: { id: Lifecycle; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'early-semester', label: 'Early semester', icon: Sprout },
  { id: 'mid-late-semester', label: 'Mid–late semester', icon: Sun },
  { id: 'end-outcome', label: 'End / outcome', icon: Trophy },
];

export function MatrixGrid() {
  return (
    <section className="bg-surface-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 sm:px-8 sm:py-24">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            The academic-year matrix
          </span>
          <h2 className="max-w-3xl text-[26px] font-bold leading-tight text-ltu-navy sm:text-[32px]">
            One year, three personas, eleven scenarios
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ltu-navy/75">
            Each persona carries multiple scenarios across the year. The
            recommended demo flow is to walk a single persona end-to-end —
            early semester through to results — rather than jumping between
            disconnected vignettes.
          </p>
        </header>

        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[170px_1fr_1fr_1fr] gap-3">
              <div />
              {stages.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {s.label}
                  </div>
                );
              })}

              {personas.map((p) => (
                <PersonaRow key={p.id} personaId={p.id} personaLabel={p.name} overlayLabel={p.overlayLabel} />
              ))}
            </div>
          </div>
        </div>

        <p className="text-[12px] italic text-muted">
          Eleven scenarios total — Inform-and-Act ×2, Status-Check ×2, Decide
          ×1, Express ×2, Nudge ×2, Check-in ×2.
        </p>
      </div>
    </section>
  );
}

function PersonaRow({
  personaId,
  personaLabel,
  overlayLabel,
}: {
  personaId: PersonaId;
  personaLabel: string;
  overlayLabel: string;
}) {
  return (
    <>
      <div className="flex flex-col justify-center gap-0.5 rounded-xl bg-white px-4 py-3 shadow-soft">
        <span className="text-[15px] font-semibold text-ltu-navy">
          {personaLabel}
        </span>
        <span className="text-[11px] uppercase tracking-wider text-muted">
          {overlayLabel}
        </span>
      </div>
      {stages.map((s) => {
        const cellScenarios = scenarios.filter(
          (sc) => sc.persona === personaId && sc.lifecycle === s.id,
        );
        return (
          <div
            key={s.id}
            className="flex flex-col gap-2 rounded-xl border border-border bg-white p-3 shadow-soft"
          >
            {cellScenarios.length === 0 && (
              <p className="text-[12px] italic text-muted">No scenario.</p>
            )}
            {cellScenarios.map((sc) => (
              <ScenarioChip key={sc.id} scenario={sc} />
            ))}
          </div>
        );
      })}
    </>
  );
}

function ScenarioChip({ scenario }: { scenario: Scenario }) {
  const meta = patternMeta[scenario.pattern];
  const Proactive = isProactive(scenario.pattern);
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface-soft px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-semibold leading-tight text-ltu-navy">
          {scenario.title}
        </span>
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${meta.accentClass}`}
        >
          {meta.short}
        </span>
      </div>
      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted">
        {Proactive ? (
          <>
            <Inbox className="h-2.5 w-2.5" /> Proactive
          </>
        ) : (
          <>
            <PlayCircle className="h-2.5 w-2.5" /> Reactive
          </>
        )}
      </span>
    </div>
  );
}
