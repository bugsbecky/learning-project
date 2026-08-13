#!/usr/bin/env node
/** Save latest CDP localStorage extract log to a named batch file */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFile = process.argv[2];
const batchName = process.argv[3] || "batch";
if (!logFile) {
  console.error("Usage: node certsafari-save-cdp-log.mjs <cdp-log.json> [batch-label]");
  process.exit(1);
}
const raw = JSON.parse(fs.readFileSync(logFile, "utf8"));
const val = raw.result?.result?.value ?? raw.result?.value;
const data = typeof val === "string" ? JSON.parse(val) : val;
const out = path.join(__dirname, "../js/questions/raw", `certsafari-quiz-60-${batchName}.json`);
fs.writeFileSync(out, JSON.stringify(data, null, 2));
console.log(JSON.stringify({ out, count: data.length }));
