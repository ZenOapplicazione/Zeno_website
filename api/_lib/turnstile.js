// Verifica server-side dei token Cloudflare Turnstile.
// I file in api/_lib non diventano endpoint su Vercel (prefisso "_").

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || undefined;
}

// Restituisce { ok: true } oppure { ok: false, status } da usare come risposta HTTP.
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY non configurata');
    return { ok: false, status: 500 };
  }
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { ok: false, status: 403 };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body });
    const outcome = await res.json();
    if (!outcome.success) {
      console.warn('Turnstile rifiutato:', outcome['error-codes']);
      return { ok: false, status: 403 };
    }
    return { ok: true };
  } catch (err) {
    console.error('Errore verifica Turnstile:', err);
    return { ok: false, status: 502 };
  }
}

export function rejectCaptcha(res, status) {
  return res
    .status(status)
    .json({ error: status === 403 ? 'Verifica anti-bot non superata' : 'Server error' });
}
