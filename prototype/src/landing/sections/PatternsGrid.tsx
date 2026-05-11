import {
  HelpCircle,
  ScanLine,
  ListChecks,
  Heart,
  Bell,
  HandHeart,
} from 'lucide-react';
import type { Pattern } from '../../lib/types';
import { patternMeta } from '../../lib/patterns';

const patternIcons: Record<Pattern, React.ComponentType<{ className?: string }>> = {
  'inform-and-act': HelpCircle,
  'status-check': ScanLine,
  decide: ListChecks,
  express: Heart,
  nudge: Bell,
  'check-in': HandHeart,
};

const patternsInOrder: Pattern[] = [
  'inform-and-act',
  'status-check',
  'decide',
  'express',
  'nudge',
  'check-in',
];

export function PatternsGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-20 sm:px-8 sm:py-24">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            The shape of every conversation
          </span>
          <h2 className="max-w-3xl text-[26px] font-bold leading-tight text-ltu-navy sm:text-[32px]">
            Six patterns the assistant handles
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ltu-navy/75">
            Four reactive patterns at launch. Two proactive patterns in a
            follow-up release — system-initiated, with consent and disclosure.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {patternsInOrder.map((p) => {
            const meta = patternMeta[p];
            const Icon = patternIcons[p];
            return (
              <article
                key={p}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-soft transition hover:border-ltu-navy/30"
              >
                <div className={`absolute inset-x-0 top-0 h-1 ${stripeFor(p)}`} />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${meta.accentClass}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <h3 className="text-[16px] font-semibold text-ltu-navy">
                      {meta.label}
                    </h3>
                  </div>
                  <span
                    className={[
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                      meta.kind === 'reactive'
                        ? 'bg-surface-soft text-muted'
                        : 'bg-ltu-red/10 text-ltu-red',
                    ].join(' ')}
                  >
                    {meta.kind}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-ltu-navy/80">
                  {meta.blurb}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function stripeFor(p: Pattern): string {
  switch (p) {
    case 'inform-and-act':
      return 'bg-ltu-navy';
    case 'status-check':
      return 'bg-blue-700';
    case 'decide':
      return 'bg-emerald-600';
    case 'express':
      return 'bg-amber-600';
    case 'nudge':
      return 'bg-purple-600';
    case 'check-in':
      return 'bg-rose-500';
  }
}
