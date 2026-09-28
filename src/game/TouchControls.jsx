import { sound } from './soundEffects.js';

export default function TouchControls({
  onDirectionPress,
  onActionA,
  onActionB,
  onMenuToggle
}) {
  return (
    <div className="w-full max-w-lg mx-auto mt-3 px-2 py-2 flex items-center justify-between select-none touch-none">
      {/* 1. Virtual D-Pad (4-Way Cross) */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* D-Pad Background cross */}
        <div className="absolute w-12 h-36 bg-slate-800 rounded-lg shadow-inner border border-slate-700 pointer-events-none" />
        <div className="absolute w-36 h-12 bg-slate-800 rounded-lg shadow-inner border border-slate-700 pointer-events-none" />
        <div className="absolute w-8 h-8 rounded-full bg-slate-900 border border-slate-700 pointer-events-none" />

        {/* UP */}
        <button
          type="button"
          aria-label="Atas"
          onTouchStart={(e) => { e.preventDefault(); onDirectionPress('up'); }}
          onClick={() => onDirectionPress('up')}
          className="absolute top-0 w-12 h-12 flex items-center justify-center font-pixel text-slate-300 active:text-white active:bg-slate-700 rounded-t-lg transition-colors cursor-pointer"
        >
          ▲
        </button>

        {/* DOWN */}
        <button
          type="button"
          aria-label="Bawah"
          onTouchStart={(e) => { e.preventDefault(); onDirectionPress('down'); }}
          onClick={() => onDirectionPress('down')}
          className="absolute bottom-0 w-12 h-12 flex items-center justify-center font-pixel text-slate-300 active:text-white active:bg-slate-700 rounded-b-lg transition-colors cursor-pointer"
        >
          ▼
        </button>

        {/* LEFT */}
        <button
          type="button"
          aria-label="Kiri"
          onTouchStart={(e) => { e.preventDefault(); onDirectionPress('left'); }}
          onClick={() => onDirectionPress('left')}
          className="absolute left-0 w-12 h-12 flex items-center justify-center font-pixel text-slate-300 active:text-white active:bg-slate-700 rounded-l-lg transition-colors cursor-pointer"
        >
          ◀
        </button>

        {/* RIGHT */}
        <button
          type="button"
          aria-label="Kanan"
          onTouchStart={(e) => { e.preventDefault(); onDirectionPress('right'); }}
          onClick={() => onDirectionPress('right')}
          className="absolute right-0 w-12 h-12 flex items-center justify-center font-pixel text-slate-300 active:text-white active:bg-slate-700 rounded-r-lg transition-colors cursor-pointer"
        >
          ▶
        </button>
      </div>

      {/* 2. Middle: Start / Select Menu Buttons */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => {
            sound.playSelect();
            onMenuToggle();
          }}
          className="px-3.5 py-1.5 rounded-full bg-slate-800 active:bg-slate-700 border border-slate-600 font-pixel text-[9px] text-slate-300 shadow-md active:scale-95"
        >
          START (MENU)
        </button>
        <span className="font-pixel text-[8px] text-slate-500 uppercase tracking-widest">
          GAMEBOY PAD
        </span>
      </div>

      {/* 3. Action Buttons (A & B Buttons, Angled) */}
      <div className="flex items-center gap-3 pr-2">
        {/* B Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); onActionB(); }}
            onClick={onActionB}
            className="w-12 h-12 rounded-full bg-amber-600 active:bg-amber-500 border-2 border-amber-800 text-white font-pixel text-xs font-bold shadow-lg shadow-black/50 active:translate-y-0.5 flex items-center justify-center"
          >
            B
          </button>
          <span className="font-pixel text-[8px] text-slate-400 mt-1">BATAL</span>
        </div>

        {/* A Button */}
        <div className="flex flex-col items-center -mt-6">
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); onActionA(); }}
            onClick={onActionA}
            className="w-12 h-12 rounded-full bg-red-600 active:bg-red-500 border-2 border-red-800 text-white font-pixel text-xs font-bold shadow-lg shadow-black/50 active:translate-y-0.5 flex items-center justify-center"
          >
            A
          </button>
          <span className="font-pixel text-[8px] text-slate-400 mt-1">AKSI</span>
        </div>
      </div>
    </div>
  );
}
