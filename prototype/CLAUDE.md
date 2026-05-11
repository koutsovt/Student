# Claude Code instructions for this project

> Workshop validation prototype for La Trobe University's new student-facing assistant — replacing Charlie. Read this when starting a session; it orients you to where everything lives and the conventions in play.

## What this is

A React + Vite + TypeScript prototype that demonstrates a **six-pattern conversation model** (Inform-and-Act · Status-Check · Decide · Express · Nudge · Check-in) across an **academic-year matrix** of 11 scripted scenarios. The system being replaced — *Charlie* — is LTU's IBM Watson Assistant deployment that sits on ASK La Trobe and matches student questions to FAQ articles. Workshop validation only — no LLM, no APIs, no real provider integrations. Mock data throughout.

The companion brief is `AGENTS.md` alongside this file. The 9–11-page briefing for senior leadership lives in `docs/personalisation-one-pager.pdf`. The decision log is `docs/decisions-and-rationale.html`.

## Where things live

| What you'll need | Path |
|---|---|
| Brief (workshop briefing v1.2 source) | `docs/Charlie_Workshop_Briefing_v1_2.docx` |
| Architecture (pattern architecture v0.5 source) | `docs/Charlie_Pattern_Architecture_v0.5.docx` |
| Project conventions | `AGENTS.md` |
| Prototype brief (v4) | `Charlie_Prototype_Brief_v4.md` |
| Decisions log (HTML, 63 decisions across 10 sections) | `docs/decisions-and-rationale.html` |
| Stakeholder briefing (PDF + editable HTML, 11 pages) | `docs/personalisation-one-pager.{pdf,html}` |
| **Production prompts per pattern** | `src/data/skills/<pattern>/prompts.md` |
| 11 scripted scenarios | `src/data/scenarios.ts` |
| 3 personas (Aisha · Mark · Jess) | `src/data/personas.ts` |
| Mock SIS records per persona | `src/data/student-records.ts` |
| Conversation engine (scripted state machine) | `src/lib/conversation-engine.ts` |
| Pattern metadata + colours + proposing-mode labels | `src/lib/patterns.ts` |
| Shared TS types | `src/lib/types.ts` |
| Landing page sections | `src/landing/sections/*` |
| Chat surface components | `src/components/*` |

## Conventions

- **TypeScript strict mode.** No `any`. Use `unknown` and narrow if needed.
- **Component files** are PascalCase (`ChatWindow.tsx`); **lib files** are kebab-case (`conversation-engine.ts`).
- **Tailwind classes inline**; no CSS modules. LTU theme tokens in `tailwind.config.js`: `ltu.red` (`#C8102E`), `ltu.navy` (`#1F2A44`), `success` (`#0F7B5C`), `amber.alert` (`#B45309`).
- **Red is reserved for brand and confirmation only** — never for danger/error per the brief.
- **Mock data lives only in `src/data/`**. Don't scatter scenario content through components.
- **Conversation flows are scripted state machines**, deterministic. Not LLM-generated. The prototype's job is workshop validation, not production behaviour.
- **Mobile-first.** Test ~375px first; desktop is the easier case.
- **Assistant identity is neutral.** No person, no emoji face, no anthropomorphised character.

## Build + run

```bash
cd prototype
npm install
npm run dev      # http://localhost:5173/
npm run build    # static dist/ for deployment
```

## The skills folder (production prompts)

`src/data/skills/` contains one folder per pattern with `prompts.md` — the production-quality system prompts that the future LTU build will run on. Format: Anthropic Skills convention (YAML frontmatter + body). These are *future production data*, not currently wired into the prototype runtime.

Layer cake (per production turn):

1. **System prompt** (always-in, ~200 tokens, cached) — brand voice, safety, identity, distress override
2. **Classifier prompt** — typed JSON `{pattern, topic, purpose, risk}` — small fast model
3. **Active pattern prompt** — the relevant `prompts.md` body — larger model
4. **Tool definitions** — only Decide loads Action APIs
5. **Retrieved context** — USER + MEMORY + past snippets

Model provider is **swappable via the `LLMClient` abstraction** (T15) — Anthropic is the default but the orchestrator works against any compatible provider (OpenAI, Azure OpenAI in Australia, Bedrock, Google, local). Per-task assignment is config, not code.

## Anchors when working in the codebase

- **Pattern model** — six patterns in `src/lib/patterns.ts`; metadata, accent colours, proposing-mode labels
- **Persona switching** — `App.tsx` orchestrates view state; switching persona resets conversation
- **Scenarios** — each is a typed `Scenario` in `src/data/scenarios.ts` with `blocks` (named conversation branches) and `lifecycle` (early / mid–late / end)
- **Express handoff** — `HandoffState` component; locks composer, shows green held-state cue
- **Inbox surface** — `InboxView` + `OutboundMessage`; proactive scenarios route through here

## Recently shipped

- v4 scenario matrix (11 scenarios, 3 personas × 3 lifecycle stages)
- Landing page (8 sections) with LTU branding
- Memory layer added to Architecture diagram
- 11-page briefing PDF for senior stakeholders
- 63-decision rationale log (HTML, 10 sections)
- Six pattern prompt files in `src/data/skills/`

## What's deliberately out of scope (workshop validation only)

- Real LLM calls
- Real persistent memory beyond a session *(user-authorised brief override for prototype)*
- Real LMS / SMS / Email integrations
- Real wellbeing advisor escalation via LTU's contact-centre platform
- Authentication / SSO
