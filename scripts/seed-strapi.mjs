/**
 * Strapi Seed Script
 * Populates all content types in a Strapi v5 instance via REST API.
 *
 * Usage: node scripts/seed-strapi.mjs
 *
 * Reads STRAPI_API_URL and STRAPI_API_TOKEN from .env in the project root.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

// ---------------------------------------------------------------------------
// .env parsing
// ---------------------------------------------------------------------------
function loadEnv(envPath) {
  const raw = fs.readFileSync(envPath, 'utf8');
  const vars = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    vars[key] = value;
  }
  return vars;
}

const env = loadEnv(path.join(ROOT, '.env'));
const STRAPI_URL = env.STRAPI_API_URL?.replace(/\/$/, '');
const TOKEN = env.STRAPI_API_TOKEN;

if (!STRAPI_URL || !TOKEN) {
  console.error('Missing STRAPI_API_URL or STRAPI_API_TOKEN in .env');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function strapiRequest(method, endpoint, body) {
  const url = `${STRAPI_URL}/api/${endpoint}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _raw: text };
  }

  if (!res.ok) {
    console.error(`  [${method} ${endpoint}] HTTP ${res.status}:`, JSON.stringify(json, null, 2));
    throw new Error(`Request failed: ${method} /api/${endpoint} → ${res.status}`);
  }

  return json;
}

/**
 * Upload an image file from disk to Strapi Media Library.
 * Returns the uploaded file ID.
 */
async function uploadImage(filename) {
  const filePath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image not found: ${filePath}`);
  }

  console.log(`  Uploading image: ${filename}`);

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer]);
  const form = new FormData();
  form.append('files', blob, filename);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      // Do NOT set Content-Type manually; fetch sets it with the boundary for multipart
    },
    body: form,
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Upload response not JSON: ${text}`);
  }

  if (!res.ok) {
    console.error(`  Upload failed for ${filename}:`, JSON.stringify(json, null, 2));
    throw new Error(`Upload failed for ${filename}: HTTP ${res.status}`);
  }

  const uploaded = Array.isArray(json) ? json[0] : json;
  console.log(`  Uploaded ${filename} → id=${uploaded.id}`);
  return uploaded.id;
}

/**
 * Create or update a single type via PUT.
 * In Strapi v5, PUT /api/{single-type} creates/updates the entry.
 * Pass publishedAt to publish immediately.
 */
async function seedSingleType(name, data) {
  console.log(`\nSeeding single type: ${name}`);
  const payload = {
    data: {
      ...data,
      publishedAt: new Date().toISOString(),
    },
  };

  try {
    const result = await strapiRequest('PUT', name, payload);
    console.log(`  Done. documentId=${result?.data?.documentId ?? '(unknown)'}`);
    return result;
  } catch (err) {
    console.error(`  Failed to seed ${name}:`, err.message);
    throw err;
  }
}

/**
 * Create a collection type entry via POST.
 * Pass publishedAt to publish immediately.
 */
