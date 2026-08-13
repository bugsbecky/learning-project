window.AIP = window.AIP || {};

AIP.chapters = AIP.chapters || [];
AIP.questions = AIP.questions || [];
AIP.content = AIP.content || {};

AIP.padChapterId = function (id) {
  if (id == null) return "";
  var s = String(id).trim();
  if (/^\d{1,2}$/.test(s)) return s.length === 1 ? "0" + s : s;
  return s;
};

AIP.registerChapter = function (chapter) {
  if (!chapter || typeof chapter !== "object" || chapter.id == null || chapter.id === "") return;
  var id = AIP.padChapterId(chapter.id);
  chapter.id = id;
  AIP.content[id] = chapter;
  var i;
  for (i = 0; i < AIP.chapters.length; i++) {
    if (AIP.chapters[i].id === id) {
      AIP.chapters[i] = chapter;
      return;
    }
  }
  AIP.chapters.push(chapter);
};

AIP.chapterTags = function (q) {
  var tags = [];
  if (Array.isArray(q.chapters)) tags = q.chapters.slice();
  if (q.chapter != null && q.chapter !== "") tags.push(q.chapter);
  return tags.map(function (t) { return AIP.padChapterId(t); });
};

AIP.registerQuestions = function (items) {
  if (items == null) return;
  if (!Array.isArray(items)) return;
  var i, j, q, replaced;
  for (i = 0; i < items.length; i++) {
    q = items[i];
    if (!q || typeof q !== "object") continue;
    replaced = false;
    if (q.id != null && q.id !== "") {
      for (j = 0; j < AIP.questions.length; j++) {
        if (AIP.questions[j] && AIP.questions[j].id === q.id) {
          AIP.questions[j] = q;
          replaced = true;
          break;
        }
      }
    }
    if (!replaced) AIP.questions.push(q);
  }
};

AIP.getChapter = function (id) {
  var key = AIP.padChapterId(id);
  if (AIP.content[key]) return AIP.content[key];
  if (id && AIP.content[id]) return AIP.content[id];
  var list = AIP.chapters || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i] && (list[i].id === key || list[i].id === id)) return list[i];
  }
  return null;
};

AIP.findChapterMeta = function (id) {
  var key = AIP.padChapterId(id);
  var list = AIP.CHAPTERS || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === key || list[i].id === id) return list[i];
  }
  return null;
};
