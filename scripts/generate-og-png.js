import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 630;

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
    }
  }
  return (~c >>> 0);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crcBuf]);
}

// 1. Create pixel buffer for 1200x630
const buffer = new Uint8ClampedArray(WIDTH * HEIGHT * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
  const idx = (y * WIDTH + x) * 4;
  if (a === 255) {
    buffer[idx] = r;
    buffer[idx + 1] = g;
    buffer[idx + 2] = b;
    buffer[idx + 3] = 255;
  } else {
    const alpha = a / 255;
    buffer[idx] = Math.round(buffer[idx] * (1 - alpha) + r * alpha);
    buffer[idx + 1] = Math.round(buffer[idx + 1] * (1 - alpha) + g * alpha);
    buffer[idx + 2] = Math.round(buffer[idx + 2] * (1 - alpha) + b * alpha);
    buffer[idx + 3] = 255;
  }
}

function fillRect(x, y, w, h, r, g, b, a = 255) {
  const x1 = Math.max(0, x);
  const y1 = Math.max(0, y);
  const x2 = Math.min(WIDTH, x + w);
  const y2 = Math.min(HEIGHT, y + h);
  for (let py = y1; py < y2; py++) {
    for (let px = x1; px < x2; px++) {
      setPixel(px, py, r, g, b, a);
    }
  }
}

function drawCircle(cx, cy, radius, r, g, b, a = 255) {
  const r2 = radius * radius;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= r2) {
        setPixel(cx + dx, cy + dy, r, g, b, a);
      }
    }
  }
}

// 5x7 Pixel Font Engine for Retro Text
const FONT_5X7 = {
  'A': [0x0C,0x12,0x12,0x1E,0x12,0x12,0x12],
  'B': [0x1C,0x12,0x12,0x1C,0x12,0x12,0x1C],
  'C': [0x0E,0x12,0x10,0x10,0x10,0x12,0x0E],
  'D': [0x1C,0x12,0x12,0x12,0x12,0x12,0x1C],
  'E': [0x1E,0x10,0x10,0x1C,0x10,0x10,0x1E],
  'F': [0x1E,0x10,0x10,0x1C,0x10,0x10,0x10],
  'G': [0x0E,0x12,0x10,0x16,0x12,0x12,0x0E],
  'H': [0x12,0x12,0x12,0x1E,0x12,0x12,0x12],
  'I': [0x0E,0x04,0x04,0x04,0x04,0x04,0x0E],
  'J': [0x07,0x02,0x02,0x02,0x12,0x12,0x0C],
  'K': [0x12,0x14,0x18,0x1C,0x18,0x14,0x12],
  'L': [0x10,0x10,0x10,0x10,0x10,0x10,0x1E],
  'M': [0x11,0x1B,0x15,0x15,0x11,0x11,0x11],
  'N': [0x11,0x19,0x15,0x13,0x11,0x11,0x11],
  'O': [0x0E,0x11,0x11,0x11,0x11,0x11,0x0E],
  'P': [0x1E,0x11,0x11,0x1E,0x10,0x10,0x10],
  'Q': [0x0E,0x11,0x11,0x11,0x15,0x12,0x0D],
  'R': [0x1E,0x11,0x11,0x1E,0x14,0x12,0x11],
  'S': [0x0E,0x11,0x10,0x0E,0x01,0x11,0x0E],
  'T': [0x1F,0x04,0x04,0x04,0x04,0x04,0x04],
  'U': [0x11,0x11,0x11,0x11,0x11,0x11,0x0E],
  'V': [0x11,0x11,0x11,0x11,0x0A,0x0A,0x04],
  'W': [0x11,0x11,0x11,0x15,0x15,0x1B,0x11],
  'X': [0x11,0x0A,0x04,0x04,0x0A,0x11,0x11],
  'Y': [0x11,0x11,0x0A,0x04,0x04,0x04,0x04],
  'Z': [0x1F,0x01,0x02,0x04,0x08,0x10,0x1F],
  '0': [0x0E,0x13,0x15,0x19,0x11,0x11,0x0E],
  '1': [0x04,0x0C,0x04,0x04,0x04,0x04,0x0E],
  '2': [0x0E,0x11,0x01,0x06,0x08,0x10,0x1F],
  '3': [0x1F,0x02,0x04,0x02,0x01,0x11,0x0E],
  '4': [0x02,0x06,0x0A,0x12,0x1F,0x02,0x02],
  '5': [0x1F,0x10,0x1E,0x01,0x01,0x11,0x0E],
  '6': [0x06,0x08,0x10,0x1E,0x11,0x11,0x0E],
  '7': [0x1F,0x01,0x02,0x04,0x08,0x08,0x08],
  '8': [0x0E,0x11,0x11,0x0E,0x11,0x11,0x0E],
  '9': [0x0E,0x11,0x11,0x0F,0x01,0x02,0x0C],
  '-': [0x00,0x00,0x00,0x1F,0x00,0x00,0x00],
  '.': [0x00,0x00,0x00,0x00,0x00,0x06,0x06],
  ':': [0x00,0x06,0x06,0x00,0x06,0x06,0x00],
  '!': [0x04,0x04,0x04,0x04,0x00,0x04,0x04],
  '/': [0x01,0x02,0x04,0x08,0x10,0x00,0x00],
  '★': [0x04,0x15,0x0E,0x1B,0x0E,0x15,0x04],
  '•': [0x00,0x00,0x0E,0x0E,0x0E,0x00,0x00],
  ' ': [0x00,0x00,0x00,0x00,0x00,0x00,0x00]
};

