import Phaser from 'phaser';
import { WORLD } from '../data/world.js';
import { BEES, BEE_ORDER } from '../data/bees.js';
import { MAPS } from '../data/maps.js';
import { WAVES_BY_MAP } from '../data/waves.js';
import { setSelectedBee } from '../state.js';

export class HUDScene extends Phaser.Scene {
  constructor() { super('HUDScene'); }

  create() {
    this.topG = this.add.graphics().setDepth(10);
    this.bottomG = this.add.graphics().setDepth(10);

    this.txtHoney = this.add.text(0, 0, '', this._textStyle(24)).setDepth(11);
    this.txtHive = this.add.text(0, 0, '', this._textStyle(20)).setDepth(11);
    this.txtMap = this.add.text(0, 0, '', this._textStyle(20)).setDepth(11).setOrigin(0.5, 0);
    this.txtWave = this.add.text(0, 0, '', this._textStyle(22)).setDepth(11).setOrigin(0.5, 0);
    this.txtPhase = this.add.text(0, 0, '', this._textStyle(16)).setDepth(11).setOrigin(0.5, 0);
    this.txtCoins = this.add.text(0, 0, '', this._textStyle(22)).setDepth(11).setOrigin(1, 0);
    this.txtWipes = this.add.text(0, 0, '', this._textStyle(18)).setDepth(11).setOrigin(1, 0);

    this.palette = [];
    this._unlockedKey = '';
    this._hotkeys = [];

    this._rebuildPaletteIfNeeded();
    this._layout();
    this.scale.on('resize', this._layout, this);
  }

  _textStyle(size) {
    return {
      fontFamily: 'system-ui, sans-serif',
      fontSize: `${size}px`,
      color: '#ffe070',
      stroke: '#2a1a0a',
      strokeThickness: 3
    };
  }

  _rebuildPaletteIfNeeded() {
    const unlocked = this.registry.get('unlockedBees') ?? [];
    const key = unlocked.join('|');
    if (key === this._unlockedKey) return;
    this._unlockedKey = key;

    // Clear existing palette cards.
    for (const p of this.palette) {
      p.bg.destroy(); p.icon.destroy(); p.name.destroy(); p.cost.destroy(); p.hot.destroy();
    }
    this.palette = [];

    // Tear down old hotkeys.
    for (const k of this._hotkeys) k.removeAllListeners();
    this._hotkeys = [];

    // Display order: filter BEE_ORDER by unlocked.
    const ordered = BEE_ORDER.filter(b => unlocked.includes(b));

    for (let i = 0; i < ordered.length; i++) {
      const type = ordered[i];
      const hotkeyLabel = i < 9 ? String(i + 1) : (i === 9 ? '0' : '');
      const card = this._buildPaletteCard(type, hotkeyLabel);
      this.palette.push({ type, ...card });

      let keyCode = null;
      if (i < 9) keyCode = Phaser.Input.Keyboard.KeyCodes.ONE + i;   // keys 1..9
      else if (i === 9) keyCode = Phaser.Input.Keyboard.KeyCodes.ZERO; // key 0 = 10th bee
      if (keyCode != null) {
        const key = this.input.keyboard.addKey(keyCode);
        key.on('down', () => this._toggleSelect(type));
        this._hotkeys.push(key);
      }
    }

    // ESC always clears selection.
    if (!this._escBound) {
      this.input.keyboard.on('keydown-ESC', () => setSelectedBee(this.registry, null));
      this._escBound = true;
    }

    this._layout();
  }

