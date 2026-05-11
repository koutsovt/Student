import type { Channel } from '../lib/types';
import { scenarios } from './scenarios';

export type OutboundMessage = {
  id: string;
  channel: Channel;
  sender: string;
  subject?: string;
  preview: string;
  body: string;
  timestamp: string;
  cta: string;
  courseContext?: string;
  reason: string;
  scenarioId: string;
};

export const outboundMessages: OutboundMessage[] = scenarios
  .filter((s) => s.inbox)
  .map((s) => ({
    id: `${s.id}-outbound`,
    channel: s.inbox!.channel,
    sender: s.inbox!.sender,
    subject: s.inbox!.subject,
    preview: s.inbox!.preview,
    body: s.inbox!.body,
    timestamp: s.inbox!.timestamp,
    cta: s.inbox!.cta,
    courseContext: s.inbox!.courseContext,
    reason: s.inbox!.reason,
    scenarioId: s.id,
  }));

export const outboundByScenario = (scenarioId: string): OutboundMessage[] =>
  outboundMessages.filter((m) => m.scenarioId === scenarioId);
