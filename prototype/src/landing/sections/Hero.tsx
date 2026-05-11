import { ArrowRight } from 'lucide-react';

type Props = {
  onOpenDemo: () => void;
};

export function Hero({ onOpenDemo }: Props) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="h-1.5 w-full bg-ltu-red" />
      <div className="mx-auto flex max-w-5xl flex-col gap-7 px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ltu-red">
          La Trobe assistant · workshop prototype
        </span>

        <h1 className="max-w-3xl text-[34px] font-bold leading-[1.12] text-ltu-navy sm:text-[48px]">
          Replacing Charlie.
          <br />
          From FAQ-matching to{' '}
          <span className="text-ltu-red">conversation-types.</span>
        </h1>

        <p className="max-w-2xl text-[16px] leading-relaxed text-ltu-navy/80 sm:text-[18px]">
          A workshop validation prototype of the new student-facing assistant —
          six conversation patterns, three personas, an academic year of
          scenarios. Not production. Mock data only.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenDemo}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-ltu-red px-6 py-3.5 text-[15px] font-semibold text-white shadow-soft transition hover:brightness-110"
          >
            Open the demo <ArrowRight className="h-4 w-4" />
          </button>
          <span className="rounded-full border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
            Workshop validation · not production · all data is mock
          </span>
        </div>
      </div>
    </section>
  );
}
