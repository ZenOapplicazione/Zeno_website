import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────────────────────
// CONFIGURAZIONE ANTI-SPAM
// Variabili d'ambiente (Vercel → Settings → Environment Variables):
//   TURNSTILE_SECRET_KEY        chiave segreta Cloudflare Turnstile
//   PUBLIC_TURNSTILE_SITE_KEY   chiave pubblica (usata dalle pagine)
//   FORMSPREE_ENDPOINT          (facoltativa) URL Formspree per le iscrizioni
// Se TURNSTILE_SECRET_KEY non è impostata, il controllo captcha viene saltato
// (le altre protezioni restano attive).
// ─────────────────────────────────────────────────────────────

const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/maqlddnl';

// Tempo minimo (ms) tra apertura pagina e invio: un umano non è così veloce.
const MIN_ELAPSED_MS = { utenti: 10_000, produttori: 10_000, newsletter: 2_000 };

// Limite di invii per IP (best-effort: vale per singola istanza serverless).
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map();

const MAX_VALUE_LENGTH = 2000;
const MAX_FIELDS = 40;
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

// Solo queste domande vengono accettate. Se aggiungi una domanda al
// questionario, aggiungi la sua etichetta anche qui.
const ALLOWED_LABELS = {
  utenti: [
    'Quanti anni hai', 'Dove vivi', 'Situazione abitativa', 'Occupazione',
    'Tipo di dieta', 'Priorità nella spesa alimentare', 'Motivazioni vegetariano/vegano',
    'Riduzione consumo carne', 'Importanza provenienza carne/pesce', 'Dove fai la spesa',
    'Spesa mensile alimentare', 'Spesa prodotti bio/etici/locali', 'Conoscenza GAS',
    'Disponibilità al cambiamento', 'Quanto in più per prodotti etici',
    'Interesse per app GAS', 'Disponibilità a commissione', 'Valore aggiunto piattaforma',
    'Email',
  ],
  produttori: [
    'Tipo di azienda', 'Tipo di azienda (altro)', 'Dove operi', 'Certificazioni',
    'Certificazioni (altro)', 'Tipologia di prodotti', 'Canali di vendita',
    'Percentuale fatturato GAS', 'Numero di GAS serviti', 'Come gestisci gli ordini',
    'Gestione ordini (altro)', 'Frequenza ordini', 'Tempo di consolidamento',
    'Cosa vorresti migliorare', 'Miglioramento (altro)', 'Modalità di consegna',
    'Raggio di consegna', 'Ordine minimo', 'Disponibilità ad aumentare produzione',
    'Software utilizzati', 'Funzionalità desiderate', 'Rischi percepiti',
    'Disponibilità a visite', 'Utilità percepita (1-5)', 'Email',
  ],
};

// Domande obbligatorie: una risposta senza queste viene rifiutata.
const REQUIRED_LABELS = {
  utenti: [
    'Quanti anni hai', 'Dove vivi', 'Situazione abitativa', 'Occupazione', 'Tipo di dieta',
    'Priorità nella spesa alimentare', 'Dove fai la spesa', 'Spesa mensile alimentare',
    'Spesa prodotti bio/etici/locali', 'Conoscenza GAS', 'Disponibilità al cambiamento',
    'Quanto in più per prodotti etici', 'Interesse per app GAS', 'Disponibilità a commissione',
  ],
  produttori: [
    'Tipo di azienda', 'Dove operi', 'Tipologia di prodotti', 'Canali di vendita',
    'Numero di GAS serviti', 'Come gestisci gli ordini', 'Modalità di consegna',
    'Raggio di consegna', 'Disponibilità ad aumentare produzione', 'Funzionalità desiderate',
    'Disponibilità a visite', 'Utilità percepita (1-5)',
  ],
};

// ── Utility ──────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

// La richiesta deve arrivare dal sito stesso (non da un altro dominio).
function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    const originHost = new URL(origin).host;
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return originHost === host;
  } catch {
    return false;
  }
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // non ancora configurato
  if (!token || typeof token !== 'string' || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'unknown') body.append('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = await r.json();
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return false;
  }
}

async function subscribeToFormspree(email) {
  try {
    const r = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!r.ok) console.error('Formspree error:', r.status);
    return r.ok;
  } catch (err) {
    console.error('Formspree error:', err);
    return false;
  }
}

