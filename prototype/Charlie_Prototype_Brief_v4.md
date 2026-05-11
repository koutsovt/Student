# Charlie Replacement — Pattern UI Prototype

> **Read this entire document, then read both `docs/` files, then propose a build plan before writing any code.**

*v4 — adds the academic-year scenario matrix; expands from 6 canonical scenarios to 11 across the lifecycle, with each persona carrying multiple scenarios.*

## What we're building

An interactive web prototype of the new student-facing assistant we're designing to replace Charlie, La Trobe University's current chatbot. The prototype's job is **workshop validation, not production**. Stakeholders (Student Experience specialists, leadership) need to see the conversation-types model behave on screen so they can validate and align on the approach.

## Reference material

Read both before designing anything:

- `docs/Charlie_Workshop_Briefing_v1_2.docx` — plain-English briefing for the workshop audience. **The primary read.** Covers the problem, the six conversation types, a worked SSAF example, the launch / follow-up release split, and the validation questions.
- `docs/Charlie_Pattern_Architecture_v0.5.docx` — technical companion. Covers the same patterns with architectural depth — useful for understanding the orchestrator's classification step, multi-tenancy considerations, and the per-student state model.

The conversation patterns, persona overlays, launch-vs-later split, and SSAF worked example all come from those documents. **The prototype must align with how those documents describe the assistant** — if anything in this brief contradicts them, the documents win.

## Goal

A web-based prototype that:

- Looks credible as a student-facing chat interface (LTU-styled)
- Demonstrates each of the six conversation patterns across an academic year, not as disconnected vignettes — each persona carries multiple scenarios mapped to lifecycle stages
- Demonstrates outbound channel handling for proactive patterns — a simulated inbox (email, LMS announcement, SMS) with click-through into a chat already in flight
- Demonstrates in-channel handoff for distress — a held state with a wellbeing-advisor connection cue, not a phone-number redirect
- Has a **presenter mode** that overlays "this is the [pattern name] pattern at work" annotations on each assistant turn
- Lets the presenter switch between three student personas (mapped to the journey overlays in the briefing)
- Has a **Launch / Later** toggle that controls whether proactive scenarios are available
- Uses mock data only — **no backend, no real LLM calls, no APIs, no real provider integrations**

## Tech stack (opinionated — use these)

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** for styling
- **lucide-react** for icons
- All state in-memory via `useState` / `useReducer`. No `localStorage`, no persistence.
- Mock data in `src/data/` as typed TypeScript modules
- No backend, no API calls, no external services
- Static site build (`npm run build` → `dist/`)

## Project structure (target)

