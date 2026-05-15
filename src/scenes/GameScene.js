import Phaser from 'phaser';
import { WORLD, cellCenter } from '../data/world.js';
import { BEES } from '../data/bees.js';
import { BEARS } from '../data/bears.js';
import { WAVES_BY_MAP } from '../data/waves.js';
import { MAPS } from '../data/maps.js';
import { SHOP_ITEMS } from '../data/shop.js';
import {
  addHoney, damageHive,
  setWaveIndex, setWavePhase, tickWavePhase,
  winRun, resetForMap, advanceMap,
  addCoins, useWipe
} from '../state.js';
import {
  computeLayout, drawGrid, drawHive, drawBee, drawBear,
  drawProjectile, drawSplash
} from '../world/meadowRender.js';
import { PlacementController } from '../controllers/PlacementController.js';

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    resetForMap(this.registry);

    const mapId = this.registry.get('currentMapId') ?? 'garden';
    this.currentMap = MAPS[mapId];
    this.waves = WAVES_BY_MAP[mapId];
    this.activeWorld = { ...WORLD, rows: this.currentMap.rows ?? WORLD.rows };

    this.cameras.main.setBackgroundColor(this.currentMap.bgColor);

    this._goLaunched = false;
    this._winLaunched = false;
    this.bees = [];
    this.bears = [];
    this.projectiles = [];
    this.splashes = [];
    this.beesByCell = new Map();      // key `${col},${row}` → bee
    this.bearsByLane = Array.from({ length: this.activeWorld.rows }, () => []);
    this.spawnIndex = 0;
    this.waveStartedAtMs = 0;

    this.layout = computeLayout(this, this.activeWorld);

    // Background grid (static — redrawn only on resize).
    this.gridGraphics = this.add.graphics().setDepth(0);
    this._redrawGrid();

    // Dynamic playfield graphics (cleared and redrawn each frame).
    this.dynGraphics = this.add.graphics().setDepth(1);

    // Toast text pool for "+N honey" popups.
    this.toasts = [];

    this.placement = new PlacementController(this);

    this.input.keyboard.on('keydown-R', () => {
      this.scene.pause();
      this.scene.launch('RedeemScene', { returnScene: 'GameScene' });
      this.scene.bringToTop('RedeemScene');
    });

    this.input.keyboard.on('keydown-W', () => this._tryWipe());

    this.scale.on('resize', this._onResize, this);

    // Launch HUD overlay if not already running.
    if (!this.scene.isActive('HUDScene')) this.scene.launch('HUDScene');
    this.scene.bringToTop('HUDScene');
  }

  _onResize() {
    const oldLayout = this.layout;
    this.layout = computeLayout(this, this.activeWorld);
    // Rescale bear x positions to keep them in the same grid-relative spot.
    if (oldLayout && oldLayout.cellSize > 0) {
      const ratio = this.layout.cellSize / oldLayout.cellSize;
      for (const b of this.bears) {
        b.x = this.layout.originX + (b.x - oldLayout.originX) * ratio;
      }
    }
    this._redrawGrid();
  }

  _redrawGrid() {
    this.gridGraphics.clear();
    drawGrid(this.gridGraphics, this.layout, this.activeWorld, this.currentMap);
  }

  // Consume one wipe — kill every non-boss bear on the field. Bosses are spared.
  _tryWipe() {
    if (this.registry.get('gameOver') || this.registry.get('victory')) return;
    if (!useWipe(this.registry)) return;
    // Cinematic full-screen white flash.
    const flash = this.add.rectangle(0, 0, this.scale.gameSize.width, this.scale.gameSize.height,
      0xffffff, 0.8).setOrigin(0).setDepth(6);
    this.tweens.add({ targets: flash, alpha: 0, duration: 400, onComplete: () => flash.destroy() });
    for (const bear of this.bears) {
      const spec = BEARS[bear.type];
      if (spec.isBoss) continue;
      bear.hp = 0;   // _updateBears' next pass will award bounty/coins and remove it
    }
  }

  // Refund a placed bee for its full purchase cost.
  sellBee(bee) {
    const spec = BEES[bee.type];
    addHoney(this.registry, spec.cost);
    this.beesByCell.delete(`${bee.col},${bee.row}`);
    const idx = this.bees.indexOf(bee);
    if (idx >= 0) this.bees.splice(idx, 1);
    const { originX, originY, cellSize } = this.layout;
    this._spawnToast(
      `+${spec.cost}🍯`,
      originX + bee.col * cellSize + cellSize / 2,
      originY + bee.row * cellSize + cellSize / 2
    );
  }

  // Called by PlacementController on a successful purchase.
  placeBee(type, col, row) {
    const spec = BEES[type];
    const bee = {
      type, col, row,
      hp: spec.hp, maxHp: spec.hp,
      cooldownMs: spec.fireMs ? spec.fireMs * 0.4 : 0,  // small initial delay
      stunnedUntil: 0,
      genAccumMs: 0,
      auraFireMult: 1,
      auraDamageMult: 1,
      auraCheckedAt: -Infinity
    };
    this.bees.push(bee);
    this.beesByCell.set(`${col},${row}`, bee);
  }

  // --- Main loop ----------------------------------------------------------

  update(_t, delta) {
    if (this.registry.get('gameOver') && !this._goLaunched) {
      this._goLaunched = true;
      this.scene.start('GameOverScene');
      return;
    }
    if (this.registry.get('victory') && !this._winLaunched) {
      this._winLaunched = true;
      const nextMap = advanceMap(this.registry);
      if (nextMap) {
        this.scene.start('MapClearScene');
      } else {
        this.scene.start('VictoryScene');
      }
      return;
    }

    if (!this.registry.get('gameOver') && !this.registry.get('victory')) {
      this._tickWave(delta);
      this._updateBears(delta);
      this._updateBees(delta);
      this._updateProjectiles(delta);
      this._updateSplashes(delta);
      this._cullDeadBees();
    }

    this._render();
    this._updateToasts(delta);
  }

  // --- Wave runner --------------------------------------------------------

  _tickWave(delta) {
    tickWavePhase(this.registry, delta);
    const phase = this.registry.get('wavePhase');
    const elapsed = this.registry.get('wavePhaseElapsedMs') ?? 0;
    const idx = this.registry.get('waveIndex') ?? 0;

    if (phase === 'prepare') {
      if (elapsed >= WORLD.prepareTimeMs) {
        setWavePhase(this.registry, 'spawning', 0);
        this.spawnIndex = 0;
      }
    } else if (phase === 'spawning') {
      const wave = this.waves[idx];
      while (this.spawnIndex < wave.spawns.length &&
             wave.spawns[this.spawnIndex].at <= elapsed) {
        const s = wave.spawns[this.spawnIndex];
        this._spawnBear(s.type, s.lane);
        this.spawnIndex += 1;
      }
      if (this.spawnIndex >= wave.spawns.length && this.bears.length === 0) {
        setWavePhase(this.registry, 'cleanup', 0);
      }
    } else if (phase === 'cleanup') {
      if (idx >= this.waves.length - 1) {
        winRun(this.registry);
      } else {
        setWaveIndex(this.registry, idx + 1);
        setWavePhase(this.registry, 'prepare', 0);
      }
    }
  }

  _spawnBear(type, fixedLane) {
    const spec = BEARS[type];
    const lane = (typeof fixedLane === 'number')
      ? fixedLane
      : Phaser.Math.Between(0, this.activeWorld.rows - 1);
    const { originX, cellSize } = this.layout;
    const spawnX = originX + WORLD.cols * cellSize + spec.r + 4;
    this.bears.push({
      type, lane,
      x: spawnX,
      hp: spec.hp, maxHp: spec.hp,
      meleeCdMs: 0,
      damageFlashUntil: 0,
      stunnedUntil: 0,
      stunReadyMs: 0       // for honey badger
    });
  }

  // --- Bears --------------------------------------------------------------

  _updateBears(delta) {
    const now = this.time.now;
    const { originX, cellSize } = this.layout;
    const hiveEdgeX = originX + (WORLD.hiveCol + 1) * cellSize;

    // Rebuild bearsByLane index.
    for (let i = 0; i < this.bearsByLane.length; i++) this.bearsByLane[i].length = 0;
    for (const b of this.bears) this.bearsByLane[b.lane].push(b);

    for (let i = this.bears.length - 1; i >= 0; i--) {
      const bear = this.bears[i];
      const spec = BEARS[bear.type];

      // Stunned bears do nothing.
      if (bear.stunnedUntil > now) continue;

      // Look for a blocker bee one cell in front of bear.
      const frontX = bear.x - spec.r * 0.6;
      const blockerCol = Math.floor((frontX - originX) / cellSize);
      const blocker = this.beesByCell.get(`${blockerCol},${bear.lane}`);

      if (blocker && blocker.hp > 0) {
        // Chew bee on meleeMs cadence.
        bear.meleeCdMs -= delta;
        if (bear.meleeCdMs <= 0) {
          blocker.hp -= spec.meleeDmg;
          bear.meleeCdMs = spec.meleeMs;
          // Honey badger swipe — stuns the blocker.
          if (spec.stunMs && now >= bear.stunReadyMs) {
            blocker.stunnedUntil = now + spec.stunMs;
            bear.stunReadyMs = now + spec.stunCooldownMs;
          }
        }
      } else {
        // Walk left.
        bear.x -= spec.speed * delta / 1000;
        bear.meleeCdMs = 0;
        // Reached the hive — damage and despawn.
        if (bear.x <= hiveEdgeX) {
          damageHive(this.registry, WORLD.bearHiveDamage);
          this.bears.splice(i, 1);
          continue;
        }
      }

      // Death.
      if (bear.hp <= 0) {
        const bounty = Phaser.Math.Between(WORLD.bearKillHoneyMin, WORLD.bearKillHoneyMax);
        const reward = Math.max(spec.bounty ?? 0, bounty);
        addHoney(this.registry, reward);
        const coinDrop = Math.max(1, Math.floor((spec.bounty ?? 5) / 10));
        addCoins(this.registry, coinDrop);
        this._spawnToast(`+${reward}🍯  +${coinDrop}💰`, bear.x, this._laneY(bear.lane));
        this.bears.splice(i, 1);
      }
    }
  }

  _laneY(lane) {
    const { originY, cellSize } = this.layout;
    return originY + lane * cellSize + cellSize / 2;
  }

  // --- Bees ---------------------------------------------------------------

  _updateBees(delta) {
    const now = this.time.now;
    for (const bee of this.bees) {
      const spec = BEES[bee.type];

      if (spec.kind === 'generator') {
        bee.genAccumMs += delta;
        if (bee.genAccumMs >= spec.generateMs) {
          bee.genAccumMs -= spec.generateMs;
          addHoney(this.registry, spec.generateAmount);
          const { originX, originY, cellSize } = this.layout;
          this._spawnToast(`+${spec.generateAmount}`,
            originX + bee.col * cellSize + cellSize / 2,
            originY + bee.row * cellSize + cellSize / 2);
        }
        continue;
      }
      if (spec.kind === 'support') continue;
      if (bee.stunnedUntil > now) continue;

      bee.cooldownMs -= delta;
      if (bee.cooldownMs > 0) continue;

      // Refresh queen aura cache every ~200ms (or on first fire).
      if (now - bee.auraCheckedAt > 200) {
        const aura = this._auraAt(bee);
        bee.auraFireMult = aura.fireMult;
        bee.auraDamageMult = aura.damageMult;
        bee.auraCheckedAt = now;
      }

      const target = this._pickTarget(bee, spec);
      if (!target) { bee.cooldownMs = 100; continue; }   // small recheck delay

      const damage = spec.damage * bee.auraDamageMult;
      target.hp -= damage;
      target.damageFlashUntil = now + 80;

      // Splash damage for bombers.
      if (spec.splash > 0) {
        const splashR = spec.splash * this.layout.cellSize;
        for (const other of this.bears) {
          if (other === target) continue;
          const dy = (other.lane - target.lane) * this.layout.cellSize;
          const dx = other.x - target.x;
          if (dx * dx + dy * dy <= splashR * splashR) {
            other.hp -= damage * 0.7;
            other.damageFlashUntil = now + 80;
          }
        }
        this.splashes.push({
          x: target.x, y: this._laneY(target.lane),
          age: 0, durationMs: 220, maxRadius: splashR
        });
      }

      // Hitscan projectile (visual only — damage already applied).
      const { originX, originY, cellSize } = this.layout;
      this.projectiles.push({
        x: originX + bee.col * cellSize + cellSize / 2,
        y: originY + bee.row * cellSize + cellSize / 2,
        tx: target.x,
        ty: this._laneY(target.lane),
        age: 0,
        durationMs: 140,
        color: spec.bulletColor,
        radius: spec.splash > 0 ? 5 : 3
      });

      bee.cooldownMs = spec.fireMs * bee.auraFireMult;
    }
  }

  _auraAt(bee) {
    let fireMult = 1, damageMult = 1;
    for (const other of this.bees) {
      const o = BEES[other.type];
      if (o.kind !== 'support') continue;
      const dc = Math.abs(other.col - bee.col);
      const dr = Math.abs(other.row - bee.row);
      if (Math.max(dc, dr) <= o.range) {  // Chebyshev distance in cells
        if (o.auraFireMult < fireMult) fireMult = o.auraFireMult;
        if (o.auraDamageMult > damageMult) damageMult = o.auraDamageMult;
      }
    }
    return { fireMult, damageMult };
  }

  _pickTarget(bee, spec) {
    const { cellSize, originX } = this.layout;
    const beeX = originX + bee.col * cellSize + cellSize / 2;
    const rangePx = spec.range * cellSize;

    if (spec.target === 'firstInLane') {
      // Bear in same lane, in front of bee (greater x), within range,
      // and most-advanced (smallest x).
      const candidates = this.bearsByLane[bee.row];
      let best = null;
      for (const bear of candidates) {
        if (bear.x < beeX - 0.3 * cellSize) continue;
        if (bear.x - beeX > rangePx) continue;
        if (!best || bear.x < best.x) best = bear;
      }
      return best;
    }
    if (spec.target === 'globalClosestToHive') {
      // Any bear in front, smallest x, within range (euclidean).
      let best = null;
      const beeY = this._laneY(bee.row);
      for (const bear of this.bears) {
        if (bear.x < beeX - 0.3 * cellSize) continue;
        const dy = this._laneY(bear.lane) - beeY;
        const dx = bear.x - beeX;
        if (dx * dx + dy * dy > rangePx * rangePx) continue;
        if (!best || bear.x < best.x) best = bear;
      }
      return best;
    }
    return null;
  }

  _cullDeadBees() {
    for (let i = this.bees.length - 1; i >= 0; i--) {
      const bee = this.bees[i];
      if (bee.hp <= 0) {
        this.beesByCell.delete(`${bee.col},${bee.row}`);
        this.bees.splice(i, 1);
      }
    }
  }

  // --- Projectiles / splashes --------------------------------------------

  _updateProjectiles(delta) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.age += delta;
      if (p.age >= p.durationMs) this.projectiles.splice(i, 1);
    }
  }

  _updateSplashes(delta) {
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const s = this.splashes[i];
      s.age += delta;
      if (s.age >= s.durationMs) this.splashes.splice(i, 1);
    }
  }

  // --- Toasts -------------------------------------------------------------

  _spawnToast(text, x, y) {
    const t = this.add.text(x, y - 20, text, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#ffe070',
      stroke: '#2a1a0a',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(5);
    this.toasts.push({ obj: t, age: 0, vy: -30 });
  }

  _updateToasts(delta) {
    for (let i = this.toasts.length - 1; i >= 0; i--) {
      const tt = this.toasts[i];
      tt.age += delta;
      tt.obj.y += tt.vy * delta / 1000;
      tt.obj.alpha = Math.max(0, 1 - tt.age / 900);
      if (tt.age > 900) {
        tt.obj.destroy();
        this.toasts.splice(i, 1);
      }
    }
  }

  // --- Render -------------------------------------------------------------

  _render() {
    const g = this.dynGraphics;
    g.clear();
    const now = this.time.now;

    const skinId = this.registry.get('activeHiveSkin');
    const skinTint = skinId ? SHOP_ITEMS[skinId]?.tint : null;
    drawHive(g, this.layout, this.activeWorld,
      this.registry.get('hiveHp') ?? 0, this.activeWorld.hiveHp, skinTint);

    // Bees first (under bears so bears chew on top visually).
    for (const bee of this.bees) drawBee(g, bee, this.layout, now);

    // Bears.
    for (const bear of this.bears) drawBear(g, bear, this.layout, now);

    // Projectiles (linear interp from origin to target).
    for (const p of this.projectiles) {
      const t = Math.min(1, p.age / p.durationMs);
      drawProjectile(g, {
        x: p.x + (p.tx - p.x) * t,
        y: p.y + (p.ty - p.y) * t,
        color: p.color,
        alpha: 1 - t * 0.4,
        radius: p.radius
      });
    }

    // Splashes.
    for (const s of this.splashes) drawSplash(g, s, this.layout);

    // Placement ghost on top.
    this.placement.render(g);
  }
}
