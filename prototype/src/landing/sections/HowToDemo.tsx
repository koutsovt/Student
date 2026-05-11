import {
  UserSquare2,
  CalendarRange,
  Eye,
  Rocket,
  Inbox,
  ShieldCheck,
} from 'lucide-react';

const steps: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}[] = [
  {
    icon: UserSquare2,
    title: 'Pick a persona',
    body: 'Right-hand panel — Aisha, Mark, or Jess. Switching resets the conversation and pulls in their mock record.',
  },
  {
    icon: CalendarRange,
    title: 'Walk the academic year',
    body: 'Scenarios are grouped by lifecycle stage — early semester, mid–late, end. Walk a persona top-to-bottom for the cleanest demo arc.',
  },
  {
    icon: Eye,
    title: 'Toggle Explain mode',
    body: 'Shows the pattern badge on every assistant turn so the audience can see the model classify in real time.',
  },
  {
    icon: Rocket,
    title: 'Switch Launch / Later',
    body: 'Hides the proactive scenarios when set to launch-only. Useful for showing what ships first vs. what comes in a follow-up release.',
  },
  {
    icon: Inbox,
    title: 'Open an inbox message',
    body: 'For proactive flows, the simulated inbox appears first — email, LMS announcement, or SMS. Click the message to step into the chat already in flight.',
  },
  {
    icon: ShieldCheck,
    title: 'Watch the held state',
    body: 'When distress signals trigger an Express handoff, the chat enters a green held state with a wellbeing advisor cue. In-channel, never a phone-number redirect.',
  },
];

export function HowToDemo() {
  return (
    <section className="bg-surface-soft">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-20 sm:px-8 sm:py-24">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            For the presenter
          </span>
          <h2 className="max-w-3xl text-[26px] font-bold leading-tight text-ltu-navy sm:text-[32px]">
            How to drive the demo
          </h2>
        </header>

        <ol className="grid gap-3 md:grid-cols-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <li
                key={s.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ltu-red/10 text-ltu-red">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Step {i + 1}
                  </span>
                  <h3 className="text-[16px] font-semibold leading-tight text-ltu-navy">
                    {s.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-ltu-navy/80">
                    {s.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
