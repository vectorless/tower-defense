// Procedural draw helpers. Everything is rendered into a single Phaser.Graphics
// object that is cleared and redrawn each frame. No sprite assets required.

import { BEES } from '../data/bees.js';
import { BEARS } from '../data/bears.js';

// --- Layout ---------------------------------------------------------------

// Compute grid origin/cell size from the current viewport.
export function computeLayout(scene, world) {
  const { width, height } = scene.scale.gameSize;
  const usableW = Math.max(200, width - world.sideMargin * 2);
  const usableH = Math.max(200, height - world.hudTopHeight - world.hudBottomHeight);
  const cellSize = Math.floor(Math.min(usableW / world.cols, usableH / world.rows));
  const gridW = cellSize * world.cols;
  const gridH = cellSize * world.rows;
  const originX = Math.floor((width - gridW) / 2);
  const originY = world.hudTopHeight + Math.floor((usableH - gridH) / 2);
  return { originX, originY, cellSize, gridW, gridH };
}

// --- Grid -----------------------------------------------------------------

export function drawGrid(g, layout, world, theme) {
  const t = theme ?? {};
  const grassA = t.grassA ?? 0x3a5a28;
  const grassB = t.grassB ?? 0x466a30;
  const spawn = t.spawnTile ?? 0x2e3a1c;
  const hive = t.hiveTile ?? 0x3a2a14;
  const { originX, originY, cellSize } = layout;
  const hexMode = t.tileShape === 'hex';
  for (let r = 0; r < world.rows; r++) {
    for (let c = 0; c < world.cols; c++) {
      const x = originX + c * cellSize;
      const y = originY + r * cellSize;
      let fill = ((r + c) % 2 === 0) ? grassA : grassB;
      if (c >= world.spawnColMin) fill = spawn;     // spawn area is darker
      if (c === world.hiveCol) fill = hive;         // hive column
      if (hexMode) {
        drawHex(g, x + cellSize / 2, y + cellSize / 2, cellSize * 0.56, fill, 0x2a1a0a, 2);
      } else {
        g.fillStyle(fill, 1).fillRect(x, y, cellSize, cellSize);
        g.lineStyle(1, 0x000000, 0.18).strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
      }
    }
  }
}

// --- Hive -----------------------------------------------------------------

export function drawHive(g, layout, world, hiveHp, hiveMaxHp) {
  const { originX, originY, cellSize } = layout;
  const cx = originX + world.hiveCol * cellSize + cellSize / 2;
  const cy = originY + (world.rows * cellSize) / 2;
  const radius = Math.min(cellSize * 0.45, (world.rows * cellSize) * 0.35);

  // Outer brown hex.
  drawHex(g, cx, cy, radius, 0x6b3a1f, 0x3a1d0d, 3);
  // Inner honeycomb cells.
  const small = radius * 0.32;
  const offsets = [[0, 0], [-small * 1.4, -small * 0.8], [small * 1.4, -small * 0.8], [0, small * 1.3]];
  for (const [dx, dy] of offsets) {
    drawHex(g, cx + dx, cy + dy, small, 0xffc24a, 0x8a5a1f, 2);
  }
  // HP bar above hive.
  const barW = cellSize * 0.9;
  const barH = 8;
  const barX = cx - barW / 2;
  const barY = cy - radius - 18;
  g.fillStyle(0x000000, 0.45).fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
  g.fillStyle(0x222222, 1).fillRect(barX, barY, barW, barH);
  const pct = Math.max(0, Math.min(1, hiveHp / hiveMaxHp));
  const hpColor = pct > 0.5 ? 0x66cc44 : pct > 0.25 ? 0xeecc33 : 0xdd4433;
  g.fillStyle(hpColor, 1).fillRect(barX, barY, barW * pct, barH);
}

function drawHex(g, cx, cy, r, fill, stroke, strokeW) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  g.fillStyle(fill, 1);
  g.beginPath();
  g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < 6; i++) g.lineTo(pts[i].x, pts[i].y);
  g.closePath();
  g.fillPath();
  if (strokeW > 0) {
    g.lineStyle(strokeW, stroke, 1);
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < 6; i++) g.lineTo(pts[i].x, pts[i].y);
    g.closePath();
    g.strokePath();
  }
}

