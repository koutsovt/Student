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
│       ├── README.md                       Index of the docs set + reading order
│       ├── personalisation-one-pager.pdf   12-page stakeholder briefing
│       ├── personalisation-one-pager.html  Editable briefing source
│       ├── infrastructure.html             Infrastructure — reflects the settled D1–D6 direction
│       ├── decisions-and-rationale.html    Architectural decisions log (incl. D1–D6)
│       ├── duplication-buy-vs-build-review.html  Build-vs-buy vs managed Azure components (D1–D6)
│       ├── managed-foundry-alignment-review.html Merged architecture (pattern tier + managed Foundry)
│       ├── ssaf-use-case.html              SSAF MVP — one enquiry traced through every component
│       ├── metrics-catalogue.html          33 metrics across Watson-parity, SLOs, new-architecture signals
│       └── day-1-dashboard.html            Launch-screen mockup — KPIs, SLO alerts, six pattern tiles
│
└── engagement-playbook/
    └── playbook.html           Reusable methodology for AI assistant engagements
```

---

## Running the prototype

### Prerequisites

- Node.js 18+ and npm
- No API keys are required for the prototype client

```bash
cd prototype
npm install
npm run dev
```

Open the client in a browser:

```text
http://localhost:5173/
```

The prototype runs entirely in-browser with no backend. The Vite dev server only serves the React client; all conversation flows are deterministic scripted state machines with mock data. There are no live LLM calls, no API calls, and no API keys required.

### Server and client steps

This repository does not have a separate backend server for the prototype.

1. Start the client dev server:

   ```bash
   cd prototype
   npm install
   npm run dev
   ```

2. Open the client:

   ```text
   http://localhost:5173/
   ```

3. Build the static client for submission or deployment:

   ```bash
   cd prototype
   npm run build
   ```

4. Preview the production build locally:

   ```bash
   cd prototype
   npm run preview
   ```

### Vice-Chancellor handoff

For the Vice-Chancellor package, the simplest option is to host the built static client and send a link. The prototype has no backend and no live integrations, so the build output in `prototype/dist/` can be served by any static web server.

If the package is sent as source code instead, include this repository plus [VC_HANDOFF.md](VC_HANDOFF.md) and [VC_RUN_GUIDE.html](VC_RUN_GUIDE.html). The recipient should create a local folder named `Student`, then copy the supplied package contents into that folder. Then they, or Codex acting on their behalf, can run:

```bash
codex --dangerously-bypass-approvals-and-sandbox "Run the prototype server"
```

That is the Codex YOLO-mode path and should only be used from the trusted copied handoff folder. The manual equivalent is:

```bash
cd prototype
npm install
npm run dev
```

Then open:

```text
http://localhost:5173/
```

### Optional bakeoff runner

The `bakeoff/` folder is a separate LLM evaluation runner, not the prototype server. It requires provider API keys in `bakeoff/.env`.

```bash
cd bakeoff
npm install
cp .env.example .env
npm run bake
```

---

## Key documents

| Document | Description |
|---|---|
| [`docs/personalisation-one-pager.pdf`](prototype/docs/personalisation-one-pager.pdf) | 12-page briefing for senior leadership |
| [`docs/infrastructure.html`](prototype/docs/infrastructure.html) | Infrastructure — topology, components, MCP tool servers, cost (reflects the settled D1–D6 direction) |
| [`docs/decisions-and-rationale.html`](prototype/docs/decisions-and-rationale.html) | 90+ decisions across architecture, tech stack, security, rejected options — incl. the D1–D6 managed-Foundry decisions |
| [`docs/duplication-buy-vs-build-review.html`](prototype/docs/duplication-buy-vs-build-review.html) | Build-vs-buy against managed Microsoft components; the six decisions (D1–D6) and the residency trilemma |
| [`docs/managed-foundry-alignment-review.html`](prototype/docs/managed-foundry-alignment-review.html) | The merged production architecture — our agent, tools, knowledge and memory built inside the Azure AI Foundry agent platform |
| [`docs/ssaf-use-case.html`](prototype/docs/ssaf-use-case.html) | SSAF as the MVP use case — one topic routed three ways, traced through every component |
| [`docs/metrics-catalogue.html`](prototype/docs/metrics-catalogue.html) | 33 metrics (M1–M33) — Watson-parity, per-pattern SLOs, outcome signals, feedback capture, cohort slices, continuous quality |
| [`docs/day-1-dashboard.html`](prototype/docs/day-1-dashboard.html) | Visual mockup of the launch-day dashboard — 5 header KPIs, SLO alert strip, six pattern tiles, cohort × lifecycle row |
| [`engagement-playbook/playbook.html`](engagement-playbook/playbook.html) | 8-phase methodology for conversational AI engagements |

---

## Architecture highlights

- **Six-pattern conversation model** — intent classified before content delivery; a **Pattern Router** we build classifies the turn, then configures the managed agent
- **Agent platform (D1)** — we build on **Azure AI Foundry as the managed agent platform** (Australia East): the agent, tools, knowledge and memory are built *inside* Foundry as first-class constructs — build-inside, not a separate stack wrapped around a model endpoint
- **Models configurable, not provider-agnostic (D1/D4)** — selected per task via **Azure Model Router** within the in-region Foundry catalogue (GPT-family at launch); no model named in code. `LLMClient` (T15) re-scoped to within-catalogue, not reversed
- **Managed components (D2/D3)** — knowledge retrieval → **Azure AI Search**; prompt-injection defence → **Prompt Shields**; self-harm severity → **Content Safety**
- **MCP tool servers** — three Container Apps services (`ltu-records-mcp`, `ltu-actions-mcp`, `ltu-wellbeing-mcp`) between the Pattern Router and LTU systems
- **SAP PO middleware** — Action API calls route via LTU's existing SAP Process Orchestrator
- **Bounded memory (D5)** — we own USER profile + MEMORY facts + session log (bounded, sanitised, RLS) as the system of record
- **Launch scope** — reactive patterns only; Azure AU East single-region; ~$5,600–12,400/mo + reserved PTU at 30k students. SSAF is the proposed MVP use case

## Tech stack (prototype)

React 18 · Vite · TypeScript (strict) · Tailwind CSS · lucide-react

## Tech stack (production proposal)

Azure AI Foundry (managed agent platform) · Model Router · Azure AI Search · Prompt Shields / Content Safety · Azure Container Apps (orchestration + MCP tool servers) · PostgreSQL Flexible · Redis Premium · SAP PO · Entra ID · GitHub Actions · Bicep

---

## Personas

| Persona | Archetype | Key tension |
|---|---|---|
| **Aisha** | International undergraduate | Fee deadlines + timezone distance |
| **Mark** | Mature online learner | Disengages under work/family pressure |
| **Jess** | Regional first-in-family | Sanction anxiety + low institutional familiarity |

---

*Workshop validation only — mock data throughout, no real LTU systems connected.*
