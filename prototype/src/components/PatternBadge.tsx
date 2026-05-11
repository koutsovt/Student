import type { Pattern } from '../lib/types';
import { patternMeta } from '../lib/patterns';
import { Sparkles } from 'lucide-react';

type Props = {
  pattern: Pattern;
  size?: 'sm' | 'md';
};

export function PatternBadge({ pattern, size = 'sm' }: Props) {
  const meta = patternMeta[pattern];
  const text = size === 'sm' ? 'text-[11px]' : 'text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium uppercase tracking-wide ${meta.accentClass} ${text}`}
      title={meta.blurb}
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      <span>{meta.label}</span>
      <span className="text-[10px] font-normal lowercase opacity-70">
        {meta.kind}
      </span>
    </span>
  );
}
