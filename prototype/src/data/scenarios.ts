import type { Scenario } from '../lib/types';

const ssafForm = {
  kind: 'form' as const,
  pattern: 'decide' as const,
  title: 'Defer SSAF to HELP',
  intro: "Just a couple of confirmations. Stays in chat — no separate portal.",
  submitLabel: 'Lodge deferral',
  fields: [
    {
      kind: 'select' as const,
      name: 'citizenship',
      label: 'Citizenship status',
      options: [
        { value: 'au-citizen', label: 'Australian citizen' },
        { value: 'pr', label: 'Permanent resident (humanitarian)' },
        { value: 'nz-scv', label: 'NZ Special Category Visa' },
      ],
    },
    {
      kind: 'select' as const,
      name: 'tfn',
      label: 'Tax File Number on file?',
      options: [
        { value: 'yes', label: 'Yes — already provided' },
        { value: 'no', label: "No — I\'ll add it now" },
      ],
    },
    {
      kind: 'checkbox' as const,
      name: 'agree',
      label:
        'I confirm I want to defer SSAF for Semester 1 2026 ($162.50) to my HELP loan.',
    },
  ],
};

// ============================================================
// AISHA — international undergraduate
// ============================================================

const informAndActSSAF: Scenario = {
  id: 'inform-and-act-ssaf',
  pattern: 'inform-and-act',
  lifecycle: 'early-semester',
  title: 'Ask "What is SSAF?"',
  description: 'Surface query → purpose probe → routed answer',
  persona: 'aisha',
  starter: 'What is SSAF?',
  blocks: {
    start: [
      { kind: 'student', text: 'What is SSAF?' },
      {
        kind: 'assistant-choices',
        pattern: 'inform-and-act',
        text: "Happy to help — there are a few different reasons people ask about SSAF, so I\'d like to point you to the right thing. Are you trying to:",
        choices: [
          { label: 'Understand what it pays for', goto: 'explain' },
          { label: 'Pay it', goto: 'pay' },
          { label: 'Defer it to HELP', goto: 'defer' },
          { label: "I can\'t enrol — is this why?", goto: 'sanction' },
        ],
      },
    ],
    explain: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "SSAF — the Student Services and Amenities Fee — is a flat fee La Trobe charges each semester to fund student services that aren\'t part of teaching. Things like advocacy, sport and rec, careers support, food relief, and orientation events.",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "For Semester 1 it\'s $162.50 if you\'re full-time. It\'s separate from tuition.\n\nIf you decide later you\'d like to defer it to HELP rather than pay up front, just let me know — it\'s a different form from tuition deferral and I can walk you through it.",
      },
      { kind: 'end' },
    ],
    pay: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "You can pay SSAF through the StudentOnLine portal — it sits under Finance → Pay Fees. BPAY and card both work. For Semester 1, the amount is $162.50.",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Heads up — if paying isn\'t straightforward right now, you may be eligible to defer it to HELP instead. Want me to check that for you?",
      },
      { kind: 'end' },
    ],
    defer: [
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Got it — you\'re looking to defer SSAF to HELP. Quick note: it\'s a separate form from tuition deferral, which trips a lot of students up. Let me check eligibility on your record first.",
      },
      { kind: 'system', text: 'Checking eligibility…' },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "All good — you\'re eligible to defer SSAF to HELP. The deadline is 14 May 2026 (6 days away). Shall we lodge it now? It takes about three minutes.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'decide',
        text: 'Ready to go?',
        choices: [
          { label: 'Yes, walk me through it', goto: 'defer-form' },
          { label: 'Not right now', goto: 'defer-later' },
        ],
      },
    ],
    'defer-form': [
      ssafForm,
      { kind: 'system', text: 'Lodging deferral…' },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Done. Submission ID 2026-SSAF-D-44812. You\'ll see this on StudentOnLine within 24 hours, and the amount will land on your HELP statement at the next reconciliation.",
      },
      { kind: 'end' },
    ],
    'defer-later': [
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "No worries — just keep an eye on the 14 May deadline. I can drop you a reminder closer to the date if you\'d like.",
      },
      { kind: 'end' },
    ],
    sanction: [
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Let me check what\'s blocking your enrolment.",
      },
      { kind: 'system', text: 'Checking your record…' },
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Right — your enrolment is held because SSAF for Semester 1 ($162.50) is unpaid. That\'s the cause. Once it\'s sorted, the hold lifts within 24 hours.",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Two ways forward — pay it now, or defer it to HELP if you\'re eligible. Which would you like to do?",
      },
      { kind: 'end' },
    ],
  },
};

