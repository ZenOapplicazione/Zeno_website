// Iscrizione newsletter → contatto HubSpot, solo dopo la verifica Cloudflare Turnstile.
import { clientIp, rejectCaptcha, verifyTurnstile } from './_lib/turnstile.js';
import { isValidEmail, upsertHubSpotContact } from './_lib/hubspot.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, turnstileToken } = req.body || {};

  const captcha = await verifyTurnstile(turnstileToken, clientIp(req));
  if (!captcha.ok) return rejectCaptcha(res, captcha.status);

  if (!isValidEmail(email?.trim?.())) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const ok = await upsertHubSpotContact(email.trim());
  return ok
    ? res.status(200).json({ success: true })
    : res.status(502).json({ error: 'Failed to save contact' });
}
