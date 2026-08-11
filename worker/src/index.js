// PermCompass self-sponsorship readiness proxy.
//
// Sits between the PermCompass PWA (GitHub Pages) and Azure OpenAI so the API
// key never touches the browser. Deployed on Cloudflare Workers. Free tier is
// plenty for this workload.
//
// Env / secrets (set with `wrangler secret put <NAME>`):
//   AZURE_OPENAI_ENDPOINT      https://<resource>.openai.azure.com
//   AZURE_OPENAI_DEPLOYMENT    e.g. gpt-4o-mini
//   AZURE_OPENAI_API_VERSION   e.g. 2024-08-01-preview
//   AZURE_OPENAI_KEY           the API key
//
// Env vars (in wrangler.toml [vars]):
//   ALLOWED_ORIGINS            comma-separated list of allowed browser origins

const MAX_INPUT_CHARS = 12000;

const SYSTEM_PROMPT = `You are a US employment-based green card readiness assessor for the two self-sponsored paths: EB-1A (Extraordinary Ability) and EB-2 NIW (National Interest Waiver).

You are NOT a lawyer. You do NOT give legal advice. You produce a structured, evidence-anchored readiness report to help the user understand where they stand and what to build next.

Rubric you MUST use:

EB-2 NIW — three gates, each green / yellow / red:
- gate1_qualifications: has US master's or higher, OR US bachelor's + 5 years progressive post-degree experience, OR "exceptional ability" (at least 3 of: field-relevant degree, 10+ years full-time experience, professional license, high salary, professional association membership, recognition for achievements).
- gate2_endeavor: proposed US work is describable in 2-3 concrete sentences, has implications beyond one company/region, and ties to a nameable US national priority (AI, semiconductors, cybersecurity, healthcare, energy, STEM, critical supply chains, public health, etc.).
- gate3_positioning: applicant has a specific record IN the endeavor area (not just adjacent), 3+ concrete accomplishments with measurable outcomes, credible plan for next steps, and could plausibly gather 5-7 letters mixing independent experts, adopters/users, and collaborators.

EB-1A — count how many of the 10 regulatory criteria the applicant can DOCUMENT with evidence a reviewer could verify (not "true" — documentable):
  awards, membership, published_about, judging, original_contributions, scholarly_articles, leading_role, high_salary, artistic, commercial.

Verdict rules:
- READY_EB1A: 6+ documentable EB-1A criteria AND strong final-merits story.
- READY_NIW: all 3 NIW gates green, EB-1A 0-3 criteria.
- CLOSABLE_GAPS: at most 1-2 items missing across NIW gates, OR EB-1A at 3-5 with thin evidence.
- STRUCTURAL_GAPS: NIW gate 1 fails, or record is entirely internal to one employer with no external visibility, or recent graduate < 18 months out.

Universal red flags (mention in caveats when present):
- graduated < 18 months ago
- entire record inside one company with no external visibility
- all recommendation-letter writers would be direct collaborators
- endeavor is really just "my current job" rephrased

Output rules:
- Respond with STRICT JSON only. No prose before or after.
- Every evidence_quote MUST be a short substring from the applicant's own submitted text. If nothing supports it, use empty string and set status accordingly.
- Never invent credentials the user did not claim.
- Be honest. If someone is not ready, say so and name what to build.

JSON schema:
{
  "verdict": "READY_EB1A" | "READY_NIW" | "CLOSABLE_GAPS" | "STRUCTURAL_GAPS",
  "summary": "2-4 sentence plain-language summary",
  "niw": {
    "gate1_qualifications": { "status": "green"|"yellow"|"red", "reason": "one sentence" },
    "gate2_endeavor":       { "status": "green"|"yellow"|"red", "reason": "one sentence" },
    "gate3_positioning":    { "status": "green"|"yellow"|"red", "reason": "one sentence" }
  },
  "eb1a": {
    "criteria_documented": <integer 0-10>,
    "criteria": [
      {
        "id": "awards"|"membership"|"published_about"|"judging"|"original_contributions"|"scholarly_articles"|"leading_role"|"high_salary"|"artistic"|"commercial",
        "status": "documented"|"partial"|"not_shown",
        "evidence_quote": "<short quote from applicant text, or empty string>",
        "gap": "what would strengthen it, or empty string if fully documented"
      }
    ]
  },
  "top_gaps": ["gap 1", "gap 2", "gap 3"],
  "confidence": "high"|"medium"|"low",
  "caveats": ["one sentence", "..."]
}`;