const expressNotCoping: Scenario = {
  id: 'express-not-coping',
  pattern: 'express',
  lifecycle: 'mid-late-semester',
  title: '"I\'m not coping"',
  description: 'Disclosure → support options → in-channel handoff',
  persona: 'aisha',
  starter: "I'm not coping",
  blocks: {
    start: [
      { kind: 'student', text: "I\'m not coping at the moment" },
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Thanks for telling me that — it takes something to say it. I want to make sure you get the right kind of support, and I won\'t rush you.",
      },
      {
        kind: 'assistant',
        pattern: 'express',
        text: 'A few things I can do right now — none of these have to be the answer, just options:',
      },
      {
        kind: 'assistant-choices',
        pattern: 'express',
        text: 'What feels right?',
        choices: [
          { label: "I\'d like to talk to someone now", goto: 'handoff' },
          { label: "Just send me what\'s available", goto: 'options' },
          { label: "I\'m okay — thanks", goto: 'closeout' },
        ],
      },
    ],
    handoff: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Okay — I\'m bringing in a wellbeing support advisor right now. You don\'t need to repeat anything; they\'ll see we\'ve been chatting. Just hang on for a moment.",
      },
      {
        kind: 'handoff',
        statusText:
          'Connecting you to a wellbeing support advisor — a real person will be with you shortly.',
        advisorPlaceholder: 'An advisor will join you shortly.',
      },
    ],
    options: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Here\'s what\'s available — pick whichever fits, or none of them. No follow-up unless you ask:",
      },
      {
        kind: 'assistant',
        pattern: 'express',
        text: "• La Trobe Counselling — free, confidential, can be in-person or online. Usually within 1–2 days.\n• Crisis Line (Lifeline) — 13 11 14, available 24/7.\n• Student Wellbeing — drop-in support, no appointment needed.\n• If you\'d rather just chat to a person here, I can connect you to a wellbeing advisor.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'express',
        text: 'Anything else?',
        choices: [
          { label: 'Actually, connect me to someone', goto: 'handoff' },
          { label: "No, that\'s enough for now", goto: 'closeout' },
        ],
      },
    ],
    closeout: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "I\'m here whenever. No need to start from scratch next time — I\'ll remember we spoke.",
      },
      { kind: 'end' },
    ],
  },
};

