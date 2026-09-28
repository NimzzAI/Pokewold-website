/**
 * Site Configuration for PokéWorld Adventure
 * Centralized settings for metadata, URLs, OpenGraph, and SEO.
 */

// Fallback host if environment variables are not set during SSR or initial static build
const DEFAULT_SITE_URL = 'https://ais-pre-4plyuawrilseu3ejlaqxw5-28343948057.asia-southeast1.run.app';

/**
 * Resolves the primary base URL of the application.
 * Priority:
 * 1. VITE_SITE_URL (custom domain, e.g. on Vercel)
 * 2. VITE_APP_URL (AI Studio Cloud Run URL injected automatically)
 * 3. window.location.origin (runtime browser context)
 * 4. DEFAULT_SITE_URL (build-time fallback)
 */
export function getSiteUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_SITE_URL) {
      return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '');
    }
    if (import.meta.env.VITE_APP_URL) {
      return import.meta.env.VITE_APP_URL.replace(/\/+$/, '');
    }
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return DEFAULT_SITE_URL;
}

export const siteConfig = {
  name: 'PokéWorld Adventure',
  shortName: 'PokéWorld',
  tagline: 'Classic 8-Bit Pokémon RPG Game',
  title: 'PokéWorld Adventure — Classic 8-Bit Pokémon RPG Game',
  description:
    'Playable classic Pokémon-style pixel RPG in the browser. Explore tile-based maps, discover wild Pokémon with PokeAPI, battle gym leaders, and collect badges.',
  keywords: [
    'Pokemon',
    'Pokemon RPG',
    'Pixel Art',
    'Retro RPG',
    'PokeAPI',
    'Turn-based Battle',
    'Pokédex',
    'Pokemon Fan Game',
    'Browser RPG',
    '8-Bit Game'
  ],
  author: 'PokéWorld Adventure Team',
  locale: 'id_ID',
  alternateLocale: 'en_US',
  themeColor: '#0f172a',
  accentColor: '#ef4444',
  ogImage: '/og-image.png',
  ogImageAlt: 'PokéWorld Adventure — Playable 8-Bit Pixel Pokémon RPG Banner',
  ogImageType: 'image/png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  favicon: '/favicon.svg',
  version: '1.0.0',
  links: {
    pokeApi: 'https://pokeapi.co',
    vercel: 'https://vercel.com',
  },
  routes: {
    home: '/',
    game: '/game',
    pokedex: '/pokedex',
    about: '/about',
  }
};

/**
 * Returns an absolute URL for a given relative path
 * @param {string} path - e.g. '/pokedex' or '/og-image.png'
 * @returns {string} - e.g. 'https://your-domain.com/pokedex'
 */
export function getAbsoluteUrl(path = '') {
  const baseUrl = getSiteUrl();
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${baseUrl}${cleanPath}`;
}

export default siteConfig;
