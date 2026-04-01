---
name: aeo-analysis
description: Measure a brand's visibility on AI search engines using the pablo CLI. Input is a website URL.
license: Proprietary
compatibility: Underlying environment must have `pablo` cli installed.
metadata:
  author: "Pablo Dev Team"
  version: "1.0"
---

## About Pablo CLI

Pablo is a CLI tool for measuring a brand's visibility on AI answer engines (ChatGPT, Perplexity, Gemini, etc.). Everything lives inside a single **project** — a shared workspace that holds all the resources for one brand's AEO tracking.

The core resources within a project are:

- **Topics** — the business categories to track (e.g., "Project Management Tools"). Topics scope what the analysis covers.
- **Brands** — the own brand and its competitors. The own brand is flagged with `--own`; all others are treated as benchmarks.
- **Prompts** — natural-language questions sent to each AI engine, grouped by topic. These drive the actual queries.
- **Runs** — an analysis execution. Triggering a run sends all prompts to all configured AI engines and collects visibility data.
- **Results** — aggregated metrics accessible via `pablo aeo overview`, `pablo aeo competitors`, and `pablo aeo visibility`.

**Important:** The project always has a current state. Even if the user hasn't said anything yet, always start by querying the CLI to understand what's already configured before deciding what to do next.

---

## How to Use This Skill

Determine the user's intent first, then route to the appropriate mode.

| Intent | Mode |
|--------|------|
| User provides a URL or wants to set up a new project | **Mode A — Full Setup Pipeline** |
| User asks about existing runs, metrics, or visibility | **Mode B — Query** |
| User wants to add, remove, or edit topics / brands / prompts | **Mode C — Modify** |

---

## Mode A — Full Setup Pipeline

For new or empty projects. Follow steps in order. Never skip a confirmation gate.

### A1 — Understand the Business

1. Use WebFetch on the provided URL — read the homepage and any linked About, Products, or Services pages
2. Extract the brand name, domain, and enough context to summarize the business

**→ Confirm with user — hard stop**

Present findings in this format:

**Business:** [what they do, market fit, product direction]
**Target Audience:** [who they serve]

Then surface only the competitive positioning dimensions that are meaningful for this business:
- **Scope** — regional or global
- **Segment** — freelancers / startups / SMB / enterprise
- **Model** — SaaS / marketplace / agency / other
- **Positioning** — budget / mid-market / premium
- **Niche** — broad category player or specialized
- **Differentiator** — the core reason customers choose them

Omit any dimension that is unclear or irrelevant. Ask:
> "Does this accurately describe your business? Anything to add or correct?"

Wait for confirmation. Incorporate any corrections. Do not proceed until confirmed.

---

### A2 — Check Existing Setup

Before creating anything, check what's already configured:

```bash
pablo aeo topics list --json
pablo aeo brands list --json
pablo aeo prompts list --json
```

Skip any step where the data is already populated. Only create what's missing.

---

### A3 — Create Topics

Topics define the business areas where you want to measure AI visibility.

**How to generate topics:**
- Generate 3–5 topics based on the business analysis from A1
- Each topic must be 3–5 words — short, clear, and category-like
- Think like SEO categories or things people would type into an AI assistant
- Do NOT mention the brand name
- Be industry-specific and include enough context so the topic is unambiguous
    - Bad: "Flexible Day Passes" (could be gym, museum, transit, etc.)
    - Good: "Coworking Day Passes" (clearly about workspaces)
- Cover both informational and transactional intent where possible

**Examples by business type:**
- Project management SaaS → "Project Management Tools", "Team Collaboration Software", "Agile Workflow Tools"
- Restaurant reservation app → "Restaurant Booking Apps", "Fine Dining Reservations", "Last Minute Dinner Booking"
- No-code site builder → "No-Code Site Builder", "Custom Domain Hosting", "User-Friendly Design Tools"

Create each topic:
```bash
pablo aeo topics create "<Topic Name>"
```

**→ Confirm with user — hard stop**

List the topics you created and ask:
> "Do these cover the areas where you want to track your AI visibility? Want to add, remove, or rename any?"

Wait for confirmation. Adjust using `pablo aeo topics create` or `pablo aeo topics delete`. Do not proceed until confirmed.

