import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

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
                { key: 'ninja',frame:"Run__000.png"},
                { key: 'ninja',frame:"Run__001.png"},
                { key: 'ninja',frame:'Run__002.png'},
                { key: 'ninja',frame:'Run__003.png'},
                { key: 'ninja',frame:'Run__004.png'},
                { key: 'ninja',frame:'Run__005.png'},
                { key: 'ninja',frame:'Run__006.png'},
                { key: 'ninja',frame:'Run__007.png'},
                { key: 'ninja',frame:'Run__008.png'},
                { key: 'ninja',frame:'Run__009.png'},
            ],
            frameRate: 20,
            repeat: -1
        });

        var frameNames = this.textures.get('ninja').getFrameNames();
        console.log(frameNames);
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);
        /**
        this.gameText = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        */
        // Add a sprite that uses the animation
        const player = this.add.sprite(200, 400, 'ninja-run').setScale(1);

        // Play the 'run' animation
        player.anims.play('run');
        EventBus.emit('current-scene-ready', this);
    }

    changeScene () {
        this.scene.start('GameOver');
    }
}