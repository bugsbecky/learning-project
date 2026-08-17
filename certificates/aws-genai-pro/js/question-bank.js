window.AIP = window.AIP || {};

(function () {
  var SERVICE_CATALOG = [
    { id: "bedrock", label: "Amazon Bedrock", aliases: ["amazon bedrock", "bedrock"] },
    { id: "sagemaker", label: "Amazon SageMaker", aliases: ["amazon sagemaker", "sagemaker"] },
    { id: "s3", label: "Amazon S3", aliases: ["amazon s3", "s3 bucket", "s3"] },
    { id: "lambda", label: "AWS Lambda", aliases: ["aws lambda", "lambda function", "lambda"] },
    { id: "opensearch", label: "Amazon OpenSearch", aliases: ["amazon opensearch", "opensearch"] },
    { id: "kinesis", label: "Amazon Kinesis", aliases: ["amazon kinesis", "kinesis"] },
    { id: "eventbridge", label: "Amazon EventBridge", aliases: ["amazon eventbridge", "eventbridge"] },
    { id: "step-functions", label: "AWS Step Functions", aliases: ["step functions", "stepfunctions"] },
    { id: "api-gateway", label: "Amazon API Gateway", aliases: ["api gateway", "apigateway"] },
    { id: "cloudwatch", label: "Amazon CloudWatch", aliases: ["amazon cloudwatch", "cloudwatch"] },
    { id: "cloudtrail", label: "AWS CloudTrail", aliases: ["aws cloudtrail", "cloudtrail"] },
    { id: "iam", label: "AWS IAM", aliases: ["aws iam", "iam role", "iam policy", "identity-based policy"] },
    { id: "kms", label: "AWS KMS", aliases: ["aws kms", "kms key", "customer managed key"] },
    { id: "vpc", label: "Amazon VPC / PrivateLink", aliases: ["amazon vpc", "vpc endpoint", "privatelink", "private subnet"] },
    { id: "waf", label: "AWS WAF", aliases: ["aws waf", "web application firewall"] },
    { id: "appconfig", label: "AWS AppConfig", aliases: ["aws appconfig", "appconfig"] },
    { id: "dynamodb", label: "Amazon DynamoDB", aliases: ["amazon dynamodb", "dynamodb"] },
    { id: "ec2", label: "Amazon EC2", aliases: ["amazon ec2", "ec2 instance", "ec2"] },
    { id: "ecs", label: "Amazon ECS / Fargate", aliases: ["amazon ecs", "ecs task", "fargate"] },
    { id: "eks", label: "Amazon EKS", aliases: ["amazon eks", "eks cluster"] },
    { id: "translate", label: "Amazon Translate", aliases: ["amazon translate", "translate"] },
    { id: "transcribe", label: "Amazon Transcribe", aliases: ["amazon transcribe", "transcribe"] },
    { id: "textract", label: "Amazon Textract", aliases: ["amazon textract", "textract"] },
    { id: "comprehend", label: "Amazon Comprehend", aliases: ["amazon comprehend", "comprehend"] },
    { id: "glue", label: "AWS Glue", aliases: ["aws glue", "glue job"] },
    { id: "secrets-manager", label: "AWS Secrets Manager", aliases: ["secrets manager"] },
    { id: "cognito", label: "Amazon Cognito", aliases: ["amazon cognito", "cognito"] },
    { id: "sns", label: "Amazon SNS", aliases: ["amazon sns", "sns topic"] },
    { id: "sqs", label: "Amazon SQS", aliases: ["amazon sqs", "sqs queue"] },
    { id: "route53", label: "Amazon Route 53", aliases: ["route 53", "route53"] },
    { id: "athena", label: "Amazon Athena", aliases: ["amazon athena", "athena"] },
    { id: "rds", label: "Amazon RDS / Aurora", aliases: ["amazon rds", "aurora"] },
    { id: "elasticache", label: "Amazon ElastiCache", aliases: ["elasticache"] },
    { id: "ecr", label: "Amazon ECR", aliases: ["amazon ecr", "ecr repository"] },
    { id: "codepipeline", label: "AWS CodePipeline", aliases: ["codepipeline", "code pipeline"] },
    { id: "codebuild", label: "AWS CodeBuild", aliases: ["codebuild", "code build"] },
    { id: "codedeploy", label: "AWS CodeDeploy", aliases: ["codedeploy", "code deploy"] },
    { id: "xray", label: "AWS X-Ray", aliases: ["aws x-ray", "x-ray"] },
    { id: "rekognition", label: "Amazon Rekognition", aliases: ["amazon rekognition", "rekognition"] },
    { id: "macie", label: "Amazon Macie", aliases: ["amazon macie", "macie"] },
    { id: "organizations", label: "AWS Organizations", aliases: ["aws organizations", "organizations"] },
    { id: "service-quotas", label: "AWS Service Quotas", aliases: ["service quotas", "servicequota"] }
  ];

  function containsService(text, alias) {
    var escaped = String(alias).toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("(^|[^a-z0-9])" + escaped + "([^a-z0-9]|$)", "i").test(text);
  }

  function questionTextForServices(q) {
    var text = [q && q.stem, q && q.subdomain].filter(Boolean).join(" ");
    var correct = {};
    var answers = Array.isArray(q && q.correct) ? q.correct : [q && q.correct];
    answers.forEach(function (id) { if (id != null) correct[String(id).toUpperCase()] = true; });
    (q && q.choices || []).forEach(function (choice) {
      var id = String(choice && (choice.id || choice.letter) || "").toUpperCase();
      if (correct[id]) text += " " + (choice.text || "");
    });
    return text;
  }

  function questionServices(q) {
    if (!q) return [];
    if (Array.isArray(q.services)) return q.services.map(function (id) { return String(id); });
    if (q.service) return [String(q.service)];
    var text = questionTextForServices(q);
    return SERVICE_CATALOG.filter(function (service) {
      return service.aliases.some(function (alias) { return containsService(text, alias); });
    }).map(function (service) { return service.id; });
  }

  AIP.SERVICE_CATALOG = SERVICE_CATALOG;
  AIP.questionServices = questionServices;
  AIP.serviceMeta = function (id) {
    for (var i = 0; i < SERVICE_CATALOG.length; i++) {
      if (SERVICE_CATALOG[i].id === String(id)) return SERVICE_CATALOG[i];
    }
    return null;
  };

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
    if (filter.service && questionServices(q).indexOf(String(filter.service)) === -1) return false;
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

  AIP.questionPerformance = function (questions) {
    var stats = AIP.storage.quiz().questions;
    var result = { correct: 0, wrong: 0, attemptedQuestions: 0, unseenQuestions: 0 };
    (questions || AIP.questions || []).forEach(function (q) {
      var row = stats[q.id] || {};
      var correct = Number(row.correct) || 0;
      var wrong = Number(row.wrong) || 0;
      result.correct += correct;
      result.wrong += wrong;
      if (correct + wrong) result.attemptedQuestions += 1;
      else result.unseenQuestions += 1;
    });
    result.answers = result.correct + result.wrong;
    result.accuracy = result.answers ? Math.round((result.correct / result.answers) * 100) : 0;
    return result;
  };

  AIP.renderPerformanceChart = function (performance) {
    var p = performance || { correct: 0, wrong: 0, answers: 0, accuracy: 0 };
    var correctWidth = p.answers ? Math.round((p.correct / p.answers) * 100) : 0;
    var wrongWidth = p.answers ? 100 - correctWidth : 0;
    return '<div class="performance-chart" role="img" aria-label="' + p.correct + ' correct and ' + p.wrong + ' wrong answers, ' + p.accuracy + '% accuracy"><div class="performance-chart-head"><span><i class="dot correct"></i>' + p.correct + ' correct</span><strong>' + (p.answers ? p.accuracy + '% accuracy' : 'No answers yet') + '</strong><span><i class="dot wrong"></i>' + p.wrong + ' wrong</span></div><div class="performance-bar"><i class="correct" style="width:' + correctWidth + '%"></i><i class="wrong" style="width:' + wrongWidth + '%"></i></div></div>';
  };

  AIP.parseExamMode = function (hash) {
    var h = String(hash || location.hash || "");
    var q = h.indexOf("?");
    if (q === -1) return { mode: "all" };
    var params = new URLSearchParams(h.slice(q + 1));
    var mode = params.get("mode") || "all";
    var domain = params.get("domain");
    var source = params.get("source");
    var service = params.get("service");
    var status = params.get("status");
    var strategy = params.get("strategy");
    var count = Number(params.get("count"));
    var out = { mode: mode };
    if (domain != null && domain !== "") out.domain = Number(domain);
    if (source) out.source = source;
    if (service) out.service = service;
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
    else if (spec.domain != null || spec.source || spec.service || spec.status) pool = AIP.filterQuestions({ domain: spec.domain, source: spec.source, service: spec.service, status: spec.status });
    else pool = AIP.sortQuestions(AIP.questions || []);
    if (spec.strategy === "adaptive") pool = priorityQuestions(pool);
    else if (spec.mode !== "random65" && !spec.id) pool = shuffle(pool);
    var count = Number(spec.count);
    if (count > 0 && !spec.id) pool = pool.slice(0, Math.min(Math.floor(count), pool.length));
    return pool;
  };

  AIP.filterQuery = function (filter) {
    var parts = [];
    ["domain", "service", "source", "status"].forEach(function (key) {
      if (filter && filter[key] != null && filter[key] !== "" && filter[key] !== "all") {
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(filter[key]));
      }
    });
    return parts.length ? "?" + parts.join("&") : "";
  };

  AIP.serviceCounts = function (questions) {
    var counts = {};
    (questions || AIP.questions || []).forEach(function (q) {
      questionServices(q).forEach(function (id) { counts[id] = (counts[id] || 0) + 1; });
    });
    return counts;
  };

  AIP.renderBank = function (filter) {
    filter = filter || {};
    var full = AIP.sortQuestions(AIP.questions || []);
    var hasFilter = Object.keys(filter).some(function (key) { return filter[key] != null && filter[key] !== "" && filter[key] !== "all"; });
    var all = hasFilter ? AIP.filterQuestions(filter) : full;
    var summary = { total: all.length, certsafari: 0, practice: 0, domainCounts: AIP.domainCounts(all) };
    all.forEach(function (q) {
      if (q.source === "certsafari") summary.certsafari += 1;
      if (q.source === "practice") summary.practice += 1;
    });
    var serviceCounts = AIP.serviceCounts(full);
    var statsAll = AIP.storage.quiz().questions;
    var attempted = all.filter(function (q) {
      var s = statsAll[q.id] || {};
      return (Number(s.correct) || 0) + (Number(s.wrong) || 0) > 0;
    }).length;
    var html = '<div class="hero"><h1>Question list</h1>';
    html += '<p class="lede">Browse every question without a fixed exam size. Filter by domain, AWS service, source, or answer history, then practice the matching list.</p></div>';
    html += '<div class="stats-grid">';
    html += '<div class="stat"><div class="n">' + summary.total + '</div><div class="l">Questions shown</div></div>';
    html += '<div class="stat"><div class="n">' + summary.certsafari + '</div><div class="l">CertSafari</div></div>';
    html += '<div class="stat"><div class="n">' + summary.practice + '</div><div class="l">Practice</div></div>';
    html += '<div class="stat"><div class="n">' + attempted + '</div><div class="l">Attempted</div></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="card bank-filter-card" style="margin-top:16px"><h3>Filter this question list</h3><div class="bank-filter-grid">';
    html += '<label class="exam-control"><span>Domain</span><select data-bank-field="domain"><option value="all">All domains</option>';
    (AIP.DOMAINS || []).forEach(function (d) {
      html += '<option value="' + d.id + '"' + (String(filter.domain) === String(d.id) ? " selected" : "") + '>Domain ' + d.id + ' · ' + AIP.escape(d.short) + '</option>';
    });
    html += '</select></label><label class="exam-control"><span>AWS service</span><select data-bank-field="service"><option value="all">All AWS services</option>';
    SERVICE_CATALOG.forEach(function (service) {
      if (serviceCounts[service.id]) html += '<option value="' + service.id + '"' + (String(filter.service) === service.id ? " selected" : "") + '>' + AIP.escape(service.label) + ' · ' + serviceCounts[service.id] + '</option>';
    });
    html += '</select></label><label class="exam-control"><span>Answer history</span><select data-bank-field="status"><option value="all">Any status</option><option value="unseen"' + (filter.status === "unseen" ? " selected" : "") + '>Only new questions</option><option value="wrong"' + (filter.status === "wrong" ? " selected" : "") + '>Only failed / needs review</option><option value="correct"' + (filter.status === "correct" ? " selected" : "") + '>Currently correct</option></select></label>';
    html += '</div><div class="chapter-actions"><button type="button" class="btn primary" data-bank="apply">Apply filters</button><a class="btn" href="#/practice' + AIP.filterQuery(filter) + '">Practice this list</a><a class="btn ghost" href="#/exam' + AIP.filterQuery(filter) + '">Use for mock setup</a><a class="btn ghost" href="#/stats">Question stats</a></div></div>';
    html += '<div class="chapter-actions" style="margin-top:16px"><a class="btn" href="#/exam">Full mock exam</a><a class="btn ghost" href="#/bank">Clear filters</a></div>';
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
          html += '<span class="answer-count correct">' + (Number(s.correct) || 0) + ' right</span><span class="answer-count wrong">' + (Number(s.wrong) || 0) + ' wrong</span></a>';
        });
        html += '</div></div>';
      });
      html += '</details>';
    });
    html += '</div>';
    return html;
  };

  AIP.renderExamSetup = function (initial) {
    var all = AIP.questions || [];
    var prefs = AIP.storage.examPrefs();
    initial = initial || {};
    var selected = {
      count: prefs.count,
      strategy: prefs.strategy,
      status: initial.status || prefs.status,
      source: initial.source || prefs.source,
      domain: initial.domain != null ? initial.domain : prefs.domain,
      service: initial.service || prefs.service
    };
    var stats = AIP.storage.quiz().questions;
    var counts = { unseen: 0, wrong: 0, correct: 0 };
    all.forEach(function (q) { counts[questionState(q, stats[q.id])] += 1; });
    var selectedCount = String(selected.count || 20);
    var performance = AIP.questionPerformance(all);
    var runs = AIP.storage.examRuns();
    var html = '<div class="hero"><h1>Mock exam</h1><p class="lede">Start a new run whenever you want. Each run keeps its own answers, skips, and position; your all-time question history stays available across every run.</p></div>';
    html += '<div class="stats-grid"><div class="stat"><div class="n">' + counts.unseen + '</div><div class="l">Not answered</div></div>';
    html += '<div class="stat"><div class="n stat-wrong">' + performance.wrong + '</div><div class="l">Wrong answers</div></div>';
    html += '<div class="stat"><div class="n stat-correct">' + performance.correct + '</div><div class="l">Correct answers</div></div>';
    html += '<div class="stat"><div class="n">' + performance.accuracy + '%</div><div class="l">Answer accuracy</div></div></div>';
    html += AIP.renderPerformanceChart(performance);
    html += '<section class="saved-runs"><div class="saved-runs-head"><h2>Your mock-exam runs</h2><span>' + runs.length + ' / 2 stored on this browser</span></div>';
    if (!runs.length) {
      html += '<div class="card saved-run empty"><p>No runs yet. Build your first set below.</p></div>';
    } else {
      runs.forEach(function (run, index) {
        var answered = (run.results || []).filter(function (x) { return typeof x === "boolean"; }).length;
        var correct = (run.results || []).filter(Boolean).length;
        var wrong = answered - correct;
        var state = answered >= run.itemIds.length ? "Complete" : "In progress";
        html += '<article class="card saved-run"><div><span class="run-kicker">' + (index === 0 ? "Latest run" : "Earlier run") + ' · ' + state + '</span><h3>' + AIP.escape(run.examMode && run.examMode.strategy === "adaptive" ? "Smart practice" : "Exam mode") + ' · ' + run.itemIds.length + ' questions</h3><p>Question ' + ((Number(run.index) || 0) + 1) + ' of ' + run.itemIds.length + ' · <span class="answer-count correct">' + correct + ' right</span> · <span class="answer-count wrong">' + wrong + ' wrong</span></p></div><div class="chapter-actions"><a class="btn primary" href="#/exam?run=' + encodeURIComponent(run.id) + '">Resume</a><button type="button" class="btn ghost" data-exam="delete-run" data-run="' + AIP.escape(run.id) + '">Remove</button></div></article>';
      });
    }
    html += '</section>';
    html += '<section class="card exam-setup"><h2>Build a question set</h2><div class="exam-controls">';
    html += '<label class="exam-control"><span>Study mode</span><select data-exam-field="strategy"><option value="adaptive"' + (selected.strategy !== "exam" ? " selected" : "") + '>Smart practice (recommended)</option><option value="exam"' + (selected.strategy === "exam" ? " selected" : "") + '>Exam mode (random)</option></select><small>Smart practice uses new questions first, then missed questions.</small></label>';
    var standardCounts = ["10", "20", "50", "80"];
    var customCount = standardCounts.indexOf(selectedCount) === -1;
    html += '<label class="exam-control"><span>Question count</span><select data-exam-field="count"><option value="10"' + (selectedCount === "10" ? " selected" : "") + '>10</option><option value="20"' + (selectedCount === "20" ? " selected" : "") + '>20</option><option value="50"' + (selectedCount === "50" ? " selected" : "") + '>50</option><option value="80"' + (selectedCount === "80" ? " selected" : "") + '>80</option><option value="custom"' + (customCount ? " selected" : "") + '>Custom</option></select><input type="number" min="1" max="' + all.length + '" inputmode="numeric" data-exam-custom value="' + (customCount ? AIP.escape(selectedCount) : '') + '" placeholder="Custom count, 1–' + all.length + '"><small>Choose 10, 20, 50, 80, or enter your own count.</small></label>';
    html += '<label class="exam-control"><span>Question status</span><select data-exam-field="status"><option value="all">Any status</option><option value="unseen"' + (selected.status === "unseen" ? " selected" : "") + '>Only new questions</option><option value="wrong"' + (selected.status === "wrong" ? " selected" : "") + '>Only failed / needs review</option><option value="correct"' + (selected.status === "correct" ? " selected" : "") + '>Currently correct</option></select><small>Use this to focus a set before you start.</small></label>';
    html += '<label class="exam-control"><span>Source</span><select data-exam-field="source"><option value="all">All sources</option><option value="certsafari"' + (selected.source === "certsafari" ? " selected" : "") + '>CertSafari</option><option value="practice"' + (selected.source === "practice" ? " selected" : "") + '>Practice questions</option><option value="examtopics"' + (selected.source === "examtopics" ? " selected" : "") + '>ExamTopics</option></select></label>';
    html += '<label class="exam-control"><span>Domain</span><select data-exam-field="domain"><option value="all">All domains</option>';
    (AIP.DOMAINS || []).forEach(function (d) {
      html += '<option value="' + d.id + '"' + (String(selected.domain) === String(d.id) ? " selected" : "") + '>Domain ' + d.id + ' · ' + AIP.escape(d.short) + '</option>';
    });
    html += '</select></label>';
    var serviceCounts = AIP.serviceCounts(all);
    html += '<label class="exam-control"><span>AWS service</span><select data-exam-field="service"><option value="all">All AWS services</option>';
    SERVICE_CATALOG.forEach(function (service) {
      if (serviceCounts[service.id]) html += '<option value="' + service.id + '"' + (selected.service === service.id ? " selected" : "") + '>' + AIP.escape(service.label) + ' · ' + serviceCounts[service.id] + '</option>';
    });
    html += '</select></label></div><div class="exam-algorithm"><strong>How Smart practice chooses:</strong> unanswered questions are always selected before answered ones. Once the pool has been seen, recent wrong answers are shown first, then lower-accuracy and least-recently-seen questions. A question appears at most once in a set.</div><p class="run-limit-note">Up to two mock-exam runs are stored in this browser. Starting a third run replaces the oldest saved run; lifetime right/wrong history is never removed.</p><div class="chapter-actions"><button type="button" class="btn primary" data-exam="start">Start new run</button><a class="btn ghost" href="#/stats">Review question stats</a><a class="btn ghost" href="#/bank">Browse question list</a></div></section>';
    return html;
  };
})();
