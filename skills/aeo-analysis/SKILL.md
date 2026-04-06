---
name: aeo-analysis
description: Measure a brand's visibility on AI search engines using the pablo CLI. Input is a website URL.
license: Proprietary
compatibility: Underlying environment must have `pablo` cli installed.
metadata:
  author: "Pablo Dev Team"
  version: "2.0"
---

## Rules

These apply at all times, regardless of what you're doing.

1. **Check before creating** — always query existing state (`topics list`, `brands list`, `prompts list`) before creating any resource. Skip what already exists.
2. **Present before acting** — never create topics, brands, or prompts without first presenting your plan to the user and getting explicit approval. This is non-negotiable.
3. **One approval per resource type** — present all topics together, get approval. Then all brands together, get approval. Then prompts. Don't batch everything into one giant list, and don't drip-feed one at a time.
4. **Respect corrections** — when the user modifies your plan (adds, removes, renames), apply the changes and confirm the final list before creating.

---

## Context

Pablo measures a brand's visibility on AI answer engines (ChatGPT, Perplexity, Gemini, etc.). Everything is organized inside a **project** — a workspace that holds all resources for one brand's AEO tracking.

**Resource hierarchy:**

```
Project
├── Topics          — SEO like topic / business categories to track (e.g., "Project Management Tools")
├── Brands          — the own brand (flagged --own) + competitors
├── Prompts         — questions sent to AI engines, grouped by topic
├── Runs            — analysis executions that query all engines
└── Results         — aggregated metrics (overview, competitors, visibility)
```

A run sends every prompt to every configured AI engine, then checks whether each brand was mentioned in the responses. The results surface which brands are visible for which topics on which platforms.

---

## CLI Reference

### Project

```bash
pablo project info --json            # brand name, site URL, config
```

### Topics

```bash
pablo aeo topics list --json
pablo aeo topics create "<Topic Name>"
pablo aeo topics delete <topicId>
```

### Brands

```bash
pablo aeo brands list --json
pablo aeo brands create "<Name>" --domain <domain.com> --own    # own brand
pablo aeo brands create "<Name>" --domain <domain.com>          # competitor
pablo aeo brands delete <brandId>
```

### Prompts

```bash
pablo aeo prompts list --json
pablo aeo prompts create <topicId> "<Question>"
pablo aeo prompts delete <promptId>
```

### Runs

```bash
pablo aeo runs list                  # find latest run
pablo aeo runs get <runId>           # detailed run data
pablo aeo runs trigger --json        # start a new analysis
```

### Results

```bash
pablo aeo overview --range 7d
pablo aeo competitors --range 7d
pablo aeo visibility --range 7d
```

---

## Workflow: Select a Project

Most commands rely on a default project. Before doing anything else, ensure one is set.

1. Run `pablo project list --json` to show available projects.
2. If there are multiple projects, ask the user which one to use.
3. Set the chosen project as default: `pablo config set project <id>`
4. Confirm with `pablo project info` to verify the active project.

If no projects exist, the user needs to create one from the Pablo dashboard first.

---

## Workflow: Setting Up a New Project

When the user provides a URL or wants to start fresh, work through these phases. Each phase ends with user approval before the next begins.

### 1. Understand the business

Fetch the site (homepage + about/product pages). Synthesize:

- **Business** — what they do, market fit, product direction
- **Target audience** — who they serve
- **Competitive positioning** — only the dimensions that are meaningful:
  scope (regional/global), segment (freelancer/SMB/enterprise), model (SaaS/marketplace/agency), positioning (budget/mid/premium), niche, differentiator

Present your findings. Wait for the user to confirm or correct before moving on.

### 2. Topics

Generate 3–5 topics based on the business analysis.

**Good topics are:**
- 3–5 words, short and category-like
- Industry-specific with enough context to be unambiguous
- A mix of informational and transactional intent where possible
- Never mention the brand name

**Bad:** "Flexible Day Passes" (gym? museum? transit?)
**Good:** "Coworking Day Passes" (clearly workspaces)

**Examples:**
- Project management SaaS → "Project Management Tools", "Team Collaboration Software", "Agile Workflow Tools"
- Restaurant reservation app → "Restaurant Booking Apps", "Fine Dining Reservations", "Last Minute Dinner Booking"

Present the proposed topics with brief reasoning. Wait for approval, then create.

### 3. Brands & Competitors

Add the own brand first (`--own` flag).

Find competitors by web-searching across the topics from step 2:
- "best [topic]", "top [topic] tools", "alternatives to [brand]"
- Pick 3–5 actual product/service competitors that appear across multiple topics
- Filter out blogs, directories, and news sites

Present each competitor with a brief rationale (which topics they appeared in, why they're relevant). Wait for approval, then create.

### 4. Prompts

Create 3 prompts per topic — natural-language questions that:
- Sound like what a real person would ask an AI assistant
- Are relevant to the topic
- Do not mention the brand by name

**Example** for "Project Management Tools":
- "What are the best project management tools for remote teams?"
- "How do I choose project management software for a 50-person company?"
- "Which project management platforms integrate best with Slack and GitHub?"

Create prompts after topics and brands are confirmed. These don't need a separate confirmation gate — they follow directly from the approved topics.

### 5. Run the analysis

Trigger a run and inform the user it takes around 5–10 minutes. Once the run completes, present results (see below).

---

## Workflow: Viewing Results

When the user asks about existing data, visibility, or comparisons — fetch the relevant results and summarize.

Pull from three views:
- `overview` — overall visibility score and mention rate
- `competitors` — brand vs. competitor ranking
- `visibility` — per-topic, per-platform breakdown

Summarize with:
- Overall visibility score and trend
- Which AI platforms mention the brand most/least
- How the brand ranks against each competitor
- Strongest and weakest topics
- Actionable next steps based on the gaps (e.g., low visibility on a platform → content opportunity, competitor outranking on a topic → area to strengthen)

After presenting the summary, check `<project_context>`. If it includes a `Dashboard:` line, end with a short CTA that includes the dashboard URL so the user can see the full breakdown.

---

## Workflow: Modifying Configuration

When the user wants to add, remove, or adjust topics, brands, or prompts:

1. List the current state of the resource being changed
2. Discuss what to change
3. Apply the changes
4. Ask if they'd like to trigger a new analysis run with the updated configuration