---

### A4 — Create Brands & Competitors

Brands define whose mentions to track and compare against.

**Add your own brand first:**
```bash
pablo aeo brands create "<BrandName>" --domain <yourdomain.com> --own
```

**Identify competitors via web search:**

For each topic from A3, use WebSearch to find who appears in real results. Use queries like:
- "best [topic]"
- "top [topic] tools / apps / platforms"
- "alternatives to [brand name]"

Across all topic searches, extract the brand/company names that appear most consistently. Prioritize competitors that show up across multiple topics. Filter out blogs, directories, and news sites — focus on actual product or service competitors. Aim for 3–5.

Create each competitor:
```bash
pablo aeo brands create "<CompetitorName>" --domain <competitor.com>
```

**→ Confirm with user — hard stop**

Present the competitor list. For each competitor, briefly explain why you selected them — which topics they appeared in and how frequently. Ask:
> "Are these the right competitors to benchmark against? Any to add, remove, or swap?"

Wait for confirmation. Adjust as needed. Do not proceed until confirmed.

---

### A5 — Create Prompts

Prompts are the natural-language questions sent to each AI engine. Create 3 per topic.

Get topic IDs:
```bash
pablo aeo topics list --json
```

For each topic, write prompts that:
- Sound like genuine questions a user would ask an AI assistant
- Do **not** mention the brand by name
- Are relevant to the topic
- Could naturally lead to a good answer that mentions the brand

```bash
pablo aeo prompts create <topicId> "<Natural language question>"
```

**Example** for "Project Management Software":
```bash
pablo aeo prompts create topic_abc "What are the best project management tools for remote teams?"
pablo aeo prompts create topic_abc "How do I choose project management software for a 50-person company?"
pablo aeo prompts create topic_abc "Which project management platforms integrate best with Slack and GitHub?"
```

Verify: `pablo aeo prompts list --json`

---

### A6 — Trigger & Monitor Analysis

```bash
pablo aeo runs trigger --json
```

Note the `runId` from the response. Do a single status check:
```bash
pablo aeo runs get <runId> --json
```

Inform the user of the current status and let them know it will take around 5–10 minutes to complete. Move on to A7 once they confirm it's done.

---

### A7 — View Results

```bash
pablo aeo overview --range 7d
pablo aeo competitors --range 7d
pablo aeo visibility --range 7d
```

**→ Present to user**

Summarize key findings:
- Overall visibility score and mention rate
- Which AI platforms mention the brand most
- How the brand ranks vs each competitor
- Which topics drive the most (and least) visibility
- Suggested next steps based on gaps (e.g., low visibility on a platform → review prompt coverage; competitor outranking on a topic → consider content for that area)

---

## Mode B — Query

For when the user asks about existing runs, results, or visibility. No setup needed.

**"What's the latest analysis?" / "Show me the results"**
1. `pablo aeo runs list --json` — find the most recent completed run
2. Fetch overview, competitors, and visibility with `--range 7d`
3. Summarize as in A7

**"How is my visibility?" / "How am I doing?"**
- Fetch `pablo aeo overview --range 7d` and `pablo aeo visibility --range 7d`
- Summarize visibility score, top platforms, and strongest/weakest topics

**"How do I compare to [competitor]?"**
- Fetch `pablo aeo competitors --range 7d`
- Focus the summary on that specific competitor's position relative to the brand

---

## Mode C — Modify

For when the user wants to change existing configuration without running the full pipeline.

Always list current state before making any changes.

**Topics**
```bash
pablo aeo topics list --json
pablo aeo topics create "<Topic Name>"
pablo aeo topics delete <topicId>
```

**Brands / Competitors**
```bash
pablo aeo brands list --json
pablo aeo brands create "<BrandName>" --domain <domain.com>
pablo aeo brands create "<BrandName>" --domain <domain.com> --own
pablo aeo brands delete <brandId>
```

**Prompts**
```bash
pablo aeo prompts list --json
pablo aeo prompts create <topicId> "<Question>"
pablo aeo prompts delete <promptId>
```

After any modification, confirm the updated state with the user and ask if they'd like to trigger a new analysis run.