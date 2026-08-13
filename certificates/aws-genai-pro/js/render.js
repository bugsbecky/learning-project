window.AIP = window.AIP || {};

AIP.escape = function (s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

AIP.badgeClass = function (badge) {
  var b = String(badge).toUpperCase();
  if (b.indexOf("DOMAIN 1") !== -1) return "d1";
  if (b.indexOf("DOMAIN 2") !== -1) return "d2";
  if (b.indexOf("DOMAIN 3") !== -1) return "d3";
  if (b.indexOf("DOMAIN 4") !== -1) return "d4";
  if (b.indexOf("DOMAIN 5") !== -1) return "d5";
  if (b.indexOf("WEIGHT") !== -1 || b.indexOf("%") !== -1) return "weight";
  if (b === "CORE") return "core";
  if (b === "IMPORTANT") return "important";
  if (b === "AWARENESS") return "awareness";
  if (b.indexOf("EXAM") !== -1) return "exam";
  if (b.indexOf("ARCHITECTURE") !== -1) return "arch";
  return "";
};

AIP.renderBadges = function (list) {
  var seen = {};
  return (list || []).filter(function (b) {
    if (!b) return false;
    var key = String(b).trim().toUpperCase();
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  }).map(function (b) {
    return '<span class="badge ' + AIP.badgeClass(b) + '">' + AIP.escape(b) + "</span>";
  }).join("");
};

AIP.domainDash = function () {
  return '<div class="domain-dash">' + (AIP.DOMAINS || []).map(function (d) {
    return '<div class="domain-card d' + d.id + '"><div class="pct">' + d.pct + '%</div><div class="name">Domain ' + d.id + '<br>' + AIP.escape(d.short) + '</div><div class="bar"><i></i></div></div>';
  }).join("") + "</div>";
};

AIP.stageLabel = function (stageId) {
  var list = AIP.JOURNEY || [];
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].id === stageId) return list[i].label;
  }
  return stageId || "";
};

AIP.domainMeta = function (domainId) {
  var list = AIP.DOMAINS || [];
  for (var i = 0; i < list.length; i++) {
    if (String(list[i].id) === String(domainId)) return list[i];
  }
  return null;
};

AIP.renderArchitecturePath = function (stageId) {
  var paths = AIP.ARCHITECTURE_PATHS || {};
  var steps = paths[stageId] || paths.default || [];
  if (!steps.length) return "";
  var html = '<section class="context-bar" aria-labelledby="architecture-context-title">';
  html += '<div class="context-copy"><span class="section-kicker">Architecture path</span><h2 id="architecture-context-title">Where this topic sits</h2></div>';
  html += '<div class="architecture-scroll"><div class="architecture-path" role="list" aria-label="Enterprise Knowledge Assistant request path">';
  steps.forEach(function (step, i) {
    if (i) html += '<span class="architecture-arrow" aria-hidden="true">' + AIP.escape(step.arrow || "→") + "</span>";
    var current = step.id === stageId;
    html += '<span class="architecture-node' + (current ? " current" : "") + '" role="listitem">';
    if (current) html += '<span class="architecture-current">Current</span>';
    html += AIP.escape(step.label) + "</span>";
  });
  html += "</div></div></section>";
  return html;
};

AIP.renderPathChip = function (stageId) {
  var label = AIP.stageLabel(stageId);
  if (!label) return "";
  return '<span class="path-chip"><span class="path-k">Path</span><span class="path-v">' + AIP.escape(label) + "</span></span>";
};

AIP.renderPathPills = function (currentStage) {
  var steps = AIP.JOURNEY || [];
  var html = '<div class="path-pills" aria-label="Request path">';
  steps.forEach(function (step, i) {
    if (i) html += '<span class="path-sep" aria-hidden="true">›</span>';
    var cls = step.id === currentStage ? " current" : "";
    html += '<span class="path-pill' + cls + '">' + AIP.escape(step.label) + "</span>";
  });
  html += "</div>";
  return html;
};

