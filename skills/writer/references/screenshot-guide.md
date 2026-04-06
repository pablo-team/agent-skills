# Screenshot Guide

Take screenshots of web pages for visual identity extraction (colors, style, mood, imagery patterns).

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `url` | Yes | — | URL to capture |
| `selector` | No | Full page | CSS selector to capture a specific element |
| `width` | No | 1280 | Viewport width in pixels |

## Option 1 — Direct screenshot tool (preferred)

If your environment provides a `screenshot` tool, use it directly:

```
screenshot({ url: "https://example.com", selector: "#hero", width: 1280 })
```

This is the fastest path — no setup required.

## Option 2 — Screenshot script (fallback)

When no screenshot tool is available, use the bundled Puppeteer script.

### One-time setup

Install Puppeteer and download a browser binary:

```bash
npm install puppeteer
```

### Usage

```bash
node ./scripts/screenshot.mjs <url> [selector] [width] [output-path]
```

- `selector` — pass `null` to capture the full page
- `width` — viewport width, defaults to `1280`
- `output-path` — where to save the PNG, defaults to `/tmp/screenshot.png`

### Examples

```bash
# Full page screenshot
node ./scripts/screenshot.mjs "https://example.com"

# Capture just the hero section
node ./scripts/screenshot.mjs "https://example.com" "#hero" 1280 /tmp/hero.png

# Wide viewport, full page
node ./scripts/screenshot.mjs "https://example.com" null 1440 /tmp/wide.png
```

The script writes the PNG to disk and prints `Screenshot written to <path>` to stdout.
