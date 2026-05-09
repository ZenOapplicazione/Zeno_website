// src/lib/data.ts — Static content for all sections (replaces Strapi CMS)

// ─── Navbar ───
export const navbarData = {
  logo: 'ZenO',
  menuItems: [
    { label: 'Home', target: 'top' },
    { label: 'Come funziona', target: 'howSection' },
    { label: 'A chi si rivolge', target: 'groupsSection' },
    { label: 'Risparmio ambientale', target: 'impactSection' },
    { label: 'Valore sociale', target: 'benefitsSection' },
  ],
  questionnairePopupTitle: 'Questionari',
  questionnaires: [
    { slug: 'questionario-utenti', title: 'Questionario utenti' },
    { slug: 'questionario-produttori', title: 'Questionario produttori' },
  ],
  emailPlaceholder: 'La tua email',
  formspreeUrl: 'https://formspree.io/f/maqlddnl',
};

// ─── Hero ───
export const heroData = {
  title: 'ZenO',
  subtitle: 'La spesa consapevole, semplificata e condivisa.',
  desktopImage: { url: '/images/mucca.png', alternativeText: 'Mucca ZenO' },
  mobileImage: { url: '/images/mucca-mobile.png', alternativeText: 'Mucca ZenO mobile' },
  whatsappHtml: '<p>Vuoi comprare alimenti più buoni e più etici dai produttori che vuoi sostenere?</p> <p><strong>Scrivici su WhatsApp</strong>.</p>',
  whatsappLink: 'https://wa.me/393388833566?text=Ho%20domande%20su%20Zeno',
  whatsappButtonText: 'Inizia su WhatsApp',
};

// ─── HowItWorks ───
export const howItWorksData = {
  title: 'Organizza la tua spesa etica in 3 minuti',
  subtitle:
    'ZenO connette persone, produttori e punti di ritiro in un unico flusso condiviso. Gli ordini collettivi aumentano il risparmio ambientale e rendono la spesa etica più accessibile.',
  steps: [
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
  ],
};

