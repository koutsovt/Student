import { AlertCircle, Sparkles, Quote } from 'lucide-react';

export function Problem() {
  return (
    <section className="bg-surface-soft">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-20 sm:px-8 sm:py-24">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            What we're improving from
          </span>
          <h2 className="max-w-3xl text-[26px] font-bold leading-tight text-ltu-navy sm:text-[32px]">
            Charlie answers what's typed. The new assistant asks what's needed.
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-alert/10 text-amber-alert">
                <AlertCircle className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-[16px] font-semibold text-ltu-navy">
                Charlie today
              </h3>
            </div>
            <p className="text-[15px] leading-relaxed text-ltu-navy/85">
              FAQ-matching against ~20 sample questions per article. When the
              surface query masks the real need, students miss the answer they
              actually want. Lives as a red-box launcher on ASK La Trobe.
            </p>
            <p className="mt-1 rounded-xl border border-border bg-surface-soft px-4 py-3 text-[13px] text-ltu-navy/80">
              <strong className="font-semibold text-ltu-navy">7,648</strong>{' '}
              fee-non-payment sanctions in Semester 1 — most assumed to be
              SSAF, where students asked "what is SSAF?" but actually meant
              "how do I defer it?"
            </p>
          </article>

          <article className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ltu-red/10 text-ltu-red">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-[16px] font-semibold text-ltu-navy">
                The new assistant
              </h3>
            </div>
            <p className="text-[15px] leading-relaxed text-ltu-navy/85">
              Asks what's needed before answering. Routes by purpose, not topic.
              Lodges actions in chat. Hands off to a wellbeing advisor
              in-channel when distress signals come up — never a phone-number
              redirect.
            </p>
            <p className="mt-1 rounded-xl border border-border bg-surface-soft px-4 py-3 text-[13px] text-ltu-navy/80">
              Six conversation patterns, three personas, eleven scripted
              scenarios across an academic year. Validation scope, not
              feature-complete.
            </p>
          </article>
        </div>

        <blockquote className="relative mx-auto max-w-3xl rounded-2xl bg-ltu-navy px-6 py-7 text-center text-white sm:px-10 sm:py-9">
          <Quote
            className="absolute left-5 top-5 h-5 w-5 text-white/40"
            aria-hidden
          />
          <p className="text-[18px] font-medium leading-relaxed sm:text-[22px]">
            "Charlie answers what's typed. The new assistant asks what's
            needed."
          </p>
          <footer className="mt-3 text-[11px] uppercase tracking-wider text-white/60">
            Workshop briefing v1.2
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
