import Phaser from 'phaser';
import { MAPS } from '../data/maps.js';
import { BEES } from '../data/bees.js';

export class MapClearScene extends Phaser.Scene {
  constructor() { super('MapClearScene'); }

  create() {
    const { width, height } = this.scale.gameSize;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.55).setOrigin(0).setDepth(20);

    const prevId = this.registry.get('previousMapId');
    const prev = MAPS[prevId] ?? MAPS.garden;
    const nextId = this.registry.get('currentMapId');
    const next = MAPS[nextId] ?? MAPS.playground;
    const unlocked = this.registry.get('lastUnlocked') ?? [];

    this._title = this.add.text(0, 0, `${prev.name.toUpperCase()} CLEARED!`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '52px', fontStyle: 'bold',
      color: '#ffd24a',
      stroke: '#2a1a0a', strokeThickness: 6
    }).setOrigin(0.5).setDepth(21);

    this._sub = this.add.text(0, 0,
      unlocked.length > 0 ? 'New bees joined the hive!' : 'The path leads onward...', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px', color: '#fff2c0'
    }).setOrigin(0.5).setDepth(21);

    // Unlock cards.
    this._cards = [];
    for (let i = 0; i < unlocked.length; i++) {
      const spec = BEES[unlocked[i]];
      if (!spec) continue;
      const bg = this.add.rectangle(0, 0, 200, 130, 0x3a2a14, 1)
        .setStrokeStyle(3, 0xffd24a).setDepth(21);
      const icon = this.add.text(0, 0, spec.letter, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '54px', fontStyle: 'bold',
        color: '#2a1a0a',
        backgroundColor: '#' + spec.color.toString(16).padStart(6, '0')
      }).setOrigin(0.5).setDepth(22).setPadding(10);
      const name = this.add.text(0, 0, spec.name, {
        fontFamily: 'system-ui, sans-serif', fontSize: '18px', fontStyle: 'bold',
        color: '#ffe070', stroke: '#000', strokeThickness: 2
      }).setOrigin(0.5).setDepth(22);
      this._cards.push({ bg, icon, name });
    }

    this._nextLabel = this.add.text(0, 0, `Next up: ${next.name}`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px', fontStyle: 'bold',
      color: '#fff2c0',
      stroke: '#2a1a0a', strokeThickness: 4
    }).setOrigin(0.5).setDepth(21);

    this._flavor = this.add.text(0, 0, next.flavor ?? '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px', color: '#d0b070'
    }).setOrigin(0.5).setDepth(21);

    this._btn = this.add.rectangle(0, 0, 260, 60, 0xffb030)
      .setStrokeStyle(3, 0x2a1a0a).setDepth(21)
      .setInteractive({ useHandCursor: true });
    this._btnTxt = this.add.text(0, 0, 'CONTINUE', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '26px', fontStyle: 'bold',
      color: '#2a1a0a'
    }).setOrigin(0.5).setDepth(22);

    this._btn.on('pointerover', () => this._btn.setFillStyle(0xffc858));
    this._btn.on('pointerout', () => this._btn.setFillStyle(0xffb030));
    this._btn.on('pointerdown', () => this._continue());

    this.input.keyboard.once('keydown-SPACE', () => this._continue());
    this.input.keyboard.once('keydown-ENTER', () => this._continue());

    this._layout();
    this.scale.on('resize', this._layout, this);
  }

  _layout() {
    const { width: w, height: h } = this.scale.gameSize;
    this._title.setPosition(w / 2, h * 0.18);
    this._sub.setPosition(w / 2, h * 0.27);

    const cardW = 200, gap = 30;
    const n = this._cards.length;
    const totalW = cardW * n + gap * Math.max(0, n - 1);
    const startX = (w - totalW) / 2;
    const cardY = h * 0.46;
    for (let i = 0; i < n; i++) {
      const c = this._cards[i];
      const x = startX + i * (cardW + gap) + cardW / 2;
      c.bg.setPosition(x, cardY);
      c.icon.setPosition(x, cardY - 16);
      c.name.setPosition(x, cardY + 44);
    }

    this._nextLabel.setPosition(w / 2, h * 0.68);
    this._flavor.setPosition(w / 2, h * 0.74);
    this._btn.setPosition(w / 2, h * 0.85);
    this._btnTxt.setPosition(w / 2, h * 0.85);
  }

  _continue() {
    this.scene.stop('HUDScene');
    this.scene.start('ShopScene');
  }
}