// ─── Groups ───
export const groupsData = {
  title: 'Come nasce un gruppo',
  caption: 'Esempi concreti di come diversi gruppi possono utilizzare ZenO',
  cards: [
    {
      iconFile: 'group-genitori.svg',
      title: 'Gruppo di genitori',
      color: '#407D54',
      checkColor: '#79B88D',
      scenario:
        'Un gruppo di genitori organizza la spesa per ridurre costi e garantire qualità ai figli.',
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
  ],
};

// ─── Impact ───
export const impactData = {
  title: 'Ogni ordine collettivo genera impatto',
  caption: 'Risparmio indicativo in riferimento a <strong>1 kg di mele biologiche</strong>',
  metrics: [
    {
      iconSvg:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><line x1="2" y1="22" x2="11" y2="20"></line></svg>',
      backgroundImage: '/images/carbon_footprint.jpg',
      bigNumber: '-65%',
      label: 'Carbon Footprint',
      barPercent: 35,
      stats: [
        { label: 'Filiera GDO', value: '100 kg CO₂' },
        { label: 'Filiera Zeno', value: '35 kg CO₂' },
      ],
    },
    {
      iconSvg:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      backgroundImage: '/images/energy_use.png',
      bigNumber: '-58%',
      label: 'Energy Use',
      barPercent: 42,
      stats: [
        { label: 'Filiera GDO', value: '100 kWh' },
        { label: 'Filiera Zeno', value: '42 kWh' },
      ],
    },
    {
      iconSvg:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"></path></svg>',
      backgroundImage: '/images/food_waste.png',
      bigNumber: '-85%',
      label: 'Food Waste',
      barPercent: 15,
      stats: [
        { label: 'Filiera GDO', value: '100%' },
        { label: 'Filiera Zeno', value: '15%' },
      ],
    },
    {
      iconSvg:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
      backgroundImage: '/images/package_waste.png',
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

// ─── Benefits ───
export const benefitsData = {
  title: 'Benefici condivisi',
  caption:
    'Oltre all\'impatto ambientale, creiamo <strong>valore per il territorio e la comunità</strong>',
  rows: [
    {
      iconFile: 'benefit-diversita.svg',
      title: 'Diversità agricola e resilienza territoriale',
      image: { url: '/images/diversita.jpeg', alternativeText: 'Diversità agricola' },
      description:
        'La grande distribuzione tende a standardizzare varietà e produzioni. I gruppi di acquisto favoriscono produttori che coltivano varietà locali, stagionali e meno industrializzate.',
      changes: [
        { text: 'Più colture diversificate' },
        { text: 'Meno dipendenza da monoculture intensive' },
        { text: 'Maggiore resilienza climatica del territorio' },
      ],
    },
    {
      iconFile: 'benefit-equita.svg',
      title: 'Equità economica per i produttori',
      image: { url: '/images/equita.jpeg', alternativeText: 'Equità economica' },
      description:
        "L'intermediazione lunga comprime i margini del produttore. L'acquisto collettivo diretto aumenta la quota di valore che resta sul territorio.",
      changes: [
        { text: 'Margine più alto al produttore' },
        { text: 'Relazione diretta domanda-offerta' },
      ],
    },
    {
      iconFile: 'benefit-benessere.svg',
      title: 'Benessere animale e scala produttiva sostenibile',
      image: { url: '/images/benessere_animale.jpeg', alternativeText: 'Benessere animale' },
      description:
        'Favoriamo realtà produttive a scala più contenuta, con pratiche meno intensive che rispettano la dignità degli animali che vengono allevati.',
      changes: [
        { text: 'Filiera più corta' },
        { text: 'Trasporto ridotto' },
        { text: 'Maggiore benessere animale' },
      ],
    },
    {
      iconFile: 'benefit-educazione.svg',
      title: 'Educazione al consumo consapevole',
      image: { url: '/images/educazione.jpeg', alternativeText: 'Educazione al consumo' },
      description:
        "L'emergenza climatica e il rispetto ambientale devono modificare il nostro comportamento. Mostrare i dati sull'impatto ambientale e sociale di ciò che scegliamo aumenta la qualità delle decisioni.",
      changes: [
        { text: 'Scelte informate' },
        { text: 'Consapevolezza dei costi reali' },
        { text: 'Riduzione acquisti impulsivi' },
      ],
    },
    {
      iconFile: 'benefit-coesione.svg',
      title: 'Coesione sociale e comunità attiva',
      image: { url: '/images/coesione.jpeg', alternativeText: 'Coesione sociale' },
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

// ─── Footer ───
export const footerData = {
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
      iconSvg:
        '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0026 2.66797H8.0026C7.29536 2.66797 6.61708 2.94892 6.11699 3.44902C5.61689 3.94911 5.33594 4.62739 5.33594 5.33464V26.668C5.33594 27.3752 5.61689 28.0535 6.11699 28.5536C6.61708 29.0537 7.29536 29.3346 8.0026 29.3346H24.0026C24.7098 29.3346 25.3881 29.0537 25.8882 28.5536C26.3883 28.0535 26.6693 27.3752 26.6693 26.668V9.33464L20.0026 2.66797Z" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.6641 2.66797V8.0013C18.6641 8.70855 18.945 9.38682 19.4451 9.88692C19.9452 10.387 20.6235 10.668 21.3307 10.668H26.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.3307 12H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.3307 17.332H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.3307 22.668H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      title: 'Questionario utenti',
      description: 'Aiutaci a capire le tue esigenze',
      url: '/questionario-utenti',
      iconSvg:
        '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0026 2.66797H8.0026C7.29536 2.66797 6.61708 2.94892 6.11699 3.44902C5.61689 3.94911 5.33594 4.62739 5.33594 5.33464V26.668C5.33594 27.3752 5.61689 28.0535 6.11699 28.5536C6.61708 29.0537 7.29536 29.3346 8.0026 29.3346H24.0026C24.7098 29.3346 25.3881 29.0537 25.8882 28.5536C26.3883 28.0535 26.6693 27.3752 26.6693 26.668V9.33464L20.0026 2.66797Z" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.6641 2.66797V8.0013C18.6641 8.70855 18.945 9.38682 19.4451 9.88692C19.9452 10.387 20.6235 10.668 21.3307 10.668H26.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.3307 12H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.3307 17.332H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.3307 22.668H10.6641" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      title: 'Feedback e idee',
      description: 'Hai suggerimenti? Condividili con noi e aiutaci a migliorare',
      url: '#',
      iconSvg:
        '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 20C28 20.7072 27.719 21.3855 27.219 21.8856C26.7189 22.3857 26.0406 22.6667 25.3333 22.6667H9.33333L4 28V6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H25.3333C26.0406 4 26.7189 4.28095 27.219 4.78105C27.719 5.28115 28 5.95942 28 6.66667V20Z" stroke="#6A8F5A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
  ],
  copyright: '© {year} Zen-O. Tutti i diritti riservati.',
};
