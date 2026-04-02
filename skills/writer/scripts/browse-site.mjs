const url = process.argv[2];
if (!url) {
  console.error('Usage: browse-site.mjs <url>');
  process.exit(1);
}

const baseUrl = process.env.WORKER_BASE_URL;
const secret = process.env.AGENT_PROXY_SECRET;

if (!baseUrl || !secret) {
  console.error('WORKER_BASE_URL and AGENT_PROXY_SECRET must be set');
  process.exit(1);
}

const extractFn = `function() {
  function getMetaContent(name) {
    var meta = document.querySelector('meta[name="' + name + '"], meta[property="' + name + '"]');
    return meta ? meta.getAttribute("content") || "" : "";
  }

  var title = document.title || "";
  var metaDescription = getMetaContent("description");

  var ogTags = [];
  document.querySelectorAll('meta[property^="og:"]').forEach(function(meta) {
    ogTags.push({
      property: meta.getAttribute("property") || "",
      content: meta.getAttribute("content") || ""
    });
  });

  var headings = [];
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(function(h) {
    headings.push({
      level: parseInt(h.tagName.charAt(1), 10),
      text: (h.textContent || "").trim().slice(0, 200)
    });
  });

  var jsonLd = [];
  document.querySelectorAll('script[type="application/ld+json"]').forEach(function(script) {
    try {
      var parsed = JSON.parse(script.textContent || "");
      var items = Array.isArray(parsed) ? parsed : [parsed];
      items.forEach(function(item) {
        jsonLd.push({
          type: item["@type"] || "Unknown",
          raw: JSON.stringify(item)
        });
      });
    } catch (e) {}
  });

  var faqSections = [];
  jsonLd.forEach(function(ld) {
    if (ld.type === "FAQPage") {
      try {
        var faq = JSON.parse(ld.raw);
        (faq.mainEntity || []).forEach(function(entity) {
          if (entity["@type"] === "Question") {
            faqSections.push({
              question: entity.name || "",
              answer: (entity.acceptedAnswer && entity.acceptedAnswer.text) || ""
            });
          }
        });
      } catch (e) {}
    }
  });
  if (faqSections.length === 0) {
    document.querySelectorAll("details").forEach(function(d) {
      var summary = d.querySelector("summary");
      if (summary) {
        var answer = (d.textContent || "").replace(summary.textContent || "", "").trim();
        faqSections.push({
          question: (summary.textContent || "").trim().slice(0, 300),
          answer: answer.slice(0, 500)
        });
      }
    });
  }

  var mainEl = document.querySelector("main, article, [role='main']") || document.body;
  var clone = mainEl.cloneNode(true);
  clone.querySelectorAll("script, style, nav, footer, header, aside, [role='navigation']").forEach(function(el) {
    el.remove();
  });
  var mainContentExcerpt = (clone.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 2000);

  return {
    title: title,
    metaDescription: metaDescription,
    ogTags: ogTags.slice(0, 20),
    headings: headings.slice(0, 100),
    jsonLd: jsonLd.slice(0, 20),
    faqSections: faqSections.slice(0, 30),
    mainContentExcerpt: mainContentExcerpt
  };
}`;

const res = await fetch(`${baseUrl}/api/agent-proxy`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${secret}`,
  },
  body: JSON.stringify({ action: 'evaluate', url, fn: extractFn }),
});

if (!res.ok) {
  const body = await res.text();
  console.error(`request failed (${res.status}): ${body}`);
  process.exit(1);
}

const { result: data } = await res.json();

const lines = [];

lines.push(`# Page Analysis: ${data.title}`);
lines.push(`**URL:** ${url}`);
lines.push('');

if (data.metaDescription) {
  lines.push(`**Meta Description:** ${data.metaDescription}`);
  lines.push('');
}

if (data.ogTags.length > 0) {
  lines.push('## Open Graph Tags');
  for (const tag of data.ogTags) {
    lines.push(`- ${tag.property}: ${tag.content}`);
  }
  lines.push('');
}

lines.push('## Heading Structure');
if (data.headings.length === 0) {
  lines.push('No headings found.');
} else {
  for (const h of data.headings) {
    lines.push('#'.repeat(h.level) + ' ' + h.text);
  }
}
lines.push('');

if (data.jsonLd.length > 0) {
  lines.push('## JSON-LD Structured Data');
  for (const ld of data.jsonLd) {
    lines.push(`### @type: ${ld.type}`);
    lines.push('```json');
    lines.push(ld.raw);
    lines.push('```');
  }
  lines.push('');
} else {
  lines.push('## JSON-LD Structured Data');
  lines.push('**None found** — this page has no JSON-LD schema markup.');
  lines.push('');
}

if (data.faqSections.length > 0) {
  lines.push('## FAQ Sections');
  for (const faq of data.faqSections) {
    lines.push(`**Q:** ${faq.question}`);
    lines.push(`**A:** ${faq.answer}`);
    lines.push('');
  }
}

if (data.mainContentExcerpt) {
  lines.push('## Content Excerpt');
  lines.push(data.mainContentExcerpt);
}

console.log(lines.join('\n'));