---
name: pablo-cli
description: >
    Complete reference for the Pablo CLI. Use when executing pablo commands
    or when the agent needs to know available commands, flags, and options.
license: Proprietary
compatibility: Requires `pablo` cli installed and authenticated.
metadata:
    author: "Pablo Dev Team"
    version: "1.0"
---

# Pablo CLI Reference

Pablo CLI is the command-line interface for managing projects, articles, and AEO (Answer Engine Optimization) analysis.

## Authentication

### `pablo login`

Log in via device authorization flow. Opens a browser for approval.

### `pablo logout`

Log out and clear stored tokens.

### `pablo whoami`

Show current authentication status and user info.

---

## Configuration

Config is stored at `~/.pablo/config.json`.

### `pablo config set project <id>`

Set the default project ID.

### `pablo config get project`

Get the current default project ID.

---

## Project

### `pablo project info [OPTIONS]`

Show details of the current project.

| Flag | Description |
|------|-------------|
| `--project, -p <id>` | Project ID (overrides config) |
| `--json, -j` | Output as JSON |

### `pablo project list [OPTIONS]`

List all projects.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

---

## Articles

### `pablo articles list [OPTIONS]`

List all articles.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

### `pablo articles get <id> [OPTIONS]`

Get article details and content.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

### `pablo articles create [OPTIONS]`

Create a new article.

| Flag | Description |
|------|-------------|
| `--title <text>` | Article title |
| `--file <path>` | Absolute path to markdown file |
| `--json, -j` | Output as JSON |

### `pablo articles update <id> [OPTIONS]`

Update title or content of an article. At least one of `--title` or `--file` is required.

| Flag | Description |
|------|-------------|
| `--title <text>` | New title |
| `--file <path>` | Absolute path to markdown file |
| `--json, -j` | Output as JSON |

### `pablo articles generate-image [OPTIONS]`

Generate an AI image and upload it. Returns a public URL.

| Flag | Description |
|------|-------------|
| `--prompt <text>` | Image generation prompt (required) |
| `--filename, -f <name>` | Output filename, e.g. hero.png (required) |
| `--aspect, -a <ratio>` | Aspect ratio: `1:1`, `3:4`, `4:3`, `9:16`, `16:9` |
| `--json, -j` | Output as JSON |

---

## AEO (Answer Engine Optimization)

All AEO commands accept a global `--project, -p <id>` flag to override the default project.

### Overview & Analytics

#### `pablo aeo overview [OPTIONS]`

Show AEO overview — visibility scores, trends, and prompt performance.

| Flag | Description |
|------|-------------|
| `-r, --range <range>` | Date range: `7d`, `30d`, `3m` (default: `7d`) |
| `-m, --model <model>` | Filter by model: `chatgpt`, `claude`, `gemini`, `perplexity` |
| `-t, --topic <id>` | Filter by topic ID |
| `--json, -j` | Output raw JSON |

#### `pablo aeo visibility [OPTIONS]`

Show visibility breakdown across AI models.

| Flag | Description |
|------|-------------|
| `-r, --range <range>` | Date range: `7d`, `30d`, `3m` (default: `7d`) |
| `-m, --model <model>` | Filter by model: `chatgpt`, `claude`, `gemini`, `perplexity` |
| `-t, --topic <id>` | Filter by topic ID |
| `--json, -j` | Output raw JSON |

#### `pablo aeo competitors [OPTIONS]`

Show competitor analysis and comparison.

| Flag | Description |
|------|-------------|
| `-r, --range <range>` | Date range: `7d`, `30d`, `3m` (default: `7d`) |
| `-m, --model <model>` | Filter by model: `chatgpt`, `claude`, `gemini`, `perplexity` |
| `-t, --topic <id>` | Filter by topic ID |
| `--json, -j` | Output raw JSON |

#### `pablo aeo sources [OPTIONS]`

Show source citations across AI models.

| Flag | Description |
|------|-------------|
| `-r, --range <range>` | Date range: `7d`, `30d`, `3m` (default: `7d`) |
| `-m, --model <model>` | Filter by model: `chatgpt`, `claude`, `gemini`, `perplexity` |
| `-t, --topic <id>` | Filter by topic ID |
| `--json, -j` | Output raw JSON |

### Topics

#### `pablo aeo topics list [OPTIONS]`

List all topics.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

#### `pablo aeo topics create <name> [OPTIONS]`

Create a new topic.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

#### `pablo aeo topics update <id> [OPTIONS]`

Update a topic.

| Flag | Description |
|------|-------------|
| `--name <text>` | New name |
| `--description <text>` | New description |
| `--json, -j` | Output as JSON |

#### `pablo aeo topics delete <id> [OPTIONS]`

Delete a topic.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

### Prompts

#### `pablo aeo prompts list [OPTIONS]`

List prompts.

| Flag | Description |
|------|-------------|
| `--active` | Show only active prompts |
| `--inactive` | Show only inactive prompts |
| `-t, --topic <id>` | Filter by topic ID |
| `--json, -j` | Output as JSON |

#### `pablo aeo prompts create <topicId> <content> [OPTIONS]`

Create a new prompt.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

#### `pablo aeo prompts update <id> [OPTIONS]`

Update a prompt.

| Flag | Description |
|------|-------------|
| `--content <text>` | New content |
| `--type <type>` | Type: `informational`, `comparison`, `recommendation`, `how_to`, `review`, `other` |
| `--status <status>` | Status: `active`, `inactive` |
| `--json, -j` | Output as JSON |

#### `pablo aeo prompts delete <id> [OPTIONS]`

Delete a prompt.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

### Brands

#### `pablo aeo brands list [OPTIONS]`

List all brands (own + competitors).

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

#### `pablo aeo brands create <name> [OPTIONS]`

Create a new brand.

| Flag | Description |
|------|-------------|
| `-d, --domain <domain>` | Domain name (required) |
| `--own` | Mark as own brand |
| `--json, -j` | Output as JSON |

#### `pablo aeo brands update <id> [OPTIONS]`

Update a brand.

| Flag | Description |
|------|-------------|
| `--name <text>` | New name |
| `-d, --domain <domain>` | New domain |
| `--own` | Update own brand status |
| `--json, -j` | Output as JSON |

#### `pablo aeo brands delete <id> [OPTIONS]`

Delete a brand.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

### AEO Analysis Runs

#### `pablo aeo runs trigger [OPTIONS]`

Trigger a new AEO analysis run.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

#### `pablo aeo runs list [OPTIONS]`

List recent analysis runs.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

#### `pablo aeo runs get <runId> [OPTIONS]`

Get run details and competitor snapshot.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

---

## Plan & Billing

### `pablo plan [OPTIONS]`

Show current plan and usage.

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

### `pablo plan pricing [OPTIONS]`

Show available plans and pricing (public, no auth required).

| Flag | Description |
|------|-------------|
| `--json, -j` | Output as JSON |

---

## Global

### `pablo --version, -v`

Show version, architecture, commit hash, environment, API base, and build timestamp.

### `pablo --help, -h`

Show top-level help with all available commands.

### Output format

All commands default to human-readable table output. Pass `--json` / `-j` for machine-readable JSON (pretty-printed, 2-space indent).
