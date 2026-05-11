import { useCallback, useEffect, useReducer, useRef } from 'react';
import type {
  Awaiting,
  EngineState,
  Pattern,
  Scenario,
  Step,
  TranscriptEntry,
} from './types';

const TYPING_DELAY_MS = 650;
const SYSTEM_DELAY_MS = 350;

type Action =
  | { type: 'reset'; explainMode: boolean }
  | { type: 'load-scenario'; scenarioId: string; explainMode: boolean }
  | { type: 'append'; entry: TranscriptEntry }
  | { type: 'remove-typing' }
  | { type: 'set-awaiting'; awaiting: Awaiting }
  | { type: 'advance'; block?: string }
  | { type: 'goto-block'; block: string }
  | { type: 'set-explain'; on: boolean };

const emptyState: EngineState = {
  scenarioId: null,
  block: 'start',
  index: 0,
  transcript: [],
  awaiting: { kind: 'idle' },
  explainMode: true,
};

function reducer(state: EngineState, action: Action): EngineState {
  switch (action.type) {
    case 'reset':
      return { ...emptyState, explainMode: action.explainMode };
    case 'load-scenario':
      return {
        scenarioId: action.scenarioId,
        block: 'start',
        index: 0,
        transcript: [],
        awaiting: { kind: 'idle' },
        explainMode: action.explainMode,
      };
    case 'append':
      return {
        ...state,
        transcript: [
          ...state.transcript.filter(
            (e) => !('typing' in e && e.typing === true),
          ),
          action.entry,
        ],
      };
    case 'remove-typing':
      return {
        ...state,
        transcript: state.transcript.filter(
          (e) => !('typing' in e && e.typing === true),
        ),
      };
    case 'set-awaiting':
      return { ...state, awaiting: action.awaiting };
    case 'advance':
      return {
        ...state,
        block: action.block ?? state.block,
        index: action.block ? 0 : state.index + 1,
      };
    case 'goto-block':
      return { ...state, block: action.block, index: 0 };
    case 'set-explain':
      return { ...state, explainMode: action.on };
    default:
      return state;
  }
}

let idCounter = 0;
const nextId = () => `m-${Date.now()}-${idCounter++}`;