AIP.renderWalk = function (steps) {
  if (!steps || !steps.length) return "";
  return '<ol class="walk">' + steps.map(function (s) {
    return "<li>" + AIP.escape(s) + "</li>";
  }).join("") + "</ol>";
};

AIP.renderWorkflow = function (steps) {
  if (!steps || !steps.length) return "";
  return '<ol class="workflow-steps">' + steps.map(function (step) {
    return "<li><span>" + AIP.escape(step) + "</span></li>";
  }).join("") + "</ol>";
};

AIP.joinList = function (val) {
  if (val == null || val === "") return "";
  if (Array.isArray(val)) return val.filter(Boolean).join(" · ");
  return String(val);
};

AIP.renderService = function (svc) {
  if (!svc) return "";
  var imp = String(svc.importance || "CORE").toLowerCase();
  var html = '<article class="component-card ' + AIP.escape(imp) + '">';
  html += '<header><h3>' + AIP.escape(svc.name) + '</h3>' + AIP.renderBadges([svc.importance || "CORE"]) + "</header>";
  if (svc.solves) html += '<p class="component-summary">' + AIP.escape(svc.solves) + "</p>";
  if (svc.how) html += '<p class="component-role"><strong>In Maya\'s app:</strong> ' + AIP.escape(svc.how) + "</p>";
  html += '<dl class="component-io">';
  html += '<div><dt>Goes in</dt><dd>' + AIP.escape(svc.input || "—") + "</dd></div>";
  html += '<div><dt>Comes out</dt><dd>' + AIP.escape(svc.output || "—") + "</dd></div>";
  html += '<div><dt>Connects to</dt><dd>' + AIP.escape(AIP.joinList(svc.connects) || "—") + "</dd></div>";
  html += "</dl></article>";
  return html;
};

AIP.renderAlts = function (alts) {
  if (!alts || !alts.length) return "";
  var rows = alts.map(function (a) {
    if (!a) return "";
    return '<tr><td>' + AIP.escape(a.option) + '</td><td>' + AIP.escape(a.when) + '</td><td>' + AIP.escape(a.pros) + '</td><td>' + AIP.escape(a.cons) + '</td></tr>';
  }).join("");
  return '<div class="table-card"><div class="table-scroll"><table class="decision-table"><caption class="sr-only">Decision matrix</caption><thead><tr><th>Option</th><th>Choose when…</th><th>Advantage</th><th>Trade-off</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
};

AIP.renderSections = function (sections) {
  if (!sections || !sections.length) return "";
  var body = sections.map(function (sec) {
    if (!sec) return "";
    var html = '<article class="detail-card"><h3>' + AIP.escape(sec.heading || "") + "</h3>";
    (sec.paragraphs || []).forEach(function (p) {
      html += '<p>' + AIP.escape(p) + '</p>';
    });
    var bullets = sec.bullets;
    if (typeof bullets === "string" && bullets) bullets = [bullets];
    if (bullets && bullets.length) {
      html += '<ul>' + bullets.map(function (b) { return '<li>' + AIP.escape(b) + '</li>'; }).join("") + '</ul>';
    }
    html += "</article>";
    return html;
  }).join("");
  return '<details class="supporting-details"><summary>Extra context for deeper study</summary><div class="detail-grid">' + body + "</div></details>";
};

AIP.chapterMemory = function (ch) {
  var configured = AIP.MUST_MEMORIZE && AIP.MUST_MEMORIZE[ch.id];
  if (configured && configured.length) return configured.slice(0, 4);

  var items = [];
  (ch.sections || []).forEach(function (section) {
    if (items.length >= 4 || !section) return;
    var detail = (section.bullets && section.bullets[0]) || (section.paragraphs && section.paragraphs[0]) || "";
    items.push((section.heading ? section.heading + ": " : "") + detail);
  });
  (ch.services || []).forEach(function (service) {
    if (items.length >= 4 || !service) return;
    items.push(service.name + ": " + (service.solves || service.how || ""));
  });
  (ch.examAsks || []).forEach(function (clue) {
    if (items.length < 3) items.push(clue);
  });
  return items.slice(0, 4);
};

