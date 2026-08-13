export function buildBatchScraper(batchSize, reset = false) {
  return `(async () => {
    function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
    function parseDomain(bodyText){
      const m = bodyText.match(/\\n(\\d+\\.\\d+ [^\\n]+)\\n/);
      return m ? m[1] : '';
    }
    function cleanStem(stem){
      return stem
        .replace(/\\n\\n(Correct!|Incorrect)[\\s\\S]*$/i, '')
        .replace(/\\n\\nReview the explanations[\\s\\S]*$/i, '')
        .trim();
    }
    function parseStem(bodyText){
      const domain = parseDomain(bodyText);
      if(!domain) return '';
      const idx = bodyText.indexOf(domain);
      const after = bodyText.slice(idx + domain.length).trim();
      const end = after.search(/\\nA[\\)\\uFF09]/);
      return cleanStem(end === -1 ? after : after.slice(0, end));
    }
    function expandAll(){
      document.querySelectorAll('button').forEach(b => {
        if(b.textContent.trim() === 'Explanation' && b.getAttribute('aria-expanded') === 'false') b.click();
      });
    }
    function extract(){
      expandAll();
      const bodyText = document.body.innerText;
      const qMatch = bodyText.match(/Question (\\d+) of (\\d+)/);
      const domain = parseDomain(bodyText);
      let stem = parseStem(bodyText);
      const h3Stem = [...document.querySelectorAll('h3')]
        .map(h => h.textContent.trim())
        .find(t => t !== 'Explanation' && t.length > 20);
      if(h3Stem) stem = cleanStem(h3Stem);
      const labels = [...document.querySelectorAll('label[for^="option-"]')];
      const options = labels.map((label, i) => {
        const letter = String.fromCharCode(65 + i);
        const raw = (label.textContent || '').trim();
        const text = raw.replace(/^[A-Z][\\)\\uFF09]\\s*/, '').replace(/\\s+/g, ' ').trim();
        const accordion = label.nextElementSibling;
        const explanationPanel = accordion?.querySelector('[role="region"]');
        const explanation = explanationPanel?.textContent?.trim() || '';
        const icon = accordion?.querySelector('svg.lucide-circle-check, svg.lucide-circle-x');
        const isCorrect = !!icon?.classList.contains('lucide-circle-check')
          || /^this is the correct/i.test(explanation)
          || /is the correct answer/i.test(explanation)
          || /is correct because/i.test(explanation);
        const isIncorrect = !!icon?.classList.contains('lucide-circle-x')
          || /^this option is incorrect/i.test(explanation)
          || /^this is an incorrect/i.test(explanation);
        return { letter, text, explanation, isCorrect, isIncorrect };
      });
      const correct = options.filter(o => o.isCorrect).map(o => o.letter);
      return {
        questionNum: qMatch ? Number(qMatch[1]) : null,
        total: qMatch ? Number(qMatch[2]) : null,
        domain,
        stem,
        options,
        correct,
        multi: correct.length > 1 || /choose (two|three|four|2|3|4)/i.test(stem)
      };
    }
    async function submitIfNeeded(){
      const submit = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Submit Answer'));
      if(!submit) return false;
      if(submit.disabled){
        document.querySelector('label[for^="option-"]')?.click();
        await sleep(500);
      }
      if(!submit.disabled){
        submit.click();
        await sleep(2200);
        expandAll();
        await sleep(400);
        return true;
      }
      return false;
    }
    async function nextQ(){
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Next Question'));
      if(!btn) return false;
      btn.click();
      await sleep(2200);
      return true;
    }
    ${reset ? "localStorage.setItem('__csScrape60', '[]');" : ""}
    let store = JSON.parse(localStorage.getItem('__csScrape60') || '[]');
    const seen = new Set(store.map(q => q.stem.slice(0, 120)));
    let added = 0;
    for(let i = 0; i < ${batchSize}; i++){
      await submitIfNeeded();
      const q = extract();
      if(q.stem && !seen.has(q.stem.slice(0, 120))){
        store.push(q);
        seen.add(q.stem.slice(0, 120));
        added++;
      }
      const cur = extract();
      if(cur.questionNum === cur.total){
        localStorage.setItem('__csScrape60', JSON.stringify(store));
        return { done: true, added, total: store.length, lastNum: cur.questionNum, quizTotal: cur.total };
      }
      if(!await nextQ()){
        localStorage.setItem('__csScrape60', JSON.stringify(store));
        return { done: false, added, total: store.length, curNum: cur.questionNum, reason: 'no next' };
      }
    }
    localStorage.setItem('__csScrape60', JSON.stringify(store));
    const cur = extract();
    return { done: false, added, total: store.length, curNum: cur.questionNum, quizTotal: cur.total };
  })()`;
}
