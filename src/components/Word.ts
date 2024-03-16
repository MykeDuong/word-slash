export default class Word extends Phaser.GameObjects.Container {
    private word: string;
    private userInput: string = '';
    private matchedText: Phaser.GameObjects.Text;
    private remainingText: Phaser.GameObjects.Text;
    private velocity: number = 150; // Adjust speed as needed

    constructor(scene: Phaser.Scene, word: string, x: number, y: number) {
        super(scene, x, y);
        this.word = word;

        this.matchedText = scene.add.text(0, 0, '', { color: '#0000FF', fontSize: '32px' });
        this.remainingText = scene.add.text(0, 0, word, { color: '#FFFFFF', fontSize: '32px' });

        this.add(this.matchedText);
        this.add(this.remainingText);

        scene.add.existing(this);

        // Move the word from right to left
        scene.tweens.add({
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
                this.destroy();
            }
        } else {
            this.userInput = '';
            this.updateText();
        }
    }

    private updateText() {
        this.matchedText.setText(this.userInput);
        this.remainingText.setText(this.word.substring(this.userInput.length));

        // Adjust the position of the remaining text to the right of the matched text
        this.remainingText.setX(this.matchedText.width);
    }
}