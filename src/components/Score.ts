export default class Score extends Phaser.GameObjects.Container {
    private score: number;
    private entry: number;
    private scoreText: Phaser.GameObjects.Text;
    private accuracyText: Phaser.GameObjects.Text;
    scene: Phaser.Scene;
    toBeDestroyed: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, style: Phaser.Types.GameObjects.Text.TextStyle) {
        super(scene, x, y);
        this.score = 0;
        this.entry = 0;
        this.scene = scene;
        this.scoreText = scene.add.text(-12, 0, `Score: 0`, style);
        this.accuracyText = scene.add.text(-70, 22, `Accuracy: 100%`, style);
        this.add(this.scoreText);
        this.add(this.accuracyText);
        scene.add.existing(this);
    }

    public increaseEntry(): void {
        this.entry++; 
        this.updateText(); 
    }
    public increaseScore(points: number): void {
        this.score += points;
        this.updateText();
    }

    public getScore(): number {
        return this.score;
    }

    private updateText(): void {
        this.scoreText.setText(`Score: ${this.score}`);
        this.accuracyText.setText(`Accuracy: ${Math.round(this.score*100/this.entry)}%`);
    } 
}