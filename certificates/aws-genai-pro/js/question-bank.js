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

  function matchesFilter(q, filter) {
    if (!filter || filter === "all") return true;
    if (typeof filter === "string") {
      if (filter === "all") return true;
      return AIP.chapterTags(q).indexOf(AIP.padChapterId(filter)) !== -1;
    }
    if (filter.source && String(q.source || "") !== String(filter.source)) return false;
    if (filter.domain != null && questionDomain(q) !== Number(filter.domain)) return false;
    if (filter.subdomain && String(q.subdomain || "") !== String(filter.subdomain)) return false;
    if (filter.id && String(q.id || "") !== String(filter.id)) return false;
    return true;
  }

  AIP.questionDomain = questionDomain;

  AIP.sortQuestions = function (questions) {
    return (questions || []).slice().sort(compareQuestions);
  };

  AIP.questionsBySource = function (source) {
    return AIP.sortQuestions((AIP.questions || []).filter(function (q) {
      return String(q.source || "") === String(source);
    }));
  };

  AIP.filterQuestions = function (filter) {
    return AIP.sortQuestions((AIP.questions || []).filter(function (q) {
      return matchesFilter(q, filter);
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
    var out = { mode: mode };
    if (domain != null && domain !== "") out.domain = Number(domain);
    if (source) out.source = source;
    return out;
  };

  AIP.questionsForExam = function (modeSpec) {
    var spec = modeSpec || { mode: "all" };
    var pool;
    if (spec.mode === "certsafari") pool = AIP.questionsBySource("certsafari");
    else if (spec.mode === "random65") pool = shuffle(AIP.sortQuestions(AIP.questions || [])).slice(0, 65);
    else if (spec.domain != null) pool = AIP.filterQuestions({ domain: spec.domain });
    else if (spec.source) pool = AIP.filterQuestions({ source: spec.source });
    else pool = AIP.sortQuestions(AIP.questions || []);
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
})();