function corsHeaders(origin, allowed) {
  const ok = allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(body, status, extra) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...(extra || {}) }
  });
}

function buildUserMessage(intake) {
  const parts = [];
  parts.push('APPLICANT INTAKE');
  parts.push('================');
  if (intake.education) parts.push(`Highest education: ${intake.education}`);
  if (intake.field) parts.push(`Field: ${intake.field}`);
  if (intake.years_experience != null) parts.push(`Years of professional experience: ${intake.years_experience}`);
  if (intake.current_role) parts.push(`Current role: ${intake.current_role}`);
  if (intake.country_of_birth) parts.push(`Country of birth: ${intake.country_of_birth}`);
  if (intake.endeavor) {
    parts.push('');
    parts.push('PROPOSED US ENDEAVOR (applicant\'s own words):');
    parts.push(intake.endeavor);
  }
  if (Array.isArray(intake.achievements) && intake.achievements.length) {
    parts.push('');
    parts.push('CLAIMED ACHIEVEMENTS (applicant\'s own words):');
    intake.achievements.forEach((a, i) => {
      if (a && typeof a === 'string' && a.trim()) parts.push(`${i + 1}. ${a.trim()}`);
    });
  }
  if (intake.cv_paste) {
    parts.push('');
    parts.push('CV / RESUME / LINKEDIN PASTE (applicant\'s own words):');
    parts.push(intake.cv_paste);
  }
  return parts.join('\n');
}

function validateIntake(intake) {
  if (!intake || typeof intake !== 'object') return 'Missing intake payload.';
  const total = JSON.stringify(intake).length;
  if (total > MAX_INPUT_CHARS) return `Intake too large (${total} chars, max ${MAX_INPUT_CHARS}).`;
  if (!intake.endeavor || !intake.endeavor.trim()) return 'Please describe your proposed US endeavor (2-3 sentences minimum).';
  return null;
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);
    if (allowed.length && !allowed.includes(origin)) return json({ error: 'Origin not allowed' }, 403, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid JSON body' }, 400, cors); }

    const intake = body && body.intake;
    const err = validateIntake(intake);
    if (err) return json({ error: err }, 400, cors);

    const endpoint = env.AZURE_OPENAI_ENDPOINT;
    const deployment = env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = env.AZURE_OPENAI_API_VERSION;
    const apiKey = env.AZURE_OPENAI_KEY;
    if (!endpoint || !deployment || !apiVersion || !apiKey) {
      return json({ error: 'Server not configured. Set AZURE_OPENAI_* secrets.' }, 500, cors);
    }

    const azureUrl = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const payload = {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserMessage(intake) }
      ],
      temperature: 0.2,
      max_tokens: 1600,
      response_format: { type: 'json_object' }
    };

    let upstream;
    try {
      upstream = await fetch(azureUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      return json({ error: 'Upstream request failed', detail: String(e) }, 502, cors);
    }

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return json({ error: 'Upstream error', status: upstream.status, detail: text.slice(0, 500) }, 502, cors);
    }

    let raw;
    try { raw = await upstream.json(); } catch { return json({ error: 'Upstream returned non-JSON' }, 502, cors); }

    const content = raw && raw.choices && raw.choices[0] && raw.choices[0].message && raw.choices[0].message.content;
    if (!content) return json({ error: 'No content in model response' }, 502, cors);

    let parsed;
    try { parsed = JSON.parse(content); } catch { return json({ error: 'Model did not return valid JSON', raw: content.slice(0, 500) }, 502, cors); }

    return json({ result: parsed }, 200, cors);
  }
};
