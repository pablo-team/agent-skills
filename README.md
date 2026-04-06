# Pablo Agent Skills

Agent skills for [Pablo](https://pablo.computer) — the content management agent that helps your brand show up in AI search.

Pablo measures your brand's visibility on AI answer engines (ChatGPT, Perplexity, Gemini, Claude) and produces content designed to get cited by them. These skills give AI coding agents the knowledge to work with Pablo on your behalf.

## Installation

```
npx skills add pablo-team/agent-skills
```

This works with Claude Code and any agent environment that supports the [skills](https://github.com/anthropics/skills) format.

## Skills

### `pablo-cli`

Complete reference for the Pablo CLI — every command, flag, and option. This skill is loaded automatically when other skills need to run `pablo` commands, but it's also useful on its own when you want your agent to manage projects, articles, or AEO resources directly.

### `aeo-analysis`

Set up and run AEO (Answer Engine Optimization) analysis for a brand. The agent uses the Pablo CLI to create topics, prompts, and competitor brands, then triggers analysis runs that measure how visible your brand is across AI answer engines. Takes a website URL as input and walks through the full setup flow.

### `writer`

Write, edit, and publish AEO-optimized articles. The agent analyzes your existing blog to match your brand voice, researches the topic, drafts an article structured for AI extraction, generates on-brand images, evaluates against AEO criteria, and publishes via the Pablo CLI. Articles are designed to get cited when people ask AI tools questions in your space.

## Prerequisites

1. A Pablo account — sign up at [https://pablo.computer](https://pablo.computer)
2. Install the Pablo CLI:
   ```
   curl -fsSL https://agent.pablo.computer/install.sh | sh
   ```
3. Authenticate:
   ```
   pablo login
   ```

See [pablo-team/pablo-cli](https://github.com/pablo-team/pablo-cli) for full documentation.
