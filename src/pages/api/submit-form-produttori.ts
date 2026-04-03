// src/pages/api/submit-form.ts
import type { APIRoute } from 'astro';

export const prerender = false;

// ID del modulo estratto dai sorgenti [cite: 431]
const FORM_ID   = '1FAIpQLScvvwYovq5yB4kJZYcuuEEypdY25B98oAavAhGugnXp-GbuGA';
const FORM_VIEW = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`;
const FORM_POST = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

// src/pages/api/submit-form-produttori.ts
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const input = new URLSearchParams(body);
    const output = new URLSearchParams();

    // Filtra solo i campi entry.XXXX necessari [cite: 143, 144]
    for (const [k, v] of input.entries()) {
      if (k.startsWith('entry.')) {
        output.append(k, v);
      }
    }

    // Parametri minimi richiesti da Google
    output.set('fvv', '1');
    output.set('pageHistory', '0');

    const response = await fetch(FORM_POST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // NON inserire Referer o Origin se il 403 persiste
      },
      body: output.toString(),
    });

    // Se ricevi ancora 403, Google sta bloccando l'IP o richiede fbzx
    return new Response(JSON.stringify({ ok: response.ok, status: response.status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
};