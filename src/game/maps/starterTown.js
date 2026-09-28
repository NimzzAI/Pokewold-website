import { TILES } from '../constants.js';

// Starter Town: Oakvale Town (20 x 16)
// T: Tree (3), G: Grass (0), P: Path (1), W: Water (4), F: Flower (5), S: Sign (16)
const T = TILES.TREE;
const G = TILES.GRASS;
const P = TILES.PATH;
const W = TILES.WATER;
const F = TILES.FLOWER;
const S = TILES.SIGN;

export const starterTown = {
  id: 'starterTown',
  name: 'Oakvale Town',
  width: 20,
  height: 16,
  tiles: [
    [T, T, T, T, T, T, T, T, T, P, P, T, T, T, T, T, T, T, T, T], // row 0 (North exit to Route 1 at x=9,10)
    [T, G, G, G, T, T, T, G, G, P, P, G, G, T, T, T, T, G, G, T],
    [T, G, F, G, T, T, T, G, G, P, P, G, G, T, T, T, T, G, F, T],
    [T, G, G, G, G, G, G, G, G, P, P, G, G, G, G, G, G, G, G, T],
    [T, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, T], // row 4
    [T, G, P, G, G, G, G, P, G, G, G, G, P, G, G, G, P, G, G, T],
    [T, G, P, G, G, G, G, P, G, S, G, G, P, G, G, G, P, G, G, T], // row 6
    [T, G, P, P, P, P, P, P, G, G, G, G, P, P, P, P, P, G, G, T],
    [T, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T],
    [T, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, T], // row 9
    [T, G, P, G, G, G, G, P, G, G, G, G, P, G, G, G, P, G, G, T],
    [T, G, P, G, G, G, G, P, G, G, G, G, P, G, G, G, P, G, G, T],
    [T, G, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, G, G, T],
    [T, G, F, G, G, G, W, W, W, W, W, G, G, G, G, F, G, G, G, T],
    [T, G, G, G, G, G, W, W, W, W, W, G, G, G, G, G, G, G, G, T],
    [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]
  ],

  // Buildings placed as interactive graphic objects
  buildings: [
    {
      id: 'player_house',
      name: 'Rumah Pemain',
      type: 'house',
      x: 3,
      y: 5,
      width: 4,
      height: 3,
      doorX: 4,
      doorY: 7,
      warpTo: { map: 'playerHouse', x: 4, y: 7 }
    },
    {
      id: 'oak_lab',
      name: 'Lab Penelitian Prof. Oak',
      type: 'lab',
      x: 13,
      y: 5,
      width: 5,
      height: 3,
      doorX: 15,
      doorY: 7,
      warpTo: { map: 'oakLab', x: 5, y: 8 }
    },
    {
      id: 'pokecenter',
      name: 'Pokémon Center',
      type: 'pokecenter',
      x: 3,
      y: 10,
      width: 4,
      height: 3,
      doorX: 4,
      doorY: 12,
      warpTo: { map: 'pokecenter', x: 4, y: 7 }
    },
    {
      id: 'pokemart',
      name: 'Poké Mart',
      type: 'pokemart',
      x: 13,
      y: 10,
      width: 4,
      height: 3,
      doorX: 14,
      doorY: 12,
      warpTo: { map: 'pokemart', x: 3, y: 6 }
    }
  ],

  // Warps when stepping on a specific tile
  warps: [
    // North exit to Route 1
    { x: 9, y: 0, targetMap: 'route1', targetX: 9, targetY: 19 },
    { x: 10, y: 0, targetMap: 'route1', targetX: 10, targetY: 19 }
  ],

  // NPCs in starter town
  npcs: [
    {
      id: 'town_lass',
      name: 'Maya',
      x: 9,
      y: 5,
      direction: 'down',
      sprite: 'lass',
      dialogue: [
        'Halo! Selamat datang di Oakvale Town!',
        'Profesor Oak sedang menunggumu di laboratoriumnya di sebelah timur.',
        'Beliau punya kabar gembira tentang Starter Pokémon untukmu!'
      ]
    },
    {
      id: 'town_elder',
      name: 'Kakek Hiro',
      x: 6,
      y: 9,
      direction: 'right',
      sprite: 'elder',
      dialogue: [
        'Teknologi zaman sekarang luar biasa ya!',
        'Kamu bisa menyembuhkan Pokémon di Pokémon Center secara gratis!',
        'Dan beli Poké Ball di Poké Mart untuk menangkap monster di rumput tinggi.'
      ]
    }
  ],

  // Signs to read
  signs: [
    {
      x: 9,
      y: 6,
      text: [
        '📌 OAKVALE TOWN',
        'Kota di mana petualangan Pokémon barumu dimulai!'
      ]
    }
  ]
};
