import type { PersonaId, StudentRecord } from '../lib/types';

export const studentRecords: Record<PersonaId, StudentRecord> = {
  aisha: {
    personaId: 'aisha',
    studentId: '20214467',
    course: 'Bachelor of Business',
    campus: 'Melbourne (Bundoora)',
    enrolment: 'Full-time, Semester 1',
    censusDate: '31 March 2026',
    ssaf: {
      status: 'unpaid',
      amount: 162.5,
      dueDate: '14 May 2026',
      deferralEligible: true,
      deferralDeadline: '14 May 2026',
    },
    lmsActivity: {
      lastLoginDays: 1,
      weeklyAverage: 6,
    },
  },
  mark: {
    personaId: 'mark',
    studentId: '19981022',
    course: 'Master of Information Technology',
    campus: 'Online',
    enrolment: 'Part-time, Semester 1',
    censusDate: '31 March 2026',
    resultsReleaseDate: '8 July 2026',
    ssaf: {
      status: 'paid',
      amount: 162.5,
      deferralEligible: false,
    },
    subjects: [
      {
        code: 'CSE5DEV',
        name: 'Software Engineering Practice',
        assessment: { name: 'Assignment 2', due: '6 June 2026' },
        examDate: '24 June 2026',
      },
      {
        code: 'BIO1001',
        name: 'Anatomy and Physiology',
        examDate: '21 June 2026',
        result: { grade: 'N', mark: 42, status: 'fail' },
      },
    ],
    lmsActivity: {
      lastLoginDays: 14,
      weeklyAverage: 0.5,
      notes:
        'No Moodle activity in the past two weeks — was averaging 5 sessions/week.',
    },
  },
  jess: {
    personaId: 'jess',
    studentId: '20223301',
    course: 'Bachelor of Nursing',
    campus: 'Bendigo',
    enrolment: 'Full-time, Semester 1',
    censusDate: '31 March 2026',
    ssaf: {
      status: 'unpaid',
      amount: 162.5,
      dueDate: '14 May 2026',
      deferralEligible: true,
      deferralDeadline: '14 May 2026',
      sanctionTriggered: true,
      deferredLastSemester: true,
    },
    courseTransfer: {
      status: 'pending',
      submittedDate: '24 April 2026',
      fromCourse: 'Bachelor of Nursing',
      toCourse: 'Bachelor of Nursing / Bachelor of Public Health',
      expectedDecision: '12 May 2026',
    },
    lmsActivity: {
      lastLoginDays: 0,
      weeklyAverage: 8,
    },
  },
};
