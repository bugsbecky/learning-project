window.AIP = window.AIP || {};

AIP.app = (function () {
  var view;
  var sidebar;
  var nav;
  var titleEl;
  var route = { name: "home" };

  function parseHash() {
    var h = (location.hash || "#/").replace(/^#/, "");
    var path = h.split("?")[0];
    var parts = path.split("/").filter(Boolean);
    if (!parts.length) return { name: "home" };
    if (parts[0] === "chapter" && parts[1]) {
      return { name: "chapter", id: AIP.padChapterId(parts[1]) };
    }
    if (parts[0] === "quiz" && parts[1]) {
      return { name: "quiz", id: AIP.padChapterId(parts[1]) };
    }
    if (parts[0] === "exam") {
      var examMode = AIP.parseExamMode ? AIP.parseExamMode(location.hash) : { mode: "all" };
      var params = new URLSearchParams((location.hash.split("?")[1] || ""));
      var startId = params.get("id") || "";
      return { name: "exam", examMode: examMode, startId: startId };
    }
    if (parts[0] === "stats") return { name: "stats" };
    if (parts[0] === "bank") return { name: "bank" };
    return { name: "home" };
  }

  function progressAscii(pct) {
    var cells = AIP.PROGRESS_CELLS || 14;
    var filled = Math.round((pct / 100) * cells);
    if (filled < 0) filled = 0;
    if (filled > cells) filled = cells;
    var bar = "";
    var i;
    for (i = 0; i < cells; i++) bar += i < filled ? "█" : "░";
    return bar + " " + Math.round(pct) + "%";
  }

  function updateProgress() {
    var n = AIP.storage.completedCount();
    var total = (AIP.CHAPTERS || []).length;
    var pct = total ? (n / total) * 100 : 0;
    var bar = document.getElementById("progressFill");
    var ascii = document.getElementById("progressAscii");
    var count = document.getElementById("progressCount");
    if (bar) {
      bar.style.width = pct + "%";
      var meter = bar.closest("[role='progressbar']");
      if (meter) meter.setAttribute("aria-valuenow", String(Math.round(pct)));
    }
    if (ascii) ascii.textContent = progressAscii(pct);
    if (count) count.textContent = n + " / " + total;
  }

  function currentChapterId() {
    if (route.name === "chapter" || route.name === "quiz") return route.id;
    return null;
  }

  function renderSidebar() {
    if (!nav) return;
    var ui = AIP.storage.ui();
    var openGroups = ui.openGroups || [];
    var openChapters = ui.openChapters || [];
    var currentId = currentChapterId();
    var currentMeta = currentId ? AIP.findChapterMeta(currentId) : null;
    var html = "";
    (AIP.GROUPS || []).forEach(function (g) {
      var isOpen = openGroups.indexOf(g.id) !== -1 || (currentMeta && currentMeta.group === g.id);
      html += '<div class="nav-group' + (isOpen ? " open" : "") + '" data-group="' + g.id + '">';
      html += '<button type="button" class="nav-group-btn" data-toggle-group="' + g.id + '"><span>' + AIP.escape(g.title) + '</span><span class="chev">▸</span></button>';
      html += '<div class="nav-group-body">';
      (AIP.chaptersInGroup ? AIP.chaptersInGroup(g.id) : AIP.CHAPTERS.filter(function (c) { return c.group === g.id; })).forEach(function (c) {
        var active = route.name === "chapter" && route.id === c.id;
        var quizActive = route.name === "quiz" && route.id === c.id;
        var done = AIP.storage.isDone(c.id);
        var chapOpen = openChapters.indexOf(c.id) !== -1 || active || quizActive;
        html += '<div class="nav-item-wrap' + (chapOpen ? " open" : "") + (active || quizActive ? " active-wrap" : "") + '">';
        html += '<button type="button" class="nav-item' + (active || quizActive ? " active" : "") + (done ? " done" : "") + '" data-toggle-chapter="' + c.id + '"><span class="idx">' + c.id + '</span><span>' + AIP.escape(c.title) + '</span><span class="done-dot"></span></button>';
        html += '<div class="chapter-subs"><a href="#/chapter/' + c.id + '" class="' + (active ? "active" : "") + '">Learn</a><a href="#/quiz/' + c.id + '" class="' + (quizActive ? "active" : "") + '">Quiz</a></div>';
        html += "</div>";
      });
      html += "</div></div>";
    });
    nav.innerHTML = html;
  }

  function setTitle() {
    if (!titleEl) return;
    if (route.name === "home") titleEl.innerHTML = "AIP-C01 · Learn with Maya<small>Company Knowledge Assistant</small>";
    else if (route.name === "exam") titleEl.innerHTML = "Full mock exam<small>Sorted by domain · filter modes</small>";
    else if (route.name === "stats") titleEl.innerHTML = "Question stats<small>Right vs wrong counts</small>";
    else if (route.name === "bank") titleEl.innerHTML = "Question bank<small>CertSafari · grouped by domain</small>";
    else if (route.name === "quiz") {
      var c = AIP.findChapterMeta(route.id);
      titleEl.innerHTML = (c ? AIP.escape(c.id) + ". " + AIP.escape(c.title) : "Quiz") + "<small>Chapter quiz</small>";
    } else {
      var ch = AIP.findChapterMeta(route.id);
      titleEl.innerHTML = (ch ? AIP.escape(ch.id) + ". " + AIP.escape(ch.title) : "Chapter") + "<small>Context · decisions · exam clues</small>";
    }
  }

  function setView(html, keepScroll) {
    if (!view) return;
    var top = keepScroll ? view.scrollTop : 0;
    view.innerHTML = '<div class="view-inner">' + html + "</div>";
    view.scrollTop = keepScroll ? top : 0;
    var currentContext = view.querySelector(".architecture-node.current");
    var contextScroller = currentContext && currentContext.closest(".architecture-scroll");
    if (contextScroller) {
      var currentBox = currentContext.getBoundingClientRect();
      var scrollerBox = contextScroller.getBoundingClientRect();
      var currentCenter = currentBox.left - scrollerBox.left + contextScroller.scrollLeft + (currentBox.width / 2);
      contextScroller.scrollLeft = Math.max(0, currentCenter - (contextScroller.clientWidth / 2));
    }
  }

  function closeMobileNav() {
    if (sidebar) sidebar.classList.remove("open");
    var scrim = document.getElementById("scrim");
    if (scrim) scrim.classList.remove("show");
  }

  function ensureQuiz(filter, options) {
    options = options || {};
    var key = filter === "all" ? AIP.quiz.sessionKey("all", options) : String(filter);
    var cur = AIP.quiz.current();
    if (!cur || cur.filterKey !== key) AIP.quiz.start(filter, options);
  }

  function draw() {
    route = parseHash();
    setTitle();
    renderSidebar();
    updateProgress();
    if (route.name === "home") setView(AIP.renderHome());
    else if (route.name === "stats") setView(AIP.quiz.renderStats());
    else if (route.name === "bank") setView(AIP.renderBank ? AIP.renderBank() : "<p>Question bank not loaded.</p>");
    else if (route.name === "exam") {
      ensureQuiz("all", { examMode: route.examMode, startId: route.startId });
      setView(AIP.quiz.render());
    } else if (route.name === "quiz") {
      if (!AIP.findChapterMeta(route.id)) {
        setView('<div class="card"><h3>Chapter not found</h3><p>Quizzes exist for chapters 00–27.</p><a class="btn" href="#/">Home</a></div>');
      } else {
        ensureQuiz(route.id);
        setView(AIP.quiz.render());
      }
    } else {
      var meta = AIP.findChapterMeta(route.id);
      var body = AIP.getChapter(route.id);
      if (!meta && !body) {
        setView('<div class="card"><h3>Chapter not found</h3><p>Valid chapter ids are 00–27.</p><a class="btn" href="#/">Home</a></div>');
      } else {
        setView(AIP.renderChapter(body || { id: route.id, summary: "Content for this chapter is not loaded yet." }));
      }
    }
    closeMobileNav();
  }

  function toggleList(arr, id) {
    var next = (arr || []).slice();
    var i = next.indexOf(id);
    if (i === -1) next.push(id);
    else next.splice(i, 1);
    return next;
  }

  function onClick(e) {
    var groupBtn = e.target.closest("[data-toggle-group]");
    if (groupBtn) {
      var gid = groupBtn.getAttribute("data-toggle-group");
      var uiG = AIP.storage.ui();
      uiG.openGroups = toggleList(uiG.openGroups, gid);
      AIP.storage.saveUi(uiG);
      renderSidebar();
      return;
    }
    var chapBtn = e.target.closest("[data-toggle-chapter]");
    if (chapBtn) {
      var cid = chapBtn.getAttribute("data-toggle-chapter");
      var uiC = AIP.storage.ui();
      uiC.openChapters = toggleList(uiC.openChapters, cid);
      AIP.storage.saveUi(uiC);
      renderSidebar();
      return;
    }
    var doneBtn = e.target.closest("[data-act='toggle-done']");
    if (doneBtn) {
      if (route.name === "chapter" && route.id) {
        AIP.storage.setDone(route.id, !AIP.storage.isDone(route.id));
        draw();
      }
      return;
    }
    if (e.target.closest("[data-act='reset-progress']")) {
      if (confirm("Reset all chapter progress?")) {
        AIP.storage.resetProgress();
        draw();
      }
      return;
    }
    if (e.target.closest("[data-act='reset-quiz']")) {
      if (confirm("Reset all quiz right/wrong counts?")) {
        AIP.storage.resetQuizStats();
        draw();
      }
      return;
    }
    var choice = e.target.closest("[data-choice]");
    if (choice) {
      AIP.quiz.toggleChoice(choice.getAttribute("data-choice"));
      setView(AIP.quiz.render(), true);
      return;
    }
    var qact = e.target.closest("[data-quiz]");
    if (qact) {
      var act = qact.getAttribute("data-quiz");
      var cur = AIP.quiz.current();
      if (act === "submit") {
        if (!cur || !Object.keys(cur.selected).length) return;
        AIP.quiz.submit();
      }
      if (act === "next") AIP.quiz.next();
      if (act === "reset") AIP.quiz.resetAttempt();
      setView(AIP.quiz.render(), act === "submit");
    }
  }

  function boot() {
    view = document.getElementById("view");
    sidebar = document.getElementById("sidebar");
    nav = document.getElementById("sidebarNav");
    titleEl = document.getElementById("topTitle");
    var menuBtn = document.getElementById("menuBtn");
    var scrim = document.getElementById("scrim");
    if (menuBtn && sidebar) {
      menuBtn.addEventListener("click", function () {
        sidebar.classList.add("open");
        if (scrim) scrim.classList.add("show");
      });
    }
    if (scrim) {
      scrim.addEventListener("click", function () {
        closeMobileNav();
      });
    }
    document.body.addEventListener("click", onClick);
    window.addEventListener("hashchange", draw);
    if (!location.hash) location.hash = "#/";
    draw();
  }

  return { boot: boot, draw: draw, parseHash: parseHash };
})();

document.addEventListener("DOMContentLoaded", AIP.app.boot);