function drawPixelText(text, startX, startY, scale, r, g, b, a = 255) {
  let curX = startX;
  const upper = text.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    const bitmap = FONT_5X7[char] || FONT_5X7[' '];
    for (let row = 0; row < 7; row++) {
      const bits = bitmap[row] || 0;
      for (let col = 0; col < 5; col++) {
        if ((bits >> (4 - col)) & 1) {
          fillRect(curX + col * scale, startY + row * scale, scale, scale, r, g, b, a);
        }
      }
    }
    curX += 6 * scale;
  }
}

// RENDER SCENE
console.log('Generating 1200x630 pixel art OpenGraph image...');

// 1. Background gradient (Dark cosmic slate/indigo)
for (let y = 0; y < HEIGHT; y++) {
  const t = y / HEIGHT;
  const r = Math.round(9 * (1 - t) + 26 * t);
  const g = Math.round(13 * (1 - t) + 23 * t);
  const b = Math.round(25 * (1 - t) + 65 * t);
  for (let x = 0; x < WIDTH; x++) {
    // Subtle pixel grid effect
    const gridDim = (x % 32 === 0 || y % 32 === 0) ? -6 : 0;
    setPixel(x, y, Math.max(0, r + gridDim), Math.max(0, g + gridDim), Math.max(0, b + gridDim), 255);
  }
}

// 2. Ambient glowing color orbs
drawCircle(180, 160, 140, 220, 38, 38, 25);
drawCircle(1020, 420, 180, 59, 130, 246, 25);
drawCircle(600, 220, 150, 245, 158, 11, 20);

// 3. Retro outer frame (Gold + Slate border with rivets)
fillRect(24, 24, WIDTH - 48, 4, 71, 85, 105);
fillRect(24, HEIGHT - 28, WIDTH - 48, 4, 71, 85, 105);
fillRect(24, 24, 4, HEIGHT - 48, 71, 85, 105);
fillRect(WIDTH - 28, 24, 4, HEIGHT - 48, 71, 85, 105);

fillRect(32, 32, WIDTH - 64, 2, 245, 158, 11);
fillRect(32, HEIGHT - 34, WIDTH - 64, 2, 245, 158, 11);
fillRect(32, 32, 2, HEIGHT - 64, 245, 158, 11);
fillRect(WIDTH - 34, 32, 2, HEIGHT - 64, 245, 158, 11);

// Corner studs
const corners = [[40, 40], [WIDTH - 52, 40], [40, HEIGHT - 52], [WIDTH - 52, HEIGHT - 52]];
for (const [cx, cy] of corners) {
  fillRect(cx, cy, 12, 12, 251, 191, 36);
  fillRect(cx + 2, cy + 2, 8, 8, 245, 158, 11);
}

// 4. Top Tag Kicker
const topText = '★ CLASSIC 8-BIT BROWSER RPG ★';
const topScale = 3;
const topWidth = topText.length * 6 * topScale;
const topX = Math.round((WIDTH - topWidth) / 2);
fillRect(topX - 24, 52, topWidth + 48, 38, 30, 41, 59);
fillRect(topX - 24, 52, topWidth + 48, 2, 245, 158, 11);
fillRect(topX - 24, 88, topWidth + 48, 2, 245, 158, 11);
fillRect(topX - 24, 52, 2, 38, 245, 158, 11);
fillRect(topX + topWidth + 22, 52, 2, 38, 245, 158, 11);
drawPixelText(topText, topX, 60, topScale, 254, 240, 138);

