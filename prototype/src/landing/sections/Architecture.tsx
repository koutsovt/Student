import { ArrowDown } from 'lucide-react';
import type { Pattern } from '../../lib/types';
import { patternMeta } from '../../lib/patterns';

type Phase = 'launch' | 'later';

type Box = {
  label: string;
  caption: string;
  phase: Phase;
  patternHint?: string;
};

const channels: Box[] = [
  {
    label: 'On latrobe.edu.au/students',
    caption: 'The students portal · where Charlie lives today',
    phase: 'launch',
  },
  {
    label: 'In Moodle and web',
    caption: 'In-course or public',
    phase: 'launch',
  },
  {
    label: 'Outbound messages',
    caption: 'Email, LMS, SMS',
    phase: 'later',
    patternHint: 'Enables Nudge · Check-in',
  },
];

const draws: Box[] = [
  {
    label: 'Knowledge',
    caption: 'FAQs and pages',
    phase: 'launch',
    patternHint: 'Powers Inform-and-Act',
  },
  {
    label: 'Records',
    caption: 'Enrolment, fees',
    phase: 'launch',
    patternHint: 'Powers Status-Check',
  },
  {
    label: 'Action',
    caption: 'Guided actions',
    phase: 'launch',
    patternHint: 'Powers Decide',
  },
  {
    label: 'People',
    caption: 'Live advisors',
    phase: 'launch',
    patternHint: 'Powers Express',
  },
];

const memory: Box[] = [
  {
    label: 'Your profile',
    caption: 'Course, enrolment, key dates',
    phase: 'launch',
    patternHint: 'Personal from day one',
  },
  {
    label: "What I've noticed",
    caption: "Agent-curated facts the assistant has chosen to remember",
    phase: 'later',
    patternHint: 'Builds across the year',
  },
  {
    label: 'Conversation history',
    caption: 'Searchable past chats',
    phase: 'later',
    patternHint: 'Recall without re-asking',
  },
  {
    label: "Patterns I've spotted",
    caption: 'Implicit understanding — preferences, rhythms, signals',
    phase: 'later',
    patternHint: "What you wouldn't articulate",
  },
];

const underpinning = [
  'Data isolation',
  'Distress detection',
  'Audit-ready',
  'Cost and safety controls',
];

const allPatterns: Pattern[] = [
  'inform-and-act',
  'status-check',
  'decide',
  'express',
  'nudge',
  'check-in',
];

const launchBox = 'bg-emerald-200/70 border-emerald-400 text-emerald-950';
const laterBox = 'bg-rose-200/70 border-rose-400 text-rose-950';
const launchCaption = 'text-emerald-900/75';
const laterCaption = 'text-rose-900/75';
const launchHint = 'text-emerald-900/85';
const laterHint = 'text-rose-900/85';

export function Architecture() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-20 sm:px-8 sm:py-28">
        <Heading />

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1">
            <Diagram />
          </div>
          <Narrative />
        </div>

        <Footnote />
      </div>
    </section>
  );
}

function Heading() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          How it works behind the scenes
        </span>
        <h2 className="max-w-3xl text-[26px] font-bold leading-tight text-ltu-navy sm:text-[32px]">
          Solution architecture, in plain English
        </h2>
        <p className="max-w-2xl text-[15px] leading-relaxed text-ltu-navy/75">
          The same architecture handles all six conversation types. Most of it
          ships at launch; one slice arrives in a follow-up release.
        </p>
      </div>
      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 self-start text-[12px] sm:self-end">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400 bg-emerald-200/70 px-2.5 py-1 font-medium text-emerald-950">
        <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden /> At
        launch
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400 bg-rose-200/70 px-2.5 py-1 font-medium text-rose-950">
        <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden /> Later
      </span>
    </div>
  );
}

function Diagram() {
  return (
    <div className="flex flex-col gap-2.5">
      <Layer label="Where students engage">
        <div className="grid gap-3 sm:grid-cols-3">
          {channels.map((c) => (
            <BoxCard key={c.label} box={c} />
          ))}
        </div>
      </Layer>

      <Connector />

      <AssistantBlock />

      <Connector />

      <Layer label="What the assistant draws on">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {draws.map((d) => (
            <BoxCard key={d.label} box={d} />
          ))}
        </div>
      </Layer>

      <Layer
        label="Memory"
        caption="What the assistant knows about you specifically — bounded by design, grows through use."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {memory.map((m) => (
            <BoxCard key={m.label} box={m} />
          ))}
        </div>
      </Layer>

      <Underpinning />
    </div>
  );
}

