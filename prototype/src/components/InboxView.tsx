import type { Channel, Scenario } from '../lib/types';
import { OutboundMessage } from './OutboundMessage';
import { ArrowLeft, Inbox } from 'lucide-react';

type Props = {
  scenario: Scenario;
  onOpen: () => void;
  onBack: () => void;
};

const channelChrome: Record<Channel, { title: string; subtitle: string }> = {
  email: { title: 'Inbox', subtitle: 'Mail · La Trobe' },
  lms: { title: 'Moodle announcements', subtitle: 'LMS · Subjects' },
  sms: { title: 'Messages', subtitle: 'SMS' },
};

export function InboxView({ scenario, onOpen, onBack }: Props) {
  const inbox = scenario.inbox;
  if (!inbox) return null;

  const chrome = channelChrome[inbox.channel];

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-border bg-white px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-ltu-navy hover:bg-surface-soft"
          aria-label="Back to chat"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 flex-col">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <Inbox className="h-3.5 w-3.5" /> {chrome.subtitle}
          </span>
          <span className="text-[15px] font-semibold text-ltu-navy">
            {chrome.title}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-surface-soft px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-[13px] text-muted">
            Simulated outbound surface — proactive patterns reach the student
            here, not directly in the chat. Click the message to open the
            conversation already in flight.
          </p>
          <OutboundMessage scenario={scenario} onOpen={onOpen} />
        </div>
      </div>
    </section>
  );
}
