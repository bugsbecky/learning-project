#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { writeQuestionPages, sortQuestions } from "./certsafari-transform.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RAW_DIR = path.join(ROOT, "js/questions/raw");
const OUT_DIR = path.join(ROOT, "js/questions");
const MASTER = path.join(RAW_DIR, "certsafari-all.json");

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function dedupeByStem(questions) {
  const seen = new Set();
  const out = [];
  for (const q of questions) {
    const key = (q.stem || "").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

function mergeNewBatch(batchPath, batchLabel) {
  const existing = fs.existsSync(MASTER) ? loadJson(MASTER) : [];
  const existingStems = new Set(existing.map((q) => (q.stem || "").trim()));
  const batch = loadJson(batchPath);
  const uniqueInBatch = batch.filter((q) => {
    const stem = (q.stem || "").trim();
    return stem && !existingStems.has(stem);
  });
  const merged = dedupeByStem([...existing, ...uniqueInBatch]);
  fs.writeFileSync(MASTER, JSON.stringify(merged, null, 2));
  console.log(
    `${batchLabel}: scraped ${batch.length}, new ${uniqueInBatch.length}, total ${merged.length}`
  );
  return { existing: existing.length, batch: batch.length, newCount: uniqueInBatch.length, total: merged.length, uniqueInBatch };
}

function regenerateAllPages() {
  const sorted = sortQuestions(loadJson(MASTER));
  fs.writeFileSync(MASTER, JSON.stringify(sorted, null, 2));
  const pageCount = Math.ceil(sorted.length / 10);
  writeQuestionPages(sorted, OUT_DIR, "certsafari", 0, 1);
  console.log(`Regenerated ${pageCount} pages (${sorted.length} questions, cs-001..cs-${String(sorted.length).padStart(3, "0")})`);
  return sorted.length;
}

function validate(all) {
  const ids = new Set();
  const stems = new Set();
  let ok = true;
  for (let i = 0; i < all.length; i++) {
    const q = all[i];
    const id = `cs-${String(i + 1).padStart(3, "0")}`;
    if (!q.stem?.trim()) { console.error(`Missing stem at index ${i}`); ok = false; }
    if (!q.correct?.length) { console.error(`Missing correct at index ${i}`); ok = false; }
    if (!q.options?.every((o) => o.explanation)) { console.error(`Missing explanations at index ${i}`); ok = false; }
    if (stems.has(q.stem.trim())) { console.error(`Duplicate stem at index ${i}`); ok = false; }
    stems.add(q.stem.trim());
    ids.add(id);
  }
  console.log(`Validation: ${all.length} questions, unique stems ${stems.size}, ok=${ok}`);
  return ok;
}

const cmd = process.argv[2];
if (cmd === "merge") {
  const batchPath = process.argv[3];
  const label = process.argv[4] || path.basename(batchPath);
  if (!batchPath) {
    console.error("Usage: node certsafari-merge.mjs merge <batch.json> [label]");
    process.exit(1);
  }
  mergeNewBatch(batchPath, label);
} else if (cmd === "regenerate") {
  regenerateAllPages();
  validate(loadJson(MASTER));
} else if (cmd === "consolidate") {
  const batches = [
    "certsafari-quiz-60.json", "certsafari-quiz-60-batch2.json", "certsafari-quiz-60-batch3.json",
    "certsafari-quiz-60-batch4.json", "certsafari-quiz-60-batch5.json", "certsafari-quiz-60-batch6.json",
    "certsafari-quiz-60-batch7.json", "certsafari-quiz-60-batch8.json", "certsafari-quiz-60-new.json",
  ];
  const seen = new Set();
  const out = [];
  for (const f of batches) {
    const p = path.join(RAW_DIR, f);
    if (!fs.existsSync(p)) continue;
    for (const q of loadJson(p)) {
      if (!Array.isArray(q.options) || !q.stem || !q.domain) continue;
      const s = q.stem.trim();
      if (!s || seen.has(s)) continue;
      seen.add(s);
      out.push(q);
    }
  }
  fs.writeFileSync(MASTER, JSON.stringify(sortQuestions(out), null, 2));
  console.log(`Consolidated ${out.length} unique CertSafari questions`);
  regenerateAllPages();
  validate(loadJson(MASTER));
} else if (cmd === "status") {
  const all = fs.existsSync(MASTER) ? loadJson(MASTER) : [];
  console.log(`Master: ${all.length} / 360 (${Math.round((all.length / 360) * 100)}%)`);
} else {
  console.error("Usage: node certsafari-merge.mjs merge|regenerate|status");
  process.exit(1);
}