const nudgeSSAFDeadline: Scenario = {
  id: 'nudge-ssaf-deadline',
  pattern: 'nudge',
  lifecycle: 'mid-late-semester',
  title: 'SSAF deadline nudge',
  description: 'Outbound (email / SMS) → click-through into deferral walkthrough',
  persona: 'aisha',
  starter: '[Proactive] SSAF nudge',
  inbox: {
    channel: 'email',
    sender: 'La Trobe Assistant',
    subject: 'You can defer your SSAF — deadline in 6 days',
    preview:
      "It looks like SSAF is still unpaid. You may be eligible to defer it to HELP — it only takes a few minutes.",
    body: "Hi Aisha,\n\nThis is your La Trobe assistant. Your SSAF for Semester 1 is unpaid and you may be eligible to defer it to HELP. The deferral form is separate from tuition — and the deadline is 14 May 2026 (six days away).\n\nIf you\'d like, I can walk you through the form right now in chat. About three minutes.",
    timestamp: 'Today, 9:14am',
    cta: 'Open in chat',
    reason: 'You are eligible to defer SSAF to HELP; deadline 14 May 2026.',
  },
  blocks: {
    start: [
      {
        kind: 'system',
        text: 'Continuing from your message — opened from email, 9:14am.',
      },
      {
        kind: 'assistant',
        pattern: 'nudge',
        text: "Right — let\'s walk you through deferring SSAF. The deadline is 14 May (6 days away), so let\'s get this off your plate.",
      },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "I\'ve already checked — you\'re eligible to defer to HELP. It\'s a separate form from tuition deferral, but you can lodge it right here.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'decide',
        text: 'Ready?',
        choices: [
          { label: 'Yes, walk me through it', goto: 'form' },
          { label: 'Not right now', goto: 'hold' },
        ],
      },
    ],
    form: [
      ssafForm,
      { kind: 'system', text: 'Lodging deferral…' },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Done. Submission ID 2026-SSAF-D-44812. You\'ll see it on StudentOnLine within 24 hours and on your HELP statement at the next reconciliation. Glad we caught this before the deadline.",
      },
      { kind: 'end' },
    ],
    hold: [
      {
        kind: 'assistant',
        pattern: 'nudge',
        text: "All good — I\'ll send a quick reminder a couple of days before the deadline. If anything changes between now and then just say.",
      },
      { kind: 'end' },
    ],
  },
};

const decideSSAFDefer: Scenario = {
  id: 'decide-ssaf-defer',
  pattern: 'decide',
  lifecycle: 'end-outcome',
  title: 'Defer SSAF',
  description: 'Eligibility → guided form → confirmation',
  persona: 'aisha',
  starter: 'I want to defer my SSAF',
  blocks: {
    start: [
      { kind: 'student', text: 'I want to defer my SSAF' },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Sure — let\'s do that. SSAF defers to HELP through a separate form to tuition, so I\'ll handle it in chat. Checking your eligibility now.",
      },
      { kind: 'system', text: 'Checking eligibility…' },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "You\'re eligible. The amount is $162.50 for Semester 1, and the deadline is 14 May 2026 (6 days away).",
      },
      {
        kind: 'assistant-choices',
        pattern: 'decide',
        text: "Ready to lodge it now? Takes about three minutes.",
        choices: [
          { label: "Yes, let\'s do it", goto: 'form' },
          { label: 'Hold off for now', goto: 'hold' },
        ],
      },
    ],
    form: [
      ssafForm,
      { kind: 'system', text: 'Lodging deferral…' },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Sorted. Submission ID 2026-SSAF-D-44812. It\'ll show on StudentOnLine within 24 hours and on your HELP statement at the next reconciliation.",
      },
      { kind: 'end' },
    ],
    hold: [
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Fair enough. Just keep an eye on 14 May. I can drop a quick reminder closer to the date if you\'d like.",
      },
      { kind: 'end' },
    ],
  },
};

// ============================================================
// MARK — mature-age, fully online
// ============================================================