// --- Bee ------------------------------------------------------------------

// bee: { type, col, row, hp, maxHp, stunnedUntil }
export function drawBee(g, bee, layout, nowMs) {
  const spec = BEES[bee.type];
  const { originX, originY, cellSize } = layout;
  const cx = originX + bee.col * cellSize + cellSize / 2;
  const cy = originY + bee.row * cellSize + cellSize / 2;
  const r = cellSize * 0.34;

  if (spec.kind === 'generator') {
    // Honey jar: brown rounded rect with a golden top, pulses scale.
    const pulse = 1 + 0.06 * Math.sin(nowMs / 240);
    const w = cellSize * 0.6 * pulse;
    const h = cellSize * 0.66 * pulse;
    const x = cx - w / 2;
    const y = cy - h / 2 + h * 0.08;
    g.fillStyle(0x8a5a2a, 1).fillRoundedRect(x, y, w, h, 6);
    g.fillStyle(0xffd066, 1).fillRoundedRect(x, y - 4, w, h * 0.22, 4);
    g.fillStyle(0xffe89a, 1).fillRect(x + w * 0.1, y + h * 0.08, w * 0.18, h * 0.06);
    g.lineStyle(2, 0x4a2a10, 1).strokeRoundedRect(x, y, w, h, 6);
    drawBeeHpPip(g, bee, cx, cy + h / 2 + 4, cellSize);
    return;
  }

  // Wing flutter (stunned bees stop fluttering).
  const stunned = (bee.stunnedUntil ?? 0) > nowMs;
  const flutter = stunned ? 0.5 : (1 + 0.25 * Math.sin(nowMs / 60 + bee.col + bee.row));
  const wingW = r * 0.95;
  const wingH = r * 0.55 * flutter;
  g.fillStyle(0xffffff, 0.85);
  g.fillEllipse(cx - r * 0.35, cy - r * 0.45, wingW, wingH);
  g.fillEllipse(cx + r * 0.35, cy - r * 0.45, wingW, wingH);
  g.lineStyle(1, 0x444444, 0.6);
  g.strokeEllipse(cx - r * 0.35, cy - r * 0.45, wingW, wingH);
  g.strokeEllipse(cx + r * 0.35, cy - r * 0.45, wingW, wingH);

  // Body (circle).
  g.fillStyle(spec.color, 1).fillCircle(cx, cy, r);
  g.lineStyle(2, 0x2a1500, 1).strokeCircle(cx, cy, r);

  // Black stripes (thick chord rectangles, slightly rotated by drawing arcs).
  g.fillStyle(0x2a1500, 1);
  // Two horizontal stripes by drawing filled rounded rects clipped manually.
  drawStripe(g, cx, cy - r * 0.15, r * 1.6, r * 0.22);
  drawStripe(g, cx, cy + r * 0.35, r * 1.4, r * 0.2);

  // Queen support gets a golden faint aura.
  if (spec.kind === 'support') {
    const auraR = spec.range * cellSize;
    g.lineStyle(2, 0xffe070, 0.35).strokeCircle(cx, cy, auraR);
    g.fillStyle(0xffe070, 0.05).fillCircle(cx, cy, auraR);
  }

  // Eyes.
  g.fillStyle(0xffffff, 1);
  g.fillCircle(cx - r * 0.32, cy - r * 0.05, r * 0.14);
  g.fillCircle(cx + r * 0.32, cy - r * 0.05, r * 0.14);
  g.fillStyle(0x000000, 1);
  g.fillCircle(cx - r * 0.32, cy - r * 0.05, r * 0.07);
  g.fillCircle(cx + r * 0.32, cy - r * 0.05, r * 0.07);

  drawBeeHpPip(g, bee, cx, cy + r + 6, cellSize);
}

function drawStripe(g, cx, cy, w, h) {
  // Clip a horizontal stripe to roughly fit inside the bee circle.
  g.fillRect(cx - w / 2, cy - h / 2, w, h);
}

