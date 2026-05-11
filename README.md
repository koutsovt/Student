# La Trobe Assistant — Workshop Validation Prototype

A React + TypeScript prototype demonstrating a **six-pattern conversational AI model** for La Trobe University's replacement of *Charlie* (IBM Watson Assistant). Built for workshop validation with senior stakeholders — scripted, deterministic, no live LLM or API calls.

---

## What this is

Charlie's central failure is **purpose-blindness**: a question like *"what is the student services fee?"* could mean "explain it to me", "check my balance", or "I want to defer it" — Charlie answers all three identically. This prototype demonstrates a model that classifies intent before responding.

Six conversation patterns handle every topic across the student lifecycle:

| Pattern | Kind | Job |
|---|---|---|
| **Inform-and-Act** | Reactive | Probe purpose before delivering content |
| **Status-Check** | Reactive | Look up *this* student's record and reply with *their* answer |
| **Decide** | Reactive | Walk through a consequential action: eligibility → confirm → lodge |
| **Express** | Reactive | Recognise distress, listen, surface support, hand off in-channel |
| **Nudge** | Proactive | Reach the student before a deadline misses them |
| **Check-in** | Proactive | Open warmly when a behavioural signal flags support needed |

---

## Repository structure

```
├── prototype/                  React + Vite + TypeScript prototype
│   ├── src/
│   │   ├── components/         Chat surface UI components
│   │   ├── data/
│   │   │   ├── scenarios.ts    11 scripted scenarios (3 personas × lifecycle)
│   │   │   ├── personas.ts     Aisha · Mark · Jess persona definitions
│   │   │   ├── student-records.ts  Mock SIS records per persona
│   │   │   └── skills/         Production-quality pattern prompts
│   │   │       ├── inform-and-act/prompts.md
│   │   │       ├── status-check/prompts.md
│   │   │       ├── decide/prompts.md
│   │   │       ├── express/prompts.md
│   │   │       ├── nudge/prompts.md
│   │   │       └── check-in/prompts.md
│   │   ├── landing/            Landing page sections
│   │   └── lib/                Conversation engine, pattern metadata, types
│   └── docs/
│       ├── personalisation-one-pager.pdf   12-page stakeholder briefing
│       ├── personalisation-one-pager.html  Editable briefing source
│       ├── infrastructure.html             Phase 1 infrastructure document
│       └── decisions-and-rationale.html    90+ architectural decisions log
│
└── engagement-playbook/
    └── playbook.html           Reusable methodology for AI assistant engagements
```

---

## Running the prototype

```bash
cd prototype
npm install
npm run dev        # http://localhost:5173
npm run build      # static build → dist/
```

The prototype runs entirely in-browser with no backend. All conversation flows are deterministic scripted state machines — no LLM, no API keys required.

---

## Key documents

| Document | Description |
|---|---|
| [`docs/personalisation-one-pager.pdf`](prototype/docs/personalisation-one-pager.pdf) | 12-page briefing for senior leadership |
| [`docs/infrastructure.html`](prototype/docs/infrastructure.html) | Phase 1 infrastructure — topology, components, MCP tool servers, cost |
| [`docs/decisions-and-rationale.html`](prototype/docs/decisions-and-rationale.html) | 90+ decisions across architecture, tech stack, security, and rejected options |
| [`engagement-playbook/playbook.html`](engagement-playbook/playbook.html) | 8-phase methodology for conversational AI engagements |

---

## Architecture highlights

- **Six-pattern conversation model** — intent classified before content delivery
- **MCP tool servers** — three Container Apps services (`ltu-records-mcp`, `ltu-actions-mcp`, `ltu-wellbeing-mcp`) between the orchestrator and LTU systems
- **SAP PO middleware** — Action API calls route via LTU's existing SAP Process Orchestrator
- **Provider-agnostic LLM** — `LLMClient` abstraction supports Anthropic Claude, OpenAI GPT-4o, Azure OpenAI (AU East), Google Gemini, GLM, Mistral, AWS Bedrock, self-hosted (Ollama/vLLM)
- **Bounded memory** — USER profile + MEMORY facts + session log (Hermes-pattern, bounded by design)
- **Phase 1 scope** — reactive patterns only; Azure AU East single-region; ~$5,400–11,500/mo at 30k students

## Tech stack (prototype)

React 18 · Vite · TypeScript (strict) · Tailwind CSS · lucide-react

## Tech stack (production proposal)

Anthropic Agent SDK (TS) · Azure Container Apps · PostgreSQL Flexible · Redis Premium · Azure AI Search · Docling · LlamaIndex · BGE reranker · Entra ID · GitHub Actions · Bicep

---

## Personas

| Persona | Archetype | Key tension |
|---|---|---|
| **Aisha** | International undergraduate | Fee deadlines + timezone distance |
| **Mark** | Mature online learner | Disengages under work/family pressure |
| **Jess** | Regional first-in-family | Sanction anxiety + low institutional familiarity |

---

*Workshop validation only — mock data throughout, no real LTU systems connected.*