const checkInLMSDropoff: Scenario = {
  id: 'check-in-lms-dropoff',
  pattern: 'check-in',
  lifecycle: 'early-semester',
  title: 'LMS engagement check-in',
  description: 'Outbound (LMS announcement) → gentle conversation',
  persona: 'mark',
  starter: '[Proactive] At-risk check-in',
  inbox: {
    channel: 'lms',
    sender: 'La Trobe Assistant',
    subject: 'Just checking in',
    preview:
      "We noticed you haven\'t logged into Moodle for a couple of weeks. Anything we can help with?",
    body: "Hi Mark — this is your La Trobe assistant. We noticed you haven\'t logged into Moodle for about two weeks, so I wanted to check in. There\'s no problem with your enrolment — just wanted to ask if everything\'s okay, and let you know what support is around if you need it.",
    timestamp: 'Posted today',
    cta: 'Reply in chat',
    courseContext: 'CSE5DEV — Software Engineering Practice',
    reason:
      "Your recent Moodle activity dropped off — we reach out so support is offered, not waited for.",
  },
  blocks: {
    start: [
      {
        kind: 'system',
        text: 'Continuing from the announcement on CSE5DEV.',
      },
      {
        kind: 'assistant',
        pattern: 'check-in',
        text: "Hey Mark — thanks for opening this. No agenda, just checking in. I noticed you hadn\'t logged into Moodle for a couple of weeks, which is a fair bit different from your usual.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'check-in',
        text: "Anything getting in the way at the moment?",
        choices: [
          { label: 'Just busy with work', goto: 'busy' },
          { label: 'Family / personal stuff', goto: 'personal' },
          { label: 'Honestly, struggling a bit', goto: 'struggling' },
          { label: "I\'m fine — thanks for checking", goto: 'fine' },
        ],
      },
    ],
    busy: [
      {
        kind: 'assistant',
        pattern: 'check-in',
        text: "Makes sense — the part-time online cohort often hits this around mid-semester. A few options if any of them help: you can reduce study load for the semester, defer assignments where there\'s a documented reason, or just talk to your subject coordinator about the catch-up plan.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'check-in',
        text: 'Want me to help with any of those, or leave it for now?',
        choices: [
          { label: 'Tell me more about reducing load', goto: 'load-info' },
          { label: 'Leave it for now', goto: 'fine' },
        ],
      },
    ],
    personal: [
      {
        kind: 'assistant',
        pattern: 'check-in',
        text: "Got it — that comes up a lot, and there\'s usually a way to take pressure off without setting your study back. The Student Wellbeing team can help work out what fits, including special consideration if it\'s affecting assessments.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'check-in',
        text: 'Want to take this further, or just keep it on the radar for now?',
        choices: [
          { label: 'Connect me to wellbeing', goto: 'handoff' },
          { label: 'Keep it on the radar', goto: 'fine' },
        ],
      },
    ],
    struggling: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Thanks for being honest — that\'s the right thing to say if it\'s how things are. Let\'s slow down a bit.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'express',
        text: "Would it help to talk to a person now, or would you rather I just send what\'s available?",
        choices: [
          { label: 'Talk to someone now', goto: 'handoff' },
          { label: "Just send what\'s available", goto: 'options' },
        ],
      },
    ],
    'load-info': [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "You can drop to part-time without affecting your visa or financial aid (assuming you\'re domestic, which your record shows). The change happens through StudentOnLine and only applies from the next census date — so it\'s clean. Want me to walk you through it?",
      },
      { kind: 'end' },
    ],
    options: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: '• La Trobe Counselling — free, confidential.\n• Crisis Line (Lifeline) — 13 11 14, 24/7.\n• Student Wellbeing — drop-in.\n• Or I can connect you to someone here.',
      },
      {
        kind: 'assistant-choices',
        pattern: 'express',
        text: '',
        choices: [
          { label: 'Connect me to someone', goto: 'handoff' },
          { label: "That\'s enough for now", goto: 'fine' },
        ],
      },
    ],
    handoff: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Bringing in a wellbeing advisor now — they\'ll see we\'ve been chatting so you don\'t need to start over. Hang on a moment.",
      },
      {
        kind: 'handoff',
        statusText:
          'Connecting you to a wellbeing support advisor — a real person will be with you shortly.',
        advisorPlaceholder: 'An advisor will join you shortly.',
      },
    ],
    fine: [
      {
        kind: 'assistant',
        pattern: 'check-in',
        text: "Glad to hear. I\'ll keep this light — won\'t bug you again unless something changes. You can come back any time.",
      },
      { kind: 'end' },
    ],
  },
};

