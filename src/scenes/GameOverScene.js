import Phaser from 'phaser';
import { resetForMap } from '../state.js';
import { MAPS } from '../data/maps.js';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  create() {
    const { width, height } = this.scale.gameSize;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0).setDepth(20);

    const layout = () => {
      const { width: w, height: h } = this.scale.gameSize;
      this._title?.setPosition(w / 2, h * 0.4);
      this._sub?.setPosition(w / 2, h * 0.52);
      this._hint?.setPosition(w / 2, h * 0.66);
    };

    this._title = this.add.text(0, 0, 'THE BEARS GOT THE HONEY', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '56px', fontStyle: 'bold',
      color: '#ff6644',
      stroke: '#2a1a0a', strokeThickness: 6
    }).setOrigin(0.5).setDepth(21);

    const mapId = this.registry.get('currentMapId') ?? 'garden';
    const map = MAPS[mapId];
    this._sub = this.add.text(0, 0,
      `The hive has fallen on ${map?.name ?? 'the field'}.`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px', color: '#ffd0a0'
    }).setOrigin(0.5).setDepth(21);

    this._hint = this.add.text(0, 0,
      'Press SPACE to retry this map', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px', color: '#ffe070'
    }).setOrigin(0.5).setDepth(21);

    layout();
    this.scale.on('resize', layout);

    this.input.keyboard.once('keydown-SPACE', () => this._restart());
    this.input.keyboard.once('keydown-ENTER', () => this._restart());
  }

  _restart() {
    resetForMap(this.registry);
    this.scene.stop('HUDScene');
    this.scene.start('GameScene');
  }
}
