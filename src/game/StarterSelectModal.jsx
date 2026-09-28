import { useState } from 'react';
import { sound } from './soundEffects.js';
import TypeBadge from '../components/TypeBadge.jsx';

const STARTERS = [
  {
    id: 1,
    name: 'bulbasaur',
    displayName: 'Bulbasaur',
    types: ['grass', 'poison'],
    description: 'Pokémon benih tanaman. Memiliki pertahanan seimbang dan jurus Grass seperti Vine Whip.',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
  },
  {
    id: 4,
    name: 'charmander',
    displayName: 'Charmander',
    types: ['fire'],
    description: 'Pokémon kadal api. Memiliki kecepatan tinggi dan serangan Fire mematikan seperti Ember.',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
  },
  {
    id: 7,
    name: 'squirtle',
    displayName: 'Squirtle',
    types: ['water'],
    description: 'Pokémon kura-kura kecil. Memiliki cangkang kokoh dan serangan Water seperti Water Gun.',
    artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
  }
];

export default function StarterSelectModal({ onSelectStarter, onClose }) {
  const [selectedId, setSelectedId] = useState(1);

  const current = STARTERS.find(s => s.id === selectedId) || STARTERS[0];

  const handleConfirm = () => {
    sound.playCatch();
    onSelectStarter(current);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg rpg-dialog-box rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="border-b-2 border-slate-700 pb-3 text-center">
          <h2 className="text-sm sm:text-base font-pixel text-slate-900">
            PILIH STARTER POKÉMON!
          </h2>
          <p className="text-[10px] font-pixel text-slate-600 mt-1">
            Pilih pasangan pertamamu untuk memulai petualangan
          </p>
        </div>

        {/* 3 Starter Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {STARTERS.map(st => {
            const isChosen = st.id === selectedId;
            return (
              <button
                key={st.id}
                onClick={() => {
                  sound.playSelect();
                  setSelectedId(st.id);
                }}
                className={`p-2.5 rounded-xl border-2 font-pixel text-[10px] transition-all flex flex-col items-center gap-2 ${
                  isChosen
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-md ring-2 ring-red-400'
                    : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                }`}
              >
                <img
                  src={st.artwork}
                  alt={st.displayName}
                  className="w-16 h-16 object-contain pixel-art drop-shadow-sm"
                />
                <span className="font-bold text-[11px] truncate w-full text-center">
                  {st.displayName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Starter Spotlight */}
        <div className="p-3 bg-white border-2 border-slate-300 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-xs font-bold text-slate-900">
              {current.displayName}
            </span>
            <div className="flex gap-1">
              {current.types.map(t => (
                <TypeBadge key={t} type={t} size="xs" />
              ))}
            </div>
          </div>
          <p className="text-[10px] font-pixel text-slate-600 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl border-2 border-slate-400 bg-slate-200 hover:bg-slate-300 text-slate-800 font-pixel text-[10px]"
          >
            BATAL
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-pixel text-[10px] shadow-lg shadow-red-950/40"
          >
            PILIH {current.displayName.toUpperCase()}!
          </button>
        </div>
      </div>
    </div>
  );
}
