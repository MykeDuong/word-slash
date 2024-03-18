import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import TweenHelper from '../../utils/TweenHelper';

export class Instructions extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    buttonTween: Phaser.Tweens.Tween | null;
    buttonTween1: Phaser.Tweens.Tween | null;
    timer: number = 0

    constructor () {
        super('Instructions');
    }

    create () {
        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background')
        // instructions
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 180, 'Instructions', { fontSize: "5rem", fontStyle: "bold" }).setOrigin(0.5, 0.5);
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 80, '1. Type the word, and then press ENTER to destroy the cloud', { fontSize: "2rem", fontStyle: "bold" }).setOrigin(0.5, 0.5);
        this.add.text(window.innerWidth / 2, window.innerHeight / 2, '2. SPACEBAR to jump', { fontSize: "2rem", fontStyle: "bold" }).setOrigin(0.5, 0.5);
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 80, '  Note: Target on air needs you to jump before destroying', { fontSize: "2rem", fontStyle: "bold"}).setOrigin(0.5, 0.5);
        const gameText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 240, 'Press SPACE to start the game', { fontSize: "3rem", }).setOrigin(0.5, 0.5);
        const menuText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 300, 'Press I to go back to Menu', { fontSize: "3rem", }).setOrigin(0.5, 0.5); 
        // Create a tween for the startButton to blink
        this.buttonTween = this.tweens.add({
            targets: gameText,
            alpha: 0,
            ease: 'Linear',
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.buttonTween1 = this.tweens.add({
            targets: menuText,
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
        if (toggle){
            this.scene.start('Game');
        } else {
            this.scene.start('MainMenu');
        }
    }

}