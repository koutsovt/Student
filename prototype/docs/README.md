# Docs — La Trobe assistant (Charlie replacement)

Index of the architecture, decision, and stakeholder documents. Most are self-contained HTML (open in a browser); the `.docx`/`.pdf` are source artefacts.

## Settled direction (read this first)

The runtime/provider question is **decided (D1, 28 May 2026)**: the production runtime is the **managed Azure AI Foundry Agent Service** (Australia East), with **models kept configurable within the in-region Foundry catalogue** via Model Router (D4). GPT-family at launch (Claude is not in AU East on Foundry). Knowledge retrieval is **Azure AI Search** (D2), prompt-injection defence is **Prompt Shields** (D3), we **own MEMORY** as system of record (D5), and preview features stay off launch-critical paths (D6). Provider-agnosticism (`LLMClient`, T15) is **re-scoped to within-catalogue, not reversed**.

What we build vs what we buy: we own the **Pattern Router** (intent classification), the **skills library**, the **distress/Express** path, the **MCP → SAP PO** action middleware, the **personalisation/MEMORY** tier, and the management plane (**Admin Console**, **Tool Registry UI**). Everything else is managed Azure.

## Reading order

1. **`duplication-buy-vs-build-review.html`** — the decisions (D1–D6) and the residency trilemma. *Start here for the production direction.*
2. **`managed-foundry-alignment-review.html`** — the merged architecture: our pattern-assessment tier in front of the managed Foundry runtime.
3. **`infrastructure.html`** — the full static map: topology, components, repositories, MCP servers, cost, scale (reflects D1–D6).
4. **`ssaf-use-case.html`** — one enquiry (SSAF, the proposed MVP) traced through every component; shows why one topic routes three ways.
5. **`decisions-and-rationale.html`** — the complete decision log, incl. the D1–D6 records (§13).

## All documents

| Document | What it is | Audience |
|---|---|---|
| `duplication-buy-vs-build-review.html` | Build-vs-buy against managed Microsoft components; D1–D6 + the residency trilemma | Architecture / steering |
| `managed-foundry-alignment-review.html` | Merged production architecture (pattern tier + managed Foundry) | Architecture |
| `infrastructure.html` | Azure topology, components, MCP tool servers, repositories, observability, cost, scale | Architecture / IT |
| `ssaf-use-case.html` | SSAF MVP walkthrough — one topic, three patterns, full component trace | Architecture / stakeholder |
| `decisions-and-rationale.html` | Full decision log (T/A/SEC/K/PR/D series), incl. D1–D6 | Architecture |
| `metrics-catalogue.html` | The instrumentation contract — 33 metrics (M1–M33), SLOs, owners, emission points | Architecture / ops |
| `day-1-dashboard.html` | Launch-day dashboard mockup (sample data) | Stakeholder |
| `personalisation-one-pager.{pdf,html}` | 12-page briefing for senior leadership | Stakeholder / exec |
| `Charlie_Workshop_Briefing_v1_2.docx` | Primary source — plain-English pattern model | Source artefact |
| `Charlie_Pattern_Architecture_v0.5.docx` | Technical companion to the briefing | Source artefact |

## Conventions

- **No internal versioning language** in stakeholder-facing material — no "Phase 1/2", "v2.5". Use "at launch" / "later" / "follow-up release".
- These are the **production reference**. The prototype itself (`../`) stays mock — no live LLM, APIs, or integrations.
- When the docs and `Charlie_Prototype_Brief_v4.md` disagree, the `.docx` source documents win.
