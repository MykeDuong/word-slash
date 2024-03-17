import Phaser from 'phaser';

export default class Score {
    private score: number;
    private text: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.score = 0;
        this.text = scene.add.text(x, y, `Score: ${this.score}`, { fontSize: '32px', fill: '#000' });
    }

    public increase(amount: number): void {
        this.score += amount;
        this.updateText();
    }

    public decrease(amount: number): void {
        this.score -= amount;
        this.updateText();
    }

    private updateText(): void {
        this.text.setText(`Score: ${this.score}`);
    }
}