```
prototype/
├── docs/
│   ├── Charlie_Workshop_Briefing_v1_2.docx
│   └── Charlie_Pattern_Architecture_v0.5.docx
├── AGENTS.md
├── src/
│   ├── data/
│   │   ├── personas.ts          # student personas + their mock records
│   │   ├── scenarios.ts         # 11 scripted conversation flows mapped to persona × lifecycle
│   │   ├── student-records.ts   # mock SIS data per persona
│   │   └── outbound-messages.ts # mock email / LMS / SMS templates per proactive scenario
│   ├── components/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── PersonaSwitcher.tsx
│   │   ├── ScenarioPicker.tsx
│   │   ├── PatternBadge.tsx     # rendered when Explain mode is on
│   │   ├── ModeToggles.tsx      # Explain mode + Launch/Later toggles
│   │   ├── InboxView.tsx        # simulated inbox showing email / LMS / SMS
│   │   ├── OutboundMessage.tsx  # single outbound message preview with disclosure
│   │   └── HandoffState.tsx     # held state for Express in-channel escalation
│   ├── lib/
│   │   ├── conversation-engine.ts # state machine that runs a scripted scenario
│   │   └── types.ts                # shared types (Pattern, Scenario, Turn, Persona, Channel)
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## The six conversation patterns

Each pattern needs at least one scripted scenario the presenter can trigger. SSAF is the canonical worked example — use it where it fits. Full pattern descriptions are in the briefing; this is the operational summary for the prototype:

| Pattern | Trigger | Behaviour | Suggested scenario |
|---|---|---|---|
| **Inform-and-Act** | Student asks | Assistant probes purpose before answering | Student types "What is SSAF?" → assistant offers four purpose options → routes to the right answer |
| **Status-Check** | Student asks | Looks up student record, replies with their answer | "Did my course transfer go through?" → mock record lookup → reply |
| **Decide** | Student wants to take action | Multi-turn flow: eligibility → confirm → lodge | "I want to defer my SSAF" → eligibility check → guided form fill → submission confirmation |
| **Express** | Student discloses distress | Listens, surfaces support, escalates **in-channel** to a held wellbeing-advisor state | "I'm not coping" → empathetic response + support options + transition into HandoffState |
| **Nudge** *(proactive)* | System-initiated | Outbound message in inbox → click-through into chat already in flight | Email / SMS: "You can defer your SSAF — deadline in 6 days. [Open in chat]" → leads into Decide |
| **Check-in** *(proactive)* | System-initiated | Outbound message in inbox → click-through into a gentle at-risk conversation | LMS announcement: "We've noticed you haven't logged into Moodle for two weeks. Is everything okay?" |

## Personas (mock students)

Three personas, each carrying multiple scenarios mapped to lifecycle stages. Drawn from the journey overlays in the briefing.

### Aisha — international undergraduate

First semester, English-as-second-language. SSAF unpaid, eligible to defer to HELP, deadline approaching. Recent LMS activity normal. Carries the SSAF arc end-to-end (information → nudge → decision) plus a wellbeing scenario.

Mock record needs: enrolment status, SSAF amount and status, deferral eligibility, deferral deadline.

### Mark — mature-age, fully online

Working full-time, juggling family. SSAF paid. LMS activity dropped off two weeks ago. Approaching end of semester with assignments and exams. Carries scenarios that span mid-semester study pressures through to results.

Mock record needs: LMS engagement history (recent drop-off), enrolled subjects, upcoming assessment dates, exam schedule, results release date, mock result for one subject (a fail in Anatomy).

### Jess — regional, first-in-family

On Bendigo campus. SSAF deferred successfully last semester, but currently has an unpaid SSAF for the current semester triggering a re-enrolment block. Pending course-transfer enquiry. Carries scenarios across the early-semester nudge through end-of-semester sanction-recovery.

Mock record needs: campus, course-transfer enquiry status, current SSAF status (unpaid, sanction triggered), census date.

## Academic-year scenario matrix

Eleven scenarios organised across three personas and three lifecycle moments. This is the recommended demo flow — the presenter can walk an audience through an academic year per persona, rather than jumping between disconnected vignettes.

| Persona | Early semester | Mid–late semester | End / outcome |
|---|---|---|---|
| **Aisha** *(international)* | "What is SSAF?" *(Inform-and-Act)* | "I'm not coping" *(Express → handoff)*; SSAF defer nudge *(Nudge)* | SSAF deferral walkthrough *(Decide)* |
| **Mark** *(mature, online)* | LMS drop-off check-in *(Check-in)* | "Can I get an extension?" *(Inform-and-Act)* | "When do I get my results?" *(Status-Check)*; "I just failed Anatomy" *(Express)* |
| **Jess** *(regional, first-in-family)* | Census-date nudge *(Nudge)* | Course-transfer status *(Status-Check)* | Sanction-recovery *(Check-in)* |

**Coverage summary**: Inform-and-Act ×2, Status-Check ×2, Decide ×1, Express ×2, Nudge ×2, Check-in ×2 — eleven scenarios. The Decide pattern only appears once because the SSAF deferral walkthrough is the highest-value worked example; multiple Decide flows across topics is iteration two work, not workshop scope.

**Selection rationale**: each scenario adds a different axis of variation — different persona, different lifecycle stage, different topic, or a different shape of the same pattern. No two scenarios demonstrate the same combination. Welcome-week / orientation scenarios are deliberately deferred — they're largely persona-greeting variants of Inform-and-Act and don't add new pattern shape.

## UI requirements

- Single-page chat interface. **Mobile-first responsive** (works on phone, tablet, desktop).
- **Header**: LTU-styled — red accent bar, university name, persona greeting ("Hi Aisha")
- **Main pane**: scrollable chat history with message bubbles. Visually distinguish student / assistant / system messages.
- **Right sidebar** (collapsible on mobile):
  - **Persona switcher** — dropdown of three personas. Switching resets the conversation.
  - **Scenario picker** — buttons for pre-built starter inputs (one per pattern). Greyed out if not available for the active persona. Proactive scenarios route through the inbox surface, not directly into chat.
  - **Explain mode toggle** — when on, every assistant message renders a small `PatternBadge` showing which pattern is active.
  - **Launch / Later toggle** — when "Launch only", the proactive scenario buttons (Nudge, Check-in) are hidden.

## Theme & visual design

The prototype must feel credible to a 2026 La Trobe student. The existing Charlie widget lives at `https://www.latrobe.edu.au/students` — visit it during the build to ground colour, typography, and tone against the live environment. The new assistant should look like it could live alongside that portal, refreshed for a 2026 audience.

