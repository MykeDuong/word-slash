import { EventBus } from '../EventBus';
import { Data, Scene } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    accuracy: number
    score: number


    constructor() {
        super('GameOver');
    }

    init(data) {
        this.accuracy = data.accuracy
        this.score = data.score
    }

    create() {
        this.camera = this.cameras.main

        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');

        this.gameOverText = this.add.text(
            window.innerWidth / 2,
            window.innerHeight / 2 - 100, 'Game Over', {
            color: '#FFFFFF', fontSize: '120px', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 50,
            [
                `Score: ${this.score}`,
                `Accuracy: ${isNaN(this.accuracy) ? 0 : this.accuracy}%`],
            { color: '#FFFFFF', fontSize: '32px', fontStyle: 'bold' }
        ).setOrigin(0.5)

        const continueText = this.add.text(
            window.innerWidth / 2, window.innerHeight / 2 + 200,
            'Press any button to continue', { fontSize: "2rem", }
        ).setOrigin(0.5, 0.5);

        // Create a tween for the startButton to blink
        this.tweens.add({
            targets: continueText,
            alpha: 0,
            ease: 'Linear',
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.input.keyboard!.on('keydown', (event) => {
            this.changeScene()
        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
}