// Reads registry.selectedBeeType each frame, draws a ghost on the hovered
// grid cell, and handles click-to-place. Bee lifecycle and the beesByCell
// map live on GameScene; this controller only signals intent.

import { BEES } from '../data/bees.js';
import { WORLD } from '../data/world.js';
import { spendHoney, setSelectedBee } from '../state.js';
import { drawGhostBee } from '../world/meadowRender.js';

export class PlacementController {
  constructor(scene) {
    this.scene = scene;
    this.hoverCol = -1;
    this.hoverRow = -1;
    this.hoverValid = false;

    scene.input.on('pointermove', (p) => this._onMove(p));
    scene.input.on('pointerdown', (p) => this._onDown(p));
    scene.input.keyboard.on('keydown-ESC', () => setSelectedBee(scene.registry, null));
  }

  // Returns whether (col,row) is a placeable empty cell.
  _isPlaceable(col, row) {
    const aw = this.scene.activeWorld ?? WORLD;
    if (col < aw.buildColMin || col > aw.buildColMax) return false;
    if (row < 0 || row >= aw.rows) return false;
    const key = `${col},${row}`;
    return !this.scene.beesByCell.has(key);
  }

  _cellFromPointer(p) {
    const layout = this.scene.layout;
    if (!layout) return { col: -1, row: -1 };
    const col = Math.floor((p.x - layout.originX) / layout.cellSize);
    const row = Math.floor((p.y - layout.originY) / layout.cellSize);
    return { col, row };
  }

  _onMove(p) {
    const { col, row } = this._cellFromPointer(p);
    this.hoverCol = col;
    this.hoverRow = row;
    const type = this.scene.registry.get('selectedBeeType');
    if (!type) { this.hoverValid = false; return; }
    const honey = this.scene.registry.get('honey') ?? 0;
    this.hoverValid = this._isPlaceable(col, row) && honey >= BEES[type].cost;
  }

  _onDown(p) {
    if (this.scene.registry.get('gameOver') || this.scene.registry.get('victory')) return;
    const { col, row } = this._cellFromPointer(p);
    const type = this.scene.registry.get('selectedBeeType');

    // No bee selected → clicking a placed bee sells it for a full refund.
    if (!type) {
      const bee = this.scene.beesByCell.get(`${col},${row}`);
      if (bee) this.scene.sellBee(bee);
      return;
    }

    if (!this._isPlaceable(col, row)) return;
    const spec = BEES[type];
    if (!spendHoney(this.scene.registry, spec.cost)) return;
    this.scene.placeBee(type, col, row);
    setSelectedBee(this.scene.registry, null);
  }

  render(g) {
    if (this.hoverCol < 0 || this.hoverRow < 0) return;
    const layout = this.scene.layout;
    if (!layout) return;

    const type = this.scene.registry.get('selectedBeeType');

    if (!type) {
      // Sell-hover indicator: red dashed outline + refund label.
      const bee = this.scene.beesByCell.get(`${this.hoverCol},${this.hoverRow}`);
      if (!bee) return;
      const { originX, originY, cellSize } = layout;
      const cx = originX + this.hoverCol * cellSize + cellSize / 2;
      const cy = originY + this.hoverRow * cellSize + cellSize / 2;
      g.lineStyle(3, 0xff4444, 0.9);
      g.strokeRect(cx - cellSize * 0.45, cy - cellSize * 0.45,
                   cellSize * 0.9, cellSize * 0.9);
      g.fillStyle(0xff4444, 0.15);
      g.fillRect(cx - cellSize * 0.45, cy - cellSize * 0.45,
                 cellSize * 0.9, cellSize * 0.9);
      return;
    }

    // Refresh validity (honey could have changed since pointer move).
    const honey = this.scene.registry.get('honey') ?? 0;
    const valid = this._isPlaceable(this.hoverCol, this.hoverRow) && honey >= BEES[type].cost;
    drawGhostBee(g, type, this.hoverCol, this.hoverRow, layout, valid);
  }
}
