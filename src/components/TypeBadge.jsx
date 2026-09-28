import { TYPE_COLORS } from '../utils/typeChart.js';

export default function TypeBadge({ type, size = 'sm', showDot = false, className = '' }) {
  if (!type) return null;
  const normalized = type.toLowerCase();
  const style = TYPE_COLORS[normalized] || {
    bg: 'bg-slate-700',
    text: 'text-slate-200',
    border: 'border-slate-600',
    hex: '#475569'
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] tracking-wider',
    sm: 'px-2.5 py-1 text-xs font-semibold tracking-wide',
    md: 'px-3 py-1 text-sm font-semibold tracking-wide',
    lg: 'px-4 py-1.5 text-base font-bold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 uppercase font-medium rounded-md border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size] || sizeClasses.sm} shadow-xs ${className}`}
    >
      {showDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
      )}
      {normalized}
    </span>
  );
}
