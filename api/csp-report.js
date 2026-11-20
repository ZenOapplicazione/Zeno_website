// Riceve le violazioni della Content-Security-Policy e le scrive nei log di Vercel.
// Serve a capire se la policy (oggi in Report-Only) si può attivare senza rompere nulla.
// Supporta sia il vecchio formato "report-uri" sia il nuovo "Reporting API" (report-to).

const MAX_REPORTS = 20;
const MAX_FIELD = 300;

function parseBody(body) {
  if (body == null) return null;
  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (body.length > 64 * 1024) return null;
    try { return JSON.parse(body); } catch { return null; }
  }
  return body;
}

const clip = (v) => (typeof v === 'string' ? v.slice(0, MAX_FIELD) : undefined);

function normalize(payload) {
  // report-uri: { "csp-report": { ... } }
  if (payload && payload['csp-report']) {
    const r = payload['csp-report'];
    return [{
      directive: clip(r['effective-directive'] || r['violated-directive']),
      blocked: clip(r['blocked-uri']),
      page: clip(r['document-uri']),
      source: clip(r['source-file']),
    }];
  }
  // report-to: [{ type: "csp-violation", body: { ... } }, ...]
  if (Array.isArray(payload)) {
    return payload
      .filter((r) => r && r.type === 'csp-violation' && r.body)
      .slice(0, MAX_REPORTS)
      .map(({ body: b }) => ({
        directive: clip(b.effectiveDirective),
        blocked: clip(b.blockedURL),
        page: clip(b.documentURL),
        source: clip(b.sourceFile),
      }));
  }
  return [];
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  for (const report of normalize(parseBody(req.body))) {
    console.warn('[csp-violation]', JSON.stringify(report));
  }
  return res.status(204).end();
}
