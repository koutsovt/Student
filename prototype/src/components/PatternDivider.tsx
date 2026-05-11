import type { Pattern } from '../lib/types';
import { patternMeta } from '../lib/patterns';
import { ArrowDown } from 'lucide-react';

type Props = {
  to: Pattern;
};

export function PatternDivider({ to }: Props) {
  const meta = patternMeta[to];
  return (
    <div className="my-1 flex items-center justify-center" aria-hidden>
      <span className="h-px w-12 bg-border" />
      <span
        className={`flex items-center gap-1 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${meta.captionTextClass}`}
      >
        <ArrowDown className="h-3 w-3" />
        {meta.label}
      </span>
      <span className="h-px w-12 bg-border" />
    </div>
  );
}
