import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import TweenHelper from '../../utils/TweenHelper';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    timer: number = 0

    constructor () {
        super('MainMenu');
    }

    create () {
        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background')
        this.logo = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - 100, 'logo').setDepth(100).setScale(0.5);
        const startText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 200, 'Press SPACE to start', { fontSize: "3rem", }).setOrigin(0.5, 0.5); 
        // Create a tween for the startButton to blink
        this.buttonTween = this.tweens.add({
            targets: startText,
            alpha: 0,
            ease: 'Linear',
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        const spaceBar = this.input.keyboard!
            .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on('down', () => this.changeScene())

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene () {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }
}