AIP.renderSectionTitle = function (number, kicker, title) {
  return '<header class="section-title"><span class="section-number" aria-hidden="true">' + AIP.escape(number) + '</span><div><span class="section-kicker">' + AIP.escape(kicker) + "</span><h2>" + AIP.escape(title) + "</h2></div></header>";
};

AIP.renderChapter = function (ch) {
  if (!ch) return '<div class="card"><h3>Chapter not found</h3></div>';
  var meta = AIP.findChapterMeta(ch.id) || ch;
  var domain = AIP.domainMeta(meta.domain);
  var badges = [
    meta.domain != null ? "DOMAIN " + meta.domain : null,
    meta.importance,
    domain ? domain.pct + "% EXAM WEIGHT" : null
  ].concat(meta.badges || []);
  var summary = (AIP.TOPIC_SUMMARIES && AIP.TOPIC_SUMMARIES[ch.id]) || ch.summary || "";
  var html = '<article class="topic-page">';
  html += '<header class="topic-header"><div class="topic-eyebrow">Chapter ' + AIP.escape(meta.id) + " · AIP-C01</div>";
  html += '<h1>' + AIP.escape(meta.id) + ". " + AIP.escape(meta.title || "") + "</h1>";
  html += '<p class="topic-summary">' + AIP.escape(summary) + "</p>";
  html += '<div class="badge-row" aria-label="Topic metadata">' + AIP.renderBadges(badges) + "</div></header>";

  html += AIP.renderArchitecturePath(meta.stage);

  html += '<section class="topic-section" id="why">';
  html += AIP.renderSectionTitle("01", "The why", "Problem & solution");
  html += '<div class="why-grid"><article class="why-card problem"><div class="card-label">Problem</div><p>' + AIP.escape(ch.problem || "") + '</p></article>';
  html += '<article class="why-card solution"><div class="card-label">Solution</div><p>' + AIP.escape(ch.why || "") + "</p></article></div></section>";

  html += '<section class="topic-section" id="how-it-works">';
  html += AIP.renderSectionTitle("02", "How it works", "One request, step by step");
  html += '<div class="how-layout"><article class="story-card"><div class="card-label">Enterprise Knowledge Assistant</div><p>' + AIP.escape(ch.assistant || "") + "</p></article>";
  html += '<div class="workflow-card">' + AIP.renderWorkflow(ch.walkthrough) + "</div></div></section>";

  if (ch.services && ch.services.length) {
    html += '<section class="topic-section" id="core-components">';
    html += AIP.renderSectionTitle("03", "Core components", "Break it down");
    html += '<div class="component-grid">';
    ch.services.forEach(function (s) { html += AIP.renderService(s); });
    html += "</div></section>";
  }

  if (ch.alternatives && ch.alternatives.length) {
    html += '<section class="topic-section" id="decision-matrix">';
    html += AIP.renderSectionTitle("04", "The when", "Decision matrix");
    html += AIP.renderAlts(ch.alternatives) + "</section>";
  }

  html += '<section class="topic-section" id="exam-clues">';
  html += AIP.renderSectionTitle("05", "Exam clues & real world", "Recognize the decision");
  html += '<div class="exam-real-grid">';
  if (ch.examAsks && ch.examAsks.length) {
    html += '<article class="exam-clue-card"><div class="card-label">Exam clues</div><ul>' + ch.examAsks.map(function (x) {
      return "<li>" + AIP.escape(x) + "</li>";
    }).join("") + "</ul></article>";
  }
  html += '<article class="real-world-card"><div class="card-label">In Maya\'s app</div><p>' + AIP.escape(ch.realApp || ch.assistant || "") + "</p></article>";
  html += "</div></section>";

  var memory = AIP.chapterMemory(ch);
  html += '<section class="topic-section" id="must-memorize">';
  html += AIP.renderSectionTitle("06", "Exam summary", "Must memorize");
  html += '<div class="memory-card"><ul class="memory-list">' + memory.map(function (item) {
    return '<li><span class="memory-check" aria-hidden="true"></span><span>' + AIP.escape(item) + "</span></li>";
  }).join("") + "</ul>";
  html += AIP.renderSections(ch.sections) + "</div></section>";

  var done = AIP.storage.isDone(ch.id);
  var idx = (AIP.CHAPTERS || []).findIndex(function (c) { return c.id === ch.id; });
  html += '<footer class="chapter-footer"><div class="completion-actions">';
  html += '<button type="button" class="btn primary complete-btn" data-act="toggle-done" aria-pressed="' + (done ? "true" : "false") + '">' + (done ? "✓ Chapter complete" : "Mark as complete") + "</button>";
  html += '<a class="btn" href="#/quiz/' + AIP.escape(ch.id) + '">Practice chapter</a></div>';
  html += '<nav class="chapter-nav" aria-label="Chapter navigation">';
  if (idx > 0) {
    var previous = AIP.CHAPTERS[idx - 1];
    html += '<a class="chapter-link previous" href="#/chapter/' + previous.id + '"><span>← Previous</span><strong>' + AIP.escape(previous.id + ". " + previous.title) + "</strong></a>";
  }
  if (idx >= 0 && idx < AIP.CHAPTERS.length - 1) {
    var next = AIP.CHAPTERS[idx + 1];
    html += '<a class="chapter-link next" href="#/chapter/' + next.id + '"><span>Next →</span><strong>' + AIP.escape(next.id + ". " + next.title) + "</strong></a>";
  }
  html += "</nav></footer></article>";
  return html;
};

