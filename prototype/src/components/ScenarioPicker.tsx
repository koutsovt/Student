import type { Lifecycle, Scenario } from '../lib/types';
import { patternMeta, isProactive } from '../lib/patterns';
import { Inbox, PlayCircle, Sprout, Sun, Trophy } from 'lucide-react';

type Props = {
  scenarios: Scenario[];
  launchOnly: boolean;
  activeScenarioId: string | null;
  onPick: (scenarioId: string) => void;
};

const lifecycleOrder: Lifecycle[] = [
  'early-semester',
  'mid-late-semester',
  'end-outcome',
];

const lifecycleMeta: Record<
  Lifecycle,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  'early-semester': { label: 'Early semester', icon: Sprout },
  'mid-late-semester': { label: 'Mid–late semester', icon: Sun },
  'end-outcome': { label: 'End / outcome', icon: Trophy },
};

export function ScenarioPicker({
  scenarios,
  launchOnly,
  activeScenarioId,
  onPick,
}: Props) {
  const grouped = lifecycleOrder.map((stage) => ({
    stage,
    items: scenarios.filter((s) => s.lifecycle === stage),
  }));

  const proactiveCount = scenarios.filter((s) => isProactive(s.pattern)).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-muted">
          Scenarios
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted">
          Walk the academic year ↓
        </span>
      </div>

      {grouped.map(({ stage, items }) => (
        <Group key={stage} stage={stage}>
          {items.length === 0 && (
            <p className="text-[12px] italic text-muted">
              No scenario at this stage for this persona.
            </p>
          )}
          {items.map((s) => (
            <ScenarioButton
              key={s.id}
              scenario={s}
              disabled={launchOnly && isProactive(s.pattern)}
              active={s.id === activeScenarioId}
              onPick={onPick}
            />
          ))}
        </Group>
      ))}

      {launchOnly && proactiveCount > 0 && (
        <p className="rounded-md bg-surface-soft px-3 py-2 text-[11px] italic text-muted">
          Launch-only mode — {proactiveCount} proactive scenario
          {proactiveCount === 1 ? '' : 's'} hidden in this view.
        </p>
      )}
    </div>
  );
}

function Group({
  stage,
  children,
}: {
  stage: Lifecycle;
  children: React.ReactNode;
}) {
  const meta = lifecycleMeta[stage];
  const Icon = meta.icon;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
        <Icon className="h-3 w-3" />
        {meta.label}
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function ScenarioButton({
  scenario,
  disabled,
  active,
  onPick,
}: {
  scenario: Scenario;
  disabled: boolean;
  active: boolean;
  onPick: (id: string) => void;
}) {
  const meta = patternMeta[scenario.pattern];
  const proactive = isProactive(scenario.pattern);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPick(scenario.id)}
      className={[
        'focus-ring rounded-xl border px-3 py-2.5 text-left transition',
        active
          ? 'border-ltu-red bg-ltu-red/5 text-ltu-navy'
          : 'border-border bg-white text-ltu-navy hover:border-ltu-navy/40',
        disabled && 'cursor-not-allowed opacity-40 hover:border-border',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-pressed={active}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold">{scenario.title}</span>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.accentClass}`}
        >
          {meta.short}
        </span>
      </div>
      <p className="mt-0.5 text-[12px] leading-snug text-muted">
        {scenario.description}
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
        {proactive ? (
          <>
            <Inbox className="h-3 w-3" />
            <span>Proactive · opens in inbox</span>
          </>
        ) : (
          <>
            <PlayCircle className="h-3 w-3" />
            <span>Reactive</span>
          </>
        )}
      </div>
    </button>
  );
}
