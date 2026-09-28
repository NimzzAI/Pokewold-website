import { useState } from 'react';
import { sound } from './soundEffects.js';

export default function DialogueBox({ speaker = '', lines = [], onComplete }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleNext = () => {
    sound.playText();
    if (currentLineIndex < lines.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    } else {
      sound.playSelect();
      onComplete?.();
    }
  };

  const lineText = lines[currentLineIndex] || '';

  return (
    <div
      onClick={handleNext}
      className="absolute bottom-4 left-4 right-4 z-40 rpg-dialog-box rounded-xl p-4 cursor-pointer select-none transition-all active:scale-[0.99]"
    >
      {speaker && (
        <div className="text-[10px] text-red-600 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
          <span>{speaker}</span>
        </div>
      )}

      <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-pixel min-h-[36px]">
        {lineText}
      </p>

      <div className="mt-2 text-right">
        <span className="inline-block text-[10px] text-slate-500 font-pixel animate-bounce">
          ▼ Lanjut [A / Spasi]
        </span>
      </div>
    </div>
  );
}
