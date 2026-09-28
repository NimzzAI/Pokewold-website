import { useEffect, useRef } from 'react';
import { TILE_SIZE, TILES } from './constants.js';

// Visual constants
const VIEW_WIDTH_TILES = 15;
const VIEW_HEIGHT_TILES = 11;
const CANVAS_WIDTH = VIEW_WIDTH_TILES * TILE_SIZE; // 480px
const CANVAS_HEIGHT = VIEW_HEIGHT_TILES * TILE_SIZE; // 352px

export default function WorldCanvas({
  map,
  playerPos,
  playerDirection = 'down',
  isMoving = false,
  walkFrame = 0,
  starterTableSelected = null,
  onInteract
}) {
  const canvasRef = useRef(null);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Calculate Camera offset to keep player centered in viewport
    const targetCamX = playerPos.x * TILE_SIZE + TILE_SIZE / 2 - CANVAS_WIDTH / 2;
    const targetCamY = playerPos.y * TILE_SIZE + TILE_SIZE / 2 - CANVAS_HEIGHT / 2;

    const maxCamX = Math.max(0, map.width * TILE_SIZE - CANVAS_WIDTH);
    const maxCamY = Math.max(0, map.height * TILE_SIZE - CANVAS_HEIGHT);

    const camX = Math.max(0, Math.min(maxCamX, targetCamX));
    const camY = Math.max(0, Math.min(maxCamY, targetCamY));

    // Clear background
    ctx.fillStyle = map.isCave ? '#0b0f19' : (map.isInterior ? '#1e293b' : '#14532d');
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Save transform for camera
    ctx.save();
    ctx.translate(-Math.floor(camX), -Math.floor(camY));

    // 1. Draw Map Tiles
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        // Skip tiles outside camera view for performance
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        if (px + TILE_SIZE < camX || px > camX + CANVAS_WIDTH ||
            py + TILE_SIZE < camY || py > camY + CANVAS_HEIGHT) {
          continue;
        }

        const tile = map.tiles[y]?.[x] ?? TILES.GRASS;
        drawTile(ctx, tile, px, py);
      }
    }

    // 2. Draw Buildings (if map has buildings)
    if (map.buildings) {
      map.buildings.forEach(b => {
        drawBuilding(ctx, b);
      });
    }

    // 3. Draw Starter Table if inside Oak's Lab
    if (map.starterTable) {
      drawLabTable(ctx, map.starterTable.starters, starterTableSelected);
    }

    // 4. Draw NPCs
    if (map.npcs) {
      map.npcs.forEach(npc => {
        drawNPC(ctx, npc);
      });
    }

    // 5. Draw Player Character
    drawPlayer(ctx, playerPos.x * TILE_SIZE, playerPos.y * TILE_SIZE, playerDirection, isMoving, walkFrame);

    // Restore camera transform
    ctx.restore();

  }, [map, playerPos, playerDirection, isMoving, walkFrame, starterTableSelected]);

  return (
    <div className="relative inline-block border-4 border-slate-900 rounded-xl overflow-hidden shadow-2xl bg-black select-none">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="block pixel-art w-full h-auto max-h-[70vh] object-contain cursor-pointer"
        onClick={onInteract}
      />
    </div>
  );
}

// ----------------- TILE DRAWING PROCEDURES -----------------