// 5. Main Title: POKÉWORLD ADVENTURE
const titleText = 'POKEWORLD';
const titleScale = 9;
const titleWidth = titleText.length * 6 * titleScale;
const titleX = Math.round((WIDTH - titleWidth) / 2);
// 3D Shadow
drawPixelText(titleText, titleX + 6, 126, titleScale, 15, 23, 42);
drawPixelText(titleText, titleX + 4, 124, titleScale, 180, 83, 9);
drawPixelText(titleText, titleX, 120, titleScale, 251, 191, 36);

const subTitleText = 'ADVENTURE';
const subScale = 5;
const subWidth = subTitleText.length * 6 * subScale;
const subX = Math.round((WIDTH - subWidth) / 2);
drawPixelText(subTitleText, subX + 4, 204, subScale, 15, 23, 42);
drawPixelText(subTitleText, subX, 200, subScale, 103, 232, 249);

// Tagline
const tagText = 'EXPLORE • CATCH • BATTLE • GYM LEADERS';
const tagScale = 3;
const tagWidth = tagText.length * 6 * tagScale;
const tagX = Math.round((WIDTH - tagWidth) / 2);
drawPixelText(tagText, tagX, 252, tagScale, 148, 163, 184);

// 6. Center HUD Box (Overworld / Battle UI)
const hudX = 140;
const hudY = 286;
const hudW = 920;
const hudH = 196;

fillRect(hudX, hudY, hudW, hudH, 15, 23, 42);
fillRect(hudX + 4, hudY + 4, hudW - 8, hudH - 8, 2, 6, 23);
fillRect(hudX, hudY, hudW, 4, 51, 65, 85);
fillRect(hudX, hudY + hudH - 4, hudW, 4, 51, 65, 85);
fillRect(hudX, hudY, 4, hudH, 51, 65, 85);
fillRect(hudX + hudW - 4, hudY, 4, hudH, 51, 65, 85);

// Left Panel: Wild Pokémon HUD
const leftBoxX = hudX + 24;
const leftBoxY = hudY + 20;
const leftBoxW = 420;
const leftBoxH = 156;
fillRect(leftBoxX, leftBoxY, leftBoxW, leftBoxH, 15, 23, 42);
fillRect(leftBoxX + 2, leftBoxY + 2, leftBoxW - 4, leftBoxH - 4, 24, 33, 47);

// Text inside Left Box
drawPixelText('PIKACHU', leftBoxX + 20, leftBoxY + 18, 3, 255, 255, 255);
drawPixelText('LV. 18', leftBoxX + leftBoxW - 90, leftBoxY + 18, 2, 250, 204, 21);

// HP Bar
drawPixelText('HP', leftBoxX + 20, leftBoxY + 48, 2, 248, 113, 113);
fillRect(leftBoxX + 56, leftBoxY + 46, leftBoxW - 80, 16, 15, 23, 42);
fillRect(leftBoxX + 58, leftBoxY + 48, leftBoxW - 84, 12, 51, 65, 85);
fillRect(leftBoxX + 58, leftBoxY + 48, Math.round((leftBoxW - 84) * 0.85), 12, 34, 197, 94);

// Pixel Poké Ball in Left Box
const ballX = leftBoxX + 50;
const ballY = leftBoxY + 110;
const ballR = 24;
drawCircle(ballX, ballY, ballR, 15, 23, 42);
drawCircle(ballX, ballY, ballR - 2, 255, 255, 255);
// Top half red
for (let dy = -ballR + 2; dy <= 0; dy++) {
  for (let dx = -ballR + 2; dx <= ballR - 2; dx++) {
    if (dx * dx + dy * dy <= (ballR - 2) * (ballR - 2)) {
      setPixel(ballX + dx, ballY + dy, 239, 68, 68);
    }
  }
}
// Middle band
fillRect(ballX - ballR + 2, ballY - 3, (ballR - 2) * 2, 6, 15, 23, 42);
drawCircle(ballX, ballY, 8, 15, 23, 42);
drawCircle(ballX, ballY, 6, 255, 255, 255);
drawCircle(ballX, ballY, 3, 15, 23, 42);

