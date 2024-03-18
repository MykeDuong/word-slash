import { match } from "assert";
import { toNamespacedPath } from "path";
import { Game } from "../game/scenes/Game";

export default class Word extends Phaser.GameObjects.Container {
    word: string;
    private userInput: string = '';
    private matchedText: Phaser.GameObjects.Text;
    private notMatchedText: Phaser.GameObjects.Text;
    private remainingText: Phaser.GameObjects.Text;
    private velocity: number = 150; // Adjust speed as needed
    private tween: Phaser.Tweens.Tween
    private sprite: Phaser.GameObjects.Sprite;
    private onAir: boolean = false;
    private scene: Game;
    toBeDestroyed: boolean = false
    onOutOfScreen: () => void

    constructor(scene: Game, word: string, x: number, y: number, onAir: boolean, onOutOfScreen: () => void) {
        super(scene, x, y);
        this.word = word;
        this.onOutOfScreen = onOutOfScreen;
        this.scene = scene;
        this.onAir = onAir;
        let yOffset = 0;

        this.matchedText = scene.add.text(0, yOffset, '', { color: 'green', fontSize: '32px', fontStyle: 'bold' });
        this.notMatchedText = scene.add.text(0, yOffset, '', { color: 'red', fontSize: '32px', fontStyle: 'bold' });
        this.remainingText = scene.add.text(0, yOffset, word, { color: 'blue', fontSize: '32px', fontStyle: 'bold' });

        this.sprite = scene.add.sprite(45, 5 + yOffset, 'cloud-1'); // Create sprite
        this.add(this.sprite); // Add sprite to container

        scene.add.existing(this);

        this.add(this.matchedText); 
        this.add(this.notMatchedText);
        this.add(this.remainingText);

        if (!onAir) {
            yOffset = 450;
            this.y = this.y + yOffset;
        }
        // Move the word from right to left
        this.tween = scene.tweens.add({
            targets: this,
            x: -this.width + 380, // Move off screen to the left
            duration: (scene.scale.width - 180 + this.width) / this.velocity * 1000,
            ease: 'Linear',
            onComplete: () => { 
                this.startDecline();
            }
        });

        this.setupAnimations();
    }
    private setupAnimations() {
        // Example animation setup
        this.sprite.anims.create({
            key: 'cloud-1',
            frames: [
                { key: 'cloud-1', frame: "cloud_shape3_1.png" },
                { key: 'cloud-1', frame: "cloud_shape3_2.png" },
                { key: 'cloud-1', frame: 'cloud_shape3_3.png' },
                { key: 'cloud-1', frame: 'cloud_shape3_4.png' }
            ],
            frameRate: 10,
            repeat: 0
        });
    }

    updateVelocity(speed: number) {
        this.velocity = this.velocity * speed;
        this.tween.updateTo('duration', (this.scene.scale.width + this.width) / this.velocity * 1000);
    }

    canDestroy(input: boolean) {
        if (this.onAir) return this.onAir === input
        return true
    }
    // Method to start an animation
    playAnimation(animationKey: string) {
        return this.sprite.play(animationKey);
    }

    inputKey(key: string) {
        const potentialMatch = this.userInput + key;

        if (this.word.startsWith(potentialMatch)) {
            this.userInput = potentialMatch;
            this.updateText();

            if (this.userInput === this.word) {
                return [this.x, this.y]
            }
        } else {
            this.userInput = '';
            this.updateText();
        }

        return [-1, -1]
    }

    checkComplete(value: string): boolean {
        if (value === this.word) return true
        return false
    }

    stopMoving() {
        this.tween.stop()
    }

    destroyNew() {
        this.toBeDestroyed = true;
        this.matchedText.destroy();
        this.remainingText.destroy();
        this.removeAll();
    }

    startDecline() {
        this.tween = this.scene.tweens.add({
            targets: this,
            x: this.scene.player.x, // Move off screen to the left
            y: this.scene.player.y, // Move off screen to the left
            duration: 50 / this.velocity * 1000,
            ease: 'Linear',
            onComplete: () => { 
                this.sprite.anims.msPerFrame = 0.1;
                this.word = ''; 
                this.playAnimation('cloud-1').on('animationcomplete', () => {
                    this.destroy();
                });
                this.deleteWordEntry();
                this.onOutOfScreen();
            }
        });
    }
    deleteWordEntry() {
        this.scene.words = this.scene.words.slice(0);
    
    }
}