import { Fragment, useEffect, useRef } from 'react';
import type {
  Awaiting,
  Pattern,
  Persona,
  TranscriptEntry,
} from '../lib/types';
import { MessageBubble } from './MessageBubble';
import { ChoiceChips } from './ChoiceChips';
import { InlineForm } from './InlineForm';
import { HandoffState } from './HandoffState';
import { ChatComposer } from './ChatComposer';
import { PatternDivider } from './PatternDivider';

type Props = {
  persona: Persona;
  transcript: TranscriptEntry[];
  awaiting: Awaiting;
  explainMode: boolean;
  onPickChoice: (label: string, goto: string) => void;
  onSubmitForm: (summary: string) => void;
  onSendInput: (text: string) => void;
};

export function ChatWindow({
  persona,
  transcript,
  awaiting,
  explainMode,
  onPickChoice,
  onSubmitForm,
  onSendInput,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [transcript, awaiting]);

  const composerState = composerStateFor(awaiting);

  let lastAssistantPattern: Pattern | null = null;

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-white">
      {awaiting.kind === 'handoff' && (
        <HandoffState statusText={awaiting.statusText} />
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 sm:px-6"
        aria-live="polite"
      >
        {transcript.length === 0 && <Greeting persona={persona} />}
        <div className="mx-auto flex max-w-3xl flex-col gap-3.5">
          {transcript.map((entry) => {
            const isAssistant = entry.speaker === 'assistant';
            const isTyping = isAssistant && 'typing' in entry && entry.typing === true;
            const showDivider =
              explainMode &&
              isAssistant &&
              !isTyping &&
              lastAssistantPattern !== null &&
              entry.pattern !== lastAssistantPattern;

            if (isAssistant && !isTyping) {
              lastAssistantPattern = entry.pattern;
            }

            return (
              <Fragment key={entry.id}>
                {showDivider && entry.speaker === 'assistant' && (
                  <PatternDivider to={entry.pattern} />
                )}
                <MessageBubble entry={entry} explainMode={explainMode} />
              </Fragment>
            );
          })}

          {awaiting.kind === 'choices' && (
            <ChoiceChips
              choices={awaiting.choices}
              pattern={awaiting.pattern}
              explainMode={explainMode}
              onPick={onPickChoice}
            />
          )}

          {awaiting.kind === 'form' && (
            <InlineForm
              pattern={awaiting.pattern}
              title={awaiting.title}
              intro={awaiting.intro}
              fields={awaiting.fields}
              submitLabel={awaiting.submitLabel}
              explainMode={explainMode}
              onSubmit={onSubmitForm}
            />
          )}
        </div>
      </div>

      <ChatComposer
        disabled={composerState.disabled}
        placeholder={composerState.placeholder}
        onSend={onSendInput}
      />
    </section>
  );
}

function composerStateFor(a: Awaiting): { disabled: boolean; placeholder: string } {
  switch (a.kind) {
    case 'handoff':
      return { disabled: true, placeholder: a.advisorPlaceholder };
    case 'student-input':
      return { disabled: false, placeholder: a.placeholder };
    case 'choices':
      return {
        disabled: false,
        placeholder: 'Tap a chip above, or type your own reply',
      };
    case 'form':
      return {
        disabled: true,
        placeholder: 'Complete the form above to continue',
      };
    case 'typing':
      return { disabled: true, placeholder: 'Assistant is replying…' };
    case 'idle':
      return { disabled: true, placeholder: '…' };
    case 'free-input':
    case 'end':
    default:
      return {
        disabled: false,
        placeholder: 'Type a message',
      };
  }
}

function Greeting({ persona }: { persona: Persona }) {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-sm font-bold tracking-wider text-ltu-red">
        LT
      </div>
      <h2 className="text-lg font-semibold text-ltu-navy">
        {persona.shortGreeting} — I'm your La Trobe assistant.
      </h2>
      <p className="mt-2 text-sm text-muted">
        Pick a scenario from the panel to see one of the six conversation
        patterns in action, or open an inbox message to start from a proactive
        nudge or check-in.
      </p>
    </div>
  );
}
