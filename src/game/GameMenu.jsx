import { useState } from 'react';
import { sound } from './soundEffects.js';
import TypeBadge from '../components/TypeBadge.jsx';

export default function GameMenu({
  gameState,
  onSave,
  onClose,
  onUseItemOnPokemon,
  onSwitchPokemonLead
}) {
  // Tabs: 'ROOT' | 'PARTY' | 'BAG' | 'POKEDEX' | 'TRAINER'
  const [currentTab, setCurrentTab] = useState('ROOT');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [soundActive, setSoundActive] = useState(sound.enabled);

  const handleSave = () => {
    sound.playCatch();
    onSave();
    setSaveSuccessMsg('Permainan berhasil disimpan! 💾');
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const handleToggleSound = () => {
    const newState = sound.toggle();
    setSoundActive(newState);
    if (newState) sound.playSelect();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg rpg-dialog-box rounded-2xl p-5 shadow-2xl space-y-4">

        {/* ROOT MAIN MENU */}
        {currentTab === 'ROOT' && (
          <div className="space-y-3">
            <div className="border-b-2 border-slate-700 pb-2 flex items-center justify-between">
              <span className="font-pixel text-xs text-red-600 font-bold">MENU UTAMA</span>
              <span className="font-pixel text-[10px] text-slate-500">POKÉWORLD</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-pixel text-xs">
              <button
                onClick={() => {
                  sound.playSelect();
                  setCurrentTab('PARTY');
                }}
                className="p-3 bg-white hover:bg-slate-100 border-2 border-slate-400 rounded-xl text-left flex items-center gap-2"
              >
                <span>🟢 POKÉMON ({gameState.party.length})</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setCurrentTab('BAG');
                }}
                className="p-3 bg-white hover:bg-slate-100 border-2 border-slate-400 rounded-xl text-left flex items-center gap-2"
              >
                <span>🎒 TAS / BAG</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setCurrentTab('TRAINER');
                }}
                className="p-3 bg-white hover:bg-slate-100 border-2 border-slate-400 rounded-xl text-left flex items-center gap-2"
              >
                <span>🪪 TRAINER CARD</span>
              </button>

              <button
                onClick={handleSave}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-500 text-emerald-800 rounded-xl text-left flex items-center gap-2"
              >
                <span>💾 SIMPAN GAME</span>
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-2 bg-emerald-100 border border-emerald-400 rounded-lg text-emerald-800 font-pixel text-[10px] text-center">
                {saveSuccessMsg}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-slate-300">
              <button
                onClick={handleToggleSound}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-pixel text-[9px] text-slate-700"
              >
                {soundActive ? '🔊 SUARA: AKTIF' : '🔇 SUARA: MATI'}
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-pixel text-xs shadow-md"
              >
                TUTUP MENU
              </button>
            </div>
          </div>
        )}

        {/* PARTY VIEW */}
        {currentTab === 'PARTY' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-700 pb-2">
              <span className="font-pixel text-xs font-bold text-slate-900">TIM POKÉMON ({gameState.party.length}/6)</span>
              <button
                onClick={() => setCurrentTab('ROOT')}
                className="text-[10px] font-pixel text-slate-500 hover:text-slate-900"
              >
                ← KEMBALI
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {gameState.party.map((pkmn, idx) => (
                <div
                  key={pkmn.id + '-' + idx}
                  className="p-2.5 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={pkmn.sprites.front}
                      alt={pkmn.displayName}
                      className="w-12 h-12 object-contain pixel-art"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-pixel text-xs font-bold text-slate-900">
                        <span>{pkmn.displayName}</span>
                        <span className="text-[10px] text-amber-600">Lv{pkmn.level}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {pkmn.types.map(t => (
                          <TypeBadge key={t} type={t} size="xs" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-pixel text-[10px]">
                    <div className="text-slate-600">HP: {pkmn.currentHp}/{pkmn.maxHp}</div>
                    {idx > 0 && (
                      <button
                        onClick={() => {
                          sound.playSelect();
                          onSwitchPokemonLead(idx);
                        }}
                        className="mt-1 px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded border border-blue-300 text-[8px]"
                      >
                        Jadikan Utama
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BAG / INVENTORY */}
        {currentTab === 'BAG' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-700 pb-2">
              <span className="font-pixel text-xs font-bold text-slate-900">TAS TRAINER</span>
              <button
                onClick={() => setCurrentTab('ROOT')}
                className="text-[10px] font-pixel text-slate-500 hover:text-slate-900"
              >
                ← KEMBALI
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {gameState.bag.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-between font-pixel text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                  <div className="text-amber-700 font-bold text-sm">
                    x{item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRAINER CARD & OBJECTIVES */}
        {currentTab === 'TRAINER' && (
          <div className="space-y-3 font-pixel">
            <div className="flex items-center justify-between border-b-2 border-slate-700 pb-2">
              <span className="text-xs font-bold text-slate-900">KARTU PELATIH</span>
              <button
                onClick={() => setCurrentTab('ROOT')}
                className="text-[10px] text-slate-500 hover:text-slate-900"
              >
                ← KEMBALI
              </button>
            </div>

            <div className="p-4 bg-white border-2 border-slate-300 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 text-[10px]">NAMA:</span>
                <strong className="text-red-600">{gameState.playerName}</strong>
              </div>

              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 text-[10px]">UANG SAKU:</span>
                <strong className="text-amber-600">${gameState.money}</strong>
              </div>

              <div className="space-y-1.5 border-b border-slate-200 pb-2">
                <span className="text-slate-500 text-[10px]">LENCANA GYM (BADGES):</span>
                <div className="flex gap-2">
                  {gameState.badges.length > 0 ? (
                    gameState.badges.map(b => (
                      <span
                        key={b}
                        className="px-2 py-1 bg-amber-100 border border-amber-400 text-amber-900 rounded text-[9px] font-bold"
                      >
                        🏅 {b}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">Belum ada lencana</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 text-[10px]">MISI AKTIF:</span>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-700 leading-relaxed">
                  <strong>{gameState.questTitle}</strong>
                  <p className="mt-1 text-slate-500">{gameState.questDesc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
