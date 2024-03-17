export default class Word extends Phaser.GameObjects.Container {
    word: string;
    private userInput: string = '';
    private matchedText: Phaser.GameObjects.Text;
    private remainingText: Phaser.GameObjects.Text;
    private velocity: number = 150; // Adjust speed as needed
    private tween: Phaser.Tweens.Tween
    toBeDestroyed: boolean = false

    constructor(scene: Phaser.Scene, word: string, x: number, y: number) {
        super(scene, x, y);
        this.word = word;

        this.matchedText = scene.add.text(0, 0, '', { color: '#0000FF', fontSize: '32px', fontStyle: 'bold' });
        this.remainingText = scene.add.text(0, 0, word, { color: '#FFFFFF', fontSize: '32px', fontStyle: 'bold' });

        this.add(this.matchedText);
        this.add(this.remainingText);

        scene.add.existing(this);

        // Move the word from right to left
        this.tween = scene.tweens.add({
            targets: this,
            x: -this.width, // Move off screen to the left
            duration: (scene.scale.width + this.width) / this.velocity * 1000,
            ease: 'Linear',
            onComplete: () => this.destroy()
        });
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

    private updateText() {
        this.matchedText.setText(this.userInput);
        this.remainingText.setText(this.word.substring(this.userInput.length));

        // Adjust the position of the remaining text to the right of the matched text
        this.remainingText.setX(this.matchedText.width);
    }
}