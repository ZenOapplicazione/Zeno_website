// Animazione dell'hero allo scroll.
// File esterno (non inline) per rispettare la Content-Security-Policy.
// Caricato in modo sincrono subito dopo l'hero, come prima, così lo stato
// iniziale (es. logo navbar nascosto) è applicato prima del primo paint.
const heroWrapper = document.getElementById('hero-bg-wrapper');
const hero = document.getElementById('navbar-hero');
const navbarTop = document.getElementById('navbar-top');
const navbarLogo = document.getElementById('navbar-logo');
const title = document.getElementById('hero-title');
const sub = document.getElementById('hero-sub');
const waCard = document.getElementById('hero-wa-card');
const arrow = document.getElementById('hero-arrow');

const NAV_H = navbarTop ? navbarTop.offsetHeight : 64;
const HERO_H = window.innerHeight;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

let ticking = false;

function update() {
  const scrollY = window.scrollY;
  const raw = Math.min(scrollY / (HERO_H * 0.65), 1);
  const p = easeInOut(raw);
  if (heroWrapper) {
    heroWrapper.style.height = scrollY === 0 ? '100vh' : Math.max(HERO_H - scrollY, NAV_H) + 'px';
    heroWrapper.style.boxShadow = `0 2px 20px rgba(0,0,0,${lerp(0, 0.1, p)})`;
  }
  if (hero) {
    hero.style.transform = `scale(${lerp(1, 0.95, p)})`;
    hero.style.opacity = lerp(1, 0, p);
  }
  const fadeO = lerp(1, 0, easeInOut(Math.min(raw / 0.55, 1)));
  if (title) title.style.opacity = fadeO;
  if (sub) sub.style.opacity = fadeO;
  const elO = lerp(1, 0, easeInOut(Math.max(0, Math.min((raw - 0.05) / 0.45, 1))));
  if (waCard) waCard.style.opacity = elO;
  if (arrow) arrow.style.opacity = elO;
  const pe = p > 0.8 ? 'none' : 'auto';
  if (waCard) waCard.style.pointerEvents = pe;
  const barP = Math.max(0, Math.min((p - 0.6) / 0.4, 1));
  // Pulsanti e tendina sempre visibili; il logo compare solo quando l'hero si chiude
  if (navbarLogo) navbarLogo.style.opacity = barP;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(update);
    ticking = true;
  }
}, {passive: true});
update();
