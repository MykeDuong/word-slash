export default class Word extends Phaser.GameObjects.Container {
    word: string;
    private userInput: string = '';
    private matchedText: Phaser.GameObjects.Text;
    private remainingText: Phaser.GameObjects.Text;
    private velocity: number = 150; // Adjust speed as needed
    private tween: Phaser.Tweens.Tween
    private sprite: Phaser.GameObjects.Sprite;
    private onAir: boolean = false;
    scene: Phaser.Scene;
    toBeDestroyed: boolean = false

    constructor(scene: Phaser.Scene, word: string, x: number, y: number, onAir: boolean) {
        super(scene, x, y);
        this.word = word;
        this.scene = scene;
        this.onAir = onAir;
        let yOffset = 0;

        this.matchedText = scene.add.text(0, yOffset, '', { color: '#0000FF', fontSize: '32px', fontStyle: 'bold' });
        this.remainingText = scene.add.text(0, yOffset, word, { color: '#000000', fontSize: '32px', fontStyle: 'bold' });

        this.sprite = scene.add.sprite(45, 5 + yOffset, 'cloud-1'); // Create sprite
        this.add(this.sprite); // Add sprite to container

        scene.add.existing(this);

        this.add(this.matchedText);
        this.add(this.remainingText);

        if (!onAir) {
            yOffset = 300;
            this.y = this.y + yOffset;
        }
        // Move the word from right to left
        this.tween = scene.tweens.add({
            targets: this,
            x: -this.width, // Move off screen to the left
            duration: (scene.scale.width + this.width) / this.velocity * 1000,
            ease: 'Linear',
            onComplete: () => { this.destroy() }
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

    canDestroy(input: boolean) {
        return this.onAir == input
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
        this.matchedText.destroy();
        this.remainingText.destroy();
        this.removeAll();
    }
    private updateText() {
        this.matchedText.setText(this.userInput);
        this.remainingText.setText(this.word.substring(this.userInput.length));

        // Adjust the position of the remaining text to the right of the matched text
        this.remainingText.setX(this.matchedText.width);
    }
}