  _buildPaletteCard(type, hotkeyLabel) {
    const spec = BEES[type];
    const bg = this.add.rectangle(0, 0, 100, 100, 0x3a2a14, 1)
      .setStrokeStyle(2, 0xffd24a).setOrigin(0).setDepth(11)
      .setInteractive({ useHandCursor: true });
    const icon = this.add.text(0, 0, spec.letter, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '32px', fontStyle: 'bold',
      color: '#2a1a0a',
      backgroundColor: '#' + spec.color.toString(16).padStart(6, '0')
    }).setOrigin(0.5).setDepth(12).setPadding(5);
    const name = this.add.text(0, 0, spec.name, {
      fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#ffe070',
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5, 0).setDepth(12);
    const cost = this.add.text(0, 0, `${spec.cost}🍯`, {
      fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#fff2a0',
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5, 0).setDepth(12);
    const hot = this.add.text(0, 0, hotkeyLabel, {
      fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#ffe070',
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0, 0).setDepth(12);

    bg.on('pointerdown', () => this._toggleSelect(type));
    return { bg, icon, name, cost, hot };
  }

  _toggleSelect(type) {
    const cur = this.registry.get('selectedBeeType');
    setSelectedBee(this.registry, cur === type ? null : type);
  }

  _layout() {
    const { width, height } = this.scale.gameSize;
    this.topG.clear();
    this.topG.fillStyle(0x1a0a04, 0.85).fillRect(0, 0, width, WORLD.hudTopHeight);
    this.topG.lineStyle(2, 0xffd24a, 0.7)
      .lineBetween(0, WORLD.hudTopHeight, width, WORLD.hudTopHeight);

    this.bottomG.clear();
    this.bottomG.fillStyle(0x1a0a04, 0.85)
      .fillRect(0, height - WORLD.hudBottomHeight, width, WORLD.hudBottomHeight);
    this.bottomG.lineStyle(2, 0xffd24a, 0.7)
      .lineBetween(0, height - WORLD.hudBottomHeight, width, height - WORLD.hudBottomHeight);

    this.txtHoney.setPosition(24, 20);
    this.txtHive.setPosition(24, 60);
    this.txtMap.setPosition(width / 2, 8);
    this.txtWave.setPosition(width / 2, 38);
    this.txtPhase.setPosition(width / 2, 72);
    this.txtCoins.setPosition(width - 24, 20);
    this.txtWipes.setPosition(width - 24, 60);

    const n = this.palette.length;
    if (n === 0) return;
    const sideMargin = 16;
    const maxCardW = 100;
    const minCardW = 70;
    let gap = 12;
    const availW = width - 2 * sideMargin - gap * Math.max(0, n - 1);
    const cardW = Math.max(minCardW, Math.min(maxCardW, Math.floor(availW / n)));
    const totalW = cardW * n + gap * Math.max(0, n - 1);
    const startX = Math.max(sideMargin, (width - totalW) / 2);
    const y = height - WORLD.hudBottomHeight + 14;
    for (let i = 0; i < n; i++) {
      const p = this.palette[i];
      const x = startX + i * (cardW + gap);
      p.bg.setSize(cardW, 100).setPosition(x, y);
      p.icon.setPosition(x + cardW / 2, y + 32);
      p.name.setPosition(x + cardW / 2, y + 58);
      p.cost.setPosition(x + cardW / 2, y + 76);
      p.hot.setPosition(x + 6, y + 4);
    }
  }

  update() {
    // React to mid-game unlocks (e.g., after MapClearScene → new map starts).
    this._rebuildPaletteIfNeeded();

    const honey = this.registry.get('honey') ?? 0;
    const hiveHp = this.registry.get('hiveHp') ?? 0;
    const waveIdx = this.registry.get('waveIndex') ?? 0;
    const phase = this.registry.get('wavePhase');
    const phaseMs = this.registry.get('wavePhaseElapsedMs') ?? 0;
    const selected = this.registry.get('selectedBeeType');
    const mapId = this.registry.get('currentMapId') ?? 'garden';
    const map = MAPS[mapId];
    const waveCount = (WAVES_BY_MAP[mapId] || []).length;

    const coins = this.registry.get('coins') ?? 0;
    const wipes = this.registry.get('wipes') ?? 0;

    this.txtHoney.setText(`🍯 Honey: ${honey}`);
    this.txtHive.setText(`🏠 Hive: ${hiveHp} / ${WORLD.hiveHp}`);
    this.txtMap.setText(map ? map.name : '');
    this.txtWave.setText(`Wave ${waveIdx + 1} / ${waveCount}`);
    this.txtCoins.setText(`💰 ${coins}`);
    this.txtWipes.setText(wipes > 0 ? `💨 Wipes: ${wipes} (W)` : '');

    if (phase === 'prepare') {
      const left = Math.max(0, Math.ceil((WORLD.prepareTimeMs - phaseMs) / 1000));
      this.txtPhase.setText(`Prepare — ${left}s`);
    } else if (phase === 'spawning') {
      this.txtPhase.setText('Bears are coming!');
    } else {
      this.txtPhase.setText('Clearing...');
    }

    for (const p of this.palette) {
      const spec = BEES[p.type];
      const afford = honey >= spec.cost;
      const isSel = selected === p.type;
      p.bg.setStrokeStyle(isSel ? 4 : 2, isSel ? 0xffffff : (afford ? 0xffd24a : 0x555555));
      p.bg.setFillStyle(isSel ? 0x5a3a20 : 0x3a2a14, afford ? 1 : 0.55);
      p.icon.setAlpha(afford ? 1 : 0.5);
      p.name.setAlpha(afford ? 1 : 0.5);
      p.cost.setAlpha(afford ? 1 : 0.5);
    }
  }
}
