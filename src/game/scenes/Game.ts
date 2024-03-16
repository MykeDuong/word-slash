import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import pickRandomWord from '../../utils/randomWords.ts';
import Word from '../../components/Word.ts';

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
        
        const wordCloud = new Word(this, word, window.innerWidth, window.innerHeight / 2)

        // Track user's input
        this.input.keyboard!.on('keydown', (event) => {
            wordCloud.inputKey(event.key)
        });

        EventBus.emit('current-scene-ready', this);
    }   

    changeScene () {
        this.scene.start('GameOver');
    }
}