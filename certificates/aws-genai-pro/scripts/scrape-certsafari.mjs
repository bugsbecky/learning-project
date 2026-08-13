import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_JSON = path.join(__dirname, "../js/questions/raw/certsafari-quiz-60.json");
const QUESTION_COUNT = 60;
const EXAM_URL = "https://www.certsafari.com/aws/gen-ai-developer-professional";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function extractQuestion(page) {
  return page.evaluate(() => {
    function expandAll() {
      document.querySelectorAll('button').forEach((b) => {
        if (b.textContent.trim() === "Explanation" && b.getAttribute("aria-expanded") === "false") {
          b.click();
        }
      });
    }
    expandAll();

    const bodyText = document.body.innerText;
    const qMatch = bodyText.match(/Question (\d+) of (\d+)/);
    const domainMatch = bodyText.match(/\n(\d+\.\d+ [^\n]+)\n/);

    const h3s = [...document.querySelectorAll("h3")].map((h) => h.textContent.trim());
    const stem = h3s.find((t) => t !== "Explanation" && t.length > 40) || h3s[0] || "";

    const labels = [...document.querySelectorAll('label[for^="option-"]')];
    const options = labels.map((label, i) => {
      const letter = String.fromCharCode(65 + i);
      const radio = label.querySelector('[role="radio"]');
      const optionText =
        label.querySelector("span")?.textContent?.trim() ||
        radio?.getAttribute("value")?.replace(/^[A-Z]\)\s*/, "") ||
        "";
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

      return {
        letter,
        text: optionText.replace(/^[A-Z]\)\s*/, ""),
        explanation,
        isCorrect,
        isIncorrect,
      };
    });

    const correct = options.filter((o) => o.isCorrect).map((o) => o.letter);
    const multi = correct.length > 1 || /choose (two|three|four|2|3|4)/i.test(stem);

    return {
      questionNum: qMatch ? Number(qMatch[1]) : null,
      total: qMatch ? Number(qMatch[2]) : null,
      domain: domainMatch ? domainMatch[1] : "",
      stem,
      options,
      correct,
      multi,
    };
  });
}

async function startQuiz(page, count) {
  await page.goto(EXAM_URL, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1500);

  await page.evaluate(() => {
    const startBtn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Start quiz");
    startBtn?.click();
  });
  await sleep(1000);

  await page.evaluate((count) => {
    const input = document.querySelector('input[type="number"]');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(input, String(count));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, count);
  await sleep(300);

  await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], [data-state="open"]');
    const btns = dialog ? [...dialog.querySelectorAll("button")] : [...document.querySelectorAll("button")];
    const start = btns.find((b) => b.textContent.trim() === "Start Quiz" && !b.disabled);
    start?.click();
  });

  await page.waitForFunction(
    () => location.pathname.includes("/quiz/") && document.body.innerText.includes("Question 1 of"),
    { timeout: 60000 }
  );
  await sleep(1000);

  const header = await page.evaluate(() => {
    const m = document.body.innerText.match(/Question 1 of (\d+)/);
    return m ? Number(m[1]) : null;
  });
  return header;
}

async function processQuestion(page) {
  await page.waitForSelector('label[for^="option-"]', { timeout: 30000 });
  await sleep(500);

  const submitVisible = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Submit Answer");
    return !!btn && !btn.disabled;
  });

  if (submitVisible) {
    await page.evaluate(() => {
      const first = document.querySelector('[role="radio"]:not([disabled])');
      first?.click();
    });
    await sleep(200);
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Submit Answer");
      btn?.click();
    });
    await page.waitForFunction(
      () => [...document.querySelectorAll("button")].some((b) => b.textContent.trim() === "Next Question"),
      { timeout: 30000 }
    );
    await sleep(800);
  }

  const data = await extractQuestion(page);
  return data;
}

async function clickNext(page) {
  const hasNext = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Next Question");
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  return hasNext;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const actualCount = await startQuiz(page, QUESTION_COUNT);
  console.log(`Quiz started with ${actualCount ?? "?"} questions (requested ${QUESTION_COUNT})`);

  const questions = [];
  const seenStems = new Set();

  for (let i = 0; i < (actualCount || QUESTION_COUNT); i++) {
    const q = await processQuestion(page);
    const key = q.stem.slice(0, 120);
    if (!seenStems.has(key)) {
      seenStems.add(key);
      questions.push(q);
      console.log(`[${questions.length}] domain=${q.domain} correct=${q.correct.join(",")}`);
    } else {
      console.log(`[skip duplicate] ${key.slice(0, 60)}...`);
    }

    const hasNext = await clickNext(page);
    if (!hasNext) break;
    await sleep(700);
  }

  await browser.close();

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(questions, null, 2));
  console.log(`Saved ${questions.length} questions to ${OUT_JSON}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