drawPixelText('WILD ENCOUNTER!', leftBoxX + 90, leftBoxY + 98, 2, 254, 240, 138);
drawPixelText('ROUTE 1 GRASS', leftBoxX + 90, leftBoxY + 120, 2, 148, 163, 184);

// Right Panel: 4 Classic Handheld Buttons
const rightBoxX = hudX + 468;
const rightBoxY = hudY + 20;
const rightBoxW = 428;
const rightBoxH = 156;
fillRect(rightBoxX, rightBoxY, rightBoxW, rightBoxH, 15, 23, 42);

const btnW = 196;
const btnH = 54;
// FIGHT
fillRect(rightBoxX + 12, rightBoxY + 16, btnW, btnH, 220, 38, 38);
fillRect(rightBoxX + 14, rightBoxY + 18, btnW - 4, btnH - 4, 185, 28, 28);
drawPixelText('FIGHT', rightBoxX + 66, rightBoxY + 34, 3, 255, 255, 255);

// BAG
fillRect(rightBoxX + 220, rightBoxY + 16, btnW, btnH, 217, 119, 6);
fillRect(rightBoxX + 222, rightBoxY + 18, btnW - 4, btnH - 4, 180, 83, 9);
drawPixelText('BAG', rightBoxX + 288, rightBoxY + 34, 3, 255, 255, 255);

// POKEMON
fillRect(rightBoxX + 12, rightBoxY + 84, btnW, btnH, 22, 163, 74);
fillRect(rightBoxX + 14, rightBoxY + 86, btnW - 4, btnH - 4, 21, 128, 61);
drawPixelText('POKEMON', rightBoxX + 46, rightBoxY + 102, 3, 255, 255, 255);

// RUN
fillRect(rightBoxX + 220, rightBoxY + 84, btnW, btnH, 37, 99, 235);
fillRect(rightBoxX + 222, rightBoxY + 86, btnW - 4, btnH - 4, 29, 78, 216);
drawPixelText('RUN', rightBoxX + 288, rightBoxY + 102, 3, 255, 255, 255);

// 7. Bottom Badges
const badgeText = 'TILE OVERWORLD • TURN BATTLES • GYM BADGES • REAL POKEAPI';
const badgeScale = 2;
const badgeWidth = badgeText.length * 6 * badgeScale;
const badgeX = Math.round((WIDTH - badgeWidth) / 2);
fillRect(badgeX - 16, 514, badgeWidth + 32, 28, 30, 41, 59);
fillRect(badgeX - 16, 514, badgeWidth + 32, 1, 71, 85, 105);
fillRect(badgeX - 16, 541, badgeWidth + 32, 1, 71, 85, 105);
drawPixelText(badgeText, badgeX, 522, badgeScale, 226, 232, 240);

// 8. Footer URL
const footLeft = 'POKEMON FAN GAME • POWERED BY POKEAPI';
drawPixelText(footLeft, 50, 574, 2, 100, 116, 139);

const footRight = 'POKEWORLD-ADVENTURE';
const footRWidth = footRight.length * 6 * 2;
drawPixelText(footRight, WIDTH - footRWidth - 50, 574, 2, 251, 191, 36);

// 9. Convert pixel buffer to PNG format
console.log('Encoding PNG chunks...');
const rowSize = 1 + WIDTH * 4;
const rawScanlines = Buffer.alloc(HEIGHT * rowSize);

let rawOffset = 0;
let bufOffset = 0;
for (let y = 0; y < HEIGHT; y++) {
  rawScanlines[rawOffset++] = 0; // Filter 0
  for (let x = 0; x < WIDTH; x++) {
    rawScanlines[rawOffset++] = buffer[bufOffset++];
    rawScanlines[rawOffset++] = buffer[bufOffset++];
    rawScanlines[rawOffset++] = buffer[bufOffset++];
    rawScanlines[rawOffset++] = buffer[bufOffset++];
  }
}

const compressed = zlib.deflateSync(rawScanlines, { level: 9 });

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // Bit depth
ihdr[9] = 6; // RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const pngBuffer = Buffer.concat([
  signature,
  makeChunk('IHDR', ihdr),
  makeChunk('IDAT', compressed),
  makeChunk('IEND', Buffer.alloc(0))
]);

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, 'og-image.png');
fs.writeFileSync(outPath, pngBuffer);

console.log(`Successfully generated ${outPath} (${pngBuffer.length} bytes, 1200x630px)!`);
