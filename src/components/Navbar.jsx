import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Volume2, VolumeX, Gamepad2, BookOpen, Info, RotateCcw } from 'lucide-react';
import { sound } from '../game/soundEffects.js';

export default function Navbar() {
  const [soundOn, setSoundOn] = useState(sound.enabled);

  const toggleSound = () => {
    const newState = sound.toggle();
    setSoundOn(newState);
    if (newState) sound.playSelect();
  };

  const handleResetSave = () => {
    if (window.confirm('Mulai game baru dari awal? Seluruh progres saat ini akan direset.')) {
      localStorage.removeItem('pokeworld_save');
      window.location.href = '/game';
    }
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-pixel transition-colors ${
      isActive
        ? 'bg-red-600 text-white shadow-xs'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b-2 border-slate-800">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/game"
          onClick={() => sound.playSelect()}
          className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
        >
          <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-white/30 inline-block shadow-xs" />
          <span className="font-pixel text-xs sm:text-sm text-red-500 tracking-wider">POKÉWORLD</span>
          <span className="font-pixel text-[10px] text-slate-300 hidden sm:inline">ADVENTURE</span>
        </Link>

        {/* Navigation items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/game" className={navLinkClass} onClick={() => sound.playSelect()}>
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Game</span>
          </NavLink>
          <NavLink to="/pokedex" className={navLinkClass} onClick={() => sound.playSelect()}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pokédex</span>
          </NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={() => sound.playSelect()}>
            <Info className="w-3.5 h-3.5" />
            <span>Tentang</span>
          </NavLink>
        </nav>

        {/* Actions (Sound toggle & Reset) */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'Matikan Suara SFX' : 'Nyalakan Suara SFX'}
            title={soundOn ? 'Suara Aktif' : 'Suara Mati'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleResetSave}
            title="Reset Game Baru"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors border border-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
