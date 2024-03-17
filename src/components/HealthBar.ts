export default class HealthBar {
    private scene: Phaser.Scene;
    private totalHealth: number;
    private currentHealth: number;
    private graphics: Phaser.GameObjects.Graphics;
    private backgroundGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.totalHealth = 100;
        this.currentHealth = 100;

        // Background of the health bar
        this.backgroundGraphics = this.scene.add.graphics();
        this.backgroundGraphics.fillStyle(0x8B0000, 0.6);
        this.backgroundGraphics.fillRect(10, 10, 200, 20);

        // Foreground of the health bar
        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillRect(10, 10, 200, 20);
    }

    public decreaseHealth(amount: number): void {
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        this.updateHealthBar();
    }

    private updateHealthBar(): void {
        const healthPercentage = this.currentHealth / this.totalHealth;
        this.graphics.clear();
        this.graphics.fillStyle(0xff0000, 1);
        this.graphics.fillRect(10, 10, 200 * healthPercentage, 20);
    }
}