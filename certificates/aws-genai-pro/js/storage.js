window.AIP = window.AIP || {};

AIP.storage = (function () {
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      if (parsed == null || typeof parsed !== "object") return fallback;
      return parsed;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* quota / private mode */ }
  }

  function progress() {
    var p = read(AIP.STORAGE_KEYS.progress, { completed: {} });
    if (!p.completed || typeof p.completed !== "object" || Array.isArray(p.completed)) {
      p.completed = {};
    }
    return p;
  }

  function quiz() {
    var q = read(AIP.STORAGE_KEYS.quiz, { questions: {} });
    if (!q.questions || typeof q.questions !== "object" || Array.isArray(q.questions)) {
      q.questions = {};
    }
    return q;
  }

  function defaultOpenGroups() {
    return (AIP.GROUPS || []).map(function (g) { return g.id; });
  }

  function ui() {
    var u = read(AIP.STORAGE_KEYS.ui, null);
    if (!u) {
      return { openGroups: defaultOpenGroups(), openChapters: [] };
    }
    if (!Array.isArray(u.openGroups)) u.openGroups = defaultOpenGroups();
    if (!Array.isArray(u.openChapters)) u.openChapters = [];
    return u;
  }

  function isDone(id) {
    var key = AIP.padChapterId(id);
    var c = progress().completed;
    return !!(c[key] || c[id]);
  }

  function setDone(id, done) {
    var key = AIP.padChapterId(id);
    var p = progress();
    if (done) p.completed[key] = Date.now();
    else {
      delete p.completed[key];
      delete p.completed[id];
    }
    write(AIP.STORAGE_KEYS.progress, p);
  }

  function resetProgress() {
    write(AIP.STORAGE_KEYS.progress, { completed: {} });
  }

  function emptyRow() {
    return { correct: 0, wrong: 0, last: null, attempts: [] };
  }

  function recordAttempt(questionId, correct) {
    if (questionId == null || questionId === "") return emptyRow();
    var q = quiz();
    var row = q.questions[questionId];
    if (!row || typeof row !== "object") row = emptyRow();
    if (!Array.isArray(row.attempts)) row.attempts = [];
    row.correct = Number(row.correct) || 0;
    row.wrong = Number(row.wrong) || 0;
    if (correct) row.correct += 1;
    else row.wrong += 1;
    row.last = correct ? "correct" : "wrong";
    row.attempts.push({ at: Date.now(), correct: !!correct });
    q.questions[questionId] = row;
    write(AIP.STORAGE_KEYS.quiz, q);
    return row;
  }

  function questionStats(questionId) {
    var row = quiz().questions[questionId];
    if (!row || typeof row !== "object") return emptyRow();
    return {
      correct: Number(row.correct) || 0,
      wrong: Number(row.wrong) || 0,
      last: row.last || null,
      attempts: Array.isArray(row.attempts) ? row.attempts : []
    };
  }

  function resetQuizStats() {
    write(AIP.STORAGE_KEYS.quiz, { questions: {} });
    clearExamRuns();
  }

  function examSession() {
    var saved = read(AIP.STORAGE_KEYS.exam, null);
    if (!saved || !Array.isArray(saved.itemIds) || !saved.itemIds.length) return null;
    return saved;
  }

  function saveExamSession(session) {
    if (!session || !Array.isArray(session.itemIds) || !session.itemIds.length) return;
    write(AIP.STORAGE_KEYS.exam, session);
  }

  function clearExamSession() {
    try {
      localStorage.removeItem(AIP.STORAGE_KEYS.exam);
    } catch (e) { /* private mode */ }
  }

  function examRuns() {
    var runs = read(AIP.STORAGE_KEYS.examRuns, null);
    if (Array.isArray(runs)) {
      return runs.filter(function (run) {
        return run && typeof run === "object" && run.id && Array.isArray(run.itemIds) && run.itemIds.length;
      }).sort(function (a, b) { return (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0); }).slice(0, 2);
    }
    // One-time compatibility upgrade for the previous single saved session.
    var legacy = examSession();
    if (!legacy) return [];
    legacy.id = "legacy-" + (legacy.startedAt || Date.now());
    legacy.createdAt = legacy.startedAt || Date.now();
    legacy.updatedAt = legacy.updatedAt || legacy.createdAt;
    write(AIP.STORAGE_KEYS.examRuns, [legacy]);
    clearExamSession();
    return [legacy];
  }

  function saveExamRun(run) {
    if (!run || !run.id || !Array.isArray(run.itemIds) || !run.itemIds.length) return [];
    var runs = examRuns().filter(function (saved) { return saved.id !== run.id; });
    runs.push(run);
    runs.sort(function (a, b) { return (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0); });
    runs = runs.slice(0, 2);
    write(AIP.STORAGE_KEYS.examRuns, runs);
    return runs;
  }

  function examRun(id) {
    var runs = examRuns();
    for (var i = 0; i < runs.length; i++) {
      if (String(runs[i].id) === String(id)) return runs[i];
    }
    return null;
  }

  function removeExamRun(id) {
    var runs = examRuns().filter(function (run) { return String(run.id) !== String(id); });
    write(AIP.STORAGE_KEYS.examRuns, runs);
  }

  function clearExamRuns() {
    try {
      localStorage.removeItem(AIP.STORAGE_KEYS.examRuns);
    } catch (e) { /* private mode */ }
    clearExamSession();
  }

  function examPrefs() {
    var prefs = read(AIP.STORAGE_KEYS.examPrefs, {});
    return prefs && typeof prefs === "object" ? prefs : {};
  }

  function saveExamPrefs(next) {
    write(AIP.STORAGE_KEYS.examPrefs, next || {});
  }

  function saveUi(next) {
    var cur = ui();
    write(AIP.STORAGE_KEYS.ui, {
      openGroups: Array.isArray(next && next.openGroups) ? next.openGroups : cur.openGroups,
      openChapters: Array.isArray(next && next.openChapters) ? next.openChapters : cur.openChapters
    });
  }

  function completedCount() {
    var c = progress().completed;
    var ids = AIP.CHAPTERS || [];
    if (!ids.length) return Object.keys(c).length;
    var n = 0;
    var i;
    for (i = 0; i < ids.length; i++) {
      if (c[ids[i].id]) n += 1;
    }
    return n;
  }

  return {
    progress: progress,
    quiz: quiz,
    ui: ui,
    isDone: isDone,
    setDone: setDone,
    resetProgress: resetProgress,
    recordAttempt: recordAttempt,
    questionStats: questionStats,
    resetQuizStats: resetQuizStats,
    examSession: examSession,
    saveExamSession: saveExamSession,
    clearExamSession: clearExamSession,
    examRuns: examRuns,
    saveExamRun: saveExamRun,
    examRun: examRun,
    removeExamRun: removeExamRun,
    clearExamRuns: clearExamRuns,
    examPrefs: examPrefs,
    saveExamPrefs: saveExamPrefs,
    saveUi: saveUi,
    completedCount: completedCount
  };
})();
