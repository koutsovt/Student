import type { TranscriptEntry } from '../lib/types';
import { patternMeta } from '../lib/patterns';
import { PatternBadge } from './PatternBadge';

type Props = {
  entry: TranscriptEntry;
  explainMode: boolean;
};

export function MessageBubble({ entry, explainMode }: Props) {
  if (entry.speaker === 'system') {
    return (
      <div className="my-1 flex justify-center">
        <p className="max-w-[80%] text-center text-[12px] italic text-muted">
          {entry.text}
        </p>
      </div>
    );
  }

  if (entry.speaker === 'student') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-br-md bg-ltu-navy px-4 py-2.5 text-white shadow-soft">
          <p className="whitespace-pre-line text-[15px] leading-relaxed">
            {entry.text}
          </p>
        </div>
      </div>
    );
  }

  // assistant
  const typing = 'typing' in entry && entry.typing === true;
  const meta = patternMeta[entry.pattern];
  const stripeClass = explainMode && !typing ? meta.borderAccentClass : '';

  return (
    <div className="flex items-end gap-2">
      <Avatar />
      <div className="flex max-w-[78%] flex-col gap-1">
        {explainMode && !typing && (
          <PatternBadge pattern={entry.pattern} />
        )}
        <div
          className={[
            'rounded-2xl rounded-bl-md border border-border bg-surface-soft px-4 py-2.5 text-ltu-navy shadow-soft',
            stripeClass && `border-l-[3px] ${stripeClass}`,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {typing ? (
            <TypingDots />
          ) : (
            <p className="whitespace-pre-line text-[15px] leading-relaxed">
              {entry.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-[11px] font-bold tracking-wider text-ltu-red"
    >
      LT
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      <span className="h-1.5 w-1.5 rounded-full bg-muted animate-typing-dot [animation-delay:0s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted animate-typing-dot [animation-delay:0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted animate-typing-dot [animation-delay:0.3s]" />
    </div>
  );
}
