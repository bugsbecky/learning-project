import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function parseDomainFromText(bodyText) {
  const m = bodyText.match(/\n(\d+\.\d+ [^\n]+)\n/);
  return m ? m[1] : "";
}

export function parseStemFromText(bodyText) {
  const domain = parseDomainFromText(bodyText);
  if (!domain) return "";
  const idx = bodyText.indexOf(domain);
  if (idx === -1) return "";
  const after = bodyText.slice(idx + domain.length).trim();
  const end = after.search(/\nA[\)\uFF09]/);
  return (end === -1 ? after : after.slice(0, end)).trim();
}

export function extractQuestionFromDom() {
  function expandAll() {
    document.querySelectorAll("button").forEach((b) => {
      if (b.textContent.trim() === "Explanation" && b.getAttribute("aria-expanded") === "false") {
        b.click();
      }
    });
  }
  expandAll();

  const bodyText = document.body.innerText;
  const qMatch = bodyText.match(/Question (\d+) of (\d+)/);
  const domain = parseDomainFromText(bodyText);
  let stem = parseStemFromText(bodyText);

  const h3s = [...document.querySelectorAll("h3")].map((h) => h.textContent.trim());
  const h3Stem = h3s.find((t) => t !== "Explanation" && t.length > 40);
  if (h3Stem) stem = h3Stem;

  const labels = [...document.querySelectorAll('label[for^="option-"]')];
  const options = labels.map((label, i) => {
    const letter = String.fromCharCode(65 + i);
    const radio = label.querySelector('[role="radio"]');
    const raw =
      label.querySelector("span")?.textContent?.trim() ||
      radio?.getAttribute("value") ||
      "";
    const text = raw.replace(/^[A-Z][\)\uFF09]\s*/, "");
    const accordion = label.nextElementSibling;
    const explanationPanel = accordion?.querySelector('[role="region"]');
    const explanation = explanationPanel?.textContent?.trim() || "";
    const icon = accordion?.querySelector("svg.lucide-circle-check, svg.lucide-circle-x");
    const isCorrect =
      !!icon?.classList.contains("lucide-circle-check") ||
      /^this is the correct/i.test(explanation) ||
      /is the correct answer/i.test(explanation) ||
      /is correct because/i.test(explanation);
    const isIncorrect =
      !!icon?.classList.contains("lucide-circle-x") ||
      /^this option is incorrect/i.test(explanation) ||
      /^this is an incorrect/i.test(explanation);

    return { letter, text, explanation, isCorrect, isIncorrect };
  });

  const correct = options.filter((o) => o.isCorrect).map((o) => o.letter);
  const multi = correct.length > 1 || /choose (two|three|four|2|3|4)/i.test(stem);

  return {
    questionNum: qMatch ? Number(qMatch[1]) : null,
    total: qMatch ? Number(qMatch[2]) : null,
    domain,
    stem,
    options,
    correct,
    multi,
  };
}

export function domainToNumber(domain) {
  const m = String(domain || "").match(/^(\d+)\./);
  return m ? Number(m[1]) : null;
}

export function subdomainSortKey(subdomain) {
  const m = String(subdomain || "").match(/^(\d+)\.(\d+)/);
  if (!m) return [999, 999, String(subdomain || "")];
  return [Number(m[1]), Number(m[2]), String(subdomain || "")];
}

export function sortQuestions(questions) {
  return [...questions].sort((a, b) => {
    const da = domainToNumber(a.domain) ?? domainToNumber(a.subdomain) ?? 999;
    const db = domainToNumber(b.domain) ?? domainToNumber(b.subdomain) ?? 999;
    if (da !== db) return da - db;
    const [a1, a2, as] = subdomainSortKey(a.subdomain);
    const [b1, b2, bs] = subdomainSortKey(b.subdomain);
    if (a1 !== b1) return a1 - b1;
    if (a2 !== b2) return a2 - b2;
    return as.localeCompare(bs) || String(a.stem || "").localeCompare(String(b.stem || ""));
  });
}

