# AGENTS.md

Persistent context for Claude Code working on this prototype. Read this before any session.

## Project

Charlie Replacement Pattern UI Prototype — a workshop validation prototype for La Trobe University's new student-facing assistant. Demonstrates the six-conversation-types model so non-technical stakeholders can validate the approach.

**Not production code.** Mock data only. No backend, no LLM, no real APIs, no real provider integrations.

## Source of truth

The conversation-types model, persona overlays, launch / follow-up split, channel handling, and SSAF worked example all come from these documents:

- `docs/Charlie_Workshop_Briefing_v1_2.docx` — primary source, plain-English description for stakeholders
- `docs/Charlie_Pattern_Architecture_v0.5.docx` — technical companion, including the jcode-pattern appendix

Visual environment to match: `https://www.latrobe.edu.au/students` (the live LTU students portal — where the existing Charlie widget sits today).

If anything in `Charlie_Prototype_Brief_v4.md` contradicts those documents, the documents win. Re-read them when in doubt.

## Tech stack (do not deviate without asking)

- Vite + React 18 + TypeScript
- Tailwind CSS
- lucide-react
- In-memory state only (`useState`, `useReducer`)
- Mock data in `src/data/` as typed TS modules
- No backend, no API calls, no localStorage, no persistence

## Code conventions

- TypeScript strict mode. Shared types in `src/lib/types.ts`.
- Mock data lives only in `src/data/`. Don't scatter scenario content through components.
- Conversation flows are scripted state machines, deterministic. Not LLM-generated.
- Component files are PascalCase (`ChatWindow.tsx`); lib files are kebab-case (`conversation-engine.ts`).
- Tailwind classes inline; no CSS modules, no styled-components.
- No `any`. If something needs to be loose, use `unknown` and narrow it.
- Comments only where necessary. Names and types do most of the documenting.

## Theme tokens

Configure as Tailwind theme extensions or CSS custom properties at the root.

| Token | Hex | Use |
|---|---|---|
| `--ltu-red` | `#C8102E` | Brand accent, header bar, primary buttons |
| `--ltu-navy` | `#1F2A44` | Primary text, headings, student message bubbles |
| `--surface` | `#FFFFFF` | Page background, cards |
| `--surface-soft` | `#F5F7FA` | Assistant bubbles, sidebar, inbox tiles |
| `--border` | `#E5E7EB` | Card borders, dividers |
| `--text-muted` | `#6B7280` | Secondary text, timestamps, system messages |
| `--success` | `#0F7B5C` | Confirmed actions, handoff state |
| `--alert-amber` | `#B45309` | Soft alerts, not danger |

**Red is reserved for brand and confirmation only.** Never use it as a danger / error colour.
**Green is the handoff colour, not red.** Distress escalations need calm, not alarm.
**Mobile-first.** Test ~375px first; desktop is the easier case.
**Assistant identity is neutral.** No person, no emoji face, no anthropomorphised character. The assistant is a tool, not a fake friend.

## Domain vocabulary

- **Pattern** — one of the six reusable conversation types (Inform-and-Act, Status-Check, Decide, Express, Nudge, Check-in). Defined in the briefing.
- **Persona** — one of the three mock students (Aisha, Mark, Jess), each carrying multiple scenarios mapped to lifecycle stages.
- **Scenario** — a scripted conversation flow that demonstrates one pattern, attached to a specific persona and lifecycle moment.
- **Lifecycle stage** — where the student is in the academic year. The matrix uses three buckets: early semester, mid–late semester, end / outcome.
- **Turn** — a single message in a conversation, either student, assistant, or system.
- **Channel** — the surface a message arrives on. Inbound: the chat. Outbound: email, LMS announcement, SMS (SMS reserved for critical only).
- **Inbox** — the simulated outbound surface. Where Nudge and Check-in messages appear before the presenter clicks through.
- **Outbound message** — an assistant-initiated message in the inbox, with three required disclosure elements: sender identification, reason, adjust-preferences affordance.
- **Handoff state** — the held in-channel state Express transitions into when a distress signal is triggered. Status bar, disabled input, advisor-connection cue.
- **Cross-channel continuity** — clicking through from an inbox message lands the user in a chat already in flight, not a generic greeting.
- **Launch** — what's available at go-live (the four reactive patterns).
- **Later** / **Follow-up release** — what's added after launch (the two proactive patterns + persistent state + memory across sessions).
- **SSAF** — Student Services and Amenities Fee. The canonical worked example throughout the prototype.

Avoid project-internal versioning language: no "Phase 1", no "Phase 2", no "v2.5", no "v1.3". The audience doesn't know those terms. Use "at launch" / "later" / "in a follow-up release".

## Scenario matrix

Eleven scenarios across three personas and three lifecycle moments. The recommended demo flow walks the academic year per persona.

| Persona | Early semester | Mid–late semester | End / outcome |
|---|---|---|---|
| **Aisha** *(international)* | "What is SSAF?" *(Inform-and-Act)* | "I'm not coping" *(Express)*; SSAF defer nudge *(Nudge)* | SSAF deferral walkthrough *(Decide)* |
| **Mark** *(mature, online)* | LMS drop-off check-in *(Check-in)* | "Can I get an extension?" *(Inform-and-Act)* | "When do I get my results?" *(Status-Check)*; "I just failed Anatomy" *(Express)* |
| **Jess** *(regional, first-in-family)* | Census-date nudge *(Nudge)* | Course-transfer status *(Status-Check)* | Sanction-recovery *(Check-in)* |

Coverage: Inform-and-Act ×2, Status-Check ×2, Decide ×1, Express ×2, Nudge ×2, Check-in ×2.

| Pattern | Reactive/Proactive | Special UI |
|---|---|---|
| Inform-and-Act | Reactive | — |
| Status-Check | Reactive | — |
| Decide | Reactive | — |
| Express | Reactive | `HandoffState` |
| Nudge | Proactive | `InboxView` (email or SMS) |
| Check-in | Proactive | `InboxView` (LMS or email) |

## Working style

- Always read the docs before proposing changes that affect conversation behaviour.
- Surface the build plan before writing code on the first session.
- Build incrementally — get one pattern fully working before adding the next.
- Build the canonical six scenarios first (one per pattern); layer on the additional five once those work.
- Build the inbox surface before the proactive patterns; proactive patterns depend on it.
- Visit `https://www.latrobe.edu.au/students` during the build to verify the visual idiom against the live portal.
- Test mobile and desktop layouts as you go; the audience may demo from a phone.
- Ask before adding dependencies. The tech stack is opinionated for a reason.

## What this prototype is NOT

- Not production code
- Not a finished product
- Not a Charlie replacement (it's a *demonstration* of the replacement)
- Not a substitute for the architecture / requirements work
- Not exhaustive — eleven scenarios across three personas is the target. More scenarios are iteration two work, not workshop scope.
- Not integrated with real email / SMS / LMS / CXone — all outbound and handoff flows are UI-only mocks
