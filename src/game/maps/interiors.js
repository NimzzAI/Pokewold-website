import { TILES } from '../constants.js';

const W = TILES.INDOOR_WALL; // 11
const F = TILES.INDOOR_FLOOR; // 10
const CF = TILES.CENTER_FLOOR; // 12
const MF = TILES.MART_FLOOR; // 13
const GF = TILES.GYM_FLOOR; // 14
const C = TILES.CARPET; // 15

// 1. Player's House Interior (10 x 9)
export const playerHouse = {
  id: 'playerHouse',
  name: 'Rumah Red',
  width: 9,
  height: 9,
  isInterior: true,
  tiles: [
    [W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, W],
    [W, F, F, C, C, C, F, F, W],
    [W, F, F, C, C, C, F, F, W],
    [W, F, F, F, F, F, F, F, W],
    [W, F, F, F, C, F, F, F, W], // x=4 door
    [W, W, W, W, C, W, W, W, W]  // exit at x=4, y=8
  ],
  warps: [
    { x: 4, y: 8, targetMap: 'starterTown', targetX: 4, targetY: 8 }
  ],
  npcs: [
    {
      id: 'mom',
      name: 'Ibu Red',
      x: 3,
      y: 3,
      direction: 'right',
      sprite: 'mom',
      isHealer: true,
      dialogue: [
        'Red! Senang melihatmu bersiap untuk petualangan barumu.',
        'Prof. Oak mencarimu ke lab. Beliau punya Starter Pokémon untukmu!',
        'Ingat, kamu selalu bisa pulang untuk beristirahat dan memulihkan Pokémon-mu.'
      ]
    }
  ]
};

// 2. Oak's Pokémon Research Lab Interior (11 x 10)
export const oakLab = {
  id: 'oakLab',
  name: 'Laboratorium Prof. Oak',
  width: 11,
  height: 10,
  isInterior: true,
  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W],
    [W, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, F, F, F, F, F, F, F, W],
    [W, F, F, C, C, C, C, C, F, F, W],
    [W, F, F, C, C, C, C, C, F, F, W],
    [W, F, F, F, F, C, F, F, F, F, W],
    [W, F, F, F, F, C, F, F, F, F, W],
    [W, F, F, F, F, C, F, F, F, F, W],
    [W, W, W, W, W, C, W, W, W, W, W] // exit at x=5, y=9
  ],
  warps: [
    { x: 5, y: 9, targetMap: 'starterTown', targetX: 15, targetY: 8 }
  ],
  starterTable: {
    starters: [
      { id: 1, name: 'Bulbasaur', type: 'Grass / Poison', x: 4, y: 3 },
      { id: 4, name: 'Charmander', type: 'Fire', x: 5, y: 3 },
      { id: 7, name: 'Squirtle', type: 'Water', x: 6, y: 3 }
    ]
  },
  npcs: [
    {
      id: 'prof_oak',
      name: 'Prof. Oak',
      x: 5,
      y: 2,
      direction: 'down',
      sprite: 'oak',
      dialogue: [
        'Ah, Red! Akhirnya kamu datang!',
        'Di atas meja ini terdapat 3 buah Poké Ball berisi Pokémon pemula.',
        'Pilihlah salah satu yang paling cocok dengan gaya bertarungmu: Bulbasaur, Charmander, atau Squirtle!',
        'Setelah memilih, bawalah Pokémon-mu menjelajah Route 1 dan tantang Gym di Oakhaven City!'
      ]
    },
    {
      id: 'lab_assistant',
      name: 'Asisten Lab',
      x: 8,
      y: 4,
      direction: 'left',
      sprite: 'scientist',
      dialogue: [
        'Profesor Oak adalah pakar terkemuka di bidang penelitian Pokémon.',
        'Gunakan Poké Ball di dalam tasmu untuk menangkap monster liar baru saat bertarung!'
      ]
    }
  ]
};

// 3. Pokémon Center Interior (9 x 9)
export const pokecenter = {
  id: 'pokecenter',
  name: 'Pokémon Center',
  width: 9,
  height: 9,
  isInterior: true,
  tiles: [
    [W, W, W, W, W, W, W, W, W],
    [W, CF, CF, CF, CF, CF, CF, CF, W],
    [W, CF, CF, CF, CF, CF, CF, CF, W],
    [W, CF, CF, CF, CF, CF, CF, CF, W],
    [W, CF, CF, C, C, C, CF, CF, W],
    [W, CF, CF, C, C, C, CF, CF, W],
    [W, CF, CF, CF, CF, CF, CF, CF, W],
    [W, CF, CF, CF, C, CF, CF, CF, W],
    [W, W, W, W, C, W, W, W, W] // exit at x=4, y=8
  ],
  warps: [
    { x: 4, y: 8, targetReturnToPrev: true }
  ],
  npcs: [
    {
      id: 'nurse_joy',
      name: 'Suster Joy',
      x: 4,
      y: 2,
      direction: 'down',
      sprite: 'nurse',
      isNurse: true,
      dialogue: [
        'Selamat datang di Pokémon Center!',
        'Kami memulihkan Pokémon yang lelah hingga kembali sehat bugar.',
        'Sebentar ya...'
      ]
    }
  ]
};