function drawTile(ctx, tile, x, y) {
  switch (tile) {
    case TILES.GRASS:
      // Base grass
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      // Grass texture specks
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x + 4, y + 6, 2, 4);
      ctx.fillRect(x + 20, y + 14, 2, 4);
      ctx.fillRect(x + 12, y + 24, 2, 4);
      ctx.fillStyle = '#86efac';
      ctx.fillRect(x + 5, y + 5, 2, 2);
      ctx.fillRect(x + 21, y + 13, 2, 2);
      break;

    case TILES.PATH:
      // Gravel / Dirt Path
      ctx.fillStyle = '#fde047';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(x + 2, y + 4, 3, 2);
      ctx.fillRect(x + 16, y + 8, 3, 2);
      ctx.fillRect(x + 8, y + 20, 3, 2);
      ctx.fillRect(x + 22, y + 24, 3, 2);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(x, y, TILE_SIZE, 1);
      ctx.fillRect(x, y + TILE_SIZE - 1, TILE_SIZE, 1);
      break;

    case TILES.TALL_GRASS:
      // Background base
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      // Tall grass pixel clumps
      ctx.fillStyle = '#15803d';
      ctx.fillRect(x + 2, y + 6, 4, 18);
      ctx.fillRect(x + 10, y + 2, 4, 22);
      ctx.fillRect(x + 18, y + 8, 4, 16);
      ctx.fillRect(x + 26, y + 4, 4, 20);
      // Light grass tips
      ctx.fillStyle = '#86efac';
      ctx.fillRect(x + 3, y + 4, 2, 4);
      ctx.fillRect(x + 11, y + 1, 2, 4);
      ctx.fillRect(x + 19, y + 6, 2, 4);
      ctx.fillRect(x + 27, y + 2, 2, 4);
      break;

    case TILES.TREE:
      // Tree base shadow / soil
      ctx.fillStyle = '#15803d';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 12, y + 18, 8, 14);
      // Foliage layers
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.arc(x + 16, y + 12, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(x + 15, y + 10, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(x + 12, y + 7, 5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case TILES.WATER:
      // Water tile
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(x + 4, y + 8, 12, 2);
      ctx.fillRect(x + 16, y + 20, 10, 2);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(x + 6, y + 7, 6, 2);
      ctx.fillRect(x + 18, y + 19, 6, 2);
      break;

    case TILES.FLOWER:
      // Grass with blooming flowers
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      // Red & Yellow flowers
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(x + 6, y + 8, 6, 6);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 8, y + 10, 2, 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x + 18, y + 18, 6, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 20, y + 20, 2, 2);
      break;

    case TILES.FENCE:
      // Fence on grass
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      // Wooden posts & rail
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x, y + 12, TILE_SIZE, 4);
      ctx.fillRect(x, y + 20, TILE_SIZE, 4);
      ctx.fillRect(x + 4, y + 6, 4, 22);
      ctx.fillRect(x + 20, y + 6, 4, 22);
      break;

    case TILES.ROCK:
      // Mountain Boulder
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(x + 16, y + 16, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x + 10, y + 8, 6, 6);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 14, y + 20, 10, 5);
      break;

    case TILES.CAVE_WALL:
      // Dark rugged rock wall
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 4, y + 4, 8, 4);
      ctx.fillRect(x + 16, y + 14, 10, 4);
      break;

    case TILES.CAVE_FLOOR:
      // Walkable cave stone
      ctx.fillStyle = '#334155';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#475569';
      ctx.fillRect(x + 4, y + 6, 3, 2);
      ctx.fillRect(x + 18, y + 16, 4, 2);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 10, y + 22, 4, 2);
      break;

    case TILES.INDOOR_WALL:
      // Cozy wooden / plaster wall
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 8);
      ctx.fillStyle = '#9a3412';
      ctx.fillRect(x, y + TILE_SIZE - 4, TILE_SIZE, 4);
      break;

    case TILES.INDOOR_FLOOR:
      // Wood Parquet floor
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x, y + 15, TILE_SIZE, 1);
      ctx.fillRect(x + 15, y, 1, 15);
      ctx.fillRect(x + 7, y + 16, 1, 15);
      break;

    case TILES.CENTER_FLOOR:
      // Pokémon Center checkerboard tile
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(x, y, 16, 16);
      ctx.fillRect(x + 16, y + 16, 16, 16);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      break;

    case TILES.MART_FLOOR:
      // Poké Mart blue-white tile
      ctx.fillStyle = '#f0fdf4';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#e0e7ff';
      ctx.fillRect(x + 4, y + 4, 24, 24);
      break;

    case TILES.GYM_FLOOR:
      // Gym stone arena floor
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      break;

    case TILES.CARPET:
      // Elegant red welcome carpet
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(x, y, 2, TILE_SIZE);
      ctx.fillRect(x + TILE_SIZE - 2, y, 2, TILE_SIZE);
      break;

    case TILES.SIGN:
      // Wooden signpost
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 14, y + 14, 4, 16);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x + 4, y + 4, 24, 14);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x + 6, y + 6, 20, 10);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 8, y + 9, 16, 2);
      ctx.fillRect(x + 8, y + 12, 12, 2);
      break;

    default:
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      break;
  }
}

// ----------------- BUILDING DRAWING PROCEDURES -----------------

