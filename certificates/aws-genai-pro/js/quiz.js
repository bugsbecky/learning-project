window.AIP = window.AIP || {};

AIP.quiz = (function () {
  var session = null;

  function uniqSort(arr) {
    var seen = {};
    var out = [];
    (arr || []).forEach(function (x) {
      var k = String(x == null ? "" : x).trim().toUpperCase();
      if (!k || seen[k]) return;
      seen[k] = true;
      out.push(k);
    });
    out.sort();
    return out;
  }

  function correctLetters(q) {
    if (!q) return [];
    var c = q.correct;
    if (c == null) return [];
    if (Array.isArray(c)) return uniqSort(c);
    return uniqSort(String(c).split(/[\s,;]+/));
  }

  function isMulti(q) {
    return correctLetters(q).length > 1 || !!q.multi;
  }

  function choiceLetter(c) {
    if (!c) return "";
    return String(c.id || c.letter || "").trim().toUpperCase();
  }

  function questionsFor(filter) {
    if (typeof filter === "object" && filter !== null) {
      return AIP.filterQuestions ? AIP.filterQuestions(filter) : (AIP.questions || []).slice();
    }
    if (filter === "all") {
      return AIP.sortQuestions ? AIP.sortQuestions(AIP.questions || []) : (AIP.questions || []).slice();
    }
    var id = AIP.padChapterId(filter);
    var bank = AIP.questions || [];
    var items = bank.filter(function (q) {
      return AIP.chapterTags(q).indexOf(id) !== -1;
    });
    return AIP.sortQuestions ? AIP.sortQuestions(items) : items;
  }

  function sessionKey(filter, options) {
    options = options || {};
    if (typeof filter === "object" && filter !== null) {
      return JSON.stringify(filter);
    }
    if (filter === "all") {
      return "all:" + JSON.stringify(options.examMode || {});
    }
    return String(filter);
  }

  function start(filter, options) {
    options = options || {};
    var items;
    if (filter === "all" && options.examMode && AIP.questionsForExam) {
      items = AIP.questionsForExam(options.examMode);
    } else {
      items = questionsFor(filter);
    }
    var startIndex = 0;
    if (options.startId) {
      var idx = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i] && items[i].id === options.startId) {
          idx = i;
          break;
        }
      }
      if (idx >= 0) startIndex = idx;
    }
    session = {
      filter: filter === "all" ? "all" : AIP.padChapterId(filter),
      filterKey: sessionKey(filter, options),
      examMode: options.examMode || null,
      items: items,
      index: startIndex,
      revealed: false,
      selected: {},
      results: []
    };
    return session;
  }

  function current() {
    return session;
  }

  function currentQuestion() {
    if (!session || !session.items.length) return null;
    return session.items[session.index] || null;
  }

  function toggleChoice(letter) {
    if (!session || session.revealed) return;
    var q = currentQuestion();
    if (!q) return;
    var key = String(letter || "").trim().toUpperCase();
    if (!key) return;
    if (!isMulti(q)) {
      session.selected = {};
      session.selected[key] = true;
      return;
    }
    if (session.selected[key]) delete session.selected[key];
    else session.selected[key] = true;
  }

  function selectedList() {
    if (!session) return [];
    return uniqSort(Object.keys(session.selected));
  }

  function sameLetters(got, want) {
    if (got.length !== want.length) return false;
    for (var i = 0; i < got.length; i++) {
      if (got[i] !== want[i]) return false;
    }
    return true;
  }

  function submit() {
    if (!session || session.revealed) return false;
    var q = currentQuestion();
    if (!q) return false;
    var got = selectedList();
    if (!got.length) return false;
    var want = correctLetters(q);
    var ok = want.length > 0 && sameLetters(got, want);
    session.revealed = true;
    session.results[session.index] = ok;
    if (q.id != null && q.id !== "") AIP.storage.recordAttempt(q.id, ok);
    return ok;
  }

  function next() {
    if (!session || !session.revealed) return false;
    if (session.index < session.items.length - 1) {
      session.index += 1;
      session.revealed = false;
      session.selected = {};
      return true;
    }
    return false;
  }

  function resetAttempt() {
    if (!session) return;
    session.index = 0;
    session.revealed = false;
    session.selected = {};
    session.results = [];
  }

  function examModeLabel(mode) {
    if (!mode || mode.mode === "all") return "All questions · sorted by domain";
    if (mode.mode === "certsafari") return "CertSafari only · sorted by domain";
    if (mode.mode === "random65") return "Random 65 · exam-style subset";
    if (mode.domain != null) {
      var dm = AIP.domainMeta ? AIP.domainMeta(mode.domain) : null;
      return "Domain " + mode.domain + (dm ? " · " + dm.short : "");
    }
    if (mode.source) return String(mode.source);
    return "Custom set";
  }

  function render() {
    if (!session) return "<p>No quiz loaded.</p>";
    if (!session.items.length) {
      var back = session.filter !== "all"
        ? '<a class="btn" href="#/chapter/' + AIP.escape(session.filter) + '">Back to chapter</a>'
        : "";
      return '<div class="card"><h3>No questions in this set</h3><p>Try the full mock exam or browse the question bank.</p><div class="chapter-actions"><a class="btn" href="#/exam">Full mock exam</a><a class="btn" href="#/bank">Question bank</a>' + back + '</div></div>';
    }
    var q = currentQuestion();
    if (!q) return "<p>No quiz loaded.</p>";
    var stats = q.id != null ? AIP.storage.questionStats(q.id) : { correct: 0, wrong: 0 };
    var multi = isMulti(q);
    var html = "";
    if (session.filter === "all") {
      html += '<div class="card" style="margin-bottom:12px;padding:12px 16px"><div style="font-size:13px;color:var(--muted)">' + AIP.escape(examModeLabel(session.examMode)) + '</div>';
      html += '<div class="chapter-actions" style="margin-top:8px"><a class="btn ghost" href="#/exam">All sorted</a>';
      html += '<a class="btn ghost" href="#/exam?mode=certsafari">CertSafari</a>';
      html += '<a class="btn ghost" href="#/exam?mode=random65">Random 65</a>';
      html += '<a class="btn ghost" href="#/bank">Browse bank</a></div></div>';
    }
    html += '<div class="quiz-meta"><div>Question ' + (session.index + 1) + " / " + session.items.length + (multi ? " · choose all that apply" : "") + '</div>';
    html += '<div>Lifetime: ' + stats.correct + ' right · ' + stats.wrong + ' wrong</div></div>';
    var badges = (q.badges || []).slice();
    if (!badges.length) {
      if (q.source === "examtopics") badges.push("EXAMTOPICS");
      else if (q.source === "certsafari") badges.push("CERTSAFARI");
      else badges.push("PRACTICE");
    }
    if (q.subdomain) html += '<div class="quiz-meta" style="margin-top:8px;color:var(--muted);font-size:13px">' + AIP.escape(q.subdomain) + '</div>';
    html += '<div class="badge-row" style="margin-top:12px">' + AIP.renderBadges(badges) + '</div>';
    html += '<div class="card"><p style="color:var(--fg);font-size:16px;line-height:1.55">' + AIP.escape(q.stem) + '</p></div>';
    var wantSet = {};
    correctLetters(q).forEach(function (L) { wantSet[L] = true; });
    (q.choices || []).forEach(function (c) {
      var letter = choiceLetter(c);
      var cls = "choice";
      if (session.selected[letter]) cls += " selected";
      if (session.revealed) {
        if (wantSet[letter]) cls += " correct";
        else if (session.selected[letter]) cls += " wrong";
      }
      html += '<button type="button" class="' + cls + '" data-choice="' + AIP.escape(letter) + '"><span class="letter">' + AIP.escape(letter) + '.</span> ' + AIP.escape(c.text) + '</button>';
    });
    if (!session.revealed) {
      html += '<div class="chapter-actions"><button type="button" class="btn primary" data-quiz="submit">Check answer</button><button type="button" class="btn ghost" data-quiz="reset">Reset this attempt</button></div>';
    } else {
      var ok = session.results[session.index];
      html += '<div class="feedback ' + (ok ? "ok" : "bad") + '"><strong>' + (ok ? "Correct." : "Not quite.") + '</strong> Answer: ' + AIP.escape(correctLetters(q).join(", "));
      if (multi && !ok) html += '<p style="margin:8px 0 0">Multi-select: every correct letter must be chosen, and no extras.</p>';
      if (Array.isArray(q.optionExplanations) && q.optionExplanations.length) {
        html += '<div class="explanation-list" style="margin-top:12px">';
        q.optionExplanations.forEach(function (ex) {
          var tag = ex.correct ? "Correct" : (ex.incorrect === false && !ex.correct ? "" : "Incorrect");
          html += '<div class="explanation-item" style="margin:10px 0;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card)">';
          html += '<strong>' + AIP.escape(ex.id) + ')</strong>';
          if (tag) html += ' <span style="color:' + (ex.correct ? "var(--ok)" : "var(--bad)") + '">' + tag + '</span>';
          if (ex.text) html += '<p style="margin:6px 0 0">' + AIP.escape(ex.text) + '</p>';
          html += '</div>';
        });
        html += '</div>';
      } else if (q.why) {
        html += '<p style="margin:8px 0 0">' + AIP.escape(q.why) + '</p>';
      }
      html += '</div>';
      var more = session.index < session.items.length - 1;
      html += '<div class="chapter-actions">';
      if (more) html += '<button type="button" class="btn primary" data-quiz="next">Next question</button>';
      else {
        html += '<div class="card"><h3>Attempt complete</h3><p>' + session.results.filter(Boolean).length + ' / ' + session.items.length + ' correct this round. Lifetime counts are kept so you can see which items you miss repeatedly.</p></div>';
      }
      html += '<button type="button" class="btn" data-quiz="reset">Try this set again</button>';
      if (session.filter !== "all") html += '<a class="btn ghost" href="#/chapter/' + AIP.escape(session.filter) + '">Back to chapter</a>';
      html += '<a class="btn ghost" href="#/bank">Question bank</a><a class="btn ghost" href="#/stats">View stats</a></div>';
    }
    return html;
  }

  function renderStats() {
    var allStats = AIP.storage.quiz().questions;
    var sorted = AIP.sortQuestions ? AIP.sortQuestions(AIP.questions || []) : (AIP.questions || []).slice();
    var summary = AIP.bankSummary ? AIP.bankSummary() : { total: sorted.length, certsafari: 0, practice: 0 };
    var rows = sorted.map(function (q) {
      var s = allStats[q.id] || { correct: 0, wrong: 0 };
      return { q: q, s: s, fail: Number(s.wrong) || 0, domain: AIP.questionDomain ? AIP.questionDomain(q) : 0 };
    });
    var attempted = rows.filter(function (r) { return (Number(r.s.correct) || 0) + (Number(r.s.wrong) || 0) > 0; });
    var html = '<div class="hero"><h1>Question stats</h1><p class="lede">Every graded attempt is stored in localStorage. Grouped by exam domain; within each domain, most-missed items appear first.</p></div>';
    html += '<div class="stats-grid">';
    html += '<div class="stat"><div class="n">' + summary.total + '</div><div class="l">Questions in bank</div></div>';
    html += '<div class="stat"><div class="n">' + summary.certsafari + '</div><div class="l">CertSafari</div></div>';
    html += '<div class="stat"><div class="n">' + attempted.length + '</div><div class="l">Attempted</div></div>';
    html += '</div>';
    html += '<div class="chapter-actions"><button type="button" class="btn danger" data-act="reset-quiz">Reset all quiz stats</button><a class="btn" href="#/exam">Full mock exam</a><a class="btn" href="#/bank">Question bank</a></div>';
    if (AIP.groupByDomain) {
      var grouped = AIP.groupByDomain(rows.map(function (r) { return r.q; }));
      html += '<div style="margin-top:20px">';
      (AIP.DOMAINS || []).forEach(function (d) {
        var domainRows = rows.filter(function (r) { return r.domain === d.id; });
        domainRows.sort(function (a, b) {
          return b.fail - a.fail || ((Number(b.s.correct) || 0) + (Number(b.s.wrong) || 0)) - ((Number(a.s.correct) || 0) + (Number(a.s.wrong) || 0));
        });
        var domainAttempted = domainRows.filter(function (r) { return (Number(r.s.correct) || 0) + (Number(r.s.wrong) || 0) > 0; }).length;
        html += '<details class="card" style="margin-bottom:10px"><summary style="cursor:pointer;font-weight:600">Domain ' + d.id + ': ' + AIP.escape(d.short) + ' <span style="color:var(--muted);font-weight:400">(' + domainAttempted + '/' + domainRows.length + ' attempted)</span></summary>';
        html += '<div class="weak-list" style="margin-top:12px">';
        domainRows.forEach(function (r) {
          var stem = String(r.q.stem || "");
          var sub = r.q.subdomain ? '<span style="display:block;font-size:12px;color:var(--muted);margin-top:2px">' + AIP.escape(r.q.subdomain) + '</span>' : "";
          html += '<a class="weak-row" href="#/exam?id=' + encodeURIComponent(r.q.id || "") + '"><span>' + AIP.escape(r.q.id) + ' · ' + AIP.escape(stem.slice(0, 90)) + (stem.length > 90 ? "…" : "") + sub + '</span><span>' + (Number(r.s.correct) || 0) + ' right</span><span>' + (Number(r.s.wrong) || 0) + ' wrong</span></a>';
        });
        html += '</div></details>';
      });
      html += '</div>';
    }
    return html;
  }

  return {
    start: start,
    current: current,
    toggleChoice: toggleChoice,
    submit: submit,
    next: next,
    resetAttempt: resetAttempt,
    render: render,
    renderStats: renderStats,
    questionsFor: questionsFor,
    isMulti: isMulti,
    sessionKey: sessionKey
  };
})();
