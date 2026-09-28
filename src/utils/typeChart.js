// Complete Gen 9 Pokémon Type Chart & Visual Configuration

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
];

export const TYPE_COLORS = {
  normal: { bg: 'bg-stone-500', text: 'text-stone-100', border: 'border-stone-400', hex: '#78716c', gradient: 'from-stone-600 to-stone-500' },
  fire: { bg: 'bg-orange-600', text: 'text-orange-50', border: 'border-orange-400', hex: '#ea580c', gradient: 'from-amber-600 to-red-600' },
  water: { bg: 'bg-blue-600', text: 'text-blue-50', border: 'border-blue-400', hex: '#2563eb', gradient: 'from-blue-600 to-cyan-500' },
  grass: { bg: 'bg-emerald-600', text: 'text-emerald-50', border: 'border-emerald-400', hex: '#059669', gradient: 'from-emerald-600 to-green-500' },
  electric: { bg: 'bg-amber-400', text: 'text-amber-950', border: 'border-amber-300', hex: '#f59e0b', gradient: 'from-amber-400 to-yellow-500' },
  ice: { bg: 'bg-cyan-500', text: 'text-cyan-950', border: 'border-cyan-300', hex: '#06b6d4', gradient: 'from-cyan-400 to-teal-400' },
  fighting: { bg: 'bg-red-700', text: 'text-red-50', border: 'border-red-500', hex: '#b91c1c', gradient: 'from-red-700 to-orange-800' },
  poison: { bg: 'bg-purple-600', text: 'text-purple-50', border: 'border-purple-400', hex: '#9333ea', gradient: 'from-purple-600 to-fuchsia-600' },
  ground: { bg: 'bg-yellow-700', text: 'text-yellow-50', border: 'border-yellow-500', hex: '#a16207', gradient: 'from-yellow-700 to-amber-700' },
  flying: { bg: 'bg-indigo-500', text: 'text-indigo-50', border: 'border-indigo-300', hex: '#6366f1', gradient: 'from-indigo-500 to-sky-400' },
  psychic: { bg: 'bg-pink-600', text: 'text-pink-50', border: 'border-pink-400', hex: '#db2777', gradient: 'from-pink-600 to-rose-500' },
  bug: { bg: 'bg-lime-600', text: 'text-lime-50', border: 'border-lime-400', hex: '#65a30d', gradient: 'from-lime-600 to-emerald-600' },
  rock: { bg: 'bg-amber-800', text: 'text-amber-50', border: 'border-amber-600', hex: '#92400e', gradient: 'from-amber-800 to-stone-700' },
  ghost: { bg: 'bg-violet-800', text: 'text-violet-50', border: 'border-violet-600', hex: '#5b21b6', gradient: 'from-violet-800 to-indigo-900' },
  dragon: { bg: 'bg-indigo-700', text: 'text-indigo-50', border: 'border-indigo-500', hex: '#4338ca', gradient: 'from-indigo-700 to-purple-800' },
  steel: { bg: 'bg-slate-500', text: 'text-slate-100', border: 'border-slate-400', hex: '#64748b', gradient: 'from-slate-600 to-zinc-500' },
  dark: { bg: 'bg-stone-800', text: 'text-stone-100', border: 'border-stone-600', hex: '#292524', gradient: 'from-stone-800 to-neutral-900' },
  fairy: { bg: 'bg-rose-400', text: 'text-rose-950', border: 'border-rose-300', hex: '#fb7185', gradient: 'from-rose-400 to-pink-400' }
};

// Attack type vs defending single type multiplier
// 2: super effective, 0.5: not very effective, 0: immune, default: 1
export const TYPE_ADVANTAGE_MAP = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

/**
 * Calculates effectiveness of an attack type against defender type(s).
 * @param {string} attackType - e.g. "fire"
 * @param {string[]} targetTypes - e.g. ["grass", "steel"]
 * @returns {{ multiplier: number, label: string, badgeColor: string }}
 */
export function getTypeEffectiveness(attackType, targetTypes) {
  if (!attackType || !targetTypes || targetTypes.length === 0) {
    return { multiplier: 1, label: 'normal', badgeColor: 'text-slate-400' };
  }

  const normalizedAttack = attackType.toLowerCase();
  let multiplier = 1;

  for (const t of targetTypes) {
    const defType = t.toLowerCase();
    const effectiveness = TYPE_ADVANTAGE_MAP[normalizedAttack]?.[defType];
    if (effectiveness !== undefined) {
      multiplier *= effectiveness;
    }
  }

  let label = 'normal';
  let badgeColor = 'text-slate-300';

  if (multiplier === 0) {
    label = 'immune';
    badgeColor = 'text-zinc-500';
  } else if (multiplier >= 2) {
    label = multiplier >= 4 ? 'super_effective_4x' : 'super_effective';
    badgeColor = 'text-emerald-400';
  } else if (multiplier < 1) {
    label = multiplier <= 0.25 ? 'not_very_effective_quarter' : 'not_very_effective';
    badgeColor = 'text-amber-400';
  }

  return { multiplier, label, badgeColor };
}

/**
 * Calculates full defensive weaknesses, resistances, and immunities for a Pokémon given its types.
 * @param {string[]} defenderTypes
 */
export function getDefensiveMatchups(defenderTypes) {
  const matchups = {
    weakTo: [],       // 2x or 4x
    resistsTo: [],    // 0.5x or 0.25x
    immuneTo: [],     // 0x
    neutralTo: []     // 1x
  };

  POKEMON_TYPES.forEach(atkType => {
    const { multiplier } = getTypeEffectiveness(atkType, defenderTypes);
    if (multiplier === 0) {
      matchups.immuneTo.push({ type: atkType, multiplier });
    } else if (multiplier >= 2) {
      matchups.weakTo.push({ type: atkType, multiplier });
    } else if (multiplier <= 0.5) {
      matchups.resistsTo.push({ type: atkType, multiplier });
    } else {
      matchups.neutralTo.push({ type: atkType, multiplier: 1 });
    }
  });

  return matchups;
}