function drawBeeHpPip(g, bee, x, y, cellSize) {
  const pct = bee.hp / bee.maxHp;
  if (pct >= 0.999) return;
  const w = cellSize * 0.55;
  const h = 4;
  g.fillStyle(0x000000, 0.5).fillRect(x - w / 2 - 1, y - 1, w + 2, h + 2);
  g.fillStyle(0x222222, 1).fillRect(x - w / 2, y, w, h);
  const color = pct > 0.5 ? 0x66cc44 : pct > 0.25 ? 0xeecc33 : 0xdd4433;
  g.fillStyle(color, 1).fillRect(x - w / 2, y, w * Math.max(0, pct), h);
}

// --- Bear -----------------------------------------------------------------

// bear: { type, x, lane, hp, maxHp, damageFlashUntil, stunnedUntil }
export function drawBear(g, bear, layout, nowMs) {
  const spec = BEARS[bear.type];
  if (spec.isBee) {
    drawEvilBee(g, bear, layout, nowMs);
    return;
  }
  const { originY, cellSize } = layout;
  const cy = originY + bear.lane * cellSize + cellSize / 2;
  const cx = bear.x;
  const r = spec.r;

  const shaking = (bear.damageFlashUntil ?? 0) > nowMs;
  const dx = shaking ? (Math.random() - 0.5) * 2.5 : 0;

  // Body ellipse.
  const bodyColor = shaking ? 0xffffff : spec.color;
  g.fillStyle(bodyColor, 1);
  g.fillEllipse(cx + dx, cy + r * 0.2, r * 2.2, r * 1.4);
  g.lineStyle(2, 0x1a0a04, 1);
  g.strokeEllipse(cx + dx, cy + r * 0.2, r * 2.2, r * 1.4);

  // Legs (small dark blobs under body).
  g.fillStyle(0x1a0a04, 1);
  g.fillCircle(cx + dx - r * 0.7, cy + r * 0.9, r * 0.18);
  g.fillCircle(cx + dx + r * 0.7, cy + r * 0.9, r * 0.18);

  // Head (front-facing, slightly left since bears walk left).
  const hx = cx + dx - r * 0.85;
  const hy = cy - r * 0.2;
  g.fillStyle(shaking ? 0xffffff : spec.headColor, 1);
  g.fillCircle(hx, hy, r * 0.75);
  g.lineStyle(2, 0x1a0a04, 1);
  g.strokeCircle(hx, hy, r * 0.75);

  // Ears.
  g.fillStyle(spec.color, 1);
  g.fillCircle(hx - r * 0.45, hy - r * 0.55, r * 0.28);
  g.fillCircle(hx + r * 0.35, hy - r * 0.6, r * 0.28);
  g.lineStyle(1.5, 0x1a0a04, 1);
  g.strokeCircle(hx - r * 0.45, hy - r * 0.55, r * 0.28);
  g.strokeCircle(hx + r * 0.35, hy - r * 0.6, r * 0.28);

  // Snout.
  g.fillStyle(0xe0c090, 1);
  g.fillEllipse(hx - r * 0.4, hy + r * 0.2, r * 0.5, r * 0.35);

  // Eyes.
  g.fillStyle(0x000000, 1);
  g.fillCircle(hx - r * 0.15, hy - r * 0.05, r * 0.08);
  g.fillCircle(hx + r * 0.25, hy - r * 0.05, r * 0.08);

  // HP bar.
  if (bear.hp < bear.maxHp) {
    const barW = r * 2;
    const barH = 4;
    const barX = cx - barW / 2;
    const barY = cy - r * 0.95 - 8;
    g.fillStyle(0x000000, 0.55).fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
    g.fillStyle(0x222222, 1).fillRect(barX, barY, barW, barH);
    const pct = bear.hp / bear.maxHp;
    const color = pct > 0.5 ? 0x66cc44 : pct > 0.25 ? 0xeecc33 : 0xdd4433;
    g.fillStyle(color, 1).fillRect(barX, barY, barW * pct, barH);
  }

  // Honey badger gets a white head-stripe to look badgery.
  if (bear.type === 'honeybadger') {
    g.fillStyle(0xffffff, 1).fillRect(hx - r * 0.5, hy - r * 0.85, r * 1.0, r * 0.18);
  }

  // Pandas get black ears and big black eye patches.
  if (bear.type === 'panda') {
    g.fillStyle(0x000000, 1);
    g.fillCircle(hx - r * 0.45, hy - r * 0.55, r * 0.28);
    g.fillCircle(hx + r * 0.35, hy - r * 0.6, r * 0.28);
    g.fillEllipse(hx - r * 0.18, hy - r * 0.04, r * 0.38, r * 0.32);
    g.fillEllipse(hx + r * 0.28, hy - r * 0.04, r * 0.38, r * 0.32);
    // Eye whites + pupils on top of the patches.
    g.fillStyle(0xffffff, 1);
    g.fillCircle(hx - r * 0.15, hy - r * 0.05, r * 0.10);
    g.fillCircle(hx + r * 0.25, hy - r * 0.05, r * 0.10);
    g.fillStyle(0x000000, 1);
    g.fillCircle(hx - r * 0.15, hy - r * 0.05, r * 0.05);
    g.fillCircle(hx + r * 0.25, hy - r * 0.05, r * 0.05);
  }
}

