import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import TweenHelper from '../../utils/TweenHelper';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    buttonTween: Phaser.Tweens.Tween | null;
    buttonTween1: Phaser.Tweens.Tween | null;
    timer: number = 0

    constructor () {
        super('MainMenu');
    }

    create () {
        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background')
        this.logo = this.add.image(window.innerWidth / 2, window.innerHeight / 2 - 100, 'logo').setDepth(100).setScale(0.5);
        const startText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 200, 'Press SPACE to start', { fontSize: "3rem", }).setOrigin(0.5, 0.5);
        const insText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 300, 'Press I for instructions', { fontSize: "3rem", }).setOrigin(0.5, 0.5); 
        // Create a tween for the startButton to blink
        this.buttonTween = this.tweens.add({
            targets: startText,
            alpha: 0,
            ease: 'Linear',
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.buttonTween1 = this.tweens.add({
            targets: insText,
            alpha: 0,
            ease: 'Linear',
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        const spaceBar = this.input.keyboard!
            .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on('down', () => this.changeScene(true))
        const iKey = this.input.keyboard!
            .addKey(Phaser.Input.Keyboard.KeyCodes.I)
            .on('down', () => this.changeScene(false))
        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene (toggle: boolean) {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        if (toggle){
            this.scene.start('Game');
        } else {
            this.scene.start('Instructions');
        }
    }

}