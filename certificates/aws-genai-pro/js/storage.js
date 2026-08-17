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
    clearExamSession();
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
    examPrefs: examPrefs,
    saveExamPrefs: saveExamPrefs,
    saveUi: saveUi,
    completedCount: completedCount
  };
})();