// Ripulisce e valida i campi del questionario. Ritorna null se non validi.
function sanitizeFields(type, fields) {
  if (!Array.isArray(fields) || fields.length === 0 || fields.length > MAX_FIELDS) return null;
  const allowed = new Set(ALLOWED_LABELS[type]);
  const clean = [];
  const seen = new Set();
  for (const f of fields) {
    if (!f || typeof f.label !== 'string' || typeof f.value !== 'string') return null;
    const label = f.label.trim();
    const value = f.value.trim();
    if (!allowed.has(label) || seen.has(label)) continue; // domanda sconosciuta: scartata
    if (!value) continue;
    if (value.length > MAX_VALUE_LENGTH) return null;
    seen.add(label);
    clean.push({ label, value });
  }
  for (const req of REQUIRED_LABELS[type]) {
    if (!seen.has(req)) return null;
  }
  const email = clean.find((f) => f.label === 'Email');
  if (email && !EMAIL_RE.test(email.value)) return null;
  return clean;
}

function buildEmailHtml(title, fields) {
  const color = '#1b4332';
  const rows = fields
    .map(({ label, value }, i) => {
      const bg = i % 2 === 0 ? '#f9fafb' : '#ffffff';
      return `<tr style="background:${bg}">
          <td style="padding:14px 18px;font-weight:600;color:${color};border-bottom:1px solid #e5e7eb;width:40%;font-size:14px">${escapeHtml(label)}</td>
          <td style="padding:14px 18px;color:#374151;border-bottom:1px solid #e5e7eb;font-size:14px;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>`;
    })
    .join('');

  return `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif">
        <div style="background:${color};padding:28px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#ff5e14;margin:0;font-size:32px;font-weight:900;letter-spacing:-0.02em">ZenO</h1>
          <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:14px">${escapeHtml(title)}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
          ${rows}
        </table>
        <div style="background:#f3f4f6;padding:18px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e5e7eb;border-top:none">
          <p style="margin:0;font-size:12px;color:#9ca3af">Inviato tramite zenocircle.it</p>
        </div>
      </div>
    `;
}

// ── Handler ──────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!isAllowedOrigin(req)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Troppi invii. Riprova tra qualche minuto.' });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { type, fields, email, website, elapsedMs, turnstileToken } = body;

    if (!['utenti', 'produttori', 'newsletter'].includes(type)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Honeypot compilato o invio troppo rapido → bot.
    // Rispondiamo "ok" così il bot non capisce di essere stato bloccato.
    const elapsed = Number(elapsedMs);
    if (
      (typeof website === 'string' && website.trim() !== '') ||
      !Number.isFinite(elapsed) ||
      elapsed < MIN_ELAPSED_MS[type]
    ) {
      console.warn(`Spam bloccato (${type}) da ${ip}`);
      return res.status(200).json({ success: true });
    }

    if (!(await verifyTurnstile(turnstileToken, ip))) {
      return res.status(403).json({ error: 'Verifica anti-spam non superata. Ricarica la pagina e riprova.' });
    }

    // ── Iscrizione newsletter (navbar / footer) ──
    if (type === 'newsletter') {
      const clean = typeof email === 'string' ? email.trim() : '';
      if (!clean || clean.length > 254 || !EMAIL_RE.test(clean)) {
        return res.status(400).json({ error: 'Email non valida' });
      }
      const ok = await subscribeToFormspree(clean);
      return ok
        ? res.status(200).json({ success: true })
        : res.status(502).json({ error: 'Iscrizione non riuscita' });
    }

    // ── Questionari ──
    const cleanFields = sanitizeFields(type, fields);
    if (!cleanFields) {
      return res.status(400).json({ error: 'Dati del questionario non validi' });
    }

    const title = type === 'produttori' ? 'Questionario Produttori' : 'Questionario Utenti';
    const respondentEmail = cleanFields.find((f) => f.label === 'Email')?.value;

    const { error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
      to: process.env.PUBLIC_FORM_EMAIL,
      subject: `ZenO — Nuovo ${title}`,
      html: buildEmailHtml(title, cleanFields),
      ...(respondentEmail ? { replyTo: respondentEmail } : {}),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Se ha lasciato l'email, la iscriviamo anche agli aggiornamenti.
    if (respondentEmail) await subscribeToFormspree(respondentEmail);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
