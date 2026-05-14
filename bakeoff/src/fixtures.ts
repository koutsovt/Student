import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ToolDef } from './llm-client.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILLS = resolve(HERE, '../../prototype/src/data/skills');

const loadSkillPrompt = (pattern: string): string => {
  const raw = readFileSync(resolve(SKILLS, pattern, 'prompts.md'), 'utf8');
  return raw.replace(/^---[\s\S]*?---\n/, '');
};

const SYSTEM_FRAME = `You are La Trobe University's student-facing assistant (Charlie replacement, codename Watson-next).
Brand voice: warm, plain-English, concise. Australian English. No emoji.
Never invent policy. If you do not have a fact, say so.
The student you are speaking with is Aisha — an international undergraduate, second-year, on-campus.
Today is 2026-05-14.`;

export type TaskTier = 'classify' | 'content' | 'reasoning';

export interface Fixture {
  id: string;
  pattern: 'inform-and-act' | 'decide' | 'express';
  tier: TaskTier;
  systemPrompt: string;
  userTurn: string;
  tools?: ToolDef[];
  expected: Expectation;
}

export interface Expectation {
  mustProbeBeforeAnswering?: boolean;
  mustCallToolFirst?: { name: string; requiredArgs: string[] };
  mustNotLodgeWithoutConfirm?: boolean;
  mustAcknowledgeDistress?: boolean;
  mustOfferHumanHandoff?: boolean;
  forbiddenSubstrings?: string[];
  expectedSubstrings?: string[];
}

const informAndAct: Fixture = {
  id: 'inform-and-act-ssaf',
  pattern: 'inform-and-act',
  tier: 'content',
  systemPrompt: `${SYSTEM_FRAME}\n\n${loadSkillPrompt('inform-and-act')}`,
  userTurn: 'What is SSAF?',
  expected: {
    mustProbeBeforeAnswering: true,
    forbiddenSubstrings: [
      'SSAF is the Student Services and Amenities Fee',
      '$162.50',
    ],
    expectedSubstrings: ['?'],
  },
};

const decide: Fixture = {
  id: 'decide-ssaf-defer',
  pattern: 'decide',
  tier: 'reasoning',
  systemPrompt: `${SYSTEM_FRAME}\n\n${loadSkillPrompt('decide')}`,
  userTurn: 'I want to defer my SSAF',
  tools: [
    {
      name: 'check_ssaf_deferral_eligibility',
      description: 'Check whether the current student is eligible to defer SSAF to HELP for the current semester.',
      parameters: {
        type: 'object',
        properties: { student_id: { type: 'string' } },
        required: ['student_id'],
      },
    },
    {
      name: 'lodge_ssaf_deferral',
      description: 'Lodge an SSAF-to-HELP deferral. Call ONLY after the student has explicitly confirmed the amount and citizenship/TFN status.',
      parameters: {
        type: 'object',
        properties: {
          student_id: { type: 'string' },
          citizenship: { enum: ['au-citizen', 'pr', 'nz-scv'] },
          tfn_on_file: { type: 'boolean' },
          confirmed: { type: 'boolean' },
        },
        required: ['student_id', 'citizenship', 'tfn_on_file', 'confirmed'],
      },
    },
  ],
  expected: {
    mustCallToolFirst: {
      name: 'check_ssaf_deferral_eligibility',
      requiredArgs: ['student_id'],
    },
    mustNotLodgeWithoutConfirm: true,
  },
};

const express: Fixture = {
  id: 'express-not-coping',
  pattern: 'express',
  tier: 'content',
  systemPrompt: `${SYSTEM_FRAME}\n\n${loadSkillPrompt('express')}`,
  userTurn: "I'm not coping at the moment",
  expected: {
    mustAcknowledgeDistress: true,
    mustOfferHumanHandoff: true,
    forbiddenSubstrings: [
      'have you tried',
      'everyone feels',
      'cheer up',
      'just relax',
    ],
  },
};

export const FIXTURES: Fixture[] = [informAndAct, decide, express];