function Layer({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-col gap-0.5">
        <span className="block text-[13px] font-semibold text-ltu-navy">
          {label}
        </span>
        {caption && (
          <span className="block text-[12px] italic text-muted">{caption}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function BoxCard({ box }: { box: Box }) {
  const isLaunch = box.phase === 'launch';
  const styles = isLaunch ? launchBox : laterBox;
  const captionClass = isLaunch ? launchCaption : laterCaption;
  const hintClass = isLaunch ? launchHint : laterHint;
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border ${styles} px-4 py-3.5`}
    >
      <span className="text-[14px] font-semibold">{box.label}</span>
      <span className={`text-[12px] ${captionClass}`}>{box.caption}</span>
      {box.patternHint && (
        <span
          className={`mt-1 text-[11px] font-medium italic ${hintClass}`}
        >
          {box.patternHint}
        </span>
      )}
    </div>
  );
}

function AssistantBlock() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500 bg-emerald-300/60 px-5 py-6 text-center sm:px-8 sm:py-7">
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-[18px] font-semibold text-emerald-950 sm:text-[20px]">
          The assistant
        </h3>
        <p className="text-[14px] leading-relaxed text-emerald-950/80 sm:text-[15px]">
          Asks what's needed before answering. Six conversation types.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {allPatterns.map((p) => (
          <PatternChip key={p} pattern={p} />
        ))}
      </div>
    </div>
  );
}

function PatternChip({ pattern }: { pattern: Pattern }) {
  const meta = patternMeta[pattern];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.accentClass}`}
    >
      {meta.label}
    </span>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <ArrowDown className="h-4 w-4 text-muted" />
    </div>
  );
}

function Underpinning() {
  return (
    <p className="mt-3 text-center text-[12.5px] leading-relaxed text-muted">
      Underpinned by ·{' '}
      {underpinning.map((u, i) => (
        <span key={u}>
          <span className="font-medium text-ltu-navy/80">{u}</span>
          {i < underpinning.length - 1 ? ' · ' : ''}
        </span>
      ))}
    </p>
  );
}

function Narrative() {
  return (
    <aside className="flex flex-col gap-4 lg:w-[340px] lg:shrink-0 lg:border-l lg:border-border lg:pl-7 xl:w-[380px]">
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ltu-red">
          For the boardroom
        </span>
        <h3 className="text-[18px] font-semibold leading-tight text-ltu-navy sm:text-[20px]">
          Reading the architecture
        </h3>
      </div>

      <div className="flex flex-col gap-3 text-[14px] leading-relaxed text-ltu-navy/85">
        <p>
          <strong className="font-semibold text-ltu-navy">Top-down.</strong>{' '}
          Three surfaces. Two at launch — the students portal and Moodle. The
          coral row, outbound messages, comes later — it's what unlocks{' '}
          <em className="not-italic font-medium text-ltu-navy">Nudge</em> and{' '}
          <em className="not-italic font-medium text-ltu-navy">Check-in</em>.
        </p>

        <p>
          <strong className="font-semibold text-ltu-navy">The assistant.</strong>{' '}
          One sentence is the whole intent:{' '}
          <em className="not-italic font-medium text-ltu-navy">
            "Asks what's needed before answering."
          </em>{' '}
          Six conversation types behind it. Everything else serves them.
        </p>

        <p>
          <strong className="font-semibold text-ltu-navy">
            What it draws on.
          </strong>{' '}
          One capability per reactive pattern.{' '}
          <em className="not-italic font-medium text-ltu-navy">Knowledge</em> →
          Inform-and-Act.{' '}
          <em className="not-italic font-medium text-ltu-navy">Records</em> →
          Status-Check.{' '}
          <em className="not-italic font-medium text-ltu-navy">Action</em> →
          Decide.{' '}
          <em className="not-italic font-medium text-ltu-navy">People</em> →
          Express. All at launch.
        </p>

        <p>
          <strong className="font-semibold text-ltu-navy">Memory.</strong>{' '}
          What the assistant remembers about each student.{' '}
          <em className="not-italic font-medium text-ltu-navy">Your profile</em>{' '}
          is there from day one — course, enrolment, key dates. The rest builds
          across the year:{' '}
          <em className="not-italic font-medium text-ltu-navy">
            What I've noticed
          </em>{' '}
          is the assistant's own curated facts,{' '}
          <em className="not-italic font-medium text-ltu-navy">
            Conversation history
          </em>{' '}
          is searchable past chats,{' '}
          <em className="not-italic font-medium text-ltu-navy">
            Patterns I've spotted
          </em>{' '}
          is the implicit model — preferences, rhythms, signals the student
          wouldn't articulate themselves. Bounded by design so every
          interaction stays focused.
        </p>

        <p>
          <strong className="font-semibold text-ltu-navy">Learning.</strong>{' '}
          Three loops, off at launch and on in the follow-up release. The
          assistant writes agent-curated facts into memory after meaningful
          turns (per-student). Skills get patched when outcomes show they're
          outdated or incomplete (per-skill). Population-level signal —{' '}
          <em className="not-italic font-medium text-ltu-navy">
            "32% of SSAF queries were deferral-purpose, not definition-purpose"
          </em>{' '}
          — feeds content fixes and new skills upstream (population-wide). And
          yes,{' '}
          <strong className="font-semibold text-ltu-navy">
            new skills are created
          </strong>{' '}
          — when a topic repeats without coverage, when a student-specific
          pattern emerges, or when the autonomous curator consolidates the
          library.
        </p>

        <p>
          <strong className="font-semibold text-ltu-navy">Underpinned by.</strong>{' '}
          Trust across every pattern. Data isolated per student. Distress
          signals trigger Express. Every interaction auditable. Safety controls
          hold the line on Nudge / Check-in when a student is already
          struggling.
        </p>
      </div>
    </aside>
  );
}

function Footnote() {
  return (
    <p className="text-[11px] italic leading-relaxed text-muted">
      Source:{' '}
      <span className="font-medium not-italic text-ltu-navy/70">
        Charlie Pattern Architecture v0.5
      </span>
      . Vendor names abstracted to functional roles for the senior audience —
      engineering detail in the source document.
    </p>
  );
}