function drawBuilding(ctx, b) {
  const bx = b.x * TILE_SIZE;
  const by = b.y * TILE_SIZE;
  const bw = b.width * TILE_SIZE;
  const bh = b.height * TILE_SIZE;

  if (b.type === 'pokecenter') {
    // Red Gabled Roof
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(bx, by, bw, bh * 0.45);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(bx, by + bh * 0.45 - 6, bw, 6);

    // Poké Ball symbol on roof
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bx + bw / 2, by + 16, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(bx + bw / 2, by + 16, 12, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx + bw / 2 - 12, by + 15, 24, 2);
    ctx.beginPath();
    ctx.arc(bx + bw / 2, by + 16, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bx + bw / 2, by + 16, 2, 0, Math.PI * 2);
    ctx.fill();

    // White Walls
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx, by + bh * 0.45, bw, bh * 0.55);

    // Glass Door
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bx + (bw / 2) - 16, by + bh - 28, 32, 28);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(bx + (bw / 2) - 1, by + bh - 28, 2, 28);

    // Windows
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(bx + 12, by + bh * 0.55, 20, 16);
    ctx.fillRect(bx + bw - 32, by + bh * 0.55, 20, 16);

  } else if (b.type === 'pokemart') {
    // Blue Gabled Roof
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(bx, by, bw, bh * 0.45);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(bx, by + bh * 0.45 - 6, bw, 6);

    // "MART" sign banner
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx + bw / 2 - 24, by + 10, 48, 14);
    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('MART', bx + bw / 2 - 14, by + 21);

    // White Walls
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx, by + bh * 0.45, bw, bh * 0.55);

    // Glass Door
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(bx + (bw / 2) - 16, by + bh - 28, 32, 28);

    // Windows
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(bx + 12, by + bh * 0.55, 20, 16);
    ctx.fillRect(bx + bw - 32, by + bh * 0.55, 20, 16);

  } else if (b.type === 'lab') {
    // Large Science Lab Roof
    ctx.fillStyle = '#475569';
    ctx.fillRect(bx, by, bw, bh * 0.4);
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx, by + bh * 0.4 - 4, bw, 4);

    // Lab Sign
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx + bw / 2 - 28, by + 8, 56, 14);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('OAK LAB', bx + bw / 2 - 22, by + 19);

    // Brick Walls
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(bx, by + bh * 0.4, bw, bh * 0.6);

    // Double Door
    ctx.fillStyle = '#475569';
    ctx.fillRect(bx + (bw / 2) - 18, by + bh - 30, 36, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx + (bw / 2) - 1, by + bh - 30, 2, 30);

    // Windows with research blue hue
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(bx + 14, by + bh * 0.5, 24, 18);
    ctx.fillRect(bx + bw - 38, by + bh * 0.5, 24, 18);

  } else if (b.type === 'gym') {
    // Majestic Pokémon Gym (Stone Temple Style)
    ctx.fillStyle = '#78716c';
    ctx.fillRect(bx, by, bw, bh * 0.35);
    ctx.fillStyle = '#57534e';
    ctx.fillRect(bx, by + bh * 0.35 - 6, bw, 6);

    // Gym Banner
    ctx.fillStyle = '#eab308';
    ctx.fillRect(bx + bw / 2 - 26, by + 10, 52, 16);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('GYM ⚔️', bx + bw / 2 - 20, by + 22);

    // Stone Pillars & Walls
    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(bx, by + bh * 0.35, bw, bh * 0.65);

    // Pillars
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(bx + 12, by + bh * 0.35, 14, bh * 0.65);
    ctx.fillRect(bx + bw - 26, by + bh * 0.35, 14, bh * 0.65);

    // Grand Entrance Door
    ctx.fillStyle = '#292524';
    ctx.fillRect(bx + (bw / 2) - 20, by + bh - 34, 40, 34);

  } else {
    // Standard Player / NPC House
    ctx.fillStyle = '#c2410c'; // Terracotta roof
    ctx.fillRect(bx, by, bw, bh * 0.45);
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(bx, by + bh * 0.45 - 4, bw, 4);

    // Wooden / Stucco walls
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(bx, by + bh * 0.45, bw, bh * 0.55);

    // Window with flower pot
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bx + 12, by + bh * 0.52, 20, 16);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(bx + 12, by + bh * 0.52 + 16, 20, 4);

    // Wooden Door
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bx + (bw / 2) - 12, by + bh - 26, 24, 26);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(bx + (bw / 2) + 6, by + bh - 14, 3, 3); // knob
  }
}

// ----------------- LAB STARTER TABLE -----------------

