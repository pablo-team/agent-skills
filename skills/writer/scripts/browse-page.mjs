import * as cheerio from "cheerio";

const url = process.argv[2];
if (!url) {
  console.error("Usage: browse-page.mjs <url>");
  process.exit(1);
}

const res = await fetch(url, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  },
});

if (!res.ok) {
  console.error(`request failed (${res.status}): ${res.statusText}`);
  process.exit(1);
}

const html = await res.text();
const $ = cheerio.load(html);

// --- Extract data ---

const title = $("title").first().text().trim();

const metaDescription =
  $('meta[name="description"]').attr("content") ||
  $('meta[property="description"]').attr("content") ||
  "";

const ogTags = [];
$('meta[property^="og:"]').each((_, el) => {
  ogTags.push({
    property: $(el).attr("property") || "",
    content: $(el).attr("content") || "",
  });
});

const headings = [];
$("h1, h2, h3, h4, h5, h6").each((_, el) => {
  const tag = el.tagName || el.name;
  headings.push({
    level: parseInt(tag.charAt(1), 10),
    text: $(el).text().trim().slice(0, 200),
  });
});

const jsonLd = [];
$('script[type="application/ld+json"]').each((_, el) => {
  try {
    const parsed = JSON.parse($(el).html() || "");
    const items = Array.isArray(parsed) ? parsed : [parsed];
    for (const item of items) {
      jsonLd.push({
        type: item["@type"] || "Unknown",
        raw: JSON.stringify(item),
      });
    }
  } catch {}
});

const faqSections = [];
for (const ld of jsonLd) {
  if (ld.type === "FAQPage") {
    try {
      const faq = JSON.parse(ld.raw);
      for (const entity of faq.mainEntity || []) {
        if (entity["@type"] === "Question") {
          faqSections.push({
            question: entity.name || "",
            answer: (entity.acceptedAnswer && entity.acceptedAnswer.text) || "",
          });
        }
      }
    } catch {}
  }
}
if (faqSections.length === 0) {
  $("details").each((_, d) => {
    const summary = $(d).find("summary").first();
    if (summary.length) {
      const summaryText = summary.text().trim();
      const answer = $(d).text().replace(summaryText, "").trim();
      faqSections.push({
        question: summaryText.slice(0, 300),
        answer: answer.slice(0, 500),
      });
    }
  });
}

const mainEl = $("main, article, [role='main']").first();
const contentRoot = mainEl.length ? mainEl.clone() : $("body").clone();
contentRoot
  .find("script, style, nav, footer, header, aside, [role='navigation']")
  .remove();
const mainContentExcerpt = contentRoot.text().replace(/\s+/g, " ").trim().slice(0, 2000);

// --- Format output ---

const lines = [];

lines.push(`# Page Analysis: ${title}`);
lines.push(`**URL:** ${url}`);
lines.push("");

if (metaDescription) {
  lines.push(`**Meta Description:** ${metaDescription}`);
  lines.push("");
}

if (ogTags.length > 0) {
  lines.push("## Open Graph Tags");
  for (const tag of ogTags) {
    lines.push(`- ${tag.property}: ${tag.content}`);
  }
  lines.push("");
}

lines.push("## Heading Structure");
if (headings.length === 0) {
  lines.push("No headings found.");
} else {
  for (const h of headings) {
    lines.push("#".repeat(h.level) + " " + h.text);
  }
}
lines.push("");

if (jsonLd.length > 0) {
  lines.push("## JSON-LD Structured Data");
  for (const ld of jsonLd) {
    lines.push(`### @type: ${ld.type}`);
    lines.push("```json");
    lines.push(ld.raw);
    lines.push("```");
  }
  lines.push("");
} else {
  lines.push("## JSON-LD Structured Data");
  lines.push("**None found** — this page has no JSON-LD schema markup.");
  lines.push("");
}

if (faqSections.length > 0) {
  lines.push("## FAQ Sections");
  for (const faq of faqSections) {
    lines.push(`**Q:** ${faq.question}`);
    lines.push(`**A:** ${faq.answer}`);
    lines.push("");
  }
}

if (mainContentExcerpt) {
  lines.push("## Content Excerpt");
  lines.push(mainContentExcerpt);
}

console.log(lines.join("\n"));