// --- Evil bee (Hive map enemy) -------------------------------------------

function drawEvilBee(g, bear, layout, nowMs) {
  const spec = BEARS[bear.type];
  const { originY, cellSize } = layout;
  const cy = originY + bear.lane * cellSize + cellSize / 2;
  const cx = bear.x;
  const r = spec.r;
  const accent = spec.accentColor ?? 0x000000;

  const shaking = (bear.damageFlashUntil ?? 0) > nowMs;
  const dx = shaking ? (Math.random() - 0.5) * 2.5 : 0;
  const flutter = 1 + 0.35 * Math.sin(nowMs / 40 + bear.x * 0.03);

  // Wings — translucent, fluttering.
  g.fillStyle(0xffffff, 0.55);
  g.fillEllipse(cx + dx - r * 0.35, cy - r * 0.85, r * 0.95, r * 0.55 * flutter);
  g.fillEllipse(cx + dx + r * 0.35, cy - r * 0.85, r * 0.95, r * 0.55 * flutter);
  g.lineStyle(1, 0x444444, 0.4);
  g.strokeEllipse(cx + dx - r * 0.35, cy - r * 0.85, r * 0.95, r * 0.55 * flutter);
  g.strokeEllipse(cx + dx + r * 0.35, cy - r * 0.85, r * 0.95, r * 0.55 * flutter);

  // Stinger (sticking out the back-right, since bees face left).
  g.fillStyle(accent, 1);
  g.beginPath();
  g.moveTo(cx + dx + r * 0.95, cy);
  g.lineTo(cx + dx + r * 1.5, cy - r * 0.18);
  g.lineTo(cx + dx + r * 1.5, cy + r * 0.18);
  g.closePath();
  g.fillPath();

  // Body — sideways ellipse.
  const bodyColor = shaking ? 0xffffff : spec.color;
  g.fillStyle(bodyColor, 1);
  g.fillEllipse(cx + dx, cy, r * 2.1, r * 1.3);
  g.lineStyle(2, accent, 1);
  g.strokeEllipse(cx + dx, cy, r * 2.1, r * 1.3);

  // Black stripes across the body.
  g.fillStyle(accent, 1);
  g.fillRect(cx + dx - r * 0.45, cy - r * 0.55, r * 0.22, r * 1.1);
  g.fillRect(cx + dx + r * 0.05, cy - r * 0.55, r * 0.22, r * 1.1);

  // Six tiny legs.
  g.lineStyle(2, accent, 1);
  for (let i = -1; i <= 1; i++) {
    g.lineBetween(cx + dx + i * r * 0.4, cy + r * 0.55, cx + dx + i * r * 0.4 - r * 0.1, cy + r * 0.85);
  }

  // RED GLOWING EYES — the evil bee signature.
  const eyeX = cx + dx - r * 0.7;
  const eyeRadius = r * 0.18;
  // Outer glow halo.
  g.fillStyle(0xff5566, 0.35);
  g.fillCircle(eyeX, cy - r * 0.2, eyeRadius * 1.9);
  g.fillCircle(eyeX, cy + r * 0.2, eyeRadius * 1.9);
  // Bright red eye core.
  g.fillStyle(0xff0033, 1);
  g.fillCircle(eyeX, cy - r * 0.2, eyeRadius);
  g.fillCircle(eyeX, cy + r * 0.2, eyeRadius);
  // Tiny white pinpoint highlight.
  g.fillStyle(0xffeeee, 1);
  g.fillCircle(eyeX - r * 0.04, cy - r * 0.24, r * 0.05);
  g.fillCircle(eyeX - r * 0.04, cy + r * 0.16, r * 0.05);

  // Dark Queen gets a crown.
  if (bear.type === 'darkQueen') {
    const ckx = cx + dx;
    const cky = cy - r * 1.05;
    g.fillStyle(0xffd24a, 1);
    g.beginPath();
    g.moveTo(ckx - r * 0.5, cky);
    g.lineTo(ckx - r * 0.4, cky - r * 0.45);
    g.lineTo(ckx - r * 0.2, cky - r * 0.15);
    g.lineTo(ckx, cky - r * 0.55);
    g.lineTo(ckx + r * 0.2, cky - r * 0.15);
    g.lineTo(ckx + r * 0.4, cky - r * 0.45);
    g.lineTo(ckx + r * 0.5, cky);
    g.closePath();
    g.fillPath();
    g.lineStyle(2, 0x6b3a1f, 1);
    g.strokePath();
  }

  // HP bar.
  if (bear.hp < bear.maxHp) {
    const barW = r * 2;
    const barH = 4;
    const barX = cx - barW / 2;
    const barY = cy - r * 1.25 - 8;
    g.fillStyle(0x000000, 0.55).fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
    g.fillStyle(0x222222, 1).fillRect(barX, barY, barW, barH);
    const pct = bear.hp / bear.maxHp;
    const color = pct > 0.5 ? 0x66cc44 : pct > 0.25 ? 0xeecc33 : 0xdd4433;
    g.fillStyle(color, 1).fillRect(barX, barY, barW * pct, barH);
  }
}

