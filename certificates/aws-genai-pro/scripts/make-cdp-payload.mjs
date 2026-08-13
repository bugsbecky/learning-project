#!/usr/bin/env node
import fs from "fs";
import { buildBatchScraper } from "./certsafari-batch-scraper.mjs";

const batch = Number(process.argv[2] || 1);
const reset = batch === 1;
const expr = buildBatchScraper(15, reset);
const payload = {
  method: "Runtime.evaluate",
  params: {
    expression: expr,
    awaitPromise: true,
    returnByValue: true,
  },
};
fs.writeFileSync(`/tmp/cs-cdp-batch-${batch}.json`, JSON.stringify(payload));
console.log(`Batch ${batch} payload: ${JSON.stringify(payload).length} bytes`);
