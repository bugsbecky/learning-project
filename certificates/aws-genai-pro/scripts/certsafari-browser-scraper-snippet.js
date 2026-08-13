// Injected into CertSafari quiz page via CDP Runtime.evaluate (awaitPromise: true)
export function scraperSource() {
  return `(() => {
    function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
    function parseDomain(bodyText){
      const m = bodyText.match(/\\n(\\d+\\.\\d+ [^\\n]+)\\n/);
      return m ? m[1] : '';
    }
    function parseStem(bodyText){
      const domain = parseDomain(bodyText);
      if(!domain) return '';
      const idx = bodyText.indexOf(domain);
      const after = bodyText.slice(idx + domain.length).trim();
      const end = after.search(/\\nA[\\)\\uFF09]/);
      return (end === -1 ? after : after.slice(0, end)).trim();
    }
    function expandAll(){
      document.querySelectorAll('button').forEach(b=>{
        if(b.textContent.trim()==='Explanation' && b.getAttribute('aria-expanded')==='false') b.click();
      });
    }
    function extract(){
      expandAll();
      const bodyText = document.body.innerText;
      const qMatch = bodyText.match(/Question (\\d+) of (\\d+)/);
      const domain = parseDomain(bodyText);
      let stem = parseStem(bodyText);
      const h3Stem = [...document.querySelectorAll('h3')].map(h=>h.textContent.trim()).find(t=>t!=='Explanation'&&t.length>40);
      if(h3Stem) stem = h3Stem;
      const labels = [...document.querySelectorAll('label[for^=\"option-\"]')];
      const options = labels.map((label,i)=>{
        const letter = String.fromCharCode(65+i);
        const radio = label.querySelector('[role=\"radio\"]');
        const raw = (label.textContent || radio?.getAttribute('value') || '').trim();
        const text = raw.replace(/^[A-Z][\\)\\uFF09]\\s*/,'').replace(/\\s+/g,' ').trim();
        const accordion = label.nextElementSibling;
        const explanationPanel = accordion?.querySelector('[role=\"region\"]');
        const explanation = explanationPanel?.textContent?.trim() || '';
        const icon = accordion?.querySelector('svg.lucide-circle-check, svg.lucide-circle-x');
        const isCorrect = !!icon?.classList.contains('lucide-circle-check') || /^this is the correct/i.test(explanation) || /is the correct answer/i.test(explanation) || /is correct because/i.test(explanation);
        const isIncorrect = !!icon?.classList.contains('lucide-circle-x') || /^this option is incorrect/i.test(explanation) || /^this is an incorrect/i.test(explanation);
        return { letter, text, explanation, isCorrect, isIncorrect };
      });
      const correct = options.filter(o=>o.isCorrect).map(o=>o.letter);
      return {
        questionNum: qMatch ? Number(qMatch[1]) : null,
        total: qMatch ? Number(qMatch[2]) : null,
        domain, stem, options, correct,
        multi: correct.length > 1 || /choose (two|three|four|2|3|4)/i.test(stem)
      };
    }
    async function submitIfNeeded(){
      const submit = [...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Submit Answer');
      if(submit && !submit.disabled){
        document.querySelector('[role=\"radio\"]:not([disabled])')?.click();
        await sleep(250);
        submit.click();
        await sleep(1200);
      }
    }
    async function nextQ(){
      const btn = [...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Next Question');
      if(!btn) return false;
      btn.click();
      await sleep(1200);
      return true;
    }
    async function scrapeRemaining(maxCount){
      const store = JSON.parse(localStorage.getItem('__csScrape') || '[]');
      const seen = new Set(store.map(q=>q.stem.slice(0,100)));
      let added = 0;
      while(added < maxCount){
        await submitIfNeeded();
        await sleep(400);
        const q = extract();
        if(q.stem && !seen.has(q.stem.slice(0,100))){
          store.push(q);
          seen.add(q.stem.slice(0,100));
          added++;
        }
        const cur = extract();
        if(cur.questionNum === cur.total) break;
        if(!await nextQ()) break;
      }
      localStorage.setItem('__csScrape', JSON.stringify(store));
      return { added, total: store.length, last: store[store.length-1] };
    }
    return scrapeRemaining(${arguments[0] || 60});
  })()`;
}
