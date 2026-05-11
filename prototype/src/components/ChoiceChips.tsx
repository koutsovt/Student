import type { Pattern } from '../lib/types';
import { patternMeta, proposingCaption } from '../lib/patterns';

type Props = {
  choices: { label: string; goto: string }[];
  pattern: Pattern;
  explainMode: boolean;
  onPick: (label: string, goto: string) => void;
};

export function ChoiceChips({ choices, pattern, explainMode, onPick }: Props) {
  const meta = patternMeta[pattern];

  return (
    <div className="flex flex-col items-end gap-1.5 pl-10">
      {explainMode && (
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${meta.captionTextClass}`}
          aria-live="polite"
        >
          {proposingCaption(pattern)}
        </span>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        {choices.map((c) => (
          <button
            key={c.label + c.goto}
            type="button"
            onClick={() => onPick(c.label, c.goto)}
            className={[
              'focus-ring rounded-full border bg-white px-3.5 py-2 text-[14px] font-medium text-ltu-navy shadow-sm transition',
              meta.chipBorderClass,
              meta.chipHoverClass,
            ].join(' ')}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