function drawLabTable(ctx, starters, selectedId) {
  // Table base
  const tx = 3 * TILE_SIZE;
  const ty = 3 * TILE_SIZE;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(tx, ty + 8, 4 * TILE_SIZE, 20);
  ctx.fillStyle = '#a16207';
  ctx.fillRect(tx + 2, ty + 10, 4 * TILE_SIZE - 4, 16);

  // 3 Poké Balls on the table
  starters.forEach(st => {
    const px = st.x * TILE_SIZE + 16;
    const py = st.y * TILE_SIZE + 18;

    // Poké Ball outer
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fill();

    // Red top half
    ctx.fillStyle = selectedId === st.id ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(px, py, 9, Math.PI, 0);
    ctx.fill();

    // Center band & button
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px - 9, py - 1, 18, 2);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ----------------- NPC DRAWING PROCEDURES -----------------

function drawNPC(ctx, npc) {
  const px = npc.x * TILE_SIZE;
  const py = npc.y * TILE_SIZE;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 28, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (npc.sprite === 'nurse') {
    // Nurse Joy with pink hair & apron
    ctx.fillStyle = '#f472b6'; // pink hair
    ctx.beginPath();
    ctx.arc(px + 16, py + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    // Face
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(px + 11, py + 8, 10, 8);
    // Apron / Uniform
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(px + 10, py + 16, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 12, py + 18, 8, 8);

  } else if (npc.sprite === 'oak') {
    // Prof Oak with gray hair & white lab coat
    ctx.fillStyle = '#94a3b8'; // gray hair
    ctx.beginPath();
    ctx.arc(px + 16, py + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    // Face
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(px + 11, py + 8, 10, 8);
    // White lab coat & red shirt
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(px + 13, py + 16, 6, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 9, py + 16, 4, 12);
    ctx.fillRect(px + 19, py + 16, 4, 12);
    ctx.fillStyle = '#78350f'; // brown pants
    ctx.fillRect(px + 11, py + 26, 10, 4);

  } else if (npc.sprite === 'brock') {
    // Brock with spiky brown hair & orange/tan vest
    ctx.fillStyle = '#78350f'; // spiky hair
    ctx.beginPath();
    ctx.arc(px + 16, py + 9, 8, 0, Math.PI * 2);
    ctx.fill();
    // Face
    ctx.fillStyle = '#d97706'; // tan skin
    ctx.fillRect(px + 11, py + 8, 10, 7);
    // Orange/tan vest
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(px + 10, py + 15, 12, 11);
    ctx.fillStyle = '#15803d'; // green shirt under
    ctx.fillRect(px + 13, py + 15, 6, 6);
    ctx.fillStyle = '#374151'; // dark pants
    ctx.fillRect(px + 11, py + 26, 10, 4);

  } else {
    // Generic Trainer / Townsfolk
    ctx.fillStyle = '#1e293b'; // cap/hair
    ctx.fillRect(px + 11, py + 5, 10, 6);
    // Face
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(px + 11, py + 9, 10, 7);
    // Shirt
    ctx.fillStyle = npc.isTrainer ? '#3b82f6' : '#10b981';
    ctx.fillRect(px + 10, py + 16, 12, 10);
    // Pants
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 11, py + 26, 10, 4);
  }
}

// ----------------- PLAYER DRAWING PROCEDURES -----------------

function drawPlayer(ctx, px, py, direction, isMoving, walkFrame) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 28, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walk bob offset
  const bob = isMoving && (walkFrame % 2 !== 0) ? -2 : 0;
  const legOffset = isMoving ? (walkFrame === 1 ? -2 : 2) : 0;

  // 1. Red Cap
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 10, py + 5 + bob, 12, 7);
  // Visor depending on direction
  if (direction === 'down') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 13, py + 8 + bob, 6, 3);
  } else if (direction === 'up') {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(px + 10, py + 4 + bob, 12, 4);
  } else if (direction === 'left') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 7, py + 9 + bob, 5, 3);
  } else if (direction === 'right') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 20, py + 9 + bob, 5, 3);
  }

  // 2. Face / Hair
  if (direction !== 'up') {
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(px + 11, py + 10 + bob, 10, 6);
    // Eyes
    ctx.fillStyle = '#1e293b';
    if (direction === 'down') {
      ctx.fillRect(px + 13, py + 12 + bob, 2, 2);
      ctx.fillRect(px + 17, py + 12 + bob, 2, 2);
    } else if (direction === 'left') {
      ctx.fillRect(px + 11, py + 12 + bob, 2, 2);
    } else if (direction === 'right') {
      ctx.fillRect(px + 19, py + 12 + bob, 2, 2);
    }
  } else {
    // Back of hair
    ctx.fillStyle = '#451a03';
    ctx.fillRect(px + 11, py + 10 + bob, 10, 6);
  }

  // 3. Blue Jacket with White Collar
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(px + 10, py + 16 + bob, 12, 9);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 14, py + 16 + bob, 4, 7);

  // 4. Yellow Bag on side/back
  ctx.fillStyle = '#eab308';
  if (direction === 'right' || direction === 'up') {
    ctx.fillRect(px + 8, py + 17 + bob, 3, 6);
  } else {
    ctx.fillRect(px + 21, py + 17 + bob, 3, 6);
  }

  // 5. Jeans / Pants with walking animation
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(px + 11, py + 25 + bob, 4, 5 + legOffset);
  ctx.fillRect(px + 17, py + 25 + bob, 4, 5 - legOffset);

  // 6. Red/White Sneakers
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px + 10, py + 29 + bob + (legOffset > 0 ? legOffset : 0), 5, 3);
  ctx.fillRect(px + 17, py + 29 + bob + (legOffset < 0 ? -legOffset : 0), 5, 3);
}
