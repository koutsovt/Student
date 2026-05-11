# Skills · production prompts per pattern

Each subfolder is a **skill** — one folder per conversation pattern. Format follows the Anthropic Skills convention (`SKILL.md`-style frontmatter + body) and is interoperable with the `~/.claude/skills/` standard used by Claude Code and jcode.

## Layout

```
skills/
├── README.md                  ← this file
├── inform-and-act/prompts.md
├── status-check/prompts.md
├── decide/prompts.md
├── express/prompts.md
├── nudge/prompts.md
└── check-in/prompts.md
```

## Prompt layer cake (per turn)

```
1. System prompt (always-in)       ← brand voice, safety, identity, distress override
                                     ~200 tokens · cached across turns

2. Classifier prompt (one call)    ← input + USER + MEMORY → {pattern, topic, purpose, risk}
                                     structured JSON output

3. Active pattern prompt           ← the active skill's prompts.md "System prompt" section
                                     ~150-400 tokens · swapped per classifier output

4. Tool definitions                ← only Decide loads Action API schemas
                                     typed JSON Schemas

5. Retrieved context               ← USER + MEMORY (always) + skill body
                                     + past snippets if relevant
```

The classifier (step 2) is Claude Haiku. The pattern prompt + tool calls (steps 3–5) run on Sonnet. The system prompt + USER + MEMORY prefix gets prompt-cached across turns within a session.

## File structure

Each `prompts.md` carries:

```yaml
---
id: <kebab-case-id>
pattern: <Display Name>
classification:
  kind: reactive | proactive
  proposing: probe | check | confirm | offer | urgency | open
risk: low | medium | high
tools: [tool_names]
handoff_targets: [other-skill-ids]
version: 0.1.0
status: draft
---
```

Body sections:

- **Job** — one-line statement of the pattern's job
- **System prompt** — the actual text the LLM receives when this pattern is active
- **Routing rules** — conditions for transferring to other patterns
- **Tools available** — the tool schemas (Decide loads Action APIs; others mostly retrieve_knowledge)
- **Examples** — known student utterances → expected behaviour
- **Safety / overrides** — cross-cutting concerns specific to this pattern

## Cross-cutting (lives in the system prompt, not here)

These are always-in and not duplicated per skill:

- Brand voice — *"your La Trobe assistant"*; warm, clipped, La Trobe register
- Identity — neutral tool, never claim to be human, no emoji face, no anthropomorphised character
- Safety rails — no medical advice, no legal advice, no financial advice beyond LTU policies
- Distress override — any pattern transfers to Express if risk classifier returns high
- Audit — every read and write is tagged with `student_id`, pattern, topic, purpose, outcome

## Versioning + evaluation

Each `prompts.md` is git-versioned. Prompts evolve; the test fixture is the scenarios in `src/data/scenarios.ts` — a prompt change is acceptable if it passes the same scenarios deterministically.

## Source

This format derives from:
- Anthropic Skills · [github.com/anthropics/skills](https://github.com/anthropics/skills)
- jcode skills support · [github.com/1jehuang/jcode/blob/master/PLAN_MCP_SKILLS.md](https://github.com/1jehuang/jcode/blob/master/PLAN_MCP_SKILLS.md)
- Pattern Architecture v0.5 (LTU)
