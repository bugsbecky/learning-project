#!/usr/bin/env node
import fs from "fs";
import { buildBatchScraper } from "./certsafari-batch-scraper.mjs";

const batchSize = Number(process.argv[2] || 60);
const reset = process.argv[3] !== "continue";
const expr = buildBatchScraper(batchSize, reset);
const payload = {
  method: "Runtime.evaluate",
  params: {
    expression: expr,
    awaitPromise: true,
    returnByValue: true,
  },
};
const out = process.argv[4] || `/tmp/cs-cdp-full-${batchSize}.json`;
fs.writeFileSync(out, JSON.stringify(payload));
console.log(JSON.stringify({ out, bytes: JSON.stringify(payload).length, batchSize, reset }));
