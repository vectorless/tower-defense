import Phaser from 'phaser';
import { resetState } from '../state.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    this.cameras.main.setBackgroundColor('#2a1a0a');

    const layout = () => {
      const { width, height } = this.scale.gameSize;
      this._title?.setPosition(width / 2, height * 0.28);
      this._sub?.setPosition(width / 2, height * 0.38);
      this._btn?.setPosition(width / 2, height * 0.58);
      this._btnTxt?.setPosition(width / 2, height * 0.58);
      this._hint?.setPosition(width / 2, height * 0.85);
    };

    this._title = this.add.text(0, 0, 'BEES vs BEARS', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '72px', fontStyle: 'bold',
      color: '#ffd24a',
      stroke: '#2a1a0a', strokeThickness: 6
    }).setOrigin(0.5);

    this._sub = this.add.text(0, 0,
      'Defend the hive from honey-stealing bears.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '22px',
      color: '#fff2c0'
    }).setOrigin(0.5);

    this._btn = this.add.rectangle(0, 0, 240, 64, 0xffb030)
      .setStrokeStyle(3, 0x2a1a0a).setInteractive({ useHandCursor: true });
    this._btnTxt = this.add.text(0, 0, 'START', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '28px', fontStyle: 'bold',
      color: '#2a1a0a'
    }).setOrigin(0.5);

    this._btn.on('pointerover', () => this._btn.setFillStyle(0xffc858));
    this._btn.on('pointerout', () => this._btn.setFillStyle(0xffb030));
    this._btn.on('pointerdown', () => this._start());

    this._hint = this.add.text(0, 0,
      'Place bees on the meadow. Survive 10 waves.\n' +
      'Hotkeys 1–6 select a bee type; click an empty cell to place.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: '#c0a070',
      align: 'center'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-SPACE', () => this._start());
    this.input.keyboard.on('keydown-ENTER', () => this._start());
    this.input.keyboard.on('keydown-R', () => {
      this.scene.start('RedeemScene', { returnScene: 'MenuScene' });
    });

    layout();
    this.scale.on('resize', layout);
  }

  _start() {
    resetState(this.registry);
    this.scene.start('GameScene');
  }
}