const informAndActExtension: Scenario = {
  id: 'inform-and-act-extension',
  pattern: 'inform-and-act',
  lifecycle: 'mid-late-semester',
  title: '"Can I get an extension?"',
  description: 'Surface query → probe purpose → routes to standard vs special consideration',
  persona: 'mark',
  starter: 'Can I get an extension on my assignment?',
  blocks: {
    start: [
      {
        kind: 'student',
        text: 'Can I get an extension on my assignment?',
      },
      {
        kind: 'assistant-choices',
        pattern: 'inform-and-act',
        text: "Yes, in most cases — but the path depends on what\'s going on, so I want to point you to the right one. Which sounds closer?",
        choices: [
          { label: 'I just need a few more days', goto: 'standard' },
          { label: "Something\'s come up — life stuff", goto: 'special' },
          { label: "I\'m not sure which I need", goto: 'compare' },
        ],
      },
    ],
    standard: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "That\'s a standard short extension — usually 1 to 3 days, requested directly from your subject coordinator. No formal evidence needed for short extensions; a quick email explaining the situation is fine.",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "For Assignment 2 in CSE5DEV, your subject coordinator is Dr. Lin Wei. Want me to draft the email for you?",
      },
      { kind: 'end' },
    ],
    special: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Then what you want is Special Consideration — that\'s the formal pathway when something genuinely affects your ability to study. It can give you a longer extension, a deferred exam, or a re-sit if needed.",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "It needs supporting evidence (medical certificate, statutory declaration, etc.) and is decided by the faculty rather than your coordinator. The form is on StudentOnLine — I can also link you to Student Wellbeing if you\'d rather talk through it first.",
      },
      { kind: 'end' },
    ],
    compare: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Quick rule of thumb. Short extension (1–3 days, no big deal): straight to your subject coordinator, brief explanation, usually approved. Special Consideration (something significant): formal form, supporting evidence, decided by faculty — better protection for your academic record if things are really off track.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'inform-and-act',
        text: 'Which fits?',
        choices: [
          { label: 'Short extension', goto: 'standard' },
          { label: 'Special consideration', goto: 'special' },
        ],
      },
    ],
  },
};

const statusCheckResults: Scenario = {
  id: 'status-check-results',
  pattern: 'status-check',
  lifecycle: 'end-outcome',
  title: '"When do I get my results?"',
  description: 'Lookup the results release date and what follows',
  persona: 'mark',
  starter: 'When do I get my results?',
  blocks: {
    start: [
      { kind: 'student', text: 'When do I get my results?' },
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Let me check — Master of IT, Semester 1.",
      },
      { kind: 'system', text: 'Looking up your record…' },
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Results for Semester 1 are released on Tuesday 8 July 2026 — that\'s when they\'ll appear on StudentOnLine. You\'ll also get an email at the address on file.",
      },
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Your two enrolled subjects this semester are CSE5DEV (Software Engineering Practice) and BIO1001 (Anatomy & Physiology). Both will be released together.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'status-check',
        text: "Want me to walk through what happens if anything is unexpected?",
        choices: [
          { label: 'Yes, briefly', goto: 'options' },
          { label: "No, that\'s all I needed", goto: 'done' },
        ],
      },
    ],
    options: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Three things you can ask for if a result isn\'t right: a re-mark (if you think the grade is off), supplementary assessment (if you sat very close to a pass), or special consideration (if circumstances during the semester affected you and you have evidence).",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Each has a deadline — typically 14–21 days from results release. I\'ll be here on the 8th if you want help working out what fits.",
      },
      { kind: 'end' },
    ],
    done: [
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "All good — talk soon.",
      },
      { kind: 'end' },
    ],
  },
};

