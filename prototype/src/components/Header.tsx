import type { Persona } from '../lib/types';
import { Menu, Info, RotateCcw } from 'lucide-react';

type Props = {
  persona: Persona;
  onMenuClick: () => void;
  onAbout: () => void;
  onRestart?: () => void;
};

export function Header({ persona, onMenuClick, onAbout, onRestart }: Props) {
  return (
    <header className="border-b border-border bg-white">
      <div className="h-1.5 w-full bg-ltu-red" />
      <div className="flex items-center gap-2 px-4 py-3 sm:px-6 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-ltu-navy hover:bg-surface-soft md:hidden"
          aria-label="Open presenter menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-1 flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ltu-red">
            La Trobe University
          </span>
          <span className="text-[15px] font-semibold text-ltu-navy">
            {persona.shortGreeting}
          </span>
        </div>
        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="focus-ring hidden items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-medium text-ltu-navy transition hover:border-ltu-navy/40 sm:inline-flex"
            title="Restart this scenario"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restart
          </button>
        )}
        <button
          type="button"
          onClick={onAbout}
          className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-medium text-ltu-navy transition hover:border-ltu-navy/40"
          title="About this prototype"
        >
          <Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">About this prototype</span>
          <span className="sm:hidden">About</span>
        </button>
      </div>
    </header>
  );
}
