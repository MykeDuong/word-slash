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
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 180, 'Instructions', { fontSize: "5rem", }).setOrigin(0.5, 0.5);
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 80, '1. Type the word, and then press Enter to destroy the cloud', { fontSize: "2rem", }).setOrigin(0.5, 0.5);
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 20, '2. SPACEBAR to jump (reminder: clouds on the air are not destroyable unless you jump (or glide)),', { fontSize: "2rem", }).setOrigin(0.5, 0.5);
        this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 120, '   and targets on the ground requires you to be on the ground', { fontSize: "2rem", }).setOrigin(0.5, 0.5);
        const gameText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 200, 'Press SPACE to start the game', { fontSize: "3rem", }).setOrigin(0.5, 0.5);
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