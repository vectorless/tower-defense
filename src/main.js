import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { HUDScene } from './scenes/HUDScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { MapClearScene } from './scenes/MapClearScene.js';
import { ShopScene } from './scenes/ShopScene.js';
import { RedeemScene } from './scenes/RedeemScene.js';
import { initState } from './state.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#2a1a0a',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%'
  },
  scene: [MenuScene, GameScene, HUDScene, GameOverScene, VictoryScene, MapClearScene, ShopScene, RedeemScene]
});

initState(game.registry);
