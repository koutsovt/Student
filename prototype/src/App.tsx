import { useEffect, useMemo, useState } from 'react';
import type { PersonaId, Scenario } from './lib/types';
import { personas, personasById } from './data/personas';
import { scenarios, scenariosById, scenariosByPersona } from './data/scenarios';
import { useConversationEngine } from './lib/conversation-engine';
import { isProactive } from './lib/patterns';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { InboxView } from './components/InboxView';
import { Landing } from './landing/Landing';

type View =
  | { kind: 'idle' }
  | { kind: 'inbox'; scenarioId: string }
  | { kind: 'chat'; scenarioId: string };

type Mode = 'landing' | 'app';

export default function App() {
  const [mode, setMode] = useState<Mode>('landing');
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>('aisha');
  const [explainMode, setExplainMode] = useState(true);
  const [launchOnly, setLaunchOnly] = useState(false);
  const [view, setView] = useState<View>({ kind: 'idle' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activePersona = personasById[activePersonaId];

  const personaScenarios: Scenario[] = useMemo(
    () => scenariosByPersona(activePersonaId),
    [activePersonaId],
  );

  const activeScenario =
    view.kind === 'chat' ? scenariosById[view.scenarioId] : null;

  const engine = useConversationEngine(activeScenario, explainMode);

  // Reset to idle when persona changes
  useEffect(() => {
    setView({ kind: 'idle' });
    engine.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePersonaId]);

  // If launchOnly is enabled while a proactive scenario is active, drop back to idle
  useEffect(() => {
    if (!launchOnly) return;
    if (view.kind === 'idle') return;
    const sc = scenariosById[
      view.kind === 'chat' ? view.scenarioId : view.scenarioId
    ];
    if (sc && isProactive(sc.pattern)) {
      setView({ kind: 'idle' });
      engine.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchOnly]);

  const handleScenarioPick = (scenarioId: string) => {
    const s = scenariosById[scenarioId];
    if (!s) return;
    if (isProactive(s.pattern) && s.inbox) {
      setView({ kind: 'inbox', scenarioId });
    } else {
      setView({ kind: 'chat', scenarioId });
    }
    setSidebarOpen(false);
  };

  const openFromInbox = () => {
    if (view.kind !== 'inbox') return;
    setView({ kind: 'chat', scenarioId: view.scenarioId });
  };

  const backToIdle = () => {
    setView({ kind: 'idle' });
    engine.reset();
  };

  if (mode === 'landing') {
    return <Landing onOpenDemo={() => setMode('app')} />;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        persona={activePersona}
        onMenuClick={() => setSidebarOpen(true)}
        onAbout={() => {
          backToIdle();
          setMode('landing');
        }}
        onRestart={view.kind === 'chat' ? engine.restart : undefined}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="flex min-h-0 flex-1 flex-col">
          {view.kind === 'inbox' ? (
            <InboxView
              scenario={scenariosById[view.scenarioId]!}
              onOpen={openFromInbox}
              onBack={backToIdle}
            />
          ) : (
            <ChatWindow
              persona={activePersona}
              transcript={engine.state.transcript}
              awaiting={engine.state.awaiting}
              explainMode={explainMode}
              onPickChoice={engine.pickChoice}
              onSubmitForm={engine.submitForm}
              onSendInput={engine.sendFreeInput}
            />
          )}
        </main>

        <Sidebar
          personas={personas}
          activePersona={activePersona}
          onPersonaChange={(id) => {
            setActivePersonaId(id);
          }}
          scenarios={personaScenarios}
          activeScenarioId={
            view.kind === 'idle' ? null : view.scenarioId
          }
          onScenarioPick={handleScenarioPick}
          explainMode={explainMode}
          launchOnly={launchOnly}
          onToggleExplain={() => setExplainMode((v) => !v)}
          onToggleLaunch={() => setLaunchOnly((v) => !v)}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <FooterReference scenariosCount={scenarios.length} />
    </div>
  );
}

function FooterReference({ scenariosCount }: { scenariosCount: number }) {
  return (
    <footer className="hidden border-t border-border bg-surface-soft px-6 py-2 text-[11px] text-muted md:block">
      Charlie replacement — pattern UI prototype · {scenariosCount} scripted
      scenarios · all data is mock
    </footer>
  );
}
