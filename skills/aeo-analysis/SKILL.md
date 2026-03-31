---
name: aeo-analysis
description: Measure a brand's visibility on AI search engines using the pablo CLI. Input is a website URL.
---

# AEO Measurement Skill

Measure a brand's visibility on AI search engines (ChatGPT, Claude, Gemini, Perplexity) using the pablo CLI.

**Input:** `<website_url>`

---

## Step 1 — Analyze the Website

Fetch the website to understand the brand:
1. Use WebFetch on `<website_url>` — read the homepage and any linked About, Products, or Services pages
2. Extract:
   - Brand name and domain
   - Industry and product/service category
   - Target customer
   - Key features and unique selling points

**→ Confirm with user**
Present a 4–6 bullet summary of your findings. Ask:
> "Does this accurately describe your brand? Anything to add or correct?"

Wait for confirmation before proceeding. Incorporate any corrections.

---

## Step 2 — Check Existing Setup

Before creating anything, check what's already configured:

```bash
pablo aeo topics list --json
pablo aeo brands list --json
pablo aeo prompts list --json
```

- If topics, brands, and prompts are all populated → skip to Step 6 (Trigger Analysis)
- Otherwise fill in the gaps in the steps below

---

## Step 3 — Set Up Topics

Topics define the business areas where you want to measure AI visibility (e.g., "Project Management Software", "Team Collaboration Tools").

Check: `pablo aeo topics list --json`

If fewer than 3 topics exist, create 3–5 based on your website analysis:

```bash
pablo aeo topics create "<Topic Name>"
```

Good topics are:
- Specific enough to generate targeted questions
- Broad enough that AI engines regularly answer them
- Directly relevant to the brand's core product/service areas

**→ Confirm with user**
List the topics you created. Ask:
> "Do these cover the areas where you want to track your AI visibility? Want to add, remove, or rename any?"

Wait for confirmation. Adjust as needed using `pablo aeo topics create`.

---

## Step 4 — Set Up Own Brand and Competitors

Brands tell the pipeline whose mentions to track and compare.

Check: `pablo aeo brands list --json`

**Add your own brand** (use `--own` flag):
```bash
pablo aeo brands create "<BrandName>" --domain <yourdomain.com> --own
```

**Add 3–5 competitors** (research from the website and your industry knowledge):
```bash
pablo aeo brands create "<CompetitorName>" --domain <competitor.com>
```

**→ Confirm with user**
Show the brands list. Ask:
> "Are these the right competitors to benchmark against? Any to add or remove?"

Wait for confirmation.

---

## Step 5 — Create Prompts

Prompts are the natural-language questions sent to each AI engine. Create 3 per topic.

Get topic IDs: `pablo aeo topics list --json`

For each topic, create prompts that:
- Sound like genuine questions a user would type into an AI engine
- Do **not** mention the brand by name
- Are relevant to the topic
- Could naturally lead to the brand being mentioned in a good answer

```bash
pablo aeo prompts create <topicId> "<Natural language question>"
```

**Example** for topic "Project Management Software":
```bash
pablo aeo prompts create topic_abc "What are the best project management tools for remote teams?"
pablo aeo prompts create topic_abc "How do I choose project management software for a 50-person company?"
pablo aeo prompts create topic_abc "Which project management platforms integrate best with Slack and GitHub?"
```

Verify all prompts: `pablo aeo prompts list --json`

---

## Step 6 — Trigger Analysis

```bash
pablo aeo runs trigger --json
```

Note the `runId` from the response (e.g., `run_abc123`).

**Poll for completion** — check every 30 seconds:
```bash
pablo aeo runs get <runId> --json
```

Status values:
| Status | Meaning |
|--------|---------|
| `queued` | Waiting to start |
| `running` | Queries in progress — check `completedItems`/`totalItems` for progress |
| `completed` | Done — proceed to Step 7 |
| `failed` | Something went wrong — run `pablo aeo runs trigger` to retry |

Typical duration: 5–15 minutes depending on how many topics, prompts, and platforms are configured.

---

## Step 7 — View Results

Once status is `completed`, fetch and present all three views:

**Overall visibility and KPIs:**
```bash
pablo aeo overview --range 7d
```

**Competitor mention rate comparison:**
```bash
pablo aeo competitors --range 7d
```

**Visibility breakdown by platform and topic:**
```bash
pablo aeo visibility --range 7d
```

**→ Present to user**
Summarize the key findings:
- Overall visibility score and mention rate
- Which AI platforms mention the brand most
- How the brand ranks vs each competitor
- Which topics drive the most (and least) visibility