const expressFailedAnatomy: Scenario = {
  id: 'express-failed-anatomy',
  pattern: 'express',
  lifecycle: 'end-outcome',
  title: '"I just failed Anatomy"',
  description: 'Acknowledge → check on the person → academic options OR handoff',
  persona: 'mark',
  starter: 'I just failed Anatomy',
  blocks: {
    start: [
      { kind: 'student', text: 'I just failed Anatomy' },
      {
        kind: 'assistant',
        pattern: 'express',
        text: "That\'s hard news to land in. Take a moment if you need to.",
      },
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Before I jump into options — can I ask how you\'re doing with this? Both sides matter; I don\'t want to skip the harder one.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'express',
        text: 'How would you describe where you\'re at?',
        choices: [
          { label: "I\'m okay — just frustrated", goto: 'academic' },
          { label: "It\'s hitting me harder than I thought", goto: 'wellbeing' },
          { label: 'I just want to know my options', goto: 'academic' },
        ],
      },
    ],
    academic: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Okay — here\'s what\'s available for BIO1001 specifically. Your final mark was 42, which puts you within range for supplementary assessment (passes are 50, supps usually offered 45–49 — but it\'s worth applying anyway, the cut isn\'t hard).",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Three concrete paths: apply for supplementary assessment (deadline ~14 days from results), apply for special consideration if anything during the semester affected you, or repeat the subject next time it runs. They\'re not mutually exclusive.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'inform-and-act',
        text: 'Want me to start any of these now, or sit with it?',
        choices: [
          { label: 'Walk me through supplementary', goto: 'supp' },
          { label: 'Hold off for tonight', goto: 'hold' },
        ],
      },
    ],
    supp: [
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Supplementary assessment is requested through StudentOnLine — under My Results → Request Supplementary. The form is short. Decisions usually come back within a week.",
      },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Once you submit it, I can help you plan revision time around your work schedule. Just say.",
      },
      { kind: 'end' },
    ],
    hold: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Sensible. Sleep on it. The deadlines aren\'t for another two weeks, so no rush. I\'ll still be here.",
      },
      { kind: 'end' },
    ],
    wellbeing: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Yeah — a fail when you\'re juggling work and family can land harder than the result itself suggests. That\'s a reasonable reaction.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'express',
        text: "Want to talk to someone now, or have me send what\'s available?",
        choices: [
          { label: 'Talk to someone now', goto: 'handoff' },
          { label: "Send what\'s available", goto: 'resources' },
        ],
      },
    ],
    resources: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "• La Trobe Counselling — free, confidential, online or in person.\n• Lifeline — 13 11 14, 24/7.\n• Student Wellbeing — drop-in support.\n• I can connect you to someone here whenever you want.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'express',
        text: 'Anything else?',
        choices: [
          { label: 'Actually, connect me', goto: 'handoff' },
          { label: "I\'m okay for now", goto: 'closeout' },
        ],
      },
    ],
    handoff: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Bringing in a wellbeing advisor — they\'ll see we\'ve been chatting so you don\'t need to start over.",
      },
      {
        kind: 'handoff',
        statusText:
          'Connecting you to a wellbeing support advisor — a real person will be with you shortly.',
        advisorPlaceholder: 'An advisor will join you shortly.',
      },
    ],
    closeout: [
      {
        kind: 'assistant',
        pattern: 'express',
        text: "Anytime. I\'ll be here when you\'re ready to look at the academic side.",
      },
      { kind: 'end' },
    ],
  },
};

// ============================================================
// JESS — regional, first-in-family
// ============================================================

