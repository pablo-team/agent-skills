# Image Generation Guide

Generate on-brand images by extracting the visual identity from the product website, then composing a detailed prompt for the `generate_image` tool.

## Step 1 — Extract Visual Identity

Analyze the product website's key pages to build a visual profile. Focus on the landing page and any pages with rich imagery.

**Use two tools together:**

1. **screenshot** tool — take screenshots of key pages to visually assess colors, style, mood, imagery, and overall design language. This is the primary source for visual identity extraction.
   - `{site_url}` — Landing page (most important)
   - `{site_url}/about` or other visually rich pages

2. **webfetch** tool — fetch page HTML to extract exact CSS color values, font families, meta tags, and OG images as supporting data.

*Note: You can always take multiple screenshots if necessary, given different selectors. Avoid taking a lot of screenshots.*

While reviewing each page, extract and note:

| Element | What to look for |
|---------|-----------------|
| **Color palette** | Primary, secondary, accent colors. Background tone (light/dark/warm/cool). Gradient usage. |
| **Visual style** | Flat design, glassmorphism, neumorphism, minimalism, brutalism, retro, corporate, etc. |
| **Image type** | 3D renders, flat vector illustrations, isometric art, line drawings, photography, abstract shapes, geometric patterns. |
| **Mood** | Bold and energetic? Calm and minimal? Dark and techy? Playful and colorful? Warm and approachable? |
| **Depth & texture** | Flat and clean? Heavy shadows? Soft gradients? Grain/noise? Layered transparency? |
| **Subject patterns** | What do their existing images depict? People, abstract geometry, product screenshots, nature, workspace scenes? |

Synthesize your observations into a concise **visual profile** before composing any prompt. Example:

> Visual profile: Minimalist, light theme with soft purple (#7C3AED) and white. Flat vector illustrations with subtle gradients. Calm, professional mood. Clean geometric shapes, no photography. Spacious, airy compositions.

## Step 2 — Compose the Prompt

The `generate_image` tool takes a single `prompt` string. Use a **segmented structure** — each segment separated by `. ` — to produce clean, consistent results.

### Prompt segments (in order)

| Segment | What to write | Example |
|---------|--------------|---------|
| **Style** | Visual style from Step 1. If unclear, use: `Modern, clean digital illustration with a professional aesthetic` | `Clean minimalist flat vector illustration in soft purple and white tones` |
| **Subject** | What to depict, prefixed with `Subject:` | `Subject: abstract representation of website analytics with flowing data streams` |
| **Composition** | Layout guidance based on usage type (see table below) | `Composition: panoramic, atmospheric, editorial` |
| **Aspect ratio** | Match the usage type | `Aspect ratio: 16:9` |
| **No text** | Always include this last | `No text or words in the image` |

### Composition presets by usage

| Usage | Aspect | Composition guidance |
|-------|--------|---------------------|
| post-header | `16:9` | `panoramic, atmospheric, editorial` |
| hero-banner | `16:9` | `wide panoramic, dramatic, expansive` |
| inline | `4:3` | `centered subject, clear illustration` |

### Assembled prompt format

```
{style}. Subject: {subject}. Composition: {composition}. Aspect ratio: {ratio}. No text or words in the image.
```

### Examples

**Minimal SaaS brand:**
```
Modern, clean digital illustration in soft purple and white tones with a professional aesthetic.
Subject: abstract representation of website analytics with flowing data streams and dashboard elements.
Composition: panoramic, atmospheric, editorial.
Aspect ratio: 16:9.
No text or words in the image.
```

**Bold startup brand:**
```
Bold 3D render with neon green and dark charcoal palette.
Subject: interconnected nodes forming a network graph representing AI-powered automation.
Composition: wide panoramic, dramatic, expansive.
Aspect ratio: 16:9.
No text or words in the image.
```

**Warm lifestyle brand:**
```
Warm editorial-style digital illustration in earthy terracotta and cream tones.
Subject: cozy workspace scene with a laptop, coffee, and plants suggesting productivity.
Composition: centered subject, clear illustration.
Aspect ratio: 4:3.
No text or words in the image.
```

### Rules

- Always end with "No text or words in the image"
- Be specific about colors — use descriptive names ("soft purple", "neon green") rather than hex codes
- Match the existing imagery on the site, don't invent a new style
- If no visual identity can be extracted, use: `Modern, clean digital illustration with a professional aesthetic`

### Tool call

```
generate_image({
  prompt: "<assembled prompt>",
  filename: "post-header.png",
  aspect: "16:9"
})
```

The tool returns `{ url }` — use this URL in the article markdown: `![alt text](url)`.