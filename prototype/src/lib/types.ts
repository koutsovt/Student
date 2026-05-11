export type Pattern =
  | 'inform-and-act'
  | 'status-check'
  | 'decide'
  | 'express'
  | 'nudge'
  | 'check-in';

export type PatternKind = 'reactive' | 'proactive';

export type PersonaId = 'aisha' | 'mark' | 'jess';

export type Channel = 'email' | 'lms' | 'sms';

export type Lifecycle = 'early-semester' | 'mid-late-semester' | 'end-outcome';

export type Speaker = 'student' | 'assistant' | 'system';

export type JourneyOverlay =
  | 'international'
  | 'mature-online'
  | 'regional-first-in-family';

export type Persona = {
  id: PersonaId;
  name: string;
  shortGreeting: string;
  overlay: JourneyOverlay;
  overlayLabel: string;
  blurb: string;
  primaryScenario: string;
};

export type Subject = {
  code: string;
  name: string;
  assessment?: { name: string; due: string };
  examDate?: string;
  result?: { grade: string; mark: number; status: 'pass' | 'fail' };
};

export type StudentRecord = {
  personaId: PersonaId;
  studentId: string;
  course: string;
  campus: string;
  enrolment: string;
  censusDate?: string;
  resultsReleaseDate?: string;
  ssaf: {
    status: 'paid' | 'unpaid' | 'deferred';
    amount: number;
    dueDate?: string;
    deferralEligible: boolean;
    deferralDeadline?: string;
    sanctionTriggered?: boolean;
    deferredLastSemester?: boolean;
  };
  courseTransfer?: {
    status: 'pending' | 'approved' | 'declined';
    submittedDate: string;
    fromCourse: string;
    toCourse: string;
    expectedDecision?: string;
  };
  subjects?: Subject[];
  lmsActivity: {
    lastLoginDays: number;
    weeklyAverage: number;
    notes?: string;
  };
};

export type FormField =
  | {
      kind: 'text';
      name: string;
      label: string;
      placeholder?: string;
      defaultValue?: string;
    }
  | {
      kind: 'select';
      name: string;
      label: string;
      options: { value: string; label: string }[];
      defaultValue?: string;
    }
  | {
      kind: 'checkbox';
      name: string;
      label: string;
      defaultValue?: boolean;
    };

export type Step =
  | { kind: 'student'; text: string }
  | { kind: 'assistant'; text: string; pattern: Pattern }
  | {
      kind: 'assistant-choices';
      text: string;
      pattern: Pattern;
      choices: { label: string; goto: string }[];
    }
  | {
      kind: 'student-input';
      pattern: Pattern;
      placeholder: string;
    }
  | { kind: 'system'; text: string }
  | {
      kind: 'form';
      pattern: Pattern;
      title: string;
      intro?: string;
      fields: FormField[];
      submitLabel: string;
    }
  | {
      kind: 'handoff';
      statusText: string;
      advisorPlaceholder: string;
    }
  | { kind: 'end' };

export type Scenario = {
  id: string;
  pattern: Pattern;
  lifecycle: Lifecycle;
  title: string;
  description: string;
  persona: PersonaId;
  starter: string;
  inbox?: {
    channel: Channel;
    sender: string;
    subject?: string;
    preview: string;
    body: string;
    timestamp: string;
    cta: string;
    courseContext?: string;
    reason: string;
  };
  blocks: Record<string, Step[]>;
};

export type TranscriptEntry =
  | {
      id: string;
      speaker: 'student';
      text: string;
    }
  | {
      id: string;
      speaker: 'assistant';
      text: string;
      pattern: Pattern;
    }
  | {
      id: string;
      speaker: 'system';
      text: string;
    }
  | {
      id: string;
      speaker: 'assistant';
      text: '';
      pattern: Pattern;
      typing: true;
    };

export type Awaiting =
  | { kind: 'idle' }
  | { kind: 'typing' }
  | {
      kind: 'choices';
      choices: { label: string; goto: string }[];
      pattern: Pattern;
    }
  | {
      kind: 'student-input';
      pattern: Pattern;
      placeholder: string;
    }
  | {
      kind: 'form';
      pattern: Pattern;
      title: string;
      intro?: string;
      fields: FormField[];
      submitLabel: string;
    }
  | {
      kind: 'handoff';
      statusText: string;
      advisorPlaceholder: string;
    }
  | { kind: 'free-input' }
  | { kind: 'end' };

export type EngineState = {
  scenarioId: string | null;
  block: string;
  index: number;
  transcript: TranscriptEntry[];
  awaiting: Awaiting;
  explainMode: boolean;
};
