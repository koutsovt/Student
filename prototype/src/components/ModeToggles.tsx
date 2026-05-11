import { Eye, EyeOff, Rocket, Sparkles } from 'lucide-react';

type Props = {
  explainMode: boolean;
  launchOnly: boolean;
  onToggleExplain: () => void;
  onToggleLaunch: () => void;
};

export function ModeToggles({
  explainMode,
  launchOnly,
  onToggleExplain,
  onToggleLaunch,
}: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[12px] font-semibold uppercase tracking-wider text-muted">
        Presenter modes
      </div>
      <Toggle
        active={explainMode}
        onClick={onToggleExplain}
        title="Explain mode"
        description="Show the pattern badge on every assistant turn."
        ActiveIcon={Eye}
        InactiveIcon={EyeOff}
      />
      <Toggle
        active={!launchOnly}
        onClick={onToggleLaunch}
        title={launchOnly ? 'Proactive patterns hidden' : 'Show proactive patterns'}
        description={
          launchOnly
            ? 'Showing the four reactive patterns available at launch only. Toggle to surface the two proactive patterns from the follow-up release.'
            : 'Showing all six patterns — including Nudge and Check-in from the follow-up release.'
        }
        ActiveIcon={Sparkles}
        InactiveIcon={Rocket}
      />
    </div>
  );
}

function Toggle({
  active,
  onClick,
  title,
  description,
  ActiveIcon,
  InactiveIcon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
  ActiveIcon: React.ComponentType<{ className?: string }>;
  InactiveIcon: React.ComponentType<{ className?: string }>;
}) {
  const Icon = active ? ActiveIcon : InactiveIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'focus-ring flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition',
        active
          ? 'border-ltu-navy bg-ltu-navy text-white'
          : 'border-border bg-white text-ltu-navy hover:border-ltu-navy/40',
      ].join(' ')}
    >
      <Icon className={['mt-0.5 h-4 w-4 shrink-0', active ? 'text-white' : 'text-muted'].join(' ')} />
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold">{title}</span>
        <span className={['text-[11px]', active ? 'text-white/80' : 'text-muted'].join(' ')}>
          {description}
        </span>
      </div>
    </button>
  );
}
