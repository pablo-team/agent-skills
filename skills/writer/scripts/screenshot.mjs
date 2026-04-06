import puppeteer from "puppeteer";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const url = process.argv[2];
const selector = process.argv[3] || null;
const width = parseInt(process.argv[4], 10) || 1280;
const outPath = resolve(process.argv[5] || "/tmp/screenshot.png");

if (!url) {
  console.error(
    "Usage: screenshot.mjs <url> [selector] [width] [output-path]"
  );
  console.error(
    '  node ./scripts/screenshot.mjs "https://example.com" null 1280 /tmp/hero.png'
  );
  process.exit(1);
}

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 800 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });

  let buffer;
  if (selector && selector !== "null") {
    const el = await page.$(selector);
    if (!el) {
      console.error(`selector "${selector}" not found on page`);
      process.exit(1);
    }
    buffer = await el.screenshot();
  } else {
    buffer = await page.screenshot({ fullPage: true });
  }

  await writeFile(outPath, buffer);
  console.log(`Screenshot written to ${outPath}`);
} finally {
  await browser.close();
}
