import { useState } from 'react';
import { sound } from './soundEffects.js';

const MART_ITEMS = [
  { id: 'pokeball', name: 'Poké Ball', price: 200, desc: 'Alat untuk menangkap Pokémon liar.' },
  { id: 'potion', name: 'Potion', price: 100, desc: 'Memulihkan 20 HP Pokémon yang terluka.' },
  { id: 'super_potion', name: 'Super Potion', price: 250, desc: 'Memulihkan 50 HP Pokémon.' },
  { id: 'antidote', name: 'Antidote', price: 50, desc: 'Menyembuhkan efek racun (Poison).' }
];

export default function ShopModal({ money, onBuy, onClose }) {
  const [selectedItem, setSelectedItem] = useState(MART_ITEMS[0]);
  const [message, setMessage] = useState('Pilih barang yang ingin kamu beli:');

  const handleBuy = (item) => {
    if (money < item.price) {
      sound.playBump();
      setMessage('Uangmu tidak mencukupi untuk membeli barang ini!');
      return;
    }

    sound.playSelect();
    onBuy(item);
    setMessage(`Terima kasih! Kamu membeli 1x ${item.name}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="w-full max-w-md rpg-dialog-box rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <h2 className="text-xs sm:text-sm font-pixel text-slate-900">POKÉ MART</h2>
          </div>
          <div className="font-pixel text-xs text-amber-700 font-bold bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">
            ${money}
          </div>
        </div>

        {/* Message */}
        <p className="text-[10px] font-pixel text-slate-700">{message}</p>

        {/* Item List */}
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {MART_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-3 rounded-xl border-2 font-pixel flex items-center justify-between cursor-pointer transition-all ${
                selectedItem.id === item.id
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                  : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div>
                <div className="text-xs font-bold">{item.name}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{item.desc}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-amber-600">${item.price}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuy(item);
                  }}
                  disabled={money < item.price}
                  className="mt-1 px-2.5 py-1 text-[9px] font-pixel bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-md"
                >
                  BELI
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Close */}
        <div className="pt-2 text-right">
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="w-full py-2 px-4 rounded-xl border-2 border-slate-400 bg-slate-200 hover:bg-slate-300 text-slate-800 font-pixel text-[10px]"
          >
            SELESAI BELANJA
          </button>
        </div>
      </div>
    </div>
  );
}
