import { TILES } from '../constants.js';

// Second Town: Oakhaven City (20 x 16)
const T = TILES.TREE;
const G = TILES.GRASS;
const P = TILES.PATH;
const F = TILES.FLOWER;
const S = TILES.SIGN;

export const secondTown = {
  id: 'secondTown',
  name: 'Oakhaven City',
  width: 20,
  height: 16,
  tiles: [
    [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T],
    [T, G, G, G, T, T, T, G, G, G, G, G, G, T, T, T, T, G, G, T],
    [T, G, F, G, T, T, T, G, G, G, G, G, G, T, T, T, T, G, F, T],
    [T, G, G, G, G, G, G, G, G, P, P, G, G, G, G, G, G, G, G, T],
    [T, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, T], // row 4
    [T, G, P, G, G, G, G, P, G, G, G, G, P, G, G, G, P, G, G, T],
    [T, G, P, G, G, G, G, P, G, S, G, G, P, G, G, G, P, G, G, T],
    [T, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, T], // row 7
    [P, P, P, G, G, G, G, P, G, G, G, G, P, G, G, G, P, G, G, T], // row 8 (West entrance from Cave)
    [P, P, P, G, G, G, G, P, G, G, G, G, P, G, G, G, P, G, G, T], // row 9 (West entrance from Cave)
    [T, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, T], // row 10
    [T, G, P, G, G, G, G, P, G, G, G, G, P, G, G, G, P, G, G, T],
    [T, G, P, G, G, G, G, P, G, G, G, G, P, G, G, G, P, G, G, T],
    [T, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, T],
    [T, G, F, G, G, G, G, G, G, G, G, G, G, G, G, F, G, G, G, T],
    [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  ],

  buildings: [
    {
      id: 'gym',
      name: 'Oakhaven Gym',
      type: 'gym',
      x: 13,
      y: 3,
      width: 5,
      height: 4,
      doorX: 15,
      doorY: 7,
      warpTo: { map: 'gym', x: 5, y: 10 }
    },
    {
      id: 'pokecenter_second',
      name: 'Pokémon Center',
      type: 'pokecenter',
      x: 3,
      y: 4,
      width: 4,
      height: 3,
      doorX: 4,
      doorY: 7,
      warpTo: { map: 'pokecenter', x: 4, y: 7 }
    },
    {
      id: 'pokemart_second',
      name: 'Poké Mart',
      type: 'pokemart',
      x: 3,
      y: 10,
      width: 4,
      height: 3,
      doorX: 4,
      doorY: 12,
      warpTo: { map: 'pokemart', x: 3, y: 6 }
    }
  ],

  warps: [
    { x: 0, y: 8, targetMap: 'cave', targetX: 18, targetY: 9 },
    { x: 0, y: 9, targetMap: 'cave', targetX: 18, targetY: 9 }
  ],

  npcs: [
    {
      id: 'gym_guide',
      name: 'Gym Guide Dan',
      x: 11,
      y: 6,
      direction: 'right',
      sprite: 'guide',
      dialogue: [
        'Yo! Calon Juara Pokémon!',
        'Kamu sudah sampai di Oakhaven City!',
        'Gym Leader Brock mengkhususkan diri pada tipe Rock (Batu).',
        'Gunakan jurus tipe Water atau Grass untuk mengalahkannya!'
      ]
    },
    {
      id: 'second_citizen',
      name: 'Ace Trainer Leo',
      x: 8,
      y: 11,
      direction: 'down',
      sprite: 'trainer',
      dialogue: [
        'Brock adalah Gym Leader yang sangat dihormati di kota ini.',
        'Jika kamu bisa mengalahkannya, kamu akan mendapatkan Boulder Badge yang bergengsi!'
      ]
    }
  ],

  signs: [
    {
      x: 9,
      y: 6,
      text: [
        '🏛️ OAKHAVEN CITY',
        'Kota Batu yang Kokoh & Rumah dari Oakhaven Pokémon Gym!'
      ]
    }
  ]
};
