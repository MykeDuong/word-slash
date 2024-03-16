import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import pickRandomWord from '../../utils/randomWords.ts';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    preload() {
        this.load.atlas('ninja-run', 'assets/ninja-run.png', 'assets/ninja-run.json');
        this.load.atlas('ninja-jump', 'assets/ninja-jump.png', 'assets/ninja-jump.json');
        this.load.atlas('ninja-attack', 'assets/ninja-attack.png', 'assets/ninja-attack.json');
        this.load.atlas('ninja-jump-attack', 'assets/ninja-jump-attack.png', 'assets/ninja-jump-attack.json');
    }


    constructor () {
        super('Game');
    }

    create () {
        // Create an animation from the loaded atlas
        this.anims.create({
            key: 'ninja-run',
            frames: [
                { key: 'ninja-run',frame:"Run__000.png"},
                { key: 'ninja-run',frame:"Run__001.png"},
                { key: 'ninja-run',frame:'Run__002.png'},
                { key: 'ninja-run',frame:'Run__003.png'},
                { key: 'ninja-run',frame:'Run__004.png'},
                { key: 'ninja-run',frame:'Run__005.png'},
                { key: 'ninja-run',frame:'Run__006.png'},
                { key: 'ninja-run',frame:'Run__007.png'},
                { key: 'ninja-run',frame:'Run__008.png'},
                { key: 'ninja-run',frame:'Run__009.png'},
            ],
            frameRate: 20,
            repeat: -1
        });

        this.camera = this.cameras.main;

        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        const player = this.add.sprite(200, window.innerHeight - 200, 'ninja-run').setScale(0.4);

        // Play the 'run' animation
        player.anims.play('ninja-run');

        const word = pickRandomWord();

        // Create a text object with the word at the right edge of the screen
        let text = this.add.text(this.scale.width, 100, word, {
            font: '40px Arial',
            fill: '#ffffff'
        });

        // Set the origin of the text to its center
        text.setOrigin(0.5, 0.5);

        // Move the text from right to left
        const tween = this.tweens.add({
            targets: text,
            x: -text.width, // move it to the left beyond its width so it completely disappears
            ease: 'Linear', // linear movement
            duration: 10000, // duration of the movement, adjust as needed
            repeat: 0, // no repeat
            onComplete: function () {
                text.destroy(); // destroy the text object once it's off screen
            }
        });
        // Track user's input
        let userInput = '';
        this.input.keyboard!.on('keydown', (event) => {
            userInput += event.key;
            if (word.toLowerCase().startsWith(userInput.toLowerCase())) {
                const matchedPart = word.substring(0, userInput.length);
                const remainingPart = word.substring(userInput.length);
                text.setText(`[color green]${matchedPart}[/color]${remainingPart}`);
            }

            // Check if the typed word matches the displayed word
            if (userInput.toLowerCase() === word.toLowerCase()) {
                // Stop the text from moving
                tween.stop();

                // Fade out the text and destroy it
                this.tweens.add({
                    targets: text,
                    alpha: 0,
                    ease: 'Linear',
                    duration: 500,
                    onComplete: function () {
                        text.destroy();
                    }
                });

                // Reset userInput for the next word
                userInput = '';
            }
        });
        EventBus.emit('current-scene-ready', this);
    }   

    changeScene () {
        this.scene.start('GameOver');
    }
}