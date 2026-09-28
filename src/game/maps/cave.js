import { TILES } from '../constants.js';

// Rockfall Cave (20 x 21)
const W = TILES.CAVE_WALL; // 8
const F = TILES.CAVE_FLOOR; // 9
const R = TILES.ROCK; // 7
const S = TILES.SIGN; // 16

export const cave = {
  id: 'cave',
  name: 'Rockfall Cave',
  width: 20,
  height: 21,
  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, F, W, W, F, F, F, F, F, F, F, F, F, W],
    [W, F, R, F, F, R, F, F, W, W, F, R, F, F, R, F, F, R, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, W, W, F, F, W, W, W, W, W, W, W, F, F, W, W, W, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, W],
    [W, F, R, F, F, R, F, F, F, F, F, F, F, R, F, F, W, F, F, W],
    [W, F, F, F, F, F, F, W, W, W, W, F, F, F, F, F, W, F, F, W], // row 7
    [W, W, W, F, F, W, W, W, F, F, W, W, W, F, F, W, W, F, F, F], // row 8 (Exit East to Second Town at x=19, y=8,9)
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F], // row 9 (Exit East to Second Town at x=19, y=8,9)
    [W, F, R, F, F, R, F, F, F, F, F, F, F, R, F, F, W, W, W, W],
    [W, F, F, F, F, F, F, F, W, W, F, F, F, F, F, F, F, F, F, W],
    [W, W, W, W, F, F, W, W, W, W, W, W, F, F, W, W, W, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, W],
    [W, F, R, F, F, R, F, F, S, F, F, F, F, R, F, F, W, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W, F, F, W],
    [W, W, W, F, F, W, W, W, W, W, W, W, F, F, W, W, W, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, F, R, F, F, F, F, F, F, F, F, F, F, F, F, F, R, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, W],
    [W, W, W, W, W, W, W, W, F, F, F, W, W, W, W, W, W, W, W, W]  // row 20 (South to Forest at x=8,9,10)
  ],

  buildings: [],

  warps: [
    { x: 8, y: 20, targetMap: 'forest', targetX: 9, targetY: 1 },
    { x: 9, y: 20, targetMap: 'forest', targetX: 9, targetY: 1 },
    { x: 10, y: 20, targetMap: 'forest', targetX: 10, targetY: 1 },
    { x: 19, y: 8, targetMap: 'secondTown', targetX: 1, targetY: 9 },
    { x: 19, y: 9, targetMap: 'secondTown', targetX: 1, targetY: 9 }
  ],

  // Cave steps trigger wild encounters directly on cave floor!
  wildEncounters: [
    { pokemonId: 41, name: 'Zubat', minLevel: 4, maxLevel: 6, chance: 0.60 },
    { pokemonId: 74, name: 'Geodude', minLevel: 4, maxLevel: 6, chance: 0.40 }
  ],

  isCave: true,

  npcs: [
    {
      id: 'trainer_dwayne',
      name: 'Hiker Dwayne',
      x: 13,
      y: 9,
      direction: 'left',
      sprite: 'hiker',
      isTrainer: true,
      trainerId: 'dwayne',
      party: [
        { pokemonId: 74, level: 6 }
      ],
      prizeMoney: 200,
      preBattleDialogue: [
        'Hahaha! Langkah kakiku mengguncang seisi gua!',
        'Pokémon batuku sangat keras dan tak tergoyahkan!',
        'Tunjukkan tekadmu di dalam kegelapan gua ini!'
      ],
      postBattleDialogue: [
        'Kekuatanmu luar biasa! Tipe air dan rumput memang kelemahan utama batu.',
        'Pintu keluar di sebelah timur mengarah langsung ke Oakhaven City!'
      ]
    }
  ],

  signs: [
    {
      x: 8,
      y: 14,
      text: [
        '📌 ROCKFALL CAVE',
        'Peringatan: Banyak Pokémon tipe Rock & Poison bersembunyi di sini.'
      ]
    }
  ]
};
