---
// src/components/Groups.astro
---
<style>
  .groups-section {
    background-color: #F4F3ED; 
    padding: 5rem 1.5rem;
    font-family: var(--font-body, system-ui, -apple-system, sans-serif);
    color: #111827;
  }

  .groups-inner {
    max-width: 1100px;
    margin: 0 auto;
  }

  .groups-header {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .groups-header h2 {
    font-family: var(--font-display, inherit);
    font-size: clamp(2.5rem, 5vw, 4.5rem); 
    font-weight: 300;
    margin-bottom: 0.5rem;
    color: #2E3A28;
  }

  .groups-header p {
    font-size: clamp(0.9rem, 1.2vw, 1.1rem);
    max-width: 700px;
    margin: 0.8rem auto 0;
    color: #4B5563;
  }

  .groups-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  /* --- CARD BASE --- */
  .gcard {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.8rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .gcard:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  }

  /* --- HEADER DELLA CARD --- */
  .gcard-head {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0; /* Rimosso, gestito ora dal body */
  }

  .gcard-icon {
    width: 48px;
    height: 48px;
    background-color: var(--card-color);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #ffffff; 
  }

  .gcard-icon svg {
    width: 24px;
    height: 24px;
  }

  .gcard-head h3 {
    font-family: var(--font-body, inherit); 
    font-size: 1.35rem;
    font-weight: 500;
    margin: 0;
    color: #111827;
    line-height: 1.2;
  }

  /* --- CORPO CENTRALE (Magia del centraggio verticale) --- */
  .gcard-body {
    margin-top: auto;
    margin-bottom: auto;
    padding: 1.5rem 0;
  }

  /* --- ETICHETTE E TESTI --- */
  .gcard-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #374151;
    margin-bottom: 0.6rem;
    margin-top: 1.5rem;
  }
  
  .gcard-body .gcard-label:first-child {
    margin-top: 0;
  }

  .gcard-scenario {
    font-size: 0.95rem;
    color: #4B5563;
    line-height: 1.45;
    margin-bottom: 0;
  }

  /* --- LISTE --- */
  .gcard-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .gcard-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.95rem;
    color: #374151;
    line-height: 1.4;
  }

  .list-arrows li svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 0.1rem;
    color: var(--card-color);
  }

  /* --- BOX VALORE GENERATO --- */
  .gcard-value-box {
    background-color: var(--card-color);
    border-radius: 8px;
    padding: 1.4rem;
  }

  .gcard-value-box .gcard-label {
    color: #ffffff;
    margin-top: 0;
  }

  .list-checks li {
    color: #ffffff;
  }

  .list-checks li svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 0.1rem;
    color: var(--check-color);
  }

  /* Responsive */
  @media (max-width: 992px) {
    .groups-grid { grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;}
  }

  @media (max-width: 576px) {
    .gcard { padding: 1.2rem; }
    .gcard-value-box { padding: 1.2rem; }
    .gcard-head h3 { font-size: 1.2rem; }
  }
</style>

