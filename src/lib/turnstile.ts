// Cloudflare Turnstile — protezione anti-bot per i form.
//
// Il widget è in modalità "interaction-only": per la maggior parte degli utenti
// è invisibile e compare solo se Cloudflare ritiene necessaria un'interazione.
// Ogni token è monouso, quindi getTurnstileToken() ricrea il widget a ogni
// chiamata e restituisce sempre un token nuovo.

// La site key è pubblica (finisce comunque nell'HTML). La secret key NON va mai
// nel frontend: vive solo nelle variabili d'ambiente del server e su Formspree.
const SITE_KEY: string =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAGD8MXiFWe9Ms8yf';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TOKEN_TIMEOUT_MS = 60_000;

/** Nome del campo che Formspree si aspetta per verificare il token. */
export const TURNSTILE_FIELD = 'cf-turnstile-response';

type TurnstileSize = 'normal' | 'compact' | 'flexible';

interface TurnstileApi {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window { turnstile?: TurnstileApi; }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile non disponibile')));
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error('Impossibile caricare Turnstile'));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Precarica lo script così il primo invio non deve aspettarlo. */
export function preloadTurnstile(): void {
  loadTurnstile().catch(() => {});
}

const activeWidgets = new WeakMap<HTMLElement, string>();

/**
 * Esegue la verifica Turnstile dentro `container` e restituisce un token nuovo.
 * Va chiamata una volta per ogni richiesta da proteggere.
 */
export async function getTurnstileToken(
  container: HTMLElement,
  size: TurnstileSize = 'normal',
): Promise<string> {
  const turnstile = await loadTurnstile();

  const previous = activeWidgets.get(container);
  if (previous) {
    try { turnstile.remove(previous); } catch { /* già rimosso */ }
    activeWidgets.delete(container);
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Verifica Turnstile scaduta')), TOKEN_TIMEOUT_MS);
    const done = (fn: () => void) => { clearTimeout(timer); fn(); };

    const id = turnstile.render(container, {
      sitekey: SITE_KEY,
      appearance: 'interaction-only',
      size,
      language: 'it',
      callback: (token: string) => done(() => resolve(token)),
      'error-callback': () => done(() => reject(new Error('Verifica Turnstile fallita'))),
      'timeout-callback': () => done(() => reject(new Error('Verifica Turnstile scaduta'))),
    });
    activeWidgets.set(container, id);
  });
}

