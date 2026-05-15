import Phaser from 'phaser';
import { setCurrentMap, resetForMap } from '../state.js';

// Code → effect. Each `apply(registry, scene)` returns a result object
// `{ message, restart? }`. If restart=true, the scene stops the active
// HUD/Game and starts a fresh GameScene afterwards.
const CODES = {
  '1': {
    label: 'Jump to The Cave with every bee unlocked',
    apply(registry) {
      setCurrentMap(registry, 'cave');
      resetForMap(registry);
      return { message: '✓ Code redeemed — welcome to The Cave', restart: true };
    }
  },
  '12': {
    label: 'Jump to The Ice with every bee unlocked',
    apply(registry) {
      setCurrentMap(registry, 'ice');
      resetForMap(registry);
      return { message: '✓ Code redeemed — welcome to The Ice', restart: true };
    }
  },
  '123': {
    label: 'Jump to The Hive with every bee unlocked',
    apply(registry) {
      setCurrentMap(registry, 'hive');
      resetForMap(registry);
      return { message: '✓ Code redeemed — welcome to The Hive', restart: true };
    }
  }
};

export class RedeemScene extends Phaser.Scene {
  constructor() { super('RedeemScene'); }

  init(data) {
    this.returnScene = data?.returnScene || 'MenuScene';
  }

  create() {
    const { width, height } = this.scale.gameSize;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0).setDepth(30);

    this._title = this.add.text(0, 0, 'REDEEM CODE', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '48px', fontStyle: 'bold',
      color: '#ffd24a', stroke: '#2a1a0a', strokeThickness: 5
    }).setOrigin(0.5).setDepth(31);

    this._boxBg = this.add.rectangle(0, 0, 460, 70, 0x1a0a04, 1)
      .setStrokeStyle(3, 0xffd24a).setDepth(31);

    this._input = '';
    this._inputTxt = this.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '40px', fontStyle: 'bold',
      color: '#fff2c0'
    }).setOrigin(0.5).setDepth(32);

    this._hint = this.add.text(0, 0, 'Type a code, then ENTER. ESC to cancel.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px', color: '#c0a070'
    }).setOrigin(0.5).setDepth(31);

    this._status = this.add.text(0, 0, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px', fontStyle: 'bold',
      color: '#ffd24a', stroke: '#2a1a0a', strokeThickness: 3
    }).setOrigin(0.5).setDepth(31);

    this._cursorOn = true;
    this._cursorTimer = this.time.addEvent({
      delay: 500, loop: true,
      callback: () => { this._cursorOn = !this._cursorOn; this._refresh(); }
    });

    this.input.keyboard.on('keydown', (event) => this._onKey(event));

    this._layout();
    this.scale.on('resize', this._layout, this);
    this._refresh();
  }

  _layout() {
    const { width: w, height: h } = this.scale.gameSize;
    this._title.setPosition(w / 2, h * 0.32);
    this._boxBg.setPosition(w / 2, h * 0.46);
    this._inputTxt.setPosition(w / 2, h * 0.46);
    this._hint.setPosition(w / 2, h * 0.56);
    this._status.setPosition(w / 2, h * 0.66);
  }

  _onKey(event) {
    if (event.key === 'Enter') {
      this._submit();
    } else if (event.key === 'Escape') {
      this._cancel();
    } else if (event.key === 'Backspace') {
      this._input = this._input.slice(0, -1);
      this._refresh();
    } else if (event.key.length === 1 && this._input.length < 20) {
      // Printable single-char keys only.
      this._input += event.key;
      this._refresh();
    }
  }

  _refresh() {
    const caret = this._cursorOn ? '▌' : ' ';
    this._inputTxt.setText(this._input + caret);
  }

  _submit() {
    const code = this._input.trim();
    const entry = CODES[code];
    if (!entry) {
      this._status.setColor('#ff6644').setText('✗ Invalid code');
      // shake the input box
      this.tweens.add({
        targets: this._boxBg, x: '+=8', yoyo: true, repeat: 3, duration: 40
      });
      return;
    }
    const result = entry.apply(this.registry, this);
    this._status.setColor('#66cc44').setText(result.message);
    this.time.delayedCall(700, () => {
      if (result.restart) {
        this.scene.stop('HUDScene');
        this.scene.stop(this.returnScene);
        this.scene.start('GameScene');
      } else {
        this._close();
      }
    });
  }

  _cancel() {
    this._close();
  }

  _close() {
    this._cursorTimer?.remove();
    if (this.scene.isPaused(this.returnScene)) {
      this.scene.resume(this.returnScene);
    } else if (!this.scene.isActive(this.returnScene)) {
      this.scene.start(this.returnScene);
      return;
    }
    this.scene.stop();
  }
}
