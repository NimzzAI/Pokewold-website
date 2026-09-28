import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Gamepad2, Database, Swords, Globe, Share2, Image as ImageIcon } from 'lucide-react';
import { sound } from '../game/soundEffects.js';
import SEO from '../components/SEO.jsx';
import siteConfig, { getSiteUrl, getAbsoluteUrl } from '../config/site.js';

export default function AboutPage() {
  const currentSiteUrl = getSiteUrl();
  const ogImageUrl = getAbsoluteUrl(siteConfig.ogImage);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 select-none">
      <SEO
        title="Tentang Proyek Game & Konfigurasi"
        description="Informasi proyek Pokémon PokéWorld Adventure, metadata website, preview OpenGraph, panduan kontrol, dan konfigurasi site URL."
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
          <div>
            <h1 className="font-pixel text-base sm:text-lg text-white">TENTANG POKÉWORLD ADVENTURE</h1>
            <p className="text-xs font-pixel text-slate-400 mt-1">Browser-Based 8-Bit Pokémon RPG Game</p>
          </div>
          <Link
            to="/game"
            onClick={() => sound.playSelect()}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-pixel text-xs flex items-center gap-1.5 shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Mainkan Game</span>
          </Link>
        </div>

        {/* Disclaimer Card */}
        <div className="p-4 bg-red-950/30 border-2 border-red-900 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-pixel text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>DISCLAIMER PROYEK PENGGEMAR (FAN PROJECT)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Website ini adalah proyek non-komersial buatan penggemar (*fan-made*) dan <strong>bukan produk resmi</strong>.
            Pokémon, nama karakter, gambar, dan aset terkait merupakan hak cipta dan merek dagang milik{' '}
            <strong className="text-white">Nintendo, Game Freak, dan The Pokémon Company</strong>.
            Semua data Pokémon diperoleh melalui API publik PokeAPI.co murni untuk tujuan edukasi dan apresiasi komunitas.
          </p>
        </div>

        {/* Website Metadata & OpenGraph Config Card */}
        <div className="p-4 bg-slate-900 border-2 border-slate-800 rounded-xl space-y-3 font-pixel">
          <div className="flex items-center gap-2 text-cyan-400 text-xs">
            <Globe className="w-4 h-4" />
            <span>KONFIGURASI METADATA & OPENGRAPH (SEO)</span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Situs ini telah dilengkapi metadata lengkap, OpenGraph card untuk preview di media sosial (WhatsApp, Twitter/X, Discord, Telegram, LinkedIn), favicons, dan Schema.org JSON-LD.
          </p>

          <div className="space-y-2 text-[10px] font-sans">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400 font-pixel text-[9px]">CANONICAL SITE URL:</span>
              <code className="text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded break-all">{currentSiteUrl}</code>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400 font-pixel text-[9px]">OG IMAGE URL (1200x630):</span>
              <a
                href={siteConfig.ogImage}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline break-all"
              >
                {ogImageUrl}
              </a>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400 font-pixel text-[9px]">ENV CONFIG (VERCEL):</span>
              <code className="text-emerald-400 font-mono text-[11px]">VITE_SITE_URL="https://your-domain.vercel.app"</code>
            </div>
          </div>

          {/* Social Share Preview Card */}
          <div className="pt-2">
            <div className="text-[10px] text-slate-400 mb-2 flex items-center gap-1.5">
              <Share2 className="w-3 h-3 text-amber-400" />
              <span>PREVIEW SOCIAL SHARE CARD (OPENGRAPH / TWITTER):</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-w-lg shadow-xl">
              <div className="aspect-[1200/630] relative w-full bg-slate-900 border-b border-slate-800">
                <img
                  src={siteConfig.ogImage}
                  alt={siteConfig.ogImageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 space-y-1">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
                  {currentSiteUrl.replace(/^https?:\/\//, '')}
                </div>
                <div className="text-xs font-bold text-white font-sans">
                  {siteConfig.title}
                </div>
                <div className="text-[11px] text-slate-400 font-sans line-clamp-2">
                  {siteConfig.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Guide */}
        <div className="p-4 bg-slate-900 border-2 border-slate-800 rounded-xl space-y-3 font-pixel">
          <div className="flex items-center gap-2 text-amber-400 text-xs">
            <Gamepad2 className="w-4 h-4" />
            <span>PANDUAN KONTROL PERMAINAN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-white block text-xs">🎮 DESKTOP / KEYBOARD</strong>
              <div className="text-slate-400">Bergerak: <span className="text-white">Panah / W, A, S, D</span></div>
              <div className="text-slate-400">Interaksi / Bicara: <span className="text-white">Enter / Spasi</span></div>
              <div className="text-slate-400">Buka Menu: <span className="text-white">M / Escape</span></div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <strong className="text-white block text-xs">📱 HP / TOUCHSCREEN</strong>
              <div className="text-slate-400">D-Pad Virtual: <span className="text-white">Tombol 4 Arah</span></div>
              <div className="text-slate-400">Tombol A: <span className="text-white">Aksi & Konfirmasi</span></div>
              <div className="text-slate-400">Tombol B: <span className="text-white">Batal / Tutup</span></div>
              <div className="text-slate-400">Tombol START: <span className="text-white">Buka Menu Game</span></div>
            </div>
          </div>
        </div>

        {/* Story & Progression */}
        <div className="p-4 bg-slate-900 border-2 border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-pixel text-xs">
            <Swords className="w-4 h-4" />
            <span>ALUR PERJALANAN & DUNIA GAME</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Kamu memulai perjalanan di <strong>Oakvale Town</strong>. Kunjungi Laboratorium Prof. Oak untuk memilih salah satu dari 3 Starter Pokémon (Bulbasaur, Charmander, Squirtle).
            Lalu lintasi <strong>Route 1</strong> dengan semak liar, masuki <strong>Emerald Forest</strong> yang lebat, telusuri <strong>Rockfall Cave</strong>, hingga tiba di <strong>Oakhaven City</strong> untuk menantang <strong>Gym Leader Brock</strong> dan merebut <em>Boulder Badge</em>!
          </p>
        </div>

        {/* Tech Stack */}
        <div className="p-4 bg-slate-900 border-2 border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-pixel text-xs">
            <Database className="w-4 h-4" />
            <span>ARSITEKTUR TEKNOLOGI</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Dibangun dengan <strong>React + Vite (JavaScript)</strong>, HTML5 Canvas 2D Tile Renderer (60 FPS pixel-perfect), Web Audio API Synthesizer (efek suara retro mandiri tanpa file MP3 eksternal), serta PokeAPI REST API. Penyimpanan progres sepenuhnya berjalan di sisi peramban melalui <code>localStorage</code>.
          </p>
        </div>

        {/* Back to Game Button */}
        <div className="text-center pt-2">
          <Link
            to="/game"
            onClick={() => sound.playSelect()}
            className="inline-block py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-pixel text-xs rounded-xl shadow-lg shadow-red-950/50"
          >
            MULAI BERMAIN SEKARANG! ⚔️
          </Link>
        </div>
      </div>
    </div>
  );
}