const nudgeCensusDate: Scenario = {
  id: 'nudge-census-date',
  pattern: 'nudge',
  lifecycle: 'early-semester',
  title: 'Census-date nudge',
  description: 'Outbound (email) → review enrolment before census closes',
  persona: 'jess',
  starter: '[Proactive] Census date approaching',
  inbox: {
    channel: 'email',
    sender: 'La Trobe Assistant',
    subject: 'Census date is in 5 days — quick check on your enrolment',
    preview:
      "If you\'re thinking about dropping or swapping a subject, doing it before census means no fees and nothing on your record.",
    body: "Hi Jess,\n\nThis is your La Trobe assistant. Census date for Semester 1 is 31 March 2026 — five days away.\n\nIt\'s the cut-off for changing your enrolment without fees or it appearing on your academic record. After census, dropped subjects still incur fees and are recorded as withdrawn.\n\nIf everything\'s settled — no action needed. If you\'re unsure about a subject, I can talk it through with you in chat.",
    timestamp: 'Today, 8:02am',
    cta: 'Review enrolment',
    reason:
      'Census date 31 March; before it, enrolment changes are free and unrecorded.',
  },
  blocks: {
    start: [
      {
        kind: 'system',
        text: 'Continuing from your message — opened from email, 8:02am.',
      },
      {
        kind: 'assistant',
        pattern: 'nudge',
        text: "Hey Jess — thanks for opening this. No alarm bells, just checking in before census on Tuesday. You\'re enrolled in four Nursing subjects this semester. Anything you\'ve been on the fence about?",
      },
      {
        kind: 'assistant-choices',
        pattern: 'nudge',
        text: 'Where are you at?',
        choices: [
          { label: "All settled — won\'t be changing", goto: 'settled' },
          { label: "I\'ve been thinking about dropping one", goto: 'drop' },
          { label: 'Want to switch to part-time', goto: 'part-time' },
        ],
      },
    ],
    settled: [
      {
        kind: 'assistant',
        pattern: 'nudge',
        text: "Good to hear. Nothing more from me on this — won\'t bug you about census again. Best of luck with the semester.",
      },
      { kind: 'end' },
    ],
    drop: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Quick numbers on what \"before census\" means in practice: you don\'t pay tuition for the dropped subject, no SSAF impact, and nothing appears on your academic transcript. After census, you pay full fees and it shows as a withdrawal.",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "If you tell me which subject you\'re unsure about, I can walk through how dropping would affect your enrolment status (full-time vs part-time) and any course-progress implications.",
      },
      { kind: 'end' },
    ],
    'part-time': [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Switching to part-time before census is clean — no fees on the dropped subjects, no record. Worth checking two things first: any scholarships or Centrelink payments tied to full-time study, and how it shifts your course completion date.",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Both of those I can look up if you\'d like — just say.",
      },
      { kind: 'end' },
    ],
  },
};

const statusCheckTransfer: Scenario = {
  id: 'status-check-transfer',
  pattern: 'status-check',
  lifecycle: 'mid-late-semester',
  title: 'Course transfer status',
  description: 'Look up the student record and report back',
  persona: 'jess',
  starter: 'Did my course transfer go through?',
  blocks: {
    start: [
      { kind: 'student', text: 'Did my course transfer go through?' },
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Let me check on your transfer application.",
      },
      { kind: 'system', text: 'Looking up your record…' },
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Your application to transfer from Bachelor of Nursing into the Bachelor of Nursing / Bachelor of Public Health double-degree was lodged on 24 April 2026 and is currently with the Faculty for review.",
      },
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Decisions on this round are expected by 12 May 2026 — that\'s four days from now. You\'ll get an email when there\'s an outcome, and I\'ll be able to walk you through next steps then.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'status-check',
        text: "Anything else on this?",
        choices: [
          { label: 'What if I want to withdraw the application?', goto: 'withdraw' },
          { label: "No, that\'s all — thanks", goto: 'done' },
        ],
      },
    ],
    withdraw: [
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "You can withdraw the application any time before the decision lands. It\'s a small form — want me to walk you through it now, or hold off until you\'ve had a chance to think about it?",
      },
      { kind: 'end' },
    ],
    done: [
      {
        kind: 'assistant',
        pattern: 'status-check',
        text: "Sounds good — I\'ll be here when the outcome lands.",
      },
      { kind: 'end' },
    ],
  },
};

