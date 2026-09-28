// PokeAPI Data Service with In-Memory Caching & Instant Offline Fallback

const BASE_URL = 'https://pokeapi.co/api/v2';
const cache = new Map();

// Built-in starter moves and baseline data to guarantee immediate responsiveness
export const FALLBACK_POKEMON = {
  1: {
    id: 1,
    name: 'bulbasaur',
    displayName: 'Bulbasaur',
    types: ['grass', 'poison'],
    height: 7,
    weight: 69,
    baseStats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    },
    moves: [
      { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Vine Whip', type: 'grass', power: 45, accuracy: 100, category: 'physical' },
      { name: 'Growl', type: 'normal', power: 0, accuracy: 100, category: 'status' },
      { name: 'Leech Seed', type: 'grass', power: 20, accuracy: 90, category: 'special' }
    ]
  },
  4: {
    id: 4,
    name: 'charmander',
    displayName: 'Charmander',
    types: ['fire'],
    height: 6,
    weight: 85,
    baseStats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
    },
    moves: [
      { name: 'Scratch', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Ember', type: 'fire', power: 40, accuracy: 100, category: 'special' },
      { name: 'Growl', type: 'normal', power: 0, accuracy: 100, category: 'status' },
      { name: 'Smokescreen', type: 'normal', power: 0, accuracy: 100, category: 'status' }
    ]
  },
  7: {
    id: 7,
    name: 'squirtle',
    displayName: 'Squirtle',
    types: ['water'],
    height: 5,
    weight: 90,
    baseStats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
    },
    moves: [
      { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Water Gun', type: 'water', power: 40, accuracy: 100, category: 'special' },
      { name: 'Tail Whip', type: 'normal', power: 0, accuracy: 100, category: 'status' },
      { name: 'Withdraw', type: 'water', power: 0, accuracy: 100, category: 'status' }
    ]
  },
  16: {
    id: 16,
    name: 'pidgey',
    displayName: 'Pidgey',
    types: ['normal', 'flying'],
    height: 3,
    weight: 18,
    baseStats: { hp: 40, attack: 45, defense: 40, specialAttack: 35, specialDefense: 35, speed: 56 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/16.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png'
    },
    moves: [
      { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Gust', type: 'flying', power: 40, accuracy: 100, category: 'special' },
      { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, category: 'physical' }
    ]
  },
  19: {
    id: 19,
    name: 'rattata',
    displayName: 'Rattata',
    types: ['normal'],
    height: 3,
    weight: 35,
    baseStats: { hp: 30, attack: 56, defense: 35, specialAttack: 25, specialDefense: 35, speed: 72 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/19.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png'
    },
    moves: [
      { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Bite', type: 'dark', power: 60, accuracy: 100, category: 'physical' },
      { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, category: 'physical' }
    ]
  },
  25: {
    id: 25,
    name: 'pikachu',
    displayName: 'Pikachu',
    types: ['electric'],
    height: 4,
    weight: 60,
    baseStats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    },
    moves: [
      { name: 'Thunder Shock', type: 'electric', power: 40, accuracy: 100, category: 'special' },
      { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Spark', type: 'electric', power: 65, accuracy: 100, category: 'physical' }
    ]
  },
  10: {
    id: 10,
    name: 'caterpie',
    displayName: 'Caterpie',
    types: ['bug'],
    height: 3,
    weight: 29,
    baseStats: { hp: 45, attack: 30, defense: 35, specialAttack: 20, specialDefense: 20, speed: 45 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/10.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png'
    },
    moves: [
      { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Bug Bite', type: 'bug', power: 60, accuracy: 100, category: 'physical' }
    ]
  },
  13: {
    id: 13,
    name: 'weedle',
    displayName: 'Weedle',
    types: ['bug', 'poison'],
    height: 3,
    weight: 32,
    baseStats: { hp: 40, attack: 35, defense: 30, specialAttack: 20, specialDefense: 20, speed: 50 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/13.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/13.png'
    },
    moves: [
      { name: 'Poison Sting', type: 'poison', power: 35, accuracy: 100, category: 'physical' },
      { name: 'Bug Bite', type: 'bug', power: 60, accuracy: 100, category: 'physical' }
    ]
  },
  41: {
    id: 41,
    name: 'zubat',
    displayName: 'Zubat',
    types: ['poison', 'flying'],
    height: 8,
    weight: 75,
    baseStats: { hp: 40, attack: 45, defense: 35, specialAttack: 30, specialDefense: 40, speed: 55 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/41.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/41.png'
    },
    moves: [
      { name: 'Leech Life', type: 'bug', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Bite', type: 'dark', power: 60, accuracy: 100, category: 'physical' },
      { name: 'Wing Attack', type: 'flying', power: 60, accuracy: 100, category: 'physical' }
    ]
  },
  74: {
    id: 74,
    name: 'geodude',
    displayName: 'Geodude',
    types: ['rock', 'ground'],
    height: 4,
    weight: 200,
    baseStats: { hp: 40, attack: 80, defense: 100, specialAttack: 30, specialDefense: 30, speed: 20 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/74.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png'
    },
    moves: [
      { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
      { name: 'Rock Throw', type: 'rock', power: 50, accuracy: 90, category: 'physical' },
      { name: 'Magnitude', type: 'ground', power: 70, accuracy: 100, category: 'physical' }
    ]
  },
  95: {
    id: 95,
    name: 'onix',
    displayName: 'Onix',
    types: ['rock', 'ground'],
    height: 88,
    weight: 2100,
    baseStats: { hp: 35, attack: 45, defense: 160, specialAttack: 30, specialDefense: 45, speed: 70 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/95.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png'
    },
    moves: [
      { name: 'Rock Throw', type: 'rock', power: 50, accuracy: 90, category: 'physical' },
      { name: 'Slam', type: 'normal', power: 80, accuracy: 75, category: 'physical' },
      { name: 'Rock Tomb', type: 'rock', power: 60, accuracy: 95, category: 'physical' }
    ]
  },
  66: {
    id: 66,
    name: 'machop',
    displayName: 'Machop',
    types: ['fighting'],
    height: 8,
    weight: 195,
    baseStats: { hp: 70, attack: 80, defense: 50, specialAttack: 35, specialDefense: 35, speed: 35 },
    sprites: {
      front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png',
      back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/66.png',
      artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png'
    },
    moves: [
      { name: 'Karate Chop', type: 'fighting', power: 50, accuracy: 100, category: 'physical' },
      { name: 'Low Kick', type: 'fighting', power: 50, accuracy: 100, category: 'physical' }
    ]
  }
};

/**
 * Calculates actual battle stats for a specific level
 */
export function calculateLevelStats(baseStats, level) {
  const hp = Math.floor(((2 * baseStats.hp * level) / 100) + level + 10);
  const attack = Math.floor(((2 * baseStats.attack * level) / 100) + 5);
  const defense = Math.floor(((2 * baseStats.defense * level) / 100) + 5);
  const specialAttack = Math.floor(((2 * baseStats.specialAttack * level) / 100) + 5);
  const specialDefense = Math.floor(((2 * baseStats.specialDefense * level) / 100) + 5);
  const speed = Math.floor(((2 * baseStats.speed * level) / 100) + 5);

  return { hp, maxHp: hp, attack, defense, specialAttack, specialDefense, speed };
}

/**
 * Creates a ready-to-battle Pokémon instance with HP, level, moves, and EXP
 */
export function createPokemonInstance(pokemonData, level = 5) {
  const stats = calculateLevelStats(pokemonData.baseStats, level);
  return {
    ...pokemonData,
    level,
    stats,
    currentHp: stats.hp,
    maxHp: stats.hp,
    exp: 0,
    maxExp: level * 20,
    status: null // 'paralyze', 'poison', etc.
  };
}

/**
 * Fetch Pokémon details from PokeAPI with instant fallback
 */
export async function getPokemonData(idOrName) {
  const key = String(idOrName).toLowerCase().trim();

  // If in memory cache, return
  if (cache.has(key)) {
    return cache.get(key);
  }

  // Check fallback library first
  const fallback = FALLBACK_POKEMON[key] || Object.values(FALLBACK_POKEMON).find(p => p.name === key);

  try {
    const res = await fetch(`${BASE_URL}/pokemon/${key}`);
    if (!res.ok) {
      if (fallback) return fallback;
      throw new Error(`Pokemon not found: ${key}`);
    }
    const raw = await res.json();

    const statsMap = {};
    raw.stats.forEach(s => {
      statsMap[s.stat.name] = s.base_stat;
    });

    const types = raw.types.map(t => t.type.name);
    const artwork = raw.sprites.other?.['official-artwork']?.front_default || raw.sprites.front_default;

    const formatted = {
      id: raw.id,
      name: raw.name,
      displayName: raw.name.charAt(0).toUpperCase() + raw.name.slice(1).replace(/-/g, ' '),
      types,
      height: raw.height,
      weight: raw.weight,
      baseStats: {
        hp: statsMap['hp'] || 45,
        attack: statsMap['attack'] || 45,
        defense: statsMap['defense'] || 45,
        specialAttack: statsMap['special-attack'] || 45,
        specialDefense: statsMap['special-defense'] || 45,
        speed: statsMap['speed'] || 45
      },
      sprites: {
        front: raw.sprites.front_default || artwork,
        back: raw.sprites.back_default || raw.sprites.front_default || artwork,
        artwork: artwork
      },
      moves: fallback?.moves || [
        { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
        { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, category: 'physical' }
      ]
    };

    cache.set(key, formatted);
    cache.set(String(raw.id), formatted);
    return formatted;
  } catch (err) {
    if (fallback) {
      return fallback;
    }
    throw err;
  }
}