### Tone of design

Modern, calm, friendly. **Not corporate. Not gamified. Not infantilising.** The audience is adults who happen to be students — some international, some mature-age, some carrying real distress when they reach the assistant. Visual language must work across all of those situations without feeling clinical or jarring. Generous whitespace. Subtle borders. Soft shadows. No heavy chrome.

### Reference visual environment

The LTU students portal at `https://www.latrobe.edu.au/students`. From it, bring through: brand red as the signature accent; sober navy for primary text and headings; sans-serif typography; restrained use of colour with photography and content doing most of the visual work. The chat surface itself should feel slightly more app-like than the legacy portal — think modern web app, not embedded widget.

### Colour palette

Starting tokens. Refine if you can confirm exact values against the live site during the build.

| Token | Hex | Use |
|---|---|---|
| `--ltu-red` | `#C8102E` | Brand accent, header bar, primary action buttons |
| `--ltu-navy` | `#1F2A44` | Primary text, headings, student message bubbles |
| `--surface` | `#FFFFFF` | Page background, cards |
| `--surface-soft` | `#F5F7FA` | Assistant message bubbles, sidebar background, inbox tiles |
| `--border` | `#E5E7EB` | Card borders, dividers |
| `--text-muted` | `#6B7280` | Secondary text, timestamps, system messages |
| `--success` | `#0F7B5C` | Confirmed actions, "you're sorted" moments, handoff state |
| `--alert-amber` | `#B45309` | Soft alerts (deadlines), not danger |

**Reserve red for brand and confirmation only.** Do not use red as a danger / error colour — it conflicts with the brand identity and reads as alarming in distress conversations.

### Typography

- System font stack or Inter via Google Fonts. Tailwind default works.
- Body text: 15–16px on desktop, 16px on mobile (16px minimum to avoid iOS zoom-on-focus).
- Headings: bold weight, navy colour, generous line-height.
- No more than two type sizes within any single component.

### Chat bubble styling

- **Student messages** — right-aligned. `--ltu-navy` filled, white text. Rounded corners with the bottom-right slightly squared.
- **Assistant messages** — left-aligned. `--surface-soft` background, dark text. Rounded corners with the bottom-left slightly squared.
- **System messages** (handoff status, mode change cues) — centre-aligned, smaller, `--text-muted`.
- Vertical spacing between turns: 16–20px. Reads like a relaxed conversation, not a chat log.
- Optional: a typing indicator (three pulsing dots) before each assistant message for ~600ms. Even though scripted, the cue makes the demo feel alive.

