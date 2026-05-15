import Phaser from 'phaser';
import { resetState } from '../state.js';

export class VictoryScene extends Phaser.Scene {
  constructor() { super('VictoryScene'); }

  create() {
    const { width, height } = this.scale.gameSize;
    this.add.rectangle(0, 0, width, height, 0xffb030, 0.25).setOrigin(0).setDepth(20);

    const layout = () => {
      const { width: w, height: h } = this.scale.gameSize;
      this._title?.setPosition(w / 2, h * 0.30);
      this._sub?.setPosition(w / 2, h * 0.42);
      this._sub2?.setPosition(w / 2, h * 0.50);
      this._hint?.setPosition(w / 2, h * 0.66);
    };

    this._title = this.add.text(0, 0, 'CAMPAIGN COMPLETE!', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '72px', fontStyle: 'bold',
      color: '#ffd24a',
      stroke: '#2a1a0a', strokeThickness: 6
    }).setOrigin(0.5).setDepth(21);

    this._sub = this.add.text(0, 0,
      'Fifteen lands defended. The Eternal Bear has fallen.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px', color: '#fff2c0'
    }).setOrigin(0.5).setDepth(21);

    this._sub2 = this.add.text(0, 0, 'The hive is safe. The cosmos is at peace.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px', color: '#fff2c0'
    }).setOrigin(0.5).setDepth(21);

    this._hint = this.add.text(0, 0, 'Press SPACE to play again', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px', color: '#ffe070'
    }).setOrigin(0.5).setDepth(21);

    layout();
    this.scale.on('resize', layout);

    this.input.keyboard.once('keydown-SPACE', () => this._restart());
    this.input.keyboard.once('keydown-ENTER', () => this._restart());
  }

  _restart() {
    resetState(this.registry);
    this.scene.stop('HUDScene');
    this.scene.start('GameScene');
  }
}
