import type { Persona, PersonaId } from '../lib/types';
import { User } from 'lucide-react';

type Props = {
  personas: Persona[];
  active: PersonaId;
  onChange: (id: PersonaId) => void;
};

export function PersonaSwitcher({ personas, active, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted">
        <User className="h-3.5 w-3.5" /> Persona
      </div>
      <div className="flex flex-col gap-1.5">
        {personas.map((p) => {
          const isActive = p.id === active;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={[
                'focus-ring rounded-xl border px-3 py-2.5 text-left transition',
                isActive
                  ? 'border-ltu-navy bg-ltu-navy text-white shadow-soft'
                  : 'border-border bg-white text-ltu-navy hover:border-ltu-navy/40',
              ].join(' ')}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold">{p.name}</span>
                <span
                  className={[
                    'text-[10px] uppercase tracking-wider',
                    isActive ? 'text-white/70' : 'text-muted',
                  ].join(' ')}
                >
                  {p.overlayLabel}
                </span>
              </div>
              <p
                className={[
                  'mt-1 text-[12px] leading-relaxed',
                  isActive ? 'text-white/80' : 'text-muted',
                ].join(' ')}
              >
                {p.blurb}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
