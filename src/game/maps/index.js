import { starterTown } from './starterTown.js';
import { route1 } from './route1.js';
import { forest } from './forest.js';
import { cave } from './cave.js';
import { secondTown } from './secondTown.js';
import { playerHouse, oakLab, pokecenter, pokemart, gym } from './interiors.js';

export const ALL_MAPS = {
  starterTown,
  route1,
  forest,
  cave,
  secondTown,
  playerHouse,
  oakLab,
  pokecenter,
  pokemart,
  gym
};

export function getMapById(mapId) {
  return ALL_MAPS[mapId] || ALL_MAPS.starterTown;
}