async function seedCollectionEntry(endpoint, data, label) {
  console.log(`\nSeeding collection entry: ${label || endpoint}`);
  const payload = {
    data: {
      ...data,
      publishedAt: new Date().toISOString(),
    },
  };

  try {
    const result = await strapiRequest('POST', endpoint, payload);
    const docId = result?.data?.documentId ?? result?.data?.id ?? '(unknown)';
    console.log(`  Done. documentId=${docId}`);
    return result;
  } catch (err) {
    console.error(`  Failed to seed ${label || endpoint}:`, err.message);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Content definitions
// ---------------------------------------------------------------------------

// --- Navbar ---
const navbarData = {
  logo: 'ZenO',
  menuItems: [
    { label: 'Home', sectionTarget: '#top' },
    { label: 'Come funziona', sectionTarget: '.how-section' },
    { label: 'A chi si rivolge', sectionTarget: '.groups-section' },
    { label: 'Risparmio ambientale', sectionTarget: '.impact-section' },
    { label: 'Valore sociale', sectionTarget: '.benefits-section' },
  ],
  questionnairePopupTitle: 'Questionari',
  questionnaireLinks: [
    { label: 'Questionario utenti', url: '/questionario-utenti' },
    { label: 'Questionario produttori', url: '/questionario-produttori' },
  ],
  emailPlaceholder: 'La tua email',
  formspreeUrl: 'https://formspree.io/f/maqlddnl',
};

// --- HowItWorks (icon fields will be set to uploaded media IDs in main()) ---
const howItWorksSteps = [
  {
    iconFile: 'how-step-group.svg',
    title: 'Unisciti o crea un gruppo',
    description:
      'ZenO ti permette di accedere a una rete di acquisto sostenibile. Puoi unirti a un gruppo vicino a te oppure crearne uno nuovo in pochi minuti.',
  },
  {
    iconFile: 'how-step-location.svg',
    title: 'Scopri i produttori locali',
    description:
      'Ogni gruppo collabora con produttori selezionati in base a qualità, distanza e impatto ambientale.',
  },
  {
    iconFile: 'how-step-cart.svg',
    title: 'Ordina insieme agli altri membri',
    description:
      "Gli ordini sono collettivi: più persone partecipano, maggiore è l'efficienza logistica e il risparmio.",
  },
  {
    iconFile: 'how-step-package.svg',
    title: 'Ritira in un punto condiviso',
    description: 'La consegna avviene in un punto di ritiro organizzato dal gruppo.',
  },
  {
    iconFile: 'how-step-chart.svg',
    title: 'Monitora il tuo impatto',
    description: 'Ogni acquisto genera un report chiaro sul risparmio ambientale raggiunto.',
  },
];

// --- GroupsSection (icon fields will be set to uploaded media IDs in main()) ---
const groupsCards = [
  {
    iconFile: 'group-genitori.svg',
    title: 'Gruppo di genitori',
    color: '#407D54',
    checkColor: '#79B88D',
    scenario:
      "Un gruppo di genitori organizza la spesa per ridurre costi e garantire qualità ai figli.",
    howTheyUse: [
      { text: 'Creano un gruppo privato' },
      { text: "Inseriscono la finestra di ritiro all'uscita di scuola" },
      { text: 'Raccolgono ordini settimanali in un unico carrello collettivo' },
    ],
    value: [
      { text: 'Riduzione tempo organizzativo' },
      { text: 'Spesa più sostenibile e salutare' },
      { text: 'Coordinamento semplice' },
    ],
  },
  {
    iconFile: 'group-azienda.svg',
    title: 'Azienda con cucina interna o spazio frigo',
    color: '#1F5F61',
    checkColor: '#4B9193',
    scenario:
      "Un'azienda con cucina o spazio refrigerato decide di fare spesa collettiva per i dipendenti.",
    howTheyUse: [
      { text: "L'azienda crea un gruppo aziendale con accesso moderato" },
      { text: 'Imposta il punto di ritiro in azienda' },
      { text: 'I dipendenti ordinano individualmente' },
      { text: 'Un unico ordine aggregato viene consegnato' },
    ],
    value: [
      { text: 'Benefit aziendale concreto' },
      { text: 'Riduzione spostamenti individuali' },
      { text: 'Cultura aziendale orientata alla sostenibilità' },
    ],
  },
  {
    iconFile: 'group-gas.svg',
    title: 'GAS già costituito',
    color: '#1E4133',
    checkColor: '#4E816B',
    scenario:
      'Un Gruppo di acquisto solidale attivo vuole digitalizzare e semplificare la gestione.',
    howTheyUse: [
      { text: 'Importano membri esistenti' },
      { text: 'Gestiscono cataloghi produttori' },
      { text: 'Automatizzano raccolta ordini' },
      { text: 'Monitorano impatto ambientale e sociale' },
    ],
    value: [
      { text: 'Meno gestione manuale' },
      { text: 'Report automatici per il gruppo' },
    ],
  },
  {
    iconFile: 'group-condomini.svg',
    title: 'Condomini o gruppi di quartiere',
    color: '#558B2F',
    checkColor: '#92C66A',
    scenario: 'Un condominio o gruppo di quartiere organizza acquisti periodici.',
    howTheyUse: [
      { text: 'Creano un gruppo locale' },
      { text: 'Coordinano consegna in uno spazio comune' },
      { text: 'Alternano responsabili ritiro' },
    ],
    value: [
      { text: 'Rafforzamento relazioni locali' },
      { text: 'Riduzione duplicazione consegne' },
      { text: 'Economie di scala' },
    ],
  },
];

// --- Footer ---
const footerData = {
  logo: 'ZenO',
  tagline: 'La spesa consapevole, semplificata e condivisa.',
  emailLabel: 'Resta aggiornato',
  emailPlaceholder: 'Inserisci la tua email per restare aggiornato',
  emailButtonText: 'Iscriviti',
  formspreeUrl: 'https://formspree.io/f/maqlddnl',
  contributeTitle: 'Dai il tuo contributo',
  contributeCards: [
    {
      title: 'Questionario produttori',
      description: 'Sei un produttore? Raccontaci la tua esperienza',
      url: '/questionario-produttori',
      icon: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0026 2.66797H8.0026C7.29536 2.66797 6.61708 2.94892 6.11699 3.44902C5.61689 3.94911 5.33594 4.62739 5.33594 5.33464V26.668C5.33594 27.3752 5.61689 28.0535 6.11699 28.5536C6.61708 29.0537 7.29536 29.3346 8.0026 29.3346H24.0026C24.7098 29.3346 25.3881 29.0537 25.8882 28.5536C26.3883 28.0535 26.6693 27.3752 26.6693 26.668V9.33464L20.0026 2.66797Z" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.6641 2.66797V8.0013C18.6641 8.70855 18.945 9.38682 19.4451 9.88692C19.9452 10.387 20.6235 10.668 21.3307 10.668H26.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.3307 12H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.3307 17.332H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.3307 22.668H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      title: 'Questionario utenti',
      description: 'Aiutaci a capire le tue esigenze',
      url: '/questionario-utenti',
      icon: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0026 2.66797H8.0026C7.29536 2.66797 6.61708 2.94892 6.11699 3.44902C5.61689 3.94911 5.33594 4.62739 5.33594 5.33464V26.668C5.33594 27.3752 5.61689 28.0535 6.11699 28.5536C6.61708 29.0537 7.29536 29.3346 8.0026 29.3346H24.0026C24.7098 29.3346 25.3881 29.0537 25.8882 28.5536C26.3883 28.0535 26.6693 27.3752 26.6693 26.668V9.33464L20.0026 2.66797Z" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.6641 2.66797V8.0013C18.6641 8.70855 18.945 9.38682 19.4451 9.88692C19.9452 10.387 20.6235 10.668 21.3307 10.668H26.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.3307 12H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.3307 17.332H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.3307 22.668H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      title: 'Feedback e idee',
      description: 'Hai suggerimenti? Condividili con noi e aiutaci a migliorare',
      url: '#',
      icon: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 20C28 20.7072 27.719 21.3855 27.219 21.8856C26.7189 22.3857 26.0406 22.6667 25.3333 22.6667H9.33333L4 28V6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H25.3333C26.0406 4 26.7189 4.28095 27.219 4.78105C27.719 5.28115 28 5.95942 28 6.66667V20Z" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
  ],
  copyright: '© {year} Zen-O. Tutti i diritti riservati.',
};

// ---------------------------------------------------------------------------
// Questionnaire data
// ---------------------------------------------------------------------------
const questionnaireUtenti = {
  slug: 'questionario-utenti',
  title: 'Questionario consumatori',
  subtitle:
    'Aiutaci a capire le tue abitudini di acquisto e le tue esigenze. Ci vorranno meno di 5 minuti.',
  metaInfo: [
    {
      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      text: '~5 minuti',
    },
    {
      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
      text: 'Per consumatori',
    },
    {
      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      text: 'Dati anonimi',
    },
  ],
  successTitle: 'Grazie per il tuo contributo!',
  successMessage:
    'Le tue risposte ci aiuteranno a costruire un servizio che risponde davvero alle tue esigenze.',
  successLinkText: 'Torna alla home',
  successLinkUrl: '/',
  sections: [
    {
      title: 'Profilo personale',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      fields: [
        {
          name: 'eta',
          label: 'Quanti anni hai?',
          type: 'radio',
          required: true,
          options: [
            { label: '18–25 anni', value: '18-25' },
            { label: '26–35 anni', value: '26-35' },
            { label: '36–45 anni', value: '36-45' },
            { label: '46–60 anni', value: '46-60' },
            { label: 'Oltre 60 anni', value: '60+' },
          ],
        },
        {
          name: 'composizione_famiglia',
          label: 'Com\'è composto il tuo nucleo familiare?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Vivo da solo/a', value: 'solo' },
            { label: 'Coppia senza figli', value: 'coppia' },
            { label: 'Famiglia con figli', value: 'famiglia_figli' },
            { label: 'Convivenza con coinquilini', value: 'coinquilini' },
            { label: 'Altro', value: 'altro', hasTextInput: true },
          ],
        },
        {
          name: 'zona',
          label: 'In che tipo di zona abiti?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Centro città', value: 'centro_citta' },
            { label: 'Periferia urbana', value: 'periferia' },
            { label: 'Piccolo comune', value: 'piccolo_comune' },
            { label: 'Zona rurale', value: 'rurale' },
          ],
        },
      ],
    },
    {
      title: 'Abitudini di acquisto',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 1.95-1.57l1.65-8.42H6"/></svg>',
      fields: [
        {
          name: 'frequenza_spesa',
          label: 'Con quale frequenza fai la spesa alimentare?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Più volte a settimana', value: 'piu_volte_settimana' },
            { label: 'Una volta a settimana', value: 'settimanale' },
            { label: 'Ogni due settimane', value: 'bisettimanale' },
            { label: 'Una volta al mese', value: 'mensile' },
          ],
        },
        {
          name: 'canali_acquisto',
          label: 'Dove acquisti principalmente prodotti alimentari? (max 3)',
          type: 'checkbox',
          required: true,
          maxSelections: 3,
          options: [
            { label: 'Supermercato grande (es. Esselunga, Coop)', value: 'supermercato_grande' },
            { label: 'Supermercato di quartiere', value: 'supermercato_quartiere' },
            { label: 'Mercato rionale / contadino', value: 'mercato' },
            { label: 'Acquisto diretto da produttori locali', value: 'diretto_produttore' },
            { label: 'GAS (Gruppo di Acquisto Solidale)', value: 'gas' },
            { label: 'E-commerce / consegna a domicilio', value: 'ecommerce' },
            { label: 'Altro', value: 'altro', hasTextInput: true },
          ],
        },
        {
          name: 'spesa_mensile',
          label: 'Quanto spendi mediamente al mese per i prodotti alimentari?',
          type: 'radio',
          required: false,
          options: [
            { label: 'Meno di €100', value: '<100' },
            { label: '€100 – €200', value: '100-200' },
            { label: '€200 – €350', value: '200-350' },
            { label: '€350 – €500', value: '350-500' },
            { label: 'Più di €500', value: '>500' },
          ],
        },
        {
          name: 'priorita_acquisto',
          label: 'Cosa è più importante per te quando acquisti cibo? (max 3)',
          type: 'checkbox',
          required: true,
          maxSelections: 3,
          options: [
            { label: 'Prezzo conveniente', value: 'prezzo' },
            { label: 'Qualità del prodotto', value: 'qualita' },
            { label: 'Produzione locale / km 0', value: 'locale' },
            { label: 'Biologico / naturale', value: 'bio' },
            { label: 'Impatto ambientale', value: 'ambiente' },
            { label: 'Praticità e velocità', value: 'praticita' },
            { label: 'Equità verso il produttore', value: 'equita' },
          ],
        },
      ],
    },
    {
      title: 'Interesse per gli acquisti collettivi',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      fields: [
        {
          name: 'esperienza_gas',
          label: 'Hai mai partecipato a un GAS o gruppo di acquisto collettivo?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Sì, attualmente partecipo', value: 'si_attivo' },
            { label: 'Sì, in passato', value: 'si_passato' },
            { label: 'No, ma sono interessato/a', value: 'no_interessato' },
            { label: 'No, e non mi interessa', value: 'no_non_interessa' },
          ],
        },
        {
          name: 'motivo_no_gas',
          label: 'Perché non hai mai partecipato a un GAS?',
          type: 'checkbox',
          required: false,
          conditionalOn: 'esperienza_gas',
          conditionalValue: 'no_interessato',
          options: [
            { label: 'Non sapevo dell\'esistenza', value: 'non_sapevo' },
            { label: 'Troppo complicato da organizzare', value: 'complicato' },
            { label: 'Non trovo un gruppo vicino a me', value: 'non_trovo' },
            { label: 'Preferisco scegliere da solo/a', value: 'preferisco_solo' },
            { label: 'Non mi fido della qualità', value: 'fiducia' },
          ],
        },
        {
          name: 'interesse_zeno',
          label: 'Quanto saresti interessato/a a usare un\'app come ZenO per organizzare acquisti collettivi?',
          type: 'scale',
          required: true,
          scaleMin: 1,
          scaleMax: 5,
        },
        {
          name: 'punti_ritiro_accettabili',
          label: 'Quale distanza massima accetteresti per il punto di ritiro?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Meno di 500 m (a piedi)', value: '<500m' },
            { label: '500 m – 1 km', value: '500m-1km' },
            { label: '1 – 3 km', value: '1-3km' },
            { label: '3 – 5 km', value: '3-5km' },
            { label: 'Oltre 5 km (in auto)', value: '>5km' },
          ],
        },
        {
          name: 'frequenza_ritiro',
          label: 'Con quale frequenza preferiresti ritirare gli ordini?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Una volta a settimana', value: 'settimanale' },
            { label: 'Ogni due settimane', value: 'bisettimanale' },
            { label: 'Una volta al mese', value: 'mensile' },
            { label: 'In base alla disponibilità', value: 'flessibile' },
          ],
        },
      ],
    },
    {
      title: 'Prodotti e categorie',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
      fields: [
        {
          name: 'categorie_interesse',
          label: 'Quali categorie di prodotti ti interesserebbero di più? (max 4)',
          type: 'checkbox',
          required: true,
          maxSelections: 4,
          options: [
            { label: 'Frutta e verdura fresca', value: 'frutta_verdura' },
            { label: 'Carne e salumi', value: 'carne_salumi' },
            { label: 'Pesce', value: 'pesce' },
            { label: 'Latticini e formaggi', value: 'latticini' },
            { label: 'Uova', value: 'uova' },
            { label: 'Pane e prodotti da forno', value: 'pane_forno' },
            { label: 'Pasta, riso e cereali', value: 'pasta_cereali' },
            { label: 'Olio, conserve e dispensa', value: 'dispensa' },
            { label: 'Vino e bevande', value: 'vino_bevande' },
          ],
        },
        {
          name: 'preferenza_biologico',
          label: 'Preferiresti prodotti biologici certificati?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Sì, è fondamentale', value: 'si_fondamentale' },
            { label: 'Preferibilmente sì', value: 'preferibilmente' },
            { label: 'Non è determinante', value: 'non_determinante' },
            { label: 'No, non mi interessa', value: 'no' },
          ],
        },
      ],
    },
    {
      title: 'Aspettative e feedback',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
      fields: [
        {
          name: 'beneficio_principale',
          label: 'Qual è il principale beneficio che ti aspetteresti da ZenO?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Risparmiare denaro', value: 'risparmio_denaro' },
            { label: 'Acquistare prodotti di maggiore qualità', value: 'qualita_superiore' },
            { label: 'Ridurre l\'impatto ambientale', value: 'impatto_ambientale' },
            { label: 'Supportare produttori locali', value: 'supporto_locale' },
            { label: 'Semplificare l\'organizzazione della spesa', value: 'semplicita' },
            { label: 'Creare comunità con altri consumatori', value: 'comunita' },
          ],
        },
        {
          name: 'barriera_principale',
          label: 'Qual è la principale preoccupazione che potrebbe frenare il tuo utilizzo?',
          type: 'radio',
          required: true,
          options: [
            { label: 'La qualità dei prodotti', value: 'qualita' },
            { label: 'La complessità dell\'app', value: 'complessita' },
            { label: 'I tempi di consegna/ritiro', value: 'tempi' },
            { label: 'Il prezzo finale', value: 'prezzo' },
            { label: 'La fiducia nei produttori', value: 'fiducia' },
            { label: 'La mancanza di un gruppo vicino a me', value: 'gruppo_vicino' },
          ],
        },
        {
          name: 'disponibilita_pagamento',
          label: 'Saresti disposto/a a pagare una piccola quota mensile per accedere alla piattaforma?',
          type: 'radio',
          required: true,
          options: [
            { label: 'No, preferirei che fosse gratuita', value: 'no' },
            { label: 'Sì, fino a €2/mese', value: '2' },
            { label: 'Sì, fino a €5/mese', value: '5' },
            { label: 'Sì, fino a €10/mese', value: '10' },
            { label: 'Dipende dal servizio offerto', value: 'dipende' },
          ],
        },
        {
          name: 'commenti_liberi',
          label: 'Hai suggerimenti, idee o commenti da condividere con noi?',
          type: 'textarea',
          required: false,
          placeholder: 'Scrivi qui i tuoi pensieri...',
        },
        {
          name: 'email_aggiornamenti',
          label: 'Vuoi ricevere aggiornamenti sul lancio di ZenO? (facoltativo)',
          type: 'email',
          required: false,
          placeholder: 'La tua email',
        },
      ],
    },
  ],
};

