import { ArrowRight } from 'lucide-react';

type Props = {
  onOpenDemo: () => void;
};

export function CTAStrip({ onOpenDemo }: Props) {
  return (
    <section className="bg-ltu-navy">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-[24px] font-bold leading-tight text-white sm:text-[28px]">
            Ready to walk the matrix?
          </h2>
          <p className="max-w-md text-[14px] leading-relaxed text-white/75">
            Best demoed by a presenter. Mobile-first; works on phone, tablet,
            desktop. All conversations are scripted state machines — no LLM,
            no APIs, no real provider integrations.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenDemo}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-ltu-red px-6 py-3.5 text-[15px] font-semibold text-white shadow-soft transition hover:brightness-110"
        >
          Open the demo <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