export function buildWhy(options) {
  return options
    .map((o) => {
      if (!o.explanation) return "";
      return `${o.letter}) ${o.explanation}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

export function toAipQuestion(q, index, startIndex = 0) {
  const domainNum = domainToNumber(q.domain) ?? domainToNumber(q.subdomain);
  const globalIndex = startIndex + index;
  const options = q.options || [];
  const optionExplanations = options.map((o) => ({
    id: o.letter,
    correct: o.isCorrect,
    incorrect: o.isIncorrect,
    text: o.explanation,
  }));
  return {
    id: `cs-${String(globalIndex + 1).padStart(3, "0")}`,
    source: "certsafari",
    page: Math.floor(globalIndex / 10) + 1,
    domain: domainNum,
    subdomain: q.domain,
    stem: q.stem,
    choices: options.map((o) => ({ id: o.letter, text: o.text })),
    correct: q.correct,
    why: buildWhy(options),
    optionExplanations,
    badges: ["CERTSAFARI", domainNum ? `DOMAIN ${domainNum}` : "DOMAIN"],
    ...(q.multi ? { multi: true } : {}),
  };
}

function formatQuestion(item) {
  const parts = [
    `id: ${JSON.stringify(item.id)}`,
    `source: ${JSON.stringify(item.source)}`,
    `page: ${item.page}`,
    `domain: ${item.domain}`,
    `subdomain: ${JSON.stringify(item.subdomain)}`,
    `stem: ${JSON.stringify(item.stem)}`,
    `choices: ${JSON.stringify(item.choices)}`,
    `correct: ${JSON.stringify(item.correct)}`,
    `why: ${JSON.stringify(item.why)}`,
    `optionExplanations: ${JSON.stringify(item.optionExplanations)}`,
    `badges: ${JSON.stringify(item.badges)}`,
  ];
  if (item.multi) parts.push("multi: true");
  return "  {\n    " + parts.join(",\n    ") + "\n  }";
}

export function writeQuestionJs(questions, outFile, startIndex = 0) {
  const items = questions.map((q, i) => toAipQuestion(q, i, startIndex));
  const js = `AIP.registerQuestions([\n${items.map(formatQuestion).join(",\n")}\n]);\n`;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, js);
  return items;
}

export function writeQuestionPages(questions, outDir, prefix, startIndex = 0, startPage = 1) {
  fs.mkdirSync(outDir, { recursive: true });
  const pageSize = 10;
  const pages = Math.ceil(questions.length / pageSize);
  const allItems = [];
  for (let p = 0; p < pages; p++) {
    const slice = questions.slice(p * pageSize, (p + 1) * pageSize);
    const items = slice.map((q, i) => toAipQuestion(q, p * pageSize + i, startIndex));
    allItems.push(...items);
    const outFile = path.join(outDir, `${prefix}-p${String(startPage + p).padStart(2, "0")}.js`);
    const js = `AIP.registerQuestions([\n${items.map(formatQuestion).join(",\n")}\n]);\n`;
    fs.writeFileSync(outFile, js);
  }
  return allItems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const jsonPath = process.argv[2];
  const outPath = process.argv[3];
  const startIndex = Number(process.argv[4] || 0);
  const startPage = Number(process.argv[5] || 1);
  if (!jsonPath || !outPath) {
    console.error("Usage: node certsafari-transform.mjs <input.json> <output.js|output-dir> [startIndex] [startPage]");
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  let items;
  if (outPath.endsWith(".js")) {
    items = writeQuestionJs(raw, outPath, startIndex);
  } else {
    items = writeQuestionPages(raw, outPath, "certsafari", startIndex, startPage);
  }
  console.log(`Wrote ${items.length} questions to ${outPath} (ids from cs-${String(startIndex + 1).padStart(3, "0")})`);
}