const questionnaireProduttori = {
  slug: 'questionario-produttori',
  title: 'Questionario produttori',
  subtitle:
    'Sei un produttore agricolo o artigianale? Aiutaci a capire le tue esigenze e opportunità.',
  metaInfo: [
    {
      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      text: '~7 minuti',
    },
    {
      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
      text: 'Per produttori',
    },
    {
      icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      text: 'Dati riservati',
    },
  ],
  successTitle: 'Grazie per il tuo contributo!',
  successMessage:
    "Le tue risposte sono preziose per noi. Ti contatteremo presto per aggiornarti sull'evoluzione di ZenO.",
  successLinkText: 'Torna alla home',
  successLinkUrl: '/',
  sections: [
    {
      title: 'Informazioni sulla tua attività',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      fields: [
        {
          name: 'tipo_produzione',
          label: 'Che tipo di produzione hai?',
          type: 'checkbox',
          required: true,
          options: [
            { label: 'Ortofrutta', value: 'ortofrutta' },
            { label: 'Cereali e legumi', value: 'cereali_legumi' },
            { label: 'Allevamento (carne, salumi)', value: 'allevamento_carne' },
            { label: 'Latticini e formaggi', value: 'latticini' },
            { label: 'Uova e pollame', value: 'uova_pollame' },
            { label: 'Vino e olio', value: 'vino_olio' },
            { label: 'Miele e prodotti apicoli', value: 'miele' },
            { label: 'Prodotti trasformati / conserve', value: 'trasformati' },
            { label: 'Pane e prodotti da forno', value: 'pane_forno' },
            { label: 'Altro', value: 'altro', hasTextInput: true },
          ],
        },
        {
          name: 'dimensione_azienda',
          label: 'Qual è la dimensione della tua azienda agricola?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Micro (< 2 ha o produzione familiare)', value: 'micro' },
            { label: 'Piccola (2–10 ha)', value: 'piccola' },
            { label: 'Media (10–50 ha)', value: 'media' },
            { label: 'Grande (> 50 ha)', value: 'grande' },
          ],
        },
        {
          name: 'certificazioni',
          label: 'Hai certificazioni?',
          type: 'checkbox',
          required: false,
          options: [
            { label: 'Biologico (EU)', value: 'bio_eu' },
            { label: 'Biodinamico', value: 'biodinamico' },
            { label: 'DOP / IGP', value: 'dop_igp' },
            { label: 'Km 0 (certificazione locale)', value: 'km0' },
            { label: 'Nessuna certificazione', value: 'nessuna' },
          ],
        },
        {
          name: 'regione',
          label: 'In quale regione si trova la tua azienda?',
          type: 'text',
          required: true,
          placeholder: 'Es. Toscana, Lombardia...',
        },
      ],
    },
    {
      title: 'Canali di vendita attuali',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
      fields: [
        {
          name: 'canali_vendita',
          label: 'Attraverso quali canali vendi attualmente? (seleziona tutti)',
          type: 'checkbox',
          required: true,
          options: [
            { label: 'GDO (supermercati, ipermercati)', value: 'gdo' },
            { label: 'Negozi specializzati / bio shop', value: 'negozi_bio' },
            { label: 'Mercati locali / contadini', value: 'mercati' },
            { label: 'Vendita diretta in azienda', value: 'vendita_diretta' },
            { label: 'GAS (Gruppi di Acquisto Solidale)', value: 'gas' },
            { label: 'E-commerce proprio', value: 'ecommerce_proprio' },
            { label: 'Piattaforme online (es. Cortilia, Almaverde)', value: 'piattaforme_online' },
            { label: 'Ristorazione / HoReCa', value: 'horeca' },
            { label: 'Altro', value: 'altro', hasTextInput: true },
          ],
        },
        {
          name: 'quota_vendita_diretta',
          label: 'Che percentuale del fatturato proviene dalla vendita diretta (senza intermediari)?',
          type: 'radio',
          required: false,
          options: [
            { label: 'Meno del 10%', value: '<10' },
            { label: '10% – 30%', value: '10-30' },
            { label: '30% – 60%', value: '30-60' },
            { label: 'Più del 60%', value: '>60' },
          ],
        },
        {
          name: 'soddisfazione_canali',
          label: 'Quanto sei soddisfatto/a dei tuoi canali di vendita attuali?',
          type: 'scale',
          required: true,
          scaleMin: 1,
          scaleMax: 5,
        },
        {
          name: 'problemi_principali',
          label: 'Quali sono i principali problemi che incontri nella vendita? (max 3)',
          type: 'checkbox',
          required: true,
          maxSelections: 3,
          options: [
            { label: 'Margini troppo bassi con la GDO', value: 'margini_gdo' },
            { label: 'Logistica e trasporto costosi', value: 'logistica' },
            { label: 'Difficoltà nel trovare acquirenti', value: 'trovare_acquirenti' },
            { label: 'Spreco di prodotto invenduto', value: 'spreco' },
            { label: 'Gestione amministrativa complessa', value: 'amministrazione' },
            { label: 'Stagionalità della produzione', value: 'stagionalita' },
            { label: 'Concorrenza da prodotti importati', value: 'concorrenza' },
          ],
        },
      ],
    },
    {
      title: 'Interesse per ZenO',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
      fields: [
        {
          name: 'interesse_piattaforma',
          label: 'Quanto ti interessa una piattaforma che ti connette direttamente a gruppi di acquisto?',
          type: 'scale',
          required: true,
          scaleMin: 1,
          scaleMax: 5,
        },
        {
          name: 'disponibilita_ordini_collettivi',
          label: 'Saresti disposto/a a gestire ordini collettivi con consegna in punti di ritiro fissi?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Sì, sarebbe ideale per me', value: 'si' },
            { label: 'Sì, ma con alcune condizioni', value: 'si_condizioni' },
            { label: 'Non sono sicuro/a', value: 'incerto' },
            { label: 'No, non si adatta alla mia realtà', value: 'no' },
          ],
        },
        {
          name: 'condizioni_necessarie',
          label: 'Quali condizioni sarebbero necessarie per partecipare?',
          type: 'checkbox',
          required: false,
          conditionalOn: 'disponibilita_ordini_collettivi',
          conditionalValue: 'si_condizioni',
          options: [
            { label: 'Ordine minimo garantito per consegna', value: 'ordine_minimo' },
            { label: 'Pianificazione con sufficiente anticipo', value: 'anticipo' },
            { label: 'Pagamento rapido e sicuro', value: 'pagamento_rapido' },
            { label: 'Supporto nella logistica', value: 'logistica' },
            { label: 'Contratti flessibili', value: 'contratti_flessibili' },
          ],
        },
        {
          name: 'quantita_disponibile',
          label: 'Hai eccedenze di prodotto che potresti destinare a gruppi di acquisto?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Sì, spesso ho invenduto', value: 'si_spesso' },
            { label: 'A volte, dipende dalla stagione', value: 'a_volte' },
            { label: 'Raramente', value: 'raramente' },
            { label: 'No, produco su prenotazione', value: 'no_prenotazione' },
          ],
        },
        {
          name: 'prezzo_accettabile',
          label: 'Che tipo di prezzo ti aspetteresti dalla piattaforma?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Prezzo libero (io decido)', value: 'libero' },
            { label: 'Prezzo concordato con il gruppo', value: 'concordato' },
            { label: 'Prezzo leggermente inferiore al mercato per volume', value: 'inferiore_volume' },
            { label: 'Prezzo equo con margine minimo garantito', value: 'equo_garantito' },
          ],
        },
      ],
    },
    {
      title: 'Aspettative e contatti',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      fields: [
        {
          name: 'beneficio_atteso',
          label: 'Qual è il principale beneficio che ti aspetteresti da ZenO?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Più clienti e più vendite', value: 'piu_vendite' },
            { label: 'Margini migliori (meno intermediari)', value: 'margini_migliori' },
            { label: 'Riduzione dello spreco di prodotto', value: 'meno_spreco' },
            { label: 'Pianificazione produzione più stabile', value: 'pianificazione' },
            { label: 'Visibilità e reputazione', value: 'visibilita' },
          ],
        },
        {
          name: 'investimento_accettabile',
          label: 'Quanto saresti disposto/a a investire mensilmente nella piattaforma?',
          type: 'radio',
          required: true,
          options: [
            { label: 'Solo commissione % sulle vendite (0 fisso)', value: 'solo_commissione' },
            { label: 'Fino a €10/mese + commissione ridotta', value: '10_commissione' },
            { label: 'Fino a €30/mese (flat)', value: '30_flat' },
            { label: 'Dipende dal volume generato', value: 'dipende_volume' },
          ],
        },
        {
          name: 'nome_azienda',
          label: 'Nome della tua azienda / produzione (facoltativo)',
          type: 'text',
          required: false,
          placeholder: 'Es. Azienda Agricola Rossi',
        },
        {
          name: 'email_contatto',
          label: 'Email per essere ricontattato/a (facoltativo)',
          type: 'email',
          required: false,
          placeholder: 'La tua email professionale',
        },
        {
          name: 'commenti_produttore',
          label: 'Hai domande, proposte o commenti?',
          type: 'textarea',
          required: false,
          placeholder: 'Scrivici tutto quello che pensi...',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function main() {
  console.log('=== Strapi Seed Script ===');
  console.log(`Target: ${STRAPI_URL}\n`);

  // ---- 1. Upload images ----
  console.log('--- Uploading images ---');

  let muccaId, muccaMobileId;
  let carbonId, energyId, foodWasteId, packageWasteId;
  let diversitaId, equitaId, benessereId, educazioneId, coesioneId;

  try {
    muccaId = await uploadImage('mucca.png');
  } catch (err) {
    console.error('Could not upload mucca.png:', err.message);
  }

  try {
    muccaMobileId = await uploadImage('mucca-mobile.png');
  } catch (err) {
    console.error('Could not upload mucca-mobile.png:', err.message);
  }

  try {
    carbonId = await uploadImage('carbon_footprint.jpg');
  } catch (err) {
    console.error('Could not upload carbon_footprint.jpg:', err.message);
  }

  try {
    energyId = await uploadImage('energy_use.png');
  } catch (err) {
    console.error('Could not upload energy_use.png:', err.message);
  }

  try {
    foodWasteId = await uploadImage('food_waste.png');
  } catch (err) {
    console.error('Could not upload food_waste.png:', err.message);
  }

  try {
    packageWasteId = await uploadImage('package_waste.png');
  } catch (err) {
    console.error('Could not upload package_waste.png:', err.message);
  }

  try {
    diversitaId = await uploadImage('diversita.jpeg');
  } catch (err) {
    console.error('Could not upload diversita.jpeg:', err.message);
  }

  try {
    equitaId = await uploadImage('equita.jpeg');
  } catch (err) {
    console.error('Could not upload equita.jpeg:', err.message);
  }

  try {
    benessereId = await uploadImage('benessere_animale.jpeg');
  } catch (err) {
    console.error('Could not upload benessere_animale.jpeg:', err.message);
  }

  try {
    educazioneId = await uploadImage('educazione.jpeg');
  } catch (err) {
    console.error('Could not upload educazione.jpeg:', err.message);
  }

  try {
    coesioneId = await uploadImage('coesione.jpeg');
  } catch (err) {
    console.error('Could not upload coesione.jpeg:', err.message);
  }

  // ---- 2. Seed single types ----
  console.log('\n--- Seeding single types ---');

  // Navbar
  await seedSingleType('navbar', navbarData);

  // Hero (needs image IDs)
  const heroData = {
    title: 'ZenO',
    subtitle: 'La spesa consapevole, semplificata e condivisa.',
    desktopImage: muccaId,
    mobileImage: muccaMobileId,
    ctaButtons: [
      { label: 'Questionario consumatori', url: '/questionario-utenti', style: 'primary' },
      { label: 'Questionario produttori', url: '/questionario-produttori', style: 'secondary' },
    ],
    emailPlaceholder: 'La tua email',
    emailButtonText: 'Ricevi aggiornamenti',
    contactText: 'Hai domande? Scrivici',
    contactUrl: 'https://wa.me/393388833566?text=Ho%20domande%20su%20Zeno',
  };
  await seedSingleType('hero', heroData);

  // HowItWorks — upload step icons and build data
  console.log('\n--- Uploading HowItWorks step icons ---');
  const howSteps = [];
  for (const step of howItWorksSteps) {
    let iconId = null;
    try {
      iconId = await uploadImage(step.iconFile);
    } catch (err) {
      console.error(`Could not upload ${step.iconFile}:`, err.message);
    }
    howSteps.push({
      icon: iconId,
      title: step.title,
      description: step.description,
    });
  }
  const howItWorksData = {
    title: 'Organizza la tua spesa etica in 3 minuti',
    subtitle:
      'ZenO connette persone, produttori e punti di ritiro in un unico flusso condiviso. Gli ordini collettivi aumentano il risparmio ambientale e rendono la spesa etica più accessibile.',
    steps: howSteps,
  };
  await seedSingleType('how-it-works', howItWorksData);

  // GroupsSection — upload card icons and build data
  console.log('\n--- Uploading Groups card icons ---');
  const groupCards = [];
  for (const card of groupsCards) {
    let iconId = null;
    try {
      iconId = await uploadImage(card.iconFile);
    } catch (err) {
      console.error(`Could not upload ${card.iconFile}:`, err.message);
    }
    const { iconFile, ...rest } = card;
    groupCards.push({ ...rest, icon: iconId });
  }
  const groupsSectionData = {
    title: 'Come nasce un gruppo',
    caption: 'Esempi concreti di come diversi gruppi possono utilizzare ZenO',
    cards: groupCards,
  };
  await seedSingleType('groups-section', groupsSectionData);

  // Impact (needs image IDs)
  const impactData = {
    title: 'Ogni ordine collettivo genera impatto',
    caption: 'Risparmio indicativo in riferimento a <strong>1 kg di mele biologiche</strong>',
    metrics: [
      {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><line x1="2" y1="22" x2="11" y2="20"></line></svg>',
        backgroundImage: carbonId,
        bigNumber: '-65%',
        label: 'Carbon Footprint',
        barPercent: 35,
        stats: [
          { label: 'Filiera GDO', value: '100 kg CO₂' },
          { label: 'Filiera Zeno', value: '35 kg CO₂' },
        ],
      },
      {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
        backgroundImage: energyId,
        bigNumber: '-58%',
        label: 'Energy Use',
        barPercent: 42,
        stats: [
          { label: 'Filiera GDO', value: '100 kWh' },
          { label: 'Filiera Zeno', value: '42 kWh' },
        ],
      },
      {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"></path></svg>',
        backgroundImage: foodWasteId,
        bigNumber: '-85%',
        label: 'Food Waste',
        barPercent: 15,
        stats: [
          { label: 'Filiera GDO', value: '100%' },
          { label: 'Filiera Zeno', value: '15%' },
        ],
      },
      {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
        backgroundImage: packageWasteId,
        bigNumber: '-75%',
        label: 'Pack Waste',
        barPercent: 25,
        stats: [
          { label: 'Filiera GDO', value: '100 kg' },
          { label: 'Filiera Zeno', value: '25 kg' },
        ],
      },
    ],
  };
  await seedSingleType('impact', impactData);

  // Benefits — upload icons and build data
  console.log('\n--- Uploading Benefits icons ---');
  const benefitIconFiles = [
    'benefit-diversita.svg',
    'benefit-equita.svg',
    'benefit-benessere.svg',
    'benefit-educazione.svg',
    'benefit-coesione.svg',
  ];
  const benefitIconIds = [];
  for (const f of benefitIconFiles) {
    try {
      benefitIconIds.push(await uploadImage(f));
    } catch (err) {
      console.error(`Could not upload ${f}:`, err.message);
      benefitIconIds.push(null);
    }
  }

  const benefitsData = {
    title: 'Benefici condivisi',
    caption:
      'Oltre all\'impatto ambientale, creiamo <strong>valore per il territorio e la comunità</strong>',
    rows: [
      {
        icon: benefitIconIds[0],
        title: 'Diversità agricola e resilienza territoriale',
        image: diversitaId,
        description:
          'La grande distribuzione tende a standardizzare varietà e produzioni. I gruppi di acquisto favoriscono produttori che coltivano varietà locali, stagionali e meno industrializzate.',
        changes: [
          { text: 'Più colture diversificate' },
          { text: 'Meno dipendenza da monoculture intensive' },
          { text: 'Maggiore resilienza climatica del territorio' },
        ],
      },
      {
        icon: benefitIconIds[1],
        title: 'Equità economica per i produttori',
        image: equitaId,
        description:
          "L'intermediazione lunga comprime i margini del produttore. L'acquisto collettivo diretto aumenta la quota di valore che resta sul territorio.",
        changes: [
          { text: 'Margine più alto al produttore' },
          { text: 'Relazione diretta domanda-offerta' },
        ],
      },
      {
        icon: benefitIconIds[2],
        title: 'Benessere animale e scala produttiva sostenibile',
        image: benessereId,
        description:
          'Favoriamo realtà produttive a scala più contenuta, con pratiche meno intensive che rispettano la dignità degli animali che vengono allevati.',
        changes: [
          { text: 'Filiera più corta' },
          { text: 'Trasporto ridotto' },
          { text: 'Maggiore benessere animale' },
        ],
      },
      {
        icon: benefitIconIds[3],
        title: 'Educazione al consumo consapevole',
        image: educazioneId,
        description:
          "L'emergenza climatica e il rispetto ambientale devono modificare il nostro comportamento. Mostrare i dati sull'impatto ambientale e sociale di ciò che scegliamo aumenta la qualità delle decisioni.",
        changes: [
          { text: 'Scelte informate' },
          { text: 'Consapevolezza dei costi reali' },
          { text: 'Riduzione acquisti impulsivi' },
        ],
      },
      {
        icon: benefitIconIds[4],
        title: 'Coesione sociale e comunità attiva',
        image: coesioneId,
        description:
          'Il punto di ritiro non è solo logistica: i gruppi creano reti di collaborazione tra cittadini.',
        changes: [
          { text: 'Coordinamento locale' },
          { text: 'Responsabilità condivisa' },
          { text: 'Economia circolare di quartiere' },
        ],
      },
    ],
  };
  await seedSingleType('benefits', benefitsData);

  // Footer
  await seedSingleType('footer', footerData);

  // ---- 3. Seed questionnaires (collection type) ----
  console.log('\n--- Seeding questionnaires ---');
  await seedCollectionEntry('questionnaires', questionnaireUtenti, 'Questionario utenti');
  await seedCollectionEntry('questionnaires', questionnaireProduttori, 'Questionario produttori');

  console.log('\n=== Seeding complete! ===');
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
