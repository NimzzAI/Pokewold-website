import { useState, useEffect } from 'react';
import { Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { POKEMON_TYPES } from '../utils/typeChart.js';
import TypeBadge from '../components/TypeBadge.jsx';
import SEO from '../components/SEO.jsx';
import { sound } from '../game/soundEffects.js';
import { getPokemonData, FALLBACK_POKEMON } from '../services/pokeapi.js';

const POKEDEX_POOL = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  25, 26, 41, 42, 66, 67, 68, 74, 75, 76, 95, 130, 143, 149, 150
];

export default function PokedexPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      try {
        const promises = POKEDEX_POOL.map(id => getPokemonData(id).catch(() => FALLBACK_POKEMON[id] || null));
        const res = await Promise.all(promises);
        if (active) {
          setList(res.filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to load pokedex', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => { active = false; };
  }, []);

  const filtered = list.filter(p => {
    const matchesSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.id) === searchTerm;
    const matchesType = selectedType === 'all' || p.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 select-none">
      <SEO
        title="Pokédex Kanto Database"
        description="Daftar lengkap Pokémon dari PokeAPI dengan filter tipe, stats HP, Attack, Defense, Speed, dan sprite resmi."
      />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <h1 className="font-pixel text-base sm:text-lg text-white">POKÉDEX DATABASE</h1>
            </div>
            <p className="text-xs font-pixel text-slate-400 mt-1">Data referensi resmi powered by PokeAPI</p>
          </div>

          <Link
            to="/game"
            onClick={() => sound.playSelect()}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-pixel text-xs flex items-center gap-1.5 shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Game</span>
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama Pokémon atau nomor ID..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 pl-9 text-xs font-pixel text-slate-100 placeholder-slate-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            <button
              onClick={() => {
                sound.playSelect();
                setSelectedType('all');
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-pixel transition-colors ${
                selectedType === 'all'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              SEMUA
            </button>
            {POKEMON_TYPES.map(t => (
              <button
                key={t}
                onClick={() => {
                  sound.playSelect();
                  setSelectedType(t);
                }}
                className={`transition-transform active:scale-95 ${
                  selectedType === t ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <TypeBadge type={t} size="xs" />
              </button>
            ))}
          </div>
        </div>

        {/* Pokémon Grid */}
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-pixel text-xs text-slate-400">MEMUAT POKÉDEX...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filtered.map(pk => (
              <div
                key={pk.id}
                onClick={() => {
                  sound.playSelect();
                  setSelectedDetail(pk);
                }}
                className="bg-slate-900 hover:bg-slate-850 border-2 border-slate-800 hover:border-red-500/60 rounded-xl p-3 flex flex-col items-center text-center cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <span className="font-pixel text-[9px] text-slate-500 self-start">
                  #{String(pk.id).padStart(3, '0')}
                </span>
                <img
                  src={pk.sprites.front}
                  alt={pk.displayName}
                  className="w-16 h-16 object-contain pixel-art my-1"
                />
                <span className="font-pixel text-[11px] font-bold text-white truncate w-full">
                  {pk.displayName}
                </span>
                <div className="flex gap-1 mt-1.5">
                  {pk.types.map(t => (
                    <TypeBadge key={t} type={t} size="xs" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 font-pixel text-xs">
            Tidak ada Pokémon yang cocok dengan pencarian.
          </div>
        )}

        {/* Detail Modal */}
        {selectedDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-sm rpg-dialog-box rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b-2 border-slate-700 pb-2">
                <span className="font-pixel text-xs text-slate-500">#{selectedDetail.id}</span>
                <h3 className="font-pixel text-sm font-bold text-slate-900">{selectedDetail.displayName}</h3>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="text-xs font-pixel text-slate-600 hover:text-red-600"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-center p-2 bg-white rounded-xl border border-slate-300">
                <img
                  src={selectedDetail.sprites.artwork || selectedDetail.sprites.front}
                  alt={selectedDetail.displayName}
                  className="w-32 h-32 object-contain pixel-art drop-shadow"
                />
              </div>

              <div className="flex gap-1 justify-center">
                {selectedDetail.types.map(t => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>

              {/* Base Stats */}
              <div className="p-3 bg-white rounded-xl border border-slate-300 font-pixel text-[10px] space-y-1">
                <div className="flex justify-between"><span>HP:</span><strong className="text-slate-900">{selectedDetail.baseStats.hp}</strong></div>
                <div className="flex justify-between"><span>Attack:</span><strong className="text-slate-900">{selectedDetail.baseStats.attack}</strong></div>
                <div className="flex justify-between"><span>Defense:</span><strong className="text-slate-900">{selectedDetail.baseStats.defense}</strong></div>
                <div className="flex justify-between"><span>Sp. Atk:</span><strong className="text-slate-900">{selectedDetail.baseStats.specialAttack}</strong></div>
                <div className="flex justify-between"><span>Sp. Def:</span><strong className="text-slate-900">{selectedDetail.baseStats.specialDefense}</strong></div>
                <div className="flex justify-between"><span>Speed:</span><strong className="text-slate-900">{selectedDetail.baseStats.speed}</strong></div>
              </div>

              <button
                onClick={() => setSelectedDetail(null)}
                className="w-full py-2 bg-slate-800 text-white rounded-xl font-pixel text-xs"
              >
                TUTUP
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
