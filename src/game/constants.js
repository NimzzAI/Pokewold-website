// Game Constants & Tile Palette Definitions

export const TILE_SIZE = 32;

export const TILES = {
  GRASS: 0,
  PATH: 1,
  TALL_GRASS: 2,
  TREE: 3,
  WATER: 4,
  FLOWER: 5,
  FENCE: 6,
  ROCK: 7,
  CAVE_WALL: 8,
  CAVE_FLOOR: 9,
  INDOOR_FLOOR: 10,
  INDOOR_WALL: 11,
  CENTER_FLOOR: 12,
  MART_FLOOR: 13,
  GYM_FLOOR: 14,
  CARPET: 15,
  SIGN: 16
};

// Set of tiles that block player movement
export const SOLID_TILES = new Set([
  TILES.TREE,
  TILES.WATER,
  TILES.FENCE,
  TILES.ROCK,
  TILES.CAVE_WALL,
  TILES.INDOOR_WALL,
  TILES.SIGN
]);

export const DIRECTIONS = {
  DOWN: 'down',
  UP: 'up',
  LEFT: 'left',
  RIGHT: 'right'
};

// Default initial game state for a new player
export const INITIAL_GAME_STATE = {
  playerName: 'Red',
  currentMap: 'starterTown',
  playerPos: { x: 9, y: 11 },
  playerDirection: 'down',
  hasStarter: false,
  party: [],
  bag: [
    { id: 'pokeball', name: 'Poké Ball', count: 5, type: 'ball', desc: 'Menangkap Pokémon liar.' },
    { id: 'potion', name: 'Potion', count: 3, type: 'heal', healAmount: 20, desc: 'Memulihkan 20 HP Pokémon.' },
    { id: 'antidote', name: 'Antidote', count: 1, type: 'cure', desc: 'Menyembuhkan status poison.' }
  ],
  money: 500,
  badges: [],
  storyStep: 0, // 0: Visit Oak, 1: Pick Starter, 2: Route 1, 3: Forest & Cave, 4: Defeat Brock, 5: Champion
  questTitle: 'Kunjungi Lab Pokémon',
  questDesc: 'Pergi ke Lab Prof. Oak di sebelah kanan rumahmu untuk memilih starter Pokémon.',
  defeatedTrainers: []
};
