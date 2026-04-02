// src/pages/api/submit-form.ts
import type { APIRoute } from 'astro';

export const prerender = false;

// ID del modulo estratto dai sorgenti [cite: 431]
const FORM_ID   = '1FAIpQLScvvwYovq5yB4kJZYcuuEEypdY25B98oAavAhGugnXp-GbuGA';
const FORM_VIEW = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`;
const FORM_POST = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();

    // 1. Carica la pagina del form per ottenere i token di sessione e i cookie [cite: 435]
    const pageRes  = await fetch(FORM_VIEW, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0' },
    });
    const pageHtml = await pageRes.text();
    const cookies  = pageRes.headers.get('set-cookie') ?? '';

    // 2. Estrazione del token fbzx (essenziale per validare la sottomissione) [cite: 435]
    const fbzx =
      (pageHtml.match(/\["fbzx"\]\s*=\s*"([^"]+)"/))?.[1] ||
      (pageHtml.match(/"fbzx":"([^"]+)"/))?.[1] ||
      (pageHtml.match(/name="fbzx" value="([^"]+)"/))?.[1];

    const input  = new URLSearchParams(body);
    const output = new URLSearchParams();

    // 3. COSTRUZIONE PAYLOAD: Usiamo append() invece di set() 
    // per permettere l'invio di più valori per la stessa chiave (checkbox) [cite: 435]
    for (const [k, v] of input.entries()) {
      if (k !== 'fbzx' && k !== 'fvv' && k !== 'pageHistory' && k !== 'draftResponse') {
        output.append(k, v);
      }
    }

    // 4. Aggiunta dei parametri di sistema necessari a Google [cite: 435]
    if (fbzx) output.set('fbzx', fbzx);
    output.set('fvv', '1');
    output.set('pageHistory', '0');
    output.set('draftResponse', '%.@.[]]');

    // Debug nel terminale: verifica che le chiavi multiple (es. entry.92554476) siano ripetute
    console.log("Payload finale inviato a Google:", decodeURIComponent(output.toString()));

    // 5. Invio effettivo dei dati a Google Forms [cite: 435, 436]
    const response = await fetch(FORM_POST, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer':      FORM_VIEW,
        'Origin':       'https://docs.google.com',
        'User-Agent':   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0',
        ...(cookies ? { 'Cookie': cookies } : {}),
      },
      body:     output.toString(),
      redirect: 'follow',
    });

    console.log('Risposta server Google:', response.status);

    return new Response(JSON.stringify({ ok: true, status: response.status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Proxy error:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};