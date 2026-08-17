window.AIP = window.AIP || {};

(function () {
  function subdomainSortKey(subdomain) {
    var m = String(subdomain || "").match(/^(\d+)\.(\d+)/);
    if (!m) return [999, 999, String(subdomain || "")];
    return [Number(m[1]), Number(m[2]), String(subdomain || "")];
  }

  function questionDomain(q) {
    if (q == null) return 999;
    if (q.domain != null && q.domain !== "") return Number(q.domain);
    var m = String(q.subdomain || "").match(/^(\d+)\./);
    return m ? Number(m[1]) : 999;
  }

  function compareQuestions(a, b) {
    var da = questionDomain(a);
    var db = questionDomain(b);
    if (da !== db) return da - db;
    var ak = subdomainSortKey(a.subdomain);
    var bk = subdomainSortKey(b.subdomain);
    if (ak[0] !== bk[0]) return ak[0] - bk[0];
    if (ak[1] !== bk[1]) return ak[1] - bk[1];
    if (ak[2] !== bk[2]) return ak[2].localeCompare(bk[2]);
    return String(a.id || a.stem || "").localeCompare(String(b.id || b.stem || ""));
  }

  function shuffle(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i];
      out[i] = out[j];
      out[j] = t;
    }
    return out;
  }

  function questionState(q, stat) {
    stat = stat || AIP.storage.questionStats(q.id);
    var correct = Number(stat.correct) || 0;
    var wrong = Number(stat.wrong) || 0;
    var attempts = correct + wrong;
    if (!attempts) return "unseen";
    if (wrong > correct || stat.last === "wrong") return "wrong";
    return "correct";
  }

  function priorityQuestions(questions) {
    var stats = AIP.storage.quiz().questions;
    return (questions || []).map(function (q) {
      var stat = stats[q.id] || {};
      var correct = Number(stat.correct) || 0;
      var wrong = Number(stat.wrong) || 0;
      var attempts = correct + wrong;
      var lastAttempt = (stat.attempts || []).length ? stat.attempts[stat.attempts.length - 1] : null;
      var lastAt = lastAttempt && Number(lastAttempt.at) || 0;
      var bucket;
      // New questions always win. Once everything has been seen, missed items
      // come first, with recent misses surfaced again before weak older items.
      if (!attempts) bucket = 0;
      else if (stat.last === "wrong") bucket = 1;
      else if (wrong > correct) bucket = 2;
      else if (wrong > 0) bucket = 3;
      else bucket = 4;
      return {
        q: q,
        bucket: bucket,
        wrong: wrong,
        accuracy: attempts ? correct / attempts : 0,
        lastAt: lastAt,
        tie: Math.random()
      };
    }).sort(function (a, b) {
      if (a.bucket !== b.bucket) return a.bucket - b.bucket;
      if (a.bucket === 0) return a.tie - b.tie;
      if (a.bucket === 1) return b.lastAt - a.lastAt || b.wrong - a.wrong || a.tie - b.tie;
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      if (a.wrong !== b.wrong) return b.wrong - a.wrong;
      return a.lastAt - b.lastAt || a.tie - b.tie;
    }).map(function (item) { return item.q; });
  }

  function matchesFilter(q, filter, stats) {
    if (!filter || filter === "all") return true;
    if (typeof filter === "string") {
      if (filter === "all") return true;
      return AIP.chapterTags(q).indexOf(AIP.padChapterId(filter)) !== -1;
    }
    if (filter.source && String(q.source || "") !== String(filter.source)) return false;
    if (filter.domain != null && questionDomain(q) !== Number(filter.domain)) return false;
    if (filter.subdomain && String(q.subdomain || "") !== String(filter.subdomain)) return false;
    if (filter.id && String(q.id || "") !== String(filter.id)) return false;
    if (filter.status && filter.status !== "all" && questionState(q, stats && stats[q.id]) !== filter.status) return false;
    return true;
  }

  AIP.questionDomain = questionDomain;
  AIP.questionState = questionState;

  AIP.sortQuestions = function (questions) {
    return (questions || []).slice().sort(compareQuestions);
  };

  AIP.questionsBySource = function (source) {
    return AIP.sortQuestions((AIP.questions || []).filter(function (q) {
      return String(q.source || "") === String(source);
    }));
  };

  AIP.filterQuestions = function (filter) {
    var stats = filter && typeof filter === "object" && filter.status ? AIP.storage.quiz().questions : null;
    return AIP.sortQuestions((AIP.questions || []).filter(function (q) {
      return matchesFilter(q, filter, stats);
    }));
  };

  AIP.groupByDomain = function (questions) {
    var groups = {};
    (questions || []).forEach(function (q) {
      var d = questionDomain(q);
      if (!groups[d]) groups[d] = [];
      groups[d].push(q);
    });
    Object.keys(groups).forEach(function (k) {
      groups[k].sort(compareQuestions);
    });
    return groups;
  };

  AIP.groupBySubdomain = function (questions) {
    var groups = {};
    (questions || []).forEach(function (q) {
      var key = String(q.subdomain || "Unknown");
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    });
    Object.keys(groups).forEach(function (k) {
      groups[k].sort(compareQuestions);
    });
    return groups;
  };

  AIP.domainCounts = function (questions) {
    var counts = {};
    (AIP.DOMAINS || []).forEach(function (d) { counts[d.id] = 0; });
    (questions || AIP.questions || []).forEach(function (q) {
      var d = questionDomain(q);
      counts[d] = (counts[d] || 0) + 1;
    });
    return counts;
  };

  AIP.bankSummary = function () {
    var all = AIP.questions || [];
    var bySource = {};
    all.forEach(function (q) {
      var s = String(q.source || "unknown");
      bySource[s] = (bySource[s] || 0) + 1;
    });
    return {
      total: all.length,
      bySource: bySource,
      certsafari: bySource.certsafari || 0,
      practice: bySource.practice || 0,
      examtopics: bySource.examtopics || 0,
      domainCounts: AIP.domainCounts(all)
    };
  };

  AIP.parseExamMode = function (hash) {
    var h = String(hash || location.hash || "");
    var q = h.indexOf("?");
    if (q === -1) return { mode: "all" };
    var params = new URLSearchParams(h.slice(q + 1));
    var mode = params.get("mode") || "all";
    var domain = params.get("domain");
    var source = params.get("source");
    var status = params.get("status");
    var strategy = params.get("strategy");
    var count = Number(params.get("count"));
    var out = { mode: mode };
    if (domain != null && domain !== "") out.domain = Number(domain);
    if (source) out.source = source;
    if (status) out.status = status;
    if (strategy) out.strategy = strategy;
    if (count > 0) out.count = count;
    return out;
  };

  AIP.questionsForExam = function (modeSpec) {
    var spec = modeSpec || { mode: "all" };
    var pool;
    if (spec.id) pool = AIP.filterQuestions({ id: spec.id });
    else if (spec.mode === "certsafari") pool = AIP.questionsBySource("certsafari");
    else if (spec.mode === "random65") pool = shuffle(AIP.sortQuestions(AIP.questions || [])).slice(0, 65);
    else if (spec.domain != null || spec.source || spec.status) pool = AIP.filterQuestions({ domain: spec.domain, source: spec.source, status: spec.status });
    else pool = AIP.sortQuestions(AIP.questions || []);
    if (spec.strategy === "adaptive") pool = priorityQuestions(pool);
    else if (spec.mode !== "random65" && !spec.id) pool = shuffle(pool);
    var count = Number(spec.count);
    if (count > 0 && !spec.id) pool = pool.slice(0, Math.min(Math.floor(count), pool.length));
    return pool;
  };

  AIP.renderBank = function () {
    var summary = AIP.bankSummary();
    var all = AIP.sortQuestions(AIP.questions || []);
    var statsAll = AIP.storage.quiz().questions;
    var attempted = all.filter(function (q) {
      var s = statsAll[q.id] || {};
      return (Number(s.correct) || 0) + (Number(s.wrong) || 0) > 0;
    }).length;
    var html = '<div class="hero"><h1>Question bank</h1>';
    html += '<p class="lede">All imported questions sorted by exam domain and subdomain. CertSafari items keep verbatim stems, choices, and per-option explanations.</p></div>';
    html += '<div class="stats-grid">';
    html += '<div class="stat"><div class="n">' + summary.total + '</div><div class="l">Total questions</div></div>';
    html += '<div class="stat"><div class="n">' + summary.certsafari + '</div><div class="l">CertSafari</div></div>';
    html += '<div class="stat"><div class="n">' + summary.practice + '</div><div class="l">Practice</div></div>';
    html += '<div class="stat"><div class="n">' + attempted + '</div><div class="l">Attempted</div></div>';
    html += '</div>';
    html += '<div class="chapter-actions" style="margin-top:16px">';
    html += '<a class="btn primary" href="#/exam">Full mock exam (sorted)</a>';
    html += '<a class="btn" href="#/exam?mode=certsafari">CertSafari only</a>';
    html += '<a class="btn" href="#/exam?mode=random65">Random 65</a>';
    html += '<a class="btn ghost" href="#/stats">Question stats</a>';
    html += '</div>';
    html += '<div class="card" style="margin-top:20px"><h3>Filter by domain</h3><div class="chapter-actions">';
    (AIP.DOMAINS || []).forEach(function (d) {
      var n = summary.domainCounts[d.id] || 0;
      html += '<a class="btn" href="#/exam?domain=' + d.id + '">Domain ' + d.id + ' (' + n + ')</a>';
    });
    html += '</div></div>';
    var grouped = AIP.groupByDomain(all);
    html += '<div class="bank-groups" style="margin-top:24px">';
    (AIP.DOMAINS || []).forEach(function (d) {
      var items = grouped[d.id] || [];
      if (!items.length) return;
      var subs = AIP.groupBySubdomain(items);
      var subKeys = Object.keys(subs).sort(function (a, b) {
        var ak = subdomainSortKey(a);
        var bk = subdomainSortKey(b);
        if (ak[0] !== bk[0]) return ak[0] - bk[0];
        if (ak[1] !== bk[1]) return ak[1] - bk[1];
        return ak[2].localeCompare(bk[2]);
      });
      html += '<details class="card bank-domain" open style="margin-bottom:12px">';
      html += '<summary style="cursor:pointer;font-weight:700">Domain ' + d.id + ': ' + AIP.escape(d.short) + ' <span style="color:var(--muted);font-weight:500">(' + items.length + ')</span></summary>';
      subKeys.forEach(function (sub) {
        var rows = subs[sub] || [];
        html += '<div style="margin-top:16px"><div style="font-size:13px;color:var(--muted);margin-bottom:8px">' + AIP.escape(sub) + ' · ' + rows.length + '</div>';
        html += '<div class="weak-list">';
        rows.forEach(function (q) {
          var s = statsAll[q.id] || { correct: 0, wrong: 0 };
          var stem = String(q.stem || "");
          html += '<a class="weak-row" href="#/exam?id=' + encodeURIComponent(q.id || "") + '">';
          html += '<span>' + AIP.escape(q.id || "") + ' · ' + AIP.escape(stem.slice(0, 100)) + (stem.length > 100 ? "…" : "") + '</span>';
          html += '<span>' + (Number(s.correct) || 0) + ' right</span><span>' + (Number(s.wrong) || 0) + ' wrong</span></a>';
        });
        html += '</div></div>';
      });
      html += '</details>';
    });
    html += '</div>';
    return html;
  };

  AIP.renderExamSetup = function () {
    var all = AIP.questions || [];
    var prefs = AIP.storage.examPrefs();
    var stats = AIP.storage.quiz().questions;
    var counts = { unseen: 0, wrong: 0, correct: 0 };
    all.forEach(function (q) { counts[questionState(q, stats[q.id])] += 1; });
    var selectedCount = String(prefs.count || 20);
    var saved = AIP.storage.examSession();
    var html = '<div class="hero"><h1>Mock exam</h1><p class="lede">Choose an exam-style random set or smart practice. Your active set, answers, skips, and question history are saved on this device, so you can close the PWA and resume exactly where you stopped.</p></div>';
    html += '<div class="stats-grid"><div class="stat"><div class="n">' + counts.unseen + '</div><div class="l">Not answered</div></div>';
    html += '<div class="stat"><div class="n">' + counts.wrong + '</div><div class="l">Need review</div></div>';
    html += '<div class="stat"><div class="n">' + counts.correct + '</div><div class="l">Currently correct</div></div>';
    html += '<div class="stat"><div class="n">' + all.length + '</div><div class="l">Eligible bank</div></div></div>';
    if (saved) {
      var answered = (saved.results || []).filter(function (x) { return typeof x === "boolean"; }).length;
      html += '<div class="card exam-resume"><h3>Continue saved session</h3><p>' + answered + ' answered · question ' + ((Number(saved.index) || 0) + 1) + ' of ' + saved.itemIds.length + '. This session will still be here after reopening the app.</p><div class="chapter-actions"><a class="btn primary" href="#/exam?session=active">Resume exam</a><button type="button" class="btn ghost" data-exam="abandon">Start a different set</button></div></div>';
    }
    html += '<section class="card exam-setup"><h2>Build a question set</h2><div class="exam-controls">';
    html += '<label class="exam-control"><span>Study mode</span><select data-exam-field="strategy"><option value="adaptive"' + (prefs.strategy !== "exam" ? " selected" : "") + '>Smart practice (recommended)</option><option value="exam"' + (prefs.strategy === "exam" ? " selected" : "") + '>Exam mode (random)</option></select><small>Smart practice uses new questions first, then missed questions.</small></label>';
    var standardCounts = ["10", "20", "50", "80"];
    var customCount = standardCounts.indexOf(selectedCount) === -1;
    html += '<label class="exam-control"><span>Question count</span><select data-exam-field="count"><option value="10"' + (selectedCount === "10" ? " selected" : "") + '>10</option><option value="20"' + (selectedCount === "20" ? " selected" : "") + '>20</option><option value="50"' + (selectedCount === "50" ? " selected" : "") + '>50</option><option value="80"' + (selectedCount === "80" ? " selected" : "") + '>80</option><option value="custom"' + (customCount ? " selected" : "") + '>Custom</option></select><input type="number" min="1" max="' + all.length + '" inputmode="numeric" data-exam-custom value="' + (customCount ? AIP.escape(selectedCount) : '') + '" placeholder="Custom count, 1–' + all.length + '"><small>Choose 10, 20, 50, 80, or enter your own count.</small></label>';
    html += '<label class="exam-control"><span>Question status</span><select data-exam-field="status"><option value="all">Any status</option><option value="unseen"' + (prefs.status === "unseen" ? " selected" : "") + '>Not answered yet</option><option value="wrong"' + (prefs.status === "wrong" ? " selected" : "") + '>Needs review / wrong</option><option value="correct"' + (prefs.status === "correct" ? " selected" : "") + '>Currently correct</option></select><small>Use this to focus a set before you start.</small></label>';
    html += '<label class="exam-control"><span>Source</span><select data-exam-field="source"><option value="all">All sources</option><option value="certsafari"' + (prefs.source === "certsafari" ? " selected" : "") + '>CertSafari</option><option value="practice"' + (prefs.source === "practice" ? " selected" : "") + '>Practice questions</option><option value="examtopics"' + (prefs.source === "examtopics" ? " selected" : "") + '>ExamTopics</option></select></label>';
    html += '<label class="exam-control"><span>Domain</span><select data-exam-field="domain"><option value="all">All domains</option>';
    (AIP.DOMAINS || []).forEach(function (d) {
      html += '<option value="' + d.id + '"' + (String(prefs.domain) === String(d.id) ? " selected" : "") + '>Domain ' + d.id + ' · ' + AIP.escape(d.short) + '</option>';
    });
    html += '</select></label></div><div class="exam-algorithm"><strong>How Smart practice chooses:</strong> unanswered questions are always selected before answered ones. Once the pool has been seen, recent wrong answers are shown first, then lower-accuracy and least-recently-seen questions. A question appears at most once in a set.</div><div class="chapter-actions"><button type="button" class="btn primary" data-exam="start">Start new set</button><a class="btn ghost" href="#/stats">Review question stats</a><a class="btn ghost" href="#/bank">Browse question bank</a></div></section>';
    return html;
  };
})();
