// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite'; // Plugin di Vite per Tailwind 4
import icon from 'astro-icon'; // Integrazione di Astro

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Le integrazioni di Astro vanno qui
  integrations: [
    icon()
  ],

  vite: {
    // I plugin puri di Vite vanno qui
    plugins: [tailwindcss()],
    // Nessuno script inline nell'HTML: tutti diventano file in /_astro/.
    // Serve alla Content-Security-Policy (vercel.json) per vietare gli script inline.
    build: { assetsInlineLimit: 0 }
  },

  adapter: vercel()
});