### Assistant identity

- Small avatar to the left of every assistant message — a circular badge with a clean wordmark or abstract icon.
- **Neutral visual identity.** No photo of a person. No emoji face. No anthropomorphised character. The assistant is a tool, not a fake friend — important for distress conversations especially.
- The assistant is unnamed in the prototype (let LTU decide). Greeting reads "Hi, [persona name]"; the assistant introduces itself as "your La Trobe assistant" once, in the first message of any new conversation.

### Inbox surface styling

Each channel renders in a recognisable visual idiom, without mimicking specific brand chrome:

- **Email** — an inbox tile: sender ("La Trobe Assistant"), subject line, preview text, timestamp.
- **LMS announcement** — a notification banner styled like a course announcement: course name, "New announcement" badge, message preview.
- **SMS** — a phone notification card: sender, message text, timestamp. Plain, no chrome.

### Handoff state styling

- `--success` (green) accent — calm and supportive, **not alarming**. Red would be wrong here.
- Status bar at top of chat: green left-border or background tint, with text "Connecting you to a wellbeing support advisor."
- A subtle pulsing indicator beneath the bar.
- The assistant's last message stays visible above.
- Input box disabled, placeholder: "An advisor will join you shortly."

### Accessibility

- WCAG 2.1 AA contrast minimums on all text/background combinations.
- Keyboard navigation works for all interactive elements (persona switcher, scenario picker, toggles, message input, inbox click-through).
- Tap targets minimum 44×44px on mobile.
- Screen-reader friendly labels on all icons and toggles.
- Visible focus states. Don't rely on hover.

### Responsiveness

- Mobile-first. Test against ~375px wide (iPhone) and ~768px (tablet) viewports first; desktop is the easier case.
- Right sidebar collapses into a hamburger / drawer on mobile.
- Inbox surface on mobile takes the full screen; on desktop sits beside the chat or above it depending on width.

## Channel handling

The proactive patterns only land if the demo shows the assistant *reaching the student*, not just appearing in the chat from nowhere. Express's escalation needs to be visibly different from a normal turn. Three additions handle this without building real integrations:

### Simulated inbox surface

A mocked inbound view that appears when a proactive scenario is selected, showing one of three channels:

- **Email** — looks like an inbox tile with sender ("La Trobe Assistant"), subject line, preview text
- **LMS announcement** — looks like a Moodle-style notification banner
- **SMS** — looks like a phone notification card. **SMS only appears for critical scenarios** (e.g. SSAF nudge with deadline imminent). Other proactive scenarios use email or LMS.

When the presenter selects a proactive scenario, the inbox view appears *first*. The presenter clicks the message, which routes them into the chat with the conversation already in flight — the assistant's first chat message is the relevant opener (e.g. "Right — let me walk you through deferring SSAF"), not a generic greeting.

### Disclosure language on outbound

Every outbound message must contain three visible elements:

- **Sender identification** — "This is your La Trobe assistant" (or equivalent plain-language wording)
- **Reason for reaching out** — one line of context, e.g. "You're eligible to defer SSAF; deadline in 6 days"
- **Adjust-preferences affordance** — a visible link/button labelled "Adjust preferences" or "Stop these messages". Non-functional in the prototype but visually present.

### Mocked handoff state for Express

When the Express pattern's distress signal is triggered, the conversation enters a visible held state — *not* a normal assistant turn. The UI shifts to:

- A status bar at the top of the chat: "Connecting you to a wellbeing support advisor — a real person will be with you shortly"
- A subtle pulsing indicator or held-timer cue
- The chat input is disabled, with placeholder text: "An advisor will join you shortly"

This is a UI-only state change. No real CXone integration. The point is to validate that escalation lands in-channel, not "please call this number."

### Cross-channel continuity

