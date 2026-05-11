import type { Scenario } from '../lib/types';
import { patternMeta, proposingCaption } from '../lib/patterns';
import { Mail, MessageSquare, Megaphone, ChevronRight } from 'lucide-react';

type Props = {
  scenario: Scenario;
  onOpen: () => void;
};

function ProposingCaption({ pattern }: { pattern: Scenario['pattern'] }) {
  const meta = patternMeta[pattern];
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${meta.captionTextClass}`}
    >
      {proposingCaption(pattern)}
    </span>
  );
}

export function OutboundMessage({ scenario, onOpen }: Props) {
  const inbox = scenario.inbox;
  if (!inbox) return null;
  const meta = patternMeta[scenario.pattern];

  if (inbox.channel === 'email') {
    return (
      <article className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft">
        <ProposingCaption pattern={scenario.pattern} />
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ltu-red/10 text-ltu-red">
            <Mail className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col leading-tight">
            <span className="text-[14px] font-semibold text-ltu-navy">
              {inbox.sender}
            </span>
            <span className="text-[11px] text-muted">{inbox.timestamp}</span>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.accentClass}`}>
            {meta.short}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-semibold text-ltu-navy">
            {inbox.subject}
          </h3>
          <p className="whitespace-pre-line text-[14px] leading-relaxed text-ltu-navy/90">
            {inbox.body}
          </p>
        </div>

        <Disclosure reason={inbox.reason} />

        <button
          type="button"
          onClick={onOpen}
          className="focus-ring inline-flex items-center justify-center gap-1.5 self-start rounded-full bg-ltu-red px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
        >
          {inbox.cta} <ChevronRight className="h-4 w-4" />
        </button>
      </article>
    );
  }

  if (inbox.channel === 'sms') {
    return (
      <article className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft">
        <ProposingCaption pattern={scenario.pattern} />
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ltu-red/10 text-ltu-red">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col leading-tight">
            <span className="text-[14px] font-semibold text-ltu-navy">
              {inbox.sender}
            </span>
            <span className="text-[11px] text-muted">{inbox.timestamp}</span>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.accentClass}`}>
            {meta.short}
          </span>
        </div>

        <div className="rounded-2xl bg-surface-soft p-3.5">
          <p className="whitespace-pre-line text-[14px] leading-relaxed text-ltu-navy/90">
            {inbox.body}
          </p>
        </div>

        <Disclosure reason={inbox.reason} />

        <button
          type="button"
          onClick={onOpen}
          className="focus-ring inline-flex items-center justify-center gap-1.5 self-start rounded-full bg-ltu-red px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
        >
          {inbox.cta} <ChevronRight className="h-4 w-4" />
        </button>
      </article>
    );
  }

  // LMS announcement
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft">
      <ProposingCaption pattern={scenario.pattern} />
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ltu-red/10 text-ltu-red">
          <Megaphone className="h-4 w-4" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-ltu-navy/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ltu-navy">
              New announcement
            </span>
            {inbox.courseContext && (
              <span className="text-[12px] font-semibold text-ltu-navy">
                {inbox.courseContext}
              </span>
            )}
            <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.accentClass}`}>
              {meta.short}
            </span>
          </div>
          <span className="text-[11px] text-muted">{inbox.timestamp}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-[16px] font-semibold text-ltu-navy">
          {inbox.subject}
        </h3>
        <p className="whitespace-pre-line text-[14px] leading-relaxed text-ltu-navy/90">
          {inbox.body}
        </p>
      </div>

      <Disclosure reason={inbox.reason} />

      <button
        type="button"
        onClick={onOpen}
        className="focus-ring inline-flex items-center justify-center gap-1.5 self-start rounded-full bg-ltu-red px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
      >
        {inbox.cta} <ChevronRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function Disclosure({ reason }: { reason: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface-soft px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        Why you're seeing this
      </p>
      <p className="text-[12px] leading-relaxed text-ltu-navy/80">{reason}</p>
      <div className="mt-1 flex items-center gap-3">
        <button
          type="button"
          className="focus-ring text-[11px] font-semibold text-ltu-red underline-offset-2 hover:underline"
        >
          Adjust preferences
        </button>
        <span className="text-muted">·</span>
        <button
          type="button"
          className="focus-ring text-[11px] font-semibold text-ltu-red underline-offset-2 hover:underline"
        >
          Stop these messages
        </button>
      </div>
    </div>
  );
}
