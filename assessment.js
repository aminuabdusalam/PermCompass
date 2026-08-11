// PermCompass self-sponsorship readiness assessment.
//
// Wired to a Cloudflare Worker that proxies Azure OpenAI. See worker/SETUP.md
// for deployment. If ASSESSMENT_ENDPOINT is empty, the UI shows a setup notice
// instead of failing at request time.

(function (global) {
  'use strict';

  // TODO: Replace with the Cloudflare Worker URL after `wrangler deploy`.
  // See worker/SETUP.md for the deploy walkthrough.
  var ASSESSMENT_ENDPOINT = '';

  var STORAGE_KEY = 'pc_assessment_v1';

  var VERDICT_META = {
    READY_EB1A:      { label: 'Ready for EB-1A',       cls: 'verdict-strong',   emoji: '🏆' },
    READY_NIW:       { label: 'Ready for EB-2 NIW',    cls: 'verdict-strong',   emoji: '🚀' },
    CLOSABLE_GAPS:   { label: 'Closable gaps',         cls: 'verdict-medium',   emoji: '🛠️' },
    STRUCTURAL_GAPS: { label: 'Not yet — structural gaps', cls: 'verdict-weak', emoji: '⏳' }
  };

  var EB1A_LABELS = {
    awards: 'Awards for excellence',
    membership: 'Membership in elite associations',
    published_about: 'Published material about you',
    judging: 'Judging others\' work',
    original_contributions: 'Original contributions of major significance',
    scholarly_articles: 'Authorship of scholarly articles',
    leading_role: 'Leading or critical role',
    high_salary: 'High salary or remuneration',
    artistic: 'Artistic exhibitions/showcases',
    commercial: 'Commercial success in performing arts'
  };

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function loadDraft() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function saveDraft(draft) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch (e) {}
  }

  function readForm(root) {
    var val = function (id) { var el = root.querySelector('#' + id); return el ? el.value.trim() : ''; };
    var achievements = [];
    root.querySelectorAll('textarea.assess-achievement').forEach(function (t) {
      var s = t.value.trim(); if (s) achievements.push(s);
    });
    return {
      education: val('assess-education'),
      field: val('assess-field'),
      years_experience: val('assess-years') ? Number(val('assess-years')) : null,
      current_role: val('assess-role'),
      country_of_birth: val('assess-country'),
      endeavor: val('assess-endeavor'),
      cv_paste: val('assess-cv'),
      achievements: achievements
    };
  }

  function formHtml(draft) {
    var achievementsHtml = '';
    var achievements = (draft.achievements && draft.achievements.length) ? draft.achievements : ['', ''];
    while (achievements.length < 2) achievements.push('');
    achievements.forEach(function (a, i) {
      achievementsHtml += '<textarea class="assess-achievement" rows="2" placeholder="Achievement ' + (i + 1) +
        ' — what, where, when, and the measurable impact.">' + esc(a) + '</textarea>';
    });

    return '<div class="chapter-content assessment-form">' +
      '<h2>Self-sponsorship readiness check</h2>' +
      '<p class="assessment-lede">Answer as accurately as you can. An AI reviewer will map your input to the EB-1A and EB-2 NIW rubric and return a structured readiness report. This is a planning aid, not legal advice.</p>' +
      '<div class="info-card accent"><p><strong>Privacy note:</strong> Your input is sent to the assessment service and forwarded to an AI model to produce your report. Do not paste government IDs, SSNs, or immigration case numbers.</p></div>' +

      '<h3>About you</h3>' +
      '<label>Highest education<select id="assess-education">' +
        ['', 'PhD', 'Master\'s', 'Bachelor\'s', 'Other'].map(function (o) {
          return '<option value="' + esc(o) + '"' + (draft.education === o ? ' selected' : '') + '>' + esc(o || 'Select…') + '</option>';
        }).join('') +
      '</select></label>' +
      '<label>Field / discipline<input id="assess-field" type="text" placeholder="e.g. Applied AI, biomedical engineering, cybersecurity" value="' + esc(draft.field || '') + '" /></label>' +
      '<label>Years of professional experience<input id="assess-years" type="number" min="0" max="60" step="1" value="' + esc(draft.years_experience != null ? draft.years_experience : '') + '" /></label>' +
      '<label>Current role<input id="assess-role" type="text" placeholder="e.g. Senior ML Engineer at a large tech company" value="' + esc(draft.current_role || '') + '" /></label>' +
      '<label>Country of birth (chargeability)<input id="assess-country" type="text" placeholder="e.g. Nigeria" value="' + esc(draft.country_of_birth || '') + '" /></label>' +

      '<h3>Your proposed US endeavor</h3>' +
      '<p class="assess-help">2 to 3 sentences. What is the specific work you propose to do in the US, and why does it matter beyond one company or one region?</p>' +
      '<textarea id="assess-endeavor" rows="4" placeholder="e.g. Build open-source tooling that lets US public-sector agencies verify AI systems for safety and compliance. Ties to the NIST AI RMF and OMB M-24-10.">' + esc(draft.endeavor || '') + '</textarea>' +

      '<h3>Your top achievements</h3>' +
      '<p class="assess-help">Concrete, verifiable, and quantified where possible. Add more with the + button.</p>' +
      '<div id="assess-achievements">' + achievementsHtml + '</div>' +
      '<button type="button" class="btn btn-outline btn-add-achievement">+ Add another achievement</button>' +

      '<h3>Optional: paste your CV or LinkedIn summary</h3>' +
      '<p class="assess-help">Copy and paste any text you\'d like the reviewer to consider. Skip if you\'d rather rely on the fields above.</p>' +
      '<textarea id="assess-cv" rows="6" placeholder="Paste text only. Do not paste files or images.">' + esc(draft.cv_paste || '') + '</textarea>' +

      '<div class="content-actions">' +
        '<button type="button" class="btn btn-primary btn-lg" id="btn-assess-run">Assess my readiness</button>' +
        '<button type="button" class="btn btn-outline" id="btn-assess-clear">Clear</button>' +
      '</div>' +
      '<p class="assessment-disclaimer">Educational only, not legal advice. Consult an immigration attorney before filing.</p>' +
    '</div>';
  }

  function setupNoticeHtml() {
    return '<div class="chapter-content assessment-form">' +
      '<h2>Assessment not configured yet</h2>' +
      '<p>The AI-powered readiness check needs a small Cloudflare Worker to hold the Azure OpenAI key server-side. Once deployed, set <code>ASSESSMENT_ENDPOINT</code> in <code>assessment.js</code>.</p>' +
      '<p>Follow the 5-minute walkthrough in <code>worker/SETUP.md</code>.</p>' +
    '</div>';
  }

  function loadingHtml() {
    return '<div class="chapter-content"><div class="assessment-loading"><div class="assessment-spinner"></div><h3>Reviewing your submission…</h3><p>Usually takes 10 to 30 seconds.</p></div></div>';
  }

  function errorHtml(msg) {
    return '<div class="chapter-content assessment-form">' +
      '<h2>Something went wrong</h2>' +
      '<p>' + esc(msg) + '</p>' +
      '<div class="content-actions"><button type="button" class="btn btn-primary btn-lg" id="btn-assess-back">Back to form</button></div>' +
    '</div>';
  }

  function gateHtml(name, gate) {
    if (!gate) return '';
    var status = gate.status || 'yellow';
    return '<div class="assess-gate assess-gate-' + esc(status) + '">' +
      '<div class="assess-gate-dot"></div>' +
      '<div class="assess-gate-body"><div class="assess-gate-name">' + esc(name) + '</div>' +
      '<div class="assess-gate-reason">' + esc(gate.reason || '') + '</div></div></div>';
  }

  function eb1aRowHtml(row) {
    var label = EB1A_LABELS[row.id] || row.id;
    var status = row.status || 'not_shown';
    var icon = status === 'documented' ? '✅' : status === 'partial' ? '🟡' : '⚪';
    var quote = row.evidence_quote ? '<div class="assess-crit-quote">"' + esc(row.evidence_quote) + '"</div>' : '';
    var gap = row.gap ? '<div class="assess-crit-gap"><em>To strengthen:</em> ' + esc(row.gap) + '</div>' : '';
    return '<li class="assess-crit assess-crit-' + esc(status) + '">' +
      '<div class="assess-crit-head"><span class="assess-crit-icon">' + icon + '</span><span class="assess-crit-label">' + esc(label) + '</span></div>' +
      quote + gap + '</li>';
  }

  function resultsHtml(result) {
    var meta = VERDICT_META[result.verdict] || { label: result.verdict || 'Assessed', cls: '', emoji: '📋' };
    var niw = result.niw || {};
    var eb1a = result.eb1a || { criteria_documented: 0, criteria: [] };
    var caveats = Array.isArray(result.caveats) ? result.caveats : [];
    var gaps = Array.isArray(result.top_gaps) ? result.top_gaps : [];
    var conf = result.confidence || 'medium';

    var html = '<div class="chapter-content assessment-results">';
    html += '<div class="verdict-banner ' + esc(meta.cls) + '">' +
      '<span class="verdict-emoji">' + esc(meta.emoji) + '</span>' +
      '<div><div class="verdict-label">' + esc(meta.label) + '</div>' +
      '<div class="verdict-summary">' + esc(result.summary || '') + '</div></div>' +
    '</div>';

    html += '<h3>EB-2 NIW — three gates</h3>';
    html += '<div class="assess-gates">' +
      gateHtml('Gate 1: Qualifications', niw.gate1_qualifications) +
      gateHtml('Gate 2: Endeavor', niw.gate2_endeavor) +
      gateHtml('Gate 3: Positioning', niw.gate3_positioning) +
    '</div>';

    html += '<h3>EB-1A — documentable criteria (' + esc(eb1a.criteria_documented != null ? eb1a.criteria_documented : 0) + ' / 10)</h3>';
    if (eb1a.criteria && eb1a.criteria.length) {
      html += '<ul class="assess-criteria">';
      eb1a.criteria.forEach(function (row) { html += eb1aRowHtml(row); });
      html += '</ul>';
    }

    if (gaps.length) {
      html += '<h3>Top gaps to close</h3><ol class="assess-top-gaps">';
      gaps.forEach(function (g) { html += '<li>' + esc(g) + '</li>'; });
      html += '</ol>';
    }

    if (caveats.length) {
      html += '<div class="info-card"><h3>Caveats</h3><ul>';
      caveats.forEach(function (c) { html += '<li>' + esc(c) + '</li>'; });
      html += '</ul></div>';
    }

    html += '<p class="assess-confidence">Reviewer confidence: <strong>' + esc(conf) + '</strong></p>';
    html += '<p class="assessment-disclaimer">Educational only, not legal advice. Consult an immigration attorney before filing.</p>';
    html += '<div class="content-actions">' +
      '<button type="button" class="btn btn-primary btn-lg" id="btn-assess-back">Edit inputs and re-run</button>' +
    '</div></div>';
    return html;
  }

  function wireForm(root) {
    root.querySelectorAll('input, textarea, select').forEach(function (el) {
      el.addEventListener('change', function () { saveDraft(readForm(root)); });
      el.addEventListener('blur', function () { saveDraft(readForm(root)); });
    });
    var addBtn = root.querySelector('.btn-add-achievement');
    if (addBtn) addBtn.addEventListener('click', function () {
      var list = root.querySelector('#assess-achievements');
      var idx = list.querySelectorAll('textarea').length + 1;
      if (idx > 8) return;
      var t = document.createElement('textarea');
      t.className = 'assess-achievement'; t.rows = 2;
      t.placeholder = 'Achievement ' + idx + ' — what, where, when, and the measurable impact.';
      list.appendChild(t);
      t.focus();
    });
    var runBtn = root.querySelector('#btn-assess-run');
    if (runBtn) runBtn.addEventListener('click', function () { runAssessment(root); });
    var clearBtn = root.querySelector('#btn-assess-clear');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      if (!confirm('Clear all inputs on this device?')) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      renderInto(root);
    });
  }

  function runAssessment(root) {
    var intake = readForm(root);
    saveDraft(intake);
    if (!intake.endeavor || intake.endeavor.length < 30) {
      alert('Please describe your proposed US endeavor in at least 2 to 3 sentences.');
      root.querySelector('#assess-endeavor').focus();
      return;
    }
    if (!ASSESSMENT_ENDPOINT) {
      root.innerHTML = setupNoticeHtml();
      return;
    }
    root.innerHTML = loadingHtml();
    fetch(ASSESSMENT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intake: intake })
    }).then(function (res) {
      return res.json().then(function (body) { return { ok: res.ok, body: body }; });
    }).then(function (r) {
      if (!r.ok) {
        var msg = (r.body && r.body.error) ? r.body.error : ('HTTP ' + (r.body && r.body.status || ''));
        root.innerHTML = errorHtml(msg);
        wireBack(root);
        return;
      }
      var result = r.body && r.body.result;
      if (!result) { root.innerHTML = errorHtml('Empty response from the assessment service.'); wireBack(root); return; }
      root.innerHTML = resultsHtml(result);
      wireBack(root);
    }).catch(function (e) {
      root.innerHTML = errorHtml('Network error: ' + (e && e.message ? e.message : String(e)));
      wireBack(root);
    });
  }

  function wireBack(root) {
    var btn = root.querySelector('#btn-assess-back');
    if (btn) btn.addEventListener('click', function () { renderInto(root); });
  }

  function renderInto(root) {
    var draft = loadDraft();
    root.innerHTML = formHtml(draft);
    wireForm(root);
  }

  global.PermCompassAssessment = {
    render: function (root) { renderInto(root); }
  };
})(window);