AIP.renderHome = function () {
  var n = AIP.storage.completedCount();
  var total = (AIP.CHAPTERS || []).length;
  var person = (AIP.APP && AIP.APP.person) || "Maya";
  var summary = AIP.bankSummary ? AIP.bankSummary() : { total: (AIP.questions || []).length, certsafari: 0, practice: 0, examtopics: 0 };
  var html = '<div class="hero"><div class="badge-row"><span class="badge exam">AIP-C01</span><span class="badge arch">LEARN BY EXAMPLE</span><span class="badge core">COMPANY KNOWLEDGE ASSISTANT</span></div>';
  html += '<h1>Learn <em>AWS Generative AI</em> with one real story</h1>';
  html += '<p class="lede">You will follow one employee named ' + AIP.escape(person) + '. She asks a company chat for help. Each chapter adds one piece of that chat. You do not need to already know every AWS product. We explain each piece with a simple example first.</p></div>';
  html += AIP.domainDash();
  html += '<div class="stats-grid"><div class="stat"><div class="n">' + n + '/' + total + '</div><div class="l">Chapters done</div></div>';
  html += '<div class="stat"><div class="n">' + summary.certsafari + '</div><div class="l">CertSafari questions</div></div>';
  html += '<div class="stat"><div class="n">' + summary.total + '</div><div class="l">Total question bank</div></div>';
  html += '<div class="stat"><div class="n">750</div><div class="l">Passing score</div></div></div>';
  html += '<div class="example"><div class="k">The story used on every page</div><p><strong>' + AIP.escape(person) + '</strong> uses the <strong>' + AIP.escape((AIP.APP && AIP.APP.name) || "") + '</strong>. That is an internal chat. It answers from private company files. It must name its sources. It must hide files Maya cannot see. It must not train public models on those files. Sometimes it must open a ticket. It must stay cheap enough to run.</p><ul>' + (AIP.APP.asks || []).map(function (q) { return '<li>' + AIP.escape(q) + '</li>'; }).join("") + '</ul></div>';
  html += '<div class="card"><h3>How to study</h3><p>Read chapters in order. After the example, try to retell it in your own words. Mark a topic done when you can explain the choice, not only the product name. Then run the chapter quiz.</p></div>';
  html += '<h2 class="display">Maya\'s question moves through these steps</h2>' + AIP.renderPathPills("user");
  html += '<div class="chapter-actions"><a class="btn primary" href="#/chapter/00">Start at 00. Architecture Overview</a><a class="btn" href="#/bank">Question bank</a><a class="btn" href="#/exam">Full mock exam</a><a class="btn" href="#/stats">Question stats</a></div>';
  return html;
};