The click-through from the inbox into the chat must land the conversation **already in flight** — not a generic greeting. If the inbox shows the SSAF nudge, clicking it lands the user in a chat where the assistant's first message is the deferral walkthrough opener. Conceptually the conversation ID travels with the click; in the prototype this is just shared state.

## What the prototype does NOT need

- No real LLM calls — conversations are **scripted state machines**, deterministic.
- No real email, SMS, or LMS provider integration. The inbox is fully mocked.
- No real CXone or wellbeing escalation. The handoff state is UI-only.
- No authentication or session persistence
- No accessibility hardening beyond reasonable HTML
- No automated testing, no CI/CD
- No multilingual support
- No backend whatsoever

## Build order

Build incrementally, validating each step works before moving on. The canonical six scenarios (one per pattern) come first; the additional scenarios layer on once those are working.

1. **Skeleton** — Vite + React + TS + Tailwind set up. Empty chat shell with hardcoded greeting.
2. **Personas + switcher** — three personas defined with their full mock record state, switcher in sidebar, header greeting updates.
3. **Conversation engine** — state machine in `lib/conversation-engine.ts` that walks through a scripted scenario turn-by-turn. One scenario hardcoded for testing.
4. **Inform-and-Act SSAF (Aisha)** — full flow including the purpose-probe step. The flagship scenario; carries the central behavioural shift.
5. **Remaining canonical reactive scenarios** — Status-Check (Jess, course transfer), Decide (Aisha, SSAF deferral), Express (Aisha, "I'm not coping"). Express requires the `HandoffState` component for the in-channel held state.
6. **PatternBadge + Explain mode toggle** — annotation system showing which pattern is active.
7. **Inbox surface + cross-channel continuity** — `InboxView`, `OutboundMessage` with disclosure language, click-through routing that lands in an in-flight chat. Build before proactive patterns, since proactive patterns can't be properly demonstrated without it.
8. **Canonical proactive scenarios** — Nudge (Aisha, SSAF deadline) and Check-in (Mark, LMS drop-off), surfaced through the inbox.
9. **Launch / Later toggle** — hides proactive scenarios when "Launch only".
10. **Additional scenarios** — once the canonical six work, layer on the remaining scenarios from the matrix:
    - Inform-and-Act: Mark, "Can I get an extension?"
    - Status-Check: Mark, "When do I get my results?"
    - Express: Mark, "I just failed Anatomy"
    - Nudge: Jess, census-date approaching
    - Check-in: Jess, sanction-recovery
    Each adds a `Scenario` record and any required mock data fields. No new components required — the scenarios reuse `HandoffState`, `InboxView`, and `OutboundMessage`.
11. **Visual polish** — LTU red accent, tighten spacing, message bubble styling, mobile breakpoints.

## Definition of done

- `npm install && npm run dev` runs cleanly.
- Presenter can switch between all three personas without errors.
- All eleven scenarios from the matrix play through correctly.
- Demo can walk the academic-year matrix coherently — early-semester → mid-semester → end-of-semester for each persona.
- Explain mode shows the active pattern at each turn.
- Launch / Later toggle correctly hides / shows proactive scenarios.
- Click-through from the inbox lands in an active in-flight conversation, not a generic greeting.
- Disclosure language is visible on every outbound message (sender, reason, adjust-preferences affordance).
- Express handoff state is demoable: held status bar, disabled input, advisor-connection cue.
- Build (`npm run build`) produces a static `dist/` deployable as a static site.

## Working style

- Read the docs before proposing the build plan.
- Use TypeScript strictly — types in `lib/types.ts`, shared everywhere.
- Mock data lives in `src/data/`; no mock data scattered through components.
- Conversation flows are **scripted**, not LLM-generated. Determinism is the point.
- Comments only where necessary — clean code, descriptive names, types as documentation.
- Ask before adding dependencies beyond what's listed in the tech stack.
