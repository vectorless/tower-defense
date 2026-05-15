// Global tunables. Edit here to rebalance the game.

export const WORLD = {
  cols: 9,                    // x=0 hive (no build); x=1..6 buildable; x=7..8 bear spawn (no build)
  rows: 5,                    // lanes
  hiveCol: 0,
  buildColMin: 1,
  buildColMax: 6,
  spawnColMin: 7,

  hiveHp: 100,
  startingHoney: 50,

  honeypotIntervalMs: 4000,
  honeypotPayout: 25,

  prepareTimeMs: 6000,        // pause between waves
  bearHiveDamage: 20,         // damage per bear that reaches the hive

  bearKillHoneyMin: 5,
  bearKillHoneyMax: 20,

  // Layout reservations (px) for HUD bar and palette.
  hudTopHeight: 110,
  hudBottomHeight: 130,
  sideMargin: 24
};

// Convert world cell (col, row) → pixel center given a grid origin/cell size.
export function cellCenter(col, row, originX, originY, cellSize) {
  return {
    x: originX + col * cellSize + cellSize / 2,
    y: originY + row * cellSize + cellSize / 2
  };
}

export function cellOfX(px, originX, cellSize) {
  return Math.floor((px - originX) / cellSize);
}
