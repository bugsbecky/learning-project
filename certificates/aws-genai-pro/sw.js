/* AIP-C01 PWA service worker. Register only from http(s) — not file://. */
var CACHE = "aip-c01-v5";
var FONT_CACHE = "aip-c01-fonts-v1";
var PRECACHE = [
  "./index.html",
  "./manifest.webmanifest",
  "./css/base.css",
  "./css/components.css",
  "./css/layout.css",
  "./css/main.css",
  "./css/tokens.css",
  "./js/app.js",
  "./js/chapters.js",
  "./js/config.js",
  "./js/ns.js",
  "./js/question-bank.js",
  "./js/quiz.js",
  "./js/render.js",
  "./js/storage.js",
  "./js/study-guide.js",
  "./js/content/00-architecture-overview.js",
  "./js/content/01-genai-foundations.js",
  "./js/content/02-choosing-a-foundation-model.js",
  "./js/content/03-amazon-bedrock.js",
  "./js/content/04-prompt-engineering.js",
  "./js/content/05-application-integration.js",
  "./js/content/06-data-ingestion.js",
  "./js/content/07-embeddings.js",
  "./js/content/08-vector-databases.js",
  "./js/content/09-rag.js",
  "./js/content/10-bedrock-knowledge-bases.js",
  "./js/content/11-agents.js",
  "./js/content/12-agent-tools.js",
  "./js/content/13-workflow-orchestration.js",
  "./js/content/14-memory-and-state.js",
  "./js/content/15-safety-and-guardrails.js",
  "./js/content/16-security-and-privacy.js",
  "./js/content/17-governance.js",
  "./js/content/18-evaluation.js",
  "./js/content/19-observability.js",
  "./js/content/20-performance.js",
  "./js/content/21-cost-optimization.js",
  "./js/content/22-deployment.js",
  "./js/content/23-cicd.js",
  "./js/content/24-troubleshooting.js",
  "./js/content/25-architecture-patterns.js",
  "./js/content/26-exam-decision-guide.js",
  "./js/content/27-final-architecture.js",
  "./js/questions/certsafari-p01.js",
  "./js/questions/certsafari-p02.js",
  "./js/questions/certsafari-p03.js",
  "./js/questions/certsafari-p04.js",
  "./js/questions/certsafari-p05.js",
  "./js/questions/certsafari-p06.js",
  "./js/questions/certsafari-p07.js",
  "./js/questions/certsafari-p08.js",
  "./js/questions/certsafari-p09.js",
  "./js/questions/certsafari-p10.js",
  "./js/questions/certsafari-p11.js",
  "./js/questions/certsafari-p12.js",
  "./js/questions/certsafari-p13.js",
  "./js/questions/certsafari-p14.js",
  "./js/questions/certsafari-p15.js",
  "./js/questions/certsafari-p16.js",
  "./js/questions/certsafari-p17.js",
  "./js/questions/certsafari-p18.js",
  "./js/questions/certsafari-p19.js",
  "./js/questions/certsafari-p20.js",
  "./js/questions/certsafari-p21.js",
  "./js/questions/certsafari-p22.js",
  "./js/questions/certsafari-p23.js",
  "./js/questions/certsafari-p24.js",
  "./js/questions/certsafari-p25.js",
  "./js/questions/certsafari-p26.js",
  "./js/questions/certsafari-p27.js",
  "./js/questions/certsafari-p28.js",
  "./js/questions/certsafari-p29.js",
  "./js/questions/certsafari-p30.js",
  "./js/questions/certsafari-p31.js",
  "./js/questions/certsafari-p32.js",
  "./js/questions/certsafari-p33.js",
  "./js/questions/certsafari-p34.js",
  "./js/questions/certsafari-p35.js",
  "./js/questions/certsafari-p36.js",
  "./js/questions/examtopics-p01.js",
  "./js/questions/examtopics-p02.js",
  "./js/questions/examtopics-p03.js",
  "./js/questions/examtopics-p04.js",
  "./js/questions/examtopics-p05.js",
  "./js/questions/examtopics-p06.js",
  "./js/questions/examtopics-p07.js",
  "./js/questions/examtopics-p08.js",
  "./js/questions/examtopics-p09.js",
  "./js/questions/examtopics-p10.js",
  "./js/questions/examtopics-p11.js",
  "./js/questions/examtopics-p12.js",
  "./js/questions/practice.js",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-48.png",
  "./icons/icon-192.png",
  "./icons/icon-512-maskable.png",
  "./icons/icon-512.png",
  "./icons/icon.svg"
];

function cleanUrl(request) {
  var url = new URL(request.url);
  url.search = "";
  url.hash = "";
  return url.href;
}

function isFontRequest(url) {
  return url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== CACHE && key !== FONT_CACHE;
      }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  var url;
  try {
    url = new URL(request.url);
  } catch (err) {
    return;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then(function (cached) {
        return cached || fetch(request);
      }).catch(function () {
        return caches.match("./index.html");
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(cleanUrl(request)).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (response) {
          if (!response || response.status !== 200 || response.type === "opaque") return response;
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(cleanUrl(request), copy);
          });
          return response;
        });
      })
    );
    return;
  }

  if (isFontRequest(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then(function (cache) {
        return cache.match(request).then(function (cached) {
          var fetched = fetch(request).then(function (response) {
            if (response && response.status === 200) cache.put(request, response.clone());
            return response;
          }).catch(function () { return cached; });
          return cached || fetched;
        });
      })
    );
  }
});
