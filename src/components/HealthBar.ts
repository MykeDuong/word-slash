import { Game } from "../game/scenes/Game";

export default class HealthBar {
    private scene: Game;
    private totalHealth: number;
    private currentHealth: number;
    private graphics: Phaser.GameObjects.Graphics;
    private backgroundGraphics: Phaser.GameObjects.Graphics;
    private borderGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: Game) {
        this.scene = scene;
        this.totalHealth = 100;
        this.currentHealth = 100;

        // Background of the health bar
        this.backgroundGraphics = this.scene.add.graphics();
        this.backgroundGraphics.fillStyle(0x8B0000, 0.6);
        this.backgroundGraphics.fillRect(30, 30, 200, 20);

        // Foreground of the health bar
        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillRect(30, 30, 200, 20);

        // Border of the health bar
        this.borderGraphics = this.scene.add.graphics();
        this.borderGraphics.lineStyle(2, 0xffffff, 1); // White border with 2 pixel thickness
        this.borderGraphics.strokeRect(30, 30, 200, 20);
    }

    public decreaseHealth(amount: number): void {
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        this.updateHealthBar();
        if (this.currentHealth === 0) {
            this.scene.changeScene()
        }
    }

    private updateHealthBar(): void {
        const healthPercentage = this.currentHealth / this.totalHealth;
        this.graphics.clear();
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillRect(10, 10, 200 * healthPercentage, 20);
        // Re-draw the border to ensure it's always visible
        this.borderGraphics.clear();
        this.borderGraphics.lineStyle(2, 0xffffff, 1);
        this.borderGraphics.strokeRect(10, 10, 200, 20);
    }
}