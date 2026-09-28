import { TILES } from '../constants.js';

// Route 1 (20 x 20)
const T = TILES.TREE;
const G = TILES.GRASS;
const P = TILES.PATH;
const GR = TILES.TALL_GRASS;
const F = TILES.FLOWER;
const FC = TILES.FENCE;
const S = TILES.SIGN;

export const route1 = {
  id: 'route1',
  name: 'Route 1',
  width: 20,
  height: 21,
  tiles: [
    [T, T, T, T, T, T, T, T, P, P, P, T, T, T, T, T, T, T, T, T], // row 0 (North to Forest)
    [T, G, G, GR, GR, GR, G, G, P, P, P, G, G, GR, GR, GR, G, G, G, T],
    [T, G, GR, GR, GR, GR, G, G, P, P, P, G, GR, GR, GR, GR, G, F, G, T],
    [T, G, GR, GR, GR, GR, G, G, P, P, P, G, GR, GR, GR, GR, G, G, G, T],
    [T, G, G, GR, GR, G, G, G, P, P, P, G, G, GR, GR, G, G, G, G, T],
    [T, FC, FC, FC, FC, G, G, G, P, P, P, G, G, G, FC, FC, FC, FC, G, T],
    [T, G, G, G, G, G, G, G, P, P, P, G, G, G, G, G, G, G, G, T],
    [T, G, F, G, G, G, G, G, P, P, P, G, G, G, G, G, F, G, G, T],
    [T, G, G, G, G, G, G, G, P, P, P, G, G, G, G, G, G, G, G, T],
    [T, G, GR, GR, GR, G, G, G, P, P, P, G, G, GR, GR, GR, G, G, G, T], // row 9
    [T, G, GR, GR, GR, GR, G, G, P, P, P, G, GR, GR, GR, GR, G, G, G, T],
    [T, G, GR, GR, GR, GR, G, G, P, P, P, G, GR, GR, GR, GR, G, G, G, T],
    [T, G, G, GR, GR, G, G, G, P, P, P, G, G, GR, GR, G, G, G, G, T],
    [T, G, G, G, G, G, S, G, P, P, P, G, G, G, G, G, G, G, G, T],
    [T, G, G, G, G, G, G, G, P, P, P, G, G, G, G, G, G, G, G, T],
    [T, G, GR, GR, GR, G, G, G, P, P, P, G, G, GR, GR, GR, G, G, G, T],
    [T, G, GR, GR, GR, GR, G, G, P, P, P, G, GR, GR, GR, GR, G, F, G, T],
    [T, G, GR, GR, GR, GR, G, G, P, P, P, G, GR, GR, GR, GR, G, G, G, T],
    [T, G, G, G, G, G, G, G, P, P, P, G, G, G, G, G, G, G, G, T],
    [T, G, G, G, G, G, G, G, P, P, P, G, G, G, G, G, G, G, G, T],
    [T, T, T, T, T, T, T, T, P, P, P, T, T, T, T, T, T, T, T, T]  // row 20 (South to Starter Town)
  ],

  buildings: [],

  warps: [
    { x: 8, y: 0, targetMap: 'forest', targetX: 9, targetY: 19 },
    { x: 9, y: 0, targetMap: 'forest', targetX: 9, targetY: 19 },
    { x: 10, y: 0, targetMap: 'forest', targetX: 10, targetY: 19 },
    { x: 8, y: 20, targetMap: 'starterTown', targetX: 9, targetY: 1 },
    { x: 9, y: 20, targetMap: 'starterTown', targetX: 9, targetY: 1 },
    { x: 10, y: 20, targetMap: 'starterTown', targetX: 10, targetY: 1 }
  ],

  wildEncounters: [
    { pokemonId: 16, name: 'Pidgey', minLevel: 2, maxLevel: 4, chance: 0.55 },
    { pokemonId: 19, name: 'Rattata', minLevel: 2, maxLevel: 3, chance: 0.45 }
  ],

  npcs: [
    {
      id: 'trainer_joey',
      name: 'Youngster Joey',
      x: 12,
      y: 8,
      direction: 'left',
      sprite: 'youngster',
      isTrainer: true,
      trainerId: 'joey',
      party: [
        { pokemonId: 19, level: 4 }
      ],
      prizeMoney: 120,
      preBattleDialogue: [
        'Hai! Kita saling bertatapan mata!',
        'Artinya kita harus bertarung Pokémon sekarang juga!',
        'Rattata milikku berada di peringkat teratas Rattata di dunia!'
      ],
      postBattleDialogue: [
        'Wah, Rattata-ku kalah!? Tapi seru sekali pertarungannya!',
        'Kamu pelatih yang hebat. Lanjutkan terus perjalananmu ke Emerald Forest!'
      ]
    }
  ],

  signs: [
    {
      x: 6,
      y: 13,
      text: [
        '📌 ROUTE 1',
        'Utara: Emerald Forest → Rockfall Cave',
        'Selatan: Oakvale Town'
      ]
    }
  ]
};
