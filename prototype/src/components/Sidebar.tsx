import type { Persona, PersonaId, Scenario } from '../lib/types';
import { PersonaSwitcher } from './PersonaSwitcher';
import { ScenarioPicker } from './ScenarioPicker';
import { ModeToggles } from './ModeToggles';
import { X } from 'lucide-react';

type Props = {
  personas: Persona[];
  activePersona: Persona;
  onPersonaChange: (id: PersonaId) => void;
  scenarios: Scenario[];
  activeScenarioId: string | null;
  onScenarioPick: (scenarioId: string) => void;
  explainMode: boolean;
  launchOnly: boolean;
  onToggleExplain: () => void;
  onToggleLaunch: () => void;
  open: boolean;
  onClose: () => void;
};

export function Sidebar(props: Props) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={[
          'fixed inset-0 z-30 bg-ltu-navy/40 transition-opacity md:hidden',
          props.open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={props.onClose}
        aria-hidden
      />
      <aside
        className={[
          'fixed inset-y-0 right-0 z-40 flex w-[88%] max-w-sm flex-col gap-5 overflow-y-auto border-l border-border bg-surface-soft p-4 transition-transform md:static md:z-0 md:w-80 md:max-w-none md:translate-x-0 md:p-5',
          props.open ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
        ].join(' ')}
        aria-label="Presenter controls"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted">
              Presenter controls
            </span>
            <span className="text-[11px] text-muted">
              Walk a persona end-to-end through the academic year
            </span>
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md text-ltu-navy hover:bg-white md:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <PersonaSwitcher
          personas={props.personas}
          active={props.activePersona.id}
          onChange={props.onPersonaChange}
        />

        <ScenarioPicker
          scenarios={props.scenarios}
          launchOnly={props.launchOnly}
          activeScenarioId={props.activeScenarioId}
          onPick={props.onScenarioPick}
        />

        <ModeToggles
          explainMode={props.explainMode}
          launchOnly={props.launchOnly}
          onToggleExplain={props.onToggleExplain}
          onToggleLaunch={props.onToggleLaunch}
        />
      </aside>
    </>
  );
}
