import Phaser from 'phaser';
import { SHOP_ITEMS, SHOP_ORDER } from '../data/shop.js';
import { MAPS } from '../data/maps.js';
import {
  spendCoins, addWipe, ownSkin, setActiveHiveSkin
} from '../state.js';

export class ShopScene extends Phaser.Scene {
  constructor() { super('ShopScene'); }

  create() {
    const { width, height } = this.scale.gameSize;
    this.add.rectangle(0, 0, width, height, 0x080808, 0.85).setOrigin(0).setDepth(20);

    this._title = this.add.text(0, 0, 'BEEHIVE BAZAAR', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '52px', fontStyle: 'bold',
      color: '#ffd24a',
      stroke: '#2a1a0a', strokeThickness: 6
    }).setOrigin(0.5).setDepth(21);

    this._coinsTxt = this.add.text(0, 0, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '28px', fontStyle: 'bold',
      color: '#ffd24a',
      stroke: '#2a1a0a', strokeThickness: 4
    }).setOrigin(0.5).setDepth(21);

    this._hint = this.add.text(0, 0,
      'Click a card to buy. Click an owned hive to wear it.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px', color: '#c0a070'
    }).setOrigin(0.5).setDepth(21);

    this._status = this.add.text(0, 0, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px', fontStyle: 'bold',
      color: '#66cc44', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(21);

    this._cards = [];
    for (const id of SHOP_ORDER) {
      this._cards.push(this._buildCard(id));
    }

    const nextMapId = this.registry.get('currentMapId');
    const next = MAPS[nextMapId];
    this._continueBtn = this.add.rectangle(0, 0, 280, 60, 0xffb030)
      .setStrokeStyle(3, 0x2a1a0a).setDepth(21)
      .setInteractive({ useHandCursor: true });
    this._continueTxt = this.add.text(0, 0,
      next ? `CONTINUE → ${next.name}` : 'CONTINUE', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px', fontStyle: 'bold',
      color: '#2a1a0a'
    }).setOrigin(0.5).setDepth(22);
    this._continueBtn.on('pointerover', () => this._continueBtn.setFillStyle(0xffc858));
    this._continueBtn.on('pointerout', () => this._continueBtn.setFillStyle(0xffb030));
    this._continueBtn.on('pointerdown', () => this._continue());

    this.input.keyboard.once('keydown-SPACE', () => this._continue());
    this.input.keyboard.once('keydown-ENTER', () => this._continue());

    this._layout();
    this.scale.on('resize', this._layout, this);
    this._refresh();
  }

  _buildCard(id) {
    const item = SHOP_ITEMS[id];
    const bg = this.add.rectangle(0, 0, 220, 240, 0x2a1a0a, 1)
      .setStrokeStyle(3, 0xffd24a).setDepth(21)
      .setInteractive({ useHandCursor: true });
    const icon = this.add.text(0, 0, item.icon ?? '?', {
      fontFamily: 'system-ui, sans-serif', fontSize: '56px'
    }).setOrigin(0.5).setDepth(22);
    const name = this.add.text(0, 0, item.name, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px', fontStyle: 'bold',
      color: '#ffe070', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(22);
    const desc = this.add.text(0, 0, item.desc, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px', color: '#d0b070',
      wordWrap: { width: 200 },
      align: 'center'
    }).setOrigin(0.5).setDepth(22);
    const status = this.add.text(0, 0, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px', fontStyle: 'bold',
      color: '#ffd24a', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(22);

    bg.on('pointerdown', () => this._tryAction(id));
    return { id, item, bg, icon, name, desc, status };
  }

  _tryAction(id) {
    const item = SHOP_ITEMS[id];
    const owned = (this.registry.get('ownedSkins') ?? []).includes(id);

    if (item.kind === 'consumable') {
      if (!spendCoins(this.registry, item.cost)) {
        this._flash('Not enough coins', 0xff6644); return;
      }
      addWipe(this.registry, 1);
      this._flash(`Bought ${item.name}`, 0x66cc44);
    } else if (item.kind === 'hiveSkin') {
      if (!owned) {
        if (!spendCoins(this.registry, item.cost)) {
          this._flash('Not enough coins', 0xff6644); return;
        }
        ownSkin(this.registry, id);
        setActiveHiveSkin(this.registry, id);
        this._flash(`${item.name} unlocked & equipped`, 0x66cc44);
      } else {
        const active = this.registry.get('activeHiveSkin');
        setActiveHiveSkin(this.registry, active === id ? null : id);
        this._flash(active === id ? 'Skin unequipped' : `${item.name} equipped`, 0xffd24a);
      }
    }
    this._refresh();
  }

  _flash(msg, color) {
    this._status.setText(msg);
    this._status.setColor('#' + color.toString(16).padStart(6, '0'));
  }

  _refresh() {
    const coins = this.registry.get('coins') ?? 0;
    const wipes = this.registry.get('wipes') ?? 0;
    const owned = this.registry.get('ownedSkins') ?? [];
    const activeSkin = this.registry.get('activeHiveSkin');

    this._coinsTxt.setText(`💰 ${coins} coins`);

    for (const card of this._cards) {
      const { id, item } = card;
      if (item.kind === 'consumable') {
        card.status.setText(`Cost ${item.cost} · Owned: ${wipes}`);
        card.bg.setStrokeStyle(3, coins >= item.cost ? 0x66cc44 : 0x555555);
      } else if (item.kind === 'hiveSkin') {
        if (owned.includes(id)) {
          if (activeSkin === id) card.status.setText('★ EQUIPPED');
          else card.status.setText('Owned (click to wear)');
          card.bg.setStrokeStyle(3, activeSkin === id ? 0xffffff : 0xffd24a);
        } else {
          card.status.setText(`Cost ${item.cost}`);
          card.bg.setStrokeStyle(3, coins >= item.cost ? 0x66cc44 : 0x555555);
        }
      }
    }
  }

  _layout() {
    const { width: w, height: h } = this.scale.gameSize;
    this._title.setPosition(w / 2, h * 0.10);
    this._coinsTxt.setPosition(w / 2, h * 0.18);

    const cardW = 220, cardH = 240, gap = 22;
    const n = this._cards.length;
    const totalW = cardW * n + gap * Math.max(0, n - 1);
    const startX = (w - totalW) / 2 + cardW / 2;
    const cardY = h * 0.52;
    for (let i = 0; i < n; i++) {
      const c = this._cards[i];
      const x = startX + i * (cardW + gap);
      c.bg.setPosition(x, cardY);
      c.icon.setPosition(x, cardY - 60);
      c.name.setPosition(x, cardY - 8);
      c.desc.setPosition(x, cardY + 38);
      c.status.setPosition(x, cardY + 96);
    }

    this._hint.setPosition(w / 2, h * 0.72);
    this._status.setPosition(w / 2, h * 0.76);
    this._continueBtn.setPosition(w / 2, h * 0.84);
    this._continueTxt.setPosition(w / 2, h * 0.84);
  }

  _continue() {
    this.scene.stop('HUDScene');
    this.scene.start('GameScene');
  }
}
