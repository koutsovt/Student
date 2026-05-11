import type { Persona } from '../lib/types';

export const personas: Persona[] = [
  {
    id: 'aisha',
    name: 'Aisha',
    shortGreeting: 'Hi Aisha',
    overlay: 'international',
    overlayLabel: 'International undergraduate',
    blurb:
      'First semester, English as a second language. SSAF unpaid — eligible to defer to HELP, deadline approaching.',
    primaryScenario: 'inform-and-act-ssaf',
  },
  {
    id: 'mark',
    name: 'Mark',
    shortGreeting: 'Hi Mark',
    overlay: 'mature-online',
    overlayLabel: 'Mature-age, fully online',
    blurb:
      'Working full-time, juggling family. LMS activity dropped off mid-semester. Mid-semester pressures into results, including a fail in Anatomy.',
    primaryScenario: 'check-in-lms-dropoff',
  },
  {
    id: 'jess',
    name: 'Jess',
    shortGreeting: 'Hi Jess',
    overlay: 'regional-first-in-family',
    overlayLabel: 'Regional, first-in-family',
    blurb:
      'Bendigo campus. SSAF deferred last semester; current SSAF unpaid and a re-enrolment block has landed. Course transfer pending.',
    primaryScenario: 'nudge-census-date',
  },
];

export const personasById: Record<string, Persona> = personas.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, Persona>,
);