<section class="groups-section">
  <div class="groups-inner">
    <div class="groups-header fade-up">
      <h2>Come nasce un gruppo</h2>
      <p>Esempi concreti di come diversi gruppi possono utilizzare ZenO</p>
    </div>

    <div class="groups-grid">
      
      <div class="gcard fade-up" style="--card-color: #407D54; --check-color: #79B88D;">
        
        <div class="gcard-head">
          <div class="gcard-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </div>
          <h3>Gruppo di genitori</h3>
        </div>

        <div class="gcard-body">
          <div class="gcard-label">SCENARIO</div>
          <p class="gcard-scenario">Un gruppo di genitori organizza la spesa per ridurre costi e garantire qualità ai figli.</p>

          <div class="gcard-label">COME USANO L'APP</div>
          <ul class="gcard-list list-arrows">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Creano un gruppo privato</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Inseriscono la finestra di ritiro all'uscita di scuola</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Raccolgono ordini settimanali in un unico carrello collettivo</span>
            </li>
          </ul>
        </div>

        <div class="gcard-value-box">
          <div class="gcard-label">VALORE GENERATO</div>
          <ul class="gcard-list list-checks">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Riduzione tempo organizzativo</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Spesa più sostenibile e salutare</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Coordinamento semplice</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="gcard fade-up" style="--card-color: #1F5F61; --check-color: #4B9193;">
        
        <div class="gcard-head">
          <div class="gcard-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M4 10h16"/><path d="M8 14h.01"/><path d="M8 18h.01"/></svg>
          </div>
          <h3>Azienda con cucina<br>interna o spazio frigo</h3>
        </div>

        <div class="gcard-body">
          <div class="gcard-label">SCENARIO</div>
          <p class="gcard-scenario">Un'azienda con cucina o spazio refrigerato decide di fare spesa collettiva per i dipendenti.</p>

          <div class="gcard-label">COME USANO L'APP</div>
          <ul class="gcard-list list-arrows">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>L'azienda crea un gruppo aziendale con accesso moderato</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Imposta il punto di ritiro in azienda</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>I dipendenti ordinano individualmente</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Un unico ordine aggregato viene consegnato</span>
            </li>
          </ul>
        </div>

        <div class="gcard-value-box">
          <div class="gcard-label">VALORE GENERATO</div>
          <ul class="gcard-list list-checks">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Benefit aziendale concreto</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Riduzione spostamenti individuali</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Cultura aziendale orientata alla sostenibilità</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="gcard fade-up" style="--card-color: #1E4133; --check-color: #4E816B;">
        
        <div class="gcard-head">
          <div class="gcard-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3>GAS già costituito</h3>
        </div>

        <div class="gcard-body">
          <div class="gcard-label">SCENARIO</div>
          <p class="gcard-scenario">Un Gruppo di acquisto solidale attivo vuole digitalizzare e semplificare la gestione.</p>

          <div class="gcard-label">COME USANO L'APP</div>
          <ul class="gcard-list list-arrows">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Importano membri esistenti</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Gestiscono cataloghi produttori</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Automatizzano raccolta ordini</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Monitorano impatto ambientale e sociale</span>
            </li>
          </ul>
        </div>

        <div class="gcard-value-box">
          <div class="gcard-label">VALORE GENERATO</div>
          <ul class="gcard-list list-checks">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Meno gestione manuale</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Report automatici per il gruppo</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="gcard fade-up" style="--card-color: #558B2F; --check-color: #92C66A;">
        
        <div class="gcard-head">
          <div class="gcard-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 24.5V15.1667C17.5 14.8572 17.3771 14.5605 17.1583 14.3417C16.9395 14.1229 16.6428 14 16.3333 14H11.6667C11.3572 14 11.0605 14.1229 10.8417 14.3417C10.6229 14.5605 10.5 14.8572 10.5 15.1667V24.5" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.5 11.6648C3.49992 11.3253 3.57389 10.99 3.71675 10.6821C3.85962 10.3742 4.06793 10.1012 4.32717 9.88209L12.4938 2.88326C12.915 2.52732 13.4486 2.33203 14 2.33203C14.5514 2.33203 15.085 2.52732 15.5062 2.88326L23.6728 9.88209C23.9321 10.1012 24.1404 10.3742 24.2832 10.6821C24.4261 10.99 24.5001 11.3253 24.5 11.6648V22.1648C24.5 22.7836 24.2542 23.3771 23.8166 23.8147C23.379 24.2523 22.7855 24.4981 22.1667 24.4981H5.83333C5.21449 24.4981 4.621 24.2523 4.18342 23.8147C3.74583 23.3771 3.5 22.7836 3.5 22.1648V11.6648Z" stroke="white" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          </div>
          <h3>Condomini o gruppi di quartiere</h3>

          
        </div>

        <div class="gcard-body">
          <div class="gcard-label">SCENARIO</div>
          <p class="gcard-scenario">Un condominio o gruppo di quartiere organizza acquisti periodici.</p>

          <div class="gcard-label">COME USANO L'APP</div>
          <ul class="gcard-list list-arrows">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Creano un gruppo locale</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Coordinano consegna in uno spazio comune</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span>Alternano responsabili ritiro</span>
            </li>
          </ul>
        </div>

        <div class="gcard-value-box">
          <div class="gcard-label">VALORE GENERATO</div>
          <ul class="gcard-list list-checks">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Rafforzamento relazioni locali</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Riduzione duplicazione consegne</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span>Economie di scala</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>