export function useConversationEngine(scenario: Scenario | null, explainMode: boolean) {
  const [state, dispatch] = useReducer(reducer, {
    ...emptyState,
    explainMode,
  });
  const timersRef = useRef<number[]>([]);
  const cancelledRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  // Sync explainMode from prop
  useEffect(() => {
    dispatch({ type: 'set-explain', on: explainMode });
  }, [explainMode]);

  // Reset and start scenario when it changes
  useEffect(() => {
    cancelledRef.current = true;
    clearTimers();
    cancelledRef.current = false;

    if (!scenario) {
      dispatch({ type: 'reset', explainMode });
      return;
    }

    dispatch({
      type: 'load-scenario',
      scenarioId: scenario.id,
      explainMode,
    });
    runStep(scenario, 'start', 0);
    return () => {
      cancelledRef.current = true;
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      if (!cancelledRef.current) fn();
    }, delay);
    timersRef.current.push(id);
  };

  const runStep = (s: Scenario, blockName: string, idx: number) => {
    if (cancelledRef.current) return;
    const block = s.blocks[blockName];
    if (!block || idx >= block.length) {
      dispatch({ type: 'set-awaiting', awaiting: { kind: 'end' } });
      return;
    }
    const step = block[idx];
    processStep(s, blockName, idx, step);
  };

  const processStep = (
    s: Scenario,
    blockName: string,
    idx: number,
    step: Step,
  ) => {
    switch (step.kind) {
      case 'student': {
        dispatch({
          type: 'append',
          entry: { id: nextId(), speaker: 'student', text: step.text },
        });
        dispatch({ type: 'set-awaiting', awaiting: { kind: 'idle' } });
        schedule(() => runStep(s, blockName, idx + 1), 220);
        return;
      }
      case 'assistant': {
        dispatch({
          type: 'append',
          entry: {
            id: nextId(),
            speaker: 'assistant',
            text: '',
            pattern: step.pattern,
            typing: true,
          },
        });
        dispatch({ type: 'set-awaiting', awaiting: { kind: 'typing' } });
        schedule(() => {
          dispatch({ type: 'remove-typing' });
          dispatch({
            type: 'append',
            entry: {
              id: nextId(),
              speaker: 'assistant',
              text: step.text,
              pattern: step.pattern,
            },
          });
          schedule(() => runStep(s, blockName, idx + 1), 200);
        }, TYPING_DELAY_MS);
        return;
      }
      case 'assistant-choices': {
        if (step.text) {
          dispatch({
            type: 'append',
            entry: {
              id: nextId(),
              speaker: 'assistant',
              text: '',
              pattern: step.pattern,
              typing: true,
            },
          });
          dispatch({ type: 'set-awaiting', awaiting: { kind: 'typing' } });
          schedule(() => {
            dispatch({ type: 'remove-typing' });
            dispatch({
              type: 'append',
              entry: {
                id: nextId(),
                speaker: 'assistant',
                text: step.text,
                pattern: step.pattern,
              },
            });
            dispatch({
              type: 'set-awaiting',
              awaiting: {
                kind: 'choices',
                choices: step.choices,
                pattern: step.pattern,
              },
            });
          }, TYPING_DELAY_MS);
        } else {
          dispatch({
            type: 'set-awaiting',
            awaiting: {
              kind: 'choices',
              choices: step.choices,
              pattern: step.pattern,
            },
          });
        }
        return;
      }
      case 'student-input': {
        dispatch({
          type: 'set-awaiting',
          awaiting: {
            kind: 'student-input',
            pattern: step.pattern,
            placeholder: step.placeholder,
          },
        });
        return;
      }
      case 'system': {
        schedule(() => {
          dispatch({
            type: 'append',
            entry: { id: nextId(), speaker: 'system', text: step.text },
          });
          schedule(() => runStep(s, blockName, idx + 1), 250);
        }, SYSTEM_DELAY_MS);
        return;
      }
      case 'form': {
        dispatch({
          type: 'set-awaiting',
          awaiting: {
            kind: 'form',
            pattern: step.pattern,
            title: step.title,
            intro: step.intro,
            fields: step.fields,
            submitLabel: step.submitLabel,
          },
        });
        return;
      }
      case 'handoff': {
        dispatch({
          type: 'set-awaiting',
          awaiting: {
            kind: 'handoff',
            statusText: step.statusText,
            advisorPlaceholder: step.advisorPlaceholder,
          },
        });
        return;
      }
      case 'end': {
        dispatch({
          type: 'set-awaiting',
          awaiting: { kind: 'free-input' },
        });
        return;
      }
    }
  };

  const pickChoice = (label: string, goto: string) => {
    if (!scenario) return;
    dispatch({
      type: 'append',
      entry: { id: nextId(), speaker: 'student', text: label },
    });
    dispatch({ type: 'set-awaiting', awaiting: { kind: 'idle' } });
    schedule(() => runStep(scenario, goto, 0), 280);
  };

  const submitForm = (summary: string) => {
    if (!scenario) return;
    dispatch({
      type: 'append',
      entry: { id: nextId(), speaker: 'student', text: summary },
    });
    dispatch({ type: 'set-awaiting', awaiting: { kind: 'idle' } });
    schedule(() => runStep(scenario, state.block, state.index + 1), 280);
  };

  const findMostRecentChoicesStep = (
    s: Scenario,
    blockName: string,
    upToIdx: number,
  ): {
    text: string;
    pattern: Pattern;
    choices: { label: string; goto: string }[];
  } | null => {
    const block = s.blocks[blockName];
    if (!block) return null;
    for (let i = Math.min(upToIdx, block.length - 1); i >= 0; i--) {
      const step = block[i];
      if (step.kind === 'assistant-choices') {
        return {
          text: step.text,
          pattern: step.pattern,
          choices: step.choices,
        };
      }
    }
    return null;
  };

  const sendFreeInput = (text: string) => {
    if (!scenario) return;
    dispatch({
      type: 'append',
      entry: { id: nextId(), speaker: 'student', text },
    });

    const recent = findMostRecentChoicesStep(scenario, state.block, state.index);

    dispatch({
      type: 'append',
      entry: {
        id: nextId(),
        speaker: 'assistant',
        text: '',
        pattern: recent?.pattern ?? 'inform-and-act',
        typing: true,
      },
    });

    schedule(() => {
      dispatch({ type: 'remove-typing' });

      if (recent) {
        dispatch({
          type: 'append',
          entry: {
            id: nextId(),
            speaker: 'assistant',
            text: "I might have missed that — to keep things on track, can I check what you meant?",
            pattern: recent.pattern,
          },
        });
        dispatch({
          type: 'set-awaiting',
          awaiting: {
            kind: 'choices',
            choices: recent.choices,
            pattern: recent.pattern,
          },
        });
      } else {
        dispatch({
          type: 'append',
          entry: {
            id: nextId(),
            speaker: 'assistant',
            text: "I'm a scripted prototype — pick a scenario from the right-hand panel and I'll walk you through the pattern.",
            pattern: 'inform-and-act',
          },
        });
        dispatch({ type: 'set-awaiting', awaiting: { kind: 'free-input' } });
      }
    }, TYPING_DELAY_MS);
  };

  const reset = useCallback(() => {
    cancelledRef.current = true;
    clearTimers();
    cancelledRef.current = false;
    dispatch({ type: 'reset', explainMode });
  }, [clearTimers, explainMode]);

  const restart = useCallback(() => {
    if (!scenario) return;
    cancelledRef.current = true;
    clearTimers();
    cancelledRef.current = false;
    dispatch({
      type: 'load-scenario',
      scenarioId: scenario.id,
      explainMode,
    });
    schedule(() => runStep(scenario, 'start', 0), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, clearTimers, explainMode]);

  return {
    state,
    pickChoice,
    submitForm,
    sendFreeInput,
    reset,
    restart,
  };
}