// --- Projectile / splash --------------------------------------------------

export function drawProjectile(g, p) {
  // p: { x, y, color, alpha, radius }
  g.fillStyle(p.color, p.alpha).fillCircle(p.x, p.y, p.radius);
}

export function drawSplash(g, s, layout) {
  // s: { x, y, age, durationMs, maxRadius }
  const t = Math.min(1, s.age / s.durationMs);
  const r = 8 + (s.maxRadius - 8) * t;
  const alpha = 0.7 * (1 - t);
  g.fillStyle(0xffe070, alpha * 0.5).fillCircle(s.x, s.y, r);
  g.lineStyle(3, 0xffaa30, alpha).strokeCircle(s.x, s.y, r);
}

// --- Ghost preview --------------------------------------------------------

export function drawGhostBee(g, type, col, row, layout, valid) {
  const { originX, originY, cellSize } = layout;
  const cx = originX + col * cellSize + cellSize / 2;
  const cy = originY + row * cellSize + cellSize / 2;
  const r = cellSize * 0.34;
  const spec = BEES[type];

  // Range circle (for shooter bees with range > 0).
  if (spec.range > 0) {
    g.fillStyle(0xffffaa, 0.07).fillCircle(cx, cy, spec.range * cellSize);
    g.lineStyle(2, valid ? 0xfff0a0 : 0xff6666, 0.5)
      .strokeCircle(cx, cy, spec.range * cellSize);
  }

  // Semi-transparent body.
  g.fillStyle(spec.color, 0.5).fillCircle(cx, cy, r);
  g.lineStyle(2, valid ? 0xffffff : 0xff6666, 0.8).strokeCircle(cx, cy, r);

  // Cell highlight.
  const cellX = originX + col * cellSize;
  const cellY = originY + row * cellSize;
  g.lineStyle(2, valid ? 0xffffff : 0xff6666, 0.9)
    .strokeRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
}
