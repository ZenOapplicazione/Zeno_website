// Funzioni anti-spam condivise dai moduli del sito.

const PAGE_LOADED_AT = Date.now();

// Campi tecnici da non includere nelle risposte del questionario.
export const ANTISPAM_FIELDS = new Set(['website', 'cf-turnstile-response']);

declare global {
  interface Window {
    turnstile?: { reset: (el: Element | string) => void };
  }
}

function hasTurnstile(form: HTMLFormElement) {
  return !!form.querySelector('.cf-turnstile');
}

// Aspetta (max ~8 s) che Turnstile abbia prodotto il token.
async function waitForToken(form: HTMLFormElement): Promise<string> {
  if (!hasTurnstile(form)) return '';
  for (let i = 0; i < 40; i++) {
    const input = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
    if (input?.value) return input.value;
    await new Promise((r) => setTimeout(r, 200));
  }
  return '';
}

export async function antiSpamPayload(form: HTMLFormElement) {
  const honeypot = form.querySelector<HTMLInputElement>('[name="website"]');
  return {
    website: honeypot?.value ?? '',
    elapsedMs: Date.now() - PAGE_LOADED_AT,
    turnstileToken: await waitForToken(form),
  };
}

// Il token Turnstile vale una sola volta: dopo un errore va rigenerato.
export function resetTurnstile(form: HTMLFormElement) {
  const el = form.querySelector('.cf-turnstile');
  if (el && window.turnstile) {
    try { window.turnstile.reset(el); } catch { /* ignora */ }
  }
}

// Invia una richiesta all'API protetta. Ritorna { ok, error }.
export async function postForm(form: HTMLFormElement, payload: Record<string, unknown>) {
  const res = await fetch('/api/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, ...(await antiSpamPayload(form)) }),
  });
  let error = '';
  if (!res.ok) {
    try { error = (await res.json()).error || ''; } catch { /* ignora */ }
    resetTurnstile(form);
  }
  return { ok: res.ok, error };
}