const checkInSanctionRecovery: Scenario = {
  id: 'check-in-sanction-recovery',
  pattern: 'check-in',
  lifecycle: 'end-outcome',
  title: 'Sanction-recovery check-in',
  description: 'Outbound (email) → connect symptom (blocked enrolment) to cause (unpaid SSAF)',
  persona: 'jess',
  starter: '[Proactive] Re-enrolment hold',
  inbox: {
    channel: 'email',
    sender: 'La Trobe Assistant',
    subject: 'Quick fix on your re-enrolment hold',
    preview:
      'Your re-enrolment is held because SSAF is unpaid. Same fix as last semester — pay or defer to HELP.',
    body: "Hi Jess,\n\nThis is your La Trobe assistant. Your re-enrolment for Semester 2 is currently held because SSAF for Semester 1 hasn\'t been paid yet.\n\nGood news: it\'s the same fix as last semester. You can pay it now, or defer it to HELP if you\'d rather. Either way, the hold lifts within 24 hours.\n\nIf it\'s easier, I can walk you through it in chat.",
    timestamp: 'Yesterday, 5:48pm',
    cta: 'Sort it in chat',
    reason:
      'Re-enrolment hold detected. Most cases are SSAF non-payment — connecting the symptom to the fix.',
  },
  blocks: {
    start: [
      {
        kind: 'system',
        text: 'Continuing from your message — opened from email.',
      },
      {
        kind: 'assistant',
        pattern: 'check-in',
        text: "Hey Jess — thanks for coming back. Quick recap: your re-enrolment is held because SSAF for this semester is unpaid. Last semester you deferred to HELP (worked fine). Same option here, or you can pay it now.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'check-in',
        text: 'How would you like to sort it?',
        choices: [
          { label: 'Defer to HELP again', goto: 'defer' },
          { label: 'Pay it now', goto: 'pay' },
          { label: 'Help me decide', goto: 'compare' },
        ],
      },
    ],
    defer: [
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Easy — same form as last time. Checking eligibility now (just to be sure nothing\'s changed).",
      },
      { kind: 'system', text: 'Checking eligibility…' },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "All clear. Same flow as before.",
      },
      ssafForm,
      { kind: 'system', text: 'Lodging deferral and lifting hold…' },
      {
        kind: 'assistant',
        pattern: 'decide',
        text: "Done. Submission ID 2026-SSAF-D-44912. Re-enrolment hold will lift within 24 hours, and the amount goes to your HELP balance at the next reconciliation. Glad to have closed the loop on this.",
      },
      { kind: 'end' },
    ],
    pay: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Okay — payment goes through StudentOnLine, Finance → Pay Fees. BPAY and card both work. Once the payment lands, the re-enrolment hold lifts within 24 hours.",
      },
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "I\'ll send you a confirmation in chat once your payment shows on the system.",
      },
      { kind: 'end' },
    ],
    compare: [
      {
        kind: 'assistant',
        pattern: 'inform-and-act',
        text: "Quick compare. Pay now: $162.50 today, hold lifts within 24 hours, no debt. Defer to HELP: $162.50 added to your HELP balance, repaid through tax once you\'re earning over the threshold, hold also lifts within 24 hours.",
      },
      {
        kind: 'assistant-choices',
        pattern: 'inform-and-act',
        text: 'Either of those land?',
        choices: [
          { label: "Defer — same as last time", goto: 'defer' },
          { label: "I\'ll pay it now", goto: 'pay' },
        ],
      },
    ],
  },
};

// ============================================================

export const scenarios: Scenario[] = [
  // Aisha
  informAndActSSAF,
  expressNotCoping,
  nudgeSSAFDeadline,
  decideSSAFDefer,
  // Mark
  checkInLMSDropoff,
  informAndActExtension,
  statusCheckResults,
  expressFailedAnatomy,
  // Jess
  nudgeCensusDate,
  statusCheckTransfer,
  checkInSanctionRecovery,
];

export const scenariosById: Record<string, Scenario> = scenarios.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, Scenario>,
);

export const scenariosByPersona = (personaId: string): Scenario[] =>
  scenarios.filter((s) => s.persona === personaId);
