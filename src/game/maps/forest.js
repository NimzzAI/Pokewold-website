import { TILES } from '../constants.js';

// Emerald Forest (20 x 21)
const T = TILES.TREE;
const G = TILES.GRASS;
const P = TILES.PATH;
const GR = TILES.TALL_GRASS;
const F = TILES.FLOWER;
const S = TILES.SIGN;

export const forest = {
  id: 'forest',
  name: 'Emerald Forest',
  width: 20,
  height: 21,
  tiles: [
    [T, T, T, T, T, T, T, T, P, P, P, T, T, T, T, T, T, T, T, T], // row 0 (North to Cave)
    [T, T, T, G, G, GR, GR, G, P, P, P, G, GR, GR, G, G, T, T, T, T],
    [T, T, G, G, GR, GR, GR, G, P, P, P, G, GR, GR, GR, G, G, T, T, T],
    [T, T, G, T, T, T, G, G, P, P, P, G, G, T, T, T, G, G, T, T],
    [T, G, G, T, T, T, G, G, P, P, P, G, G, T, T, T, G, G, G, T],
    [T, G, P, P, P, P, P, P, P, P, P, G, G, G, G, G, G, G, G, T],
    [T, G, P, G, G, T, T, T, G, G, G, G, T, T, T, G, G, G, G, T],
    [T, G, P, G, G, T, T, T, GR, GR, GR, G, T, T, T, G, F, G, G, T],
    [T, G, P, P, P, G, G, G, GR, GR, GR, G, G, G, P, P, P, G, G, T],
    [T, G, G, G, P, G, T, T, GR, GR, GR, T, T, G, P, G, P, G, G, T],
    [T, G, S, G, P, G, T, T, G, G, G, T, T, G, P, G, P, G, G, T],
    [T, G, G, G, P, P, P, P, P, P, P, P, P, P, P, G, P, G, G, T],
    [T, G, GR, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, T],
    [T, G, GR, GR, G, T, T, T, G, G, G, T, T, T, G, G, P, G, G, T],
    [T, G, GR, GR, G, T, T, T, G, G, G, T, T, T, G, P, P, G, G, T],
    [T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, P, G, G, G, T],
    [T, G, F, G, G, P, P, P, P, P, P, P, P, P, P, P, G, F, G, T],
    [T, G, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, T],
    [T, G, GR, GR, G, P, G, GR, GR, GR, GR, G, G, GR, GR, G, G, G, T],
    [T, G, GR, GR, G, P, P, P, P, P, P, G, G, GR, GR, G, G, G, T],
    [T, T, T, T, T, T, T, T, P, P, P, T, T, T, T, T, T, T, T, T] // row 20 (South to Route 1)
  ],

  buildings: [],

  warps: [
    { x: 8, y: 0, targetMap: 'cave', targetX: 9, targetY: 19 },
    { x: 9, y: 0, targetMap: 'cave', targetX: 9, targetY: 19 },
    { x: 10, y: 0, targetMap: 'cave', targetX: 10, targetY: 19 },
    { x: 8, y: 20, targetMap: 'route1', targetX: 9, targetY: 1 },
    { x: 9, y: 20, targetMap: 'route1', targetX: 9, targetY: 1 },
    { x: 10, y: 20, targetMap: 'route1', targetX: 10, targetY: 1 }
  ],

  wildEncounters: [
    { pokemonId: 10, name: 'Caterpie', minLevel: 3, maxLevel: 5, chance: 0.45 },
    { pokemonId: 13, name: 'Weedle', minLevel: 3, maxLevel: 5, chance: 0.40 },
    { pokemonId: 25, name: 'Pikachu', minLevel: 4, maxLevel: 5, chance: 0.15 } // Rare wild Pikachu!
  ],

  npcs: [
    {
      id: 'trainer_sammy',
      name: 'Bug Catcher Sammy',
      x: 14,
      y: 7,
      direction: 'down',
      sprite: 'bugcatcher',
      isTrainer: true,
      trainerId: 'sammy',
      party: [
        { pokemonId: 10, level: 4 },
        { pokemonId: 13, level: 4 }
      ],
      prizeMoney: 100,
      preBattleDialogue: [
        'Hutan ini adalah surganya Pokémon serangga!',
        'Jaringku sudah menangkap banyak ulat tangguh!',
        'Ayo uji kekuatan Pokémon milikmu!'
      ],
      postBattleDialogue: [
        'Aduh! Seranggaku belum cukup lincah rupanya...',
        'Kabarnya di rumput terdalam kadang muncul Pokémon listrik langka bernama Pikachu!'
      ]
    }
  ],

  signs: [
    {
      x: 2,
      y: 10,
      text: [
        '🌲 EMERALD FOREST',
        'Hutan lebat misterius. Berhati-hatilah dengan Pokémon liar di semak!'
      ]
    }
  ]
};