// 4. Poké Mart Interior (8 x 8)
export const pokemart = {
  id: 'pokemart',
  name: 'Poké Mart',
  width: 8,
  height: 8,
  isInterior: true,
  tiles: [
    [W, W, W, W, W, W, W, W],
    [W, MF, MF, MF, MF, MF, MF, W],
    [W, MF, MF, MF, MF, MF, MF, W],
    [W, MF, MF, MF, MF, MF, MF, W],
    [W, MF, MF, C, C, MF, MF, W],
    [W, MF, MF, C, C, MF, MF, W],
    [W, MF, MF, C, MF, MF, MF, W],
    [W, W, W, C, W, W, W, W] // exit at x=3, y=7
  ],
  warps: [
    { x: 3, y: 7, targetReturnToPrev: true }
  ],
  npcs: [
    {
      id: 'mart_clerk',
      name: 'Kasir Mart',
      x: 2,
      y: 2,
      direction: 'down',
      sprite: 'clerk',
      isShopClerk: true,
      dialogue: [
        'Halo! Selamat datang di Poké Mart!',
        'Butuh persediaan Poké Ball atau Potion untuk petualanganmu?'
      ]
    }
  ]
};

// 5. Gym Interior (11 x 12)
export const gym = {
  id: 'gym',
  name: 'Oakhaven Gym',
  width: 11,
  height: 12,
  isInterior: true,
  tiles: [
    [W, W, W, W, W, W, W, W, W, W, W],
    [W, GF, GF, GF, GF, GF, GF, GF, GF, GF, W],
    [W, GF, GF, GF, GF, GF, GF, GF, GF, GF, W], // Brock at x=5, y=2
    [W, GF, GF, GF, GF, GF, GF, GF, GF, GF, W],
    [W, GF, GF, GF, GF, GF, GF, GF, GF, GF, W],
    [W, GF, GF, GF, GF, GF, GF, GF, GF, GF, W],
    [W, GF, GF, GF, GF, GF, GF, GF, GF, GF, W], // Gym Trainer at x=5, y=6
    [W, GF, GF, GF, GF, GF, GF, GF, GF, GF, W],
    [W, GF, GF, C, C, C, C, C, GF, GF, W],
    [W, GF, GF, GF, GF, C, GF, GF, GF, GF, W],
    [W, GF, GF, GF, GF, C, GF, GF, GF, GF, W],
    [W, W, W, W, W, C, W, W, W, W, W] // exit at x=5, y=11
  ],
  warps: [
    { x: 5, y: 11, targetMap: 'secondTown', targetX: 15, targetY: 8 }
  ],
  npcs: [
    {
      id: 'gym_leader_brock',
      name: 'Gym Leader Brock',
      x: 5,
      y: 2,
      direction: 'down',
      sprite: 'brock',
      isTrainer: true,
      trainerId: 'brock',
      isGymLeader: true,
      party: [
        { pokemonId: 74, level: 7 }, // Geodude
        { pokemonId: 95, level: 9 }  // Onix
      ],
      prizeMoney: 1000,
      preBattleDialogue: [
        'Aku adalah Brock, Gym Leader dari Oakhaven Gym!',
        'Tekad dan pertahananku sekeras batu granit pegunungan.',
        'Tunjukkan apakah ikatan dan kemampuan Pokémon-mu sanggup memecahkan pertahanan batuku!'
      ],
      postBattleDialogue: [
        'Luar biasa! Seranganmu sungguh menembus pertahanan keras batuku!',
        'Sebagai bukti kemenangan gemilangmu, kuberikan ini: BOULDER BADGE!',
        'Dengan lencana ini, namamu tercatat sebagai penakluk resmi Gym pertama!'
      ]
    },
    {
      id: 'gym_trainer_liam',
      name: 'Gym Trainer Liam',
      x: 5,
      y: 6,
      direction: 'down',
      sprite: 'youngster',
      isTrainer: true,
      trainerId: 'liam',
      party: [
        { pokemonId: 74, level: 5 }
      ],
      prizeMoney: 150,
      preBattleDialogue: [
        'Sebelum menghadapi Brock, kamu harus melewati ujianku terlebih dahulu!'
      ],
      postBattleDialogue: [
        'Kamu memang tangguh! Silakan maju dan hadapi Brock di podium atas.'
      ]
    }
  ]
};
