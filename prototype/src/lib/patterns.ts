import type { Pattern, PatternKind } from './types';

export type ProposingVerb =
  | 'probe'
  | 'check'
  | 'confirm'
  | 'offer'
  | 'urgency'
  | 'open';

type PatternMeta = {
  label: string;
  short: string;
  kind: PatternKind;
  blurb: string;
  accentClass: string;
  borderAccentClass: string;
  chipBorderClass: string;
  chipHoverClass: string;
  captionTextClass: string;
  proposing: { verb: ProposingVerb; label: string };
};

export const patternMeta: Record<Pattern, PatternMeta> = {
  'inform-and-act': {
    label: 'Inform-and-Act',
    short: 'Inform',
    kind: 'reactive',
    blurb:
      'Surface query → probe purpose → route to the right answer. The disambiguation step is the central behavioural shift.',
    accentClass: 'bg-ltu-navy/10 text-ltu-navy',
    borderAccentClass: 'border-l-ltu-navy',
    chipBorderClass: 'border-ltu-navy/30',
    chipHoverClass: 'hover:border-ltu-navy hover:bg-ltu-navy hover:text-white',
    captionTextClass: 'text-ltu-navy',
    proposing: { verb: 'probe', label: 'purpose probe' },
  },
  'status-check': {
    label: 'Status-Check',
    short: 'Status',
    kind: 'reactive',
    blurb:
      "Read the student's record and reply with their answer — not a generic article.",
    accentClass: 'bg-blue-100 text-blue-900',
    borderAccentClass: 'border-l-blue-700',
    chipBorderClass: 'border-blue-300',
    chipHoverClass: 'hover:border-blue-700 hover:bg-blue-700 hover:text-white',
    captionTextClass: 'text-blue-800',
    proposing: { verb: 'check', label: 'follow-up' },
  },
  decide: {
    label: 'Decide',
    short: 'Decide',
    kind: 'reactive',
    blurb:
      'Multi-turn flow: eligibility → confirm → lodge. Maps to the agent-callable action tools.',
    accentClass: 'bg-emerald-100 text-emerald-900',
    borderAccentClass: 'border-l-emerald-600',
    chipBorderClass: 'border-emerald-300',
    chipHoverClass:
      'hover:border-emerald-700 hover:bg-emerald-700 hover:text-white',
    captionTextClass: 'text-emerald-800',
    proposing: { verb: 'confirm', label: 'confirm and lodge' },
  },
  express: {
    label: 'Express',
    short: 'Express',
    kind: 'reactive',
    blurb:
      'Distress signal → listen → surface support → in-channel handoff to a wellbeing advisor. Held state, not a phone redirect.',
    accentClass: 'bg-amber-100 text-amber-900',
    borderAccentClass: 'border-l-amber-600',
    chipBorderClass: 'border-amber-300',
    chipHoverClass:
      'hover:border-amber-700 hover:bg-amber-700 hover:text-white',
    captionTextClass: 'text-amber-800',
    proposing: { verb: 'offer', label: 'pick what feels right' },
  },
  nudge: {
    label: 'Nudge',
    short: 'Nudge',
    kind: 'proactive',
    blurb:
      'System-initiated. Outbound message reaches the student before a deadline, then click-through into a chat already in flight.',
    accentClass: 'bg-purple-100 text-purple-900',
    borderAccentClass: 'border-l-purple-600',
    chipBorderClass: 'border-purple-300',
    chipHoverClass:
      'hover:border-purple-700 hover:bg-purple-700 hover:text-white',
    captionTextClass: 'text-purple-800',
    proposing: { verb: 'urgency', label: 'before the deadline' },
  },
  'check-in': {
    label: 'Check-in',
    short: 'Check-in',
    kind: 'proactive',
    blurb:
      'System-initiated. Behavioural signal triggers a gentle outbound message; the conversation opens in-channel.',
    accentClass: 'bg-rose-100 text-rose-900',
    borderAccentClass: 'border-l-rose-500',
    chipBorderClass: 'border-rose-300',
    chipHoverClass: 'hover:border-rose-600 hover:bg-rose-600 hover:text-white',
    captionTextClass: 'text-rose-700',
    proposing: { verb: 'open', label: 'no pressure' },
  },
};

export const isProactive = (p: Pattern) => patternMeta[p].kind === 'proactive';

export const proposingCaption = (p: Pattern): string =>
  `${patternMeta[p].label} · ${patternMeta[p].proposing.label}`;
