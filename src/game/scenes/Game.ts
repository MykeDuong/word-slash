import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import pickRandomWord from '../../utils/randomWords.ts';
import Word from '../../components/Word.ts';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    words: Word[];

    preload() {
        this.load.atlas('ninja-run', 'assets/ninja-run.png', 'assets/ninja-run.json');
        this.load.atlas('ninja-jump', 'assets/ninja-jump.png', 'assets/ninja-jump.json');
        this.load.atlas('ninja-jump-attack', 'assets/ninja-jump-attack.png', 'assets/ninja-jump-attack.json');
    }


    constructor () {
        super('Game');
        this.words = []
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

        this.anims.create({
            key: 'ninja-jump-attack',
            frames: [
                { key: 'ninja-jump-attack',frame:"Jump_Attack__000.png"},
                { key: 'ninja-jump-attack',frame:"Jump_Attack__001.png"},
                { key: 'ninja-jump-attack',frame:'Jump_Attack__002.png'},
                { key: 'ninja-jump-attack',frame:'Jump_Attack__003.png'},
                { key: 'ninja-jump-attack',frame:'Jump_Attack__004.png'},
                { key: 'ninja-jump-attack',frame:'Jump_Attack__005.png'},
                { key: 'ninja-jump-attack',frame:'Jump_Attack__006.png'},
                { key: 'ninja-jump-attack',frame:'Jump_Attack__007.png'},
                { key: 'ninja-jump-attack',frame:'Jump_Attack__008.png'},
                { key: 'ninja-jump-attack',frame:'Jump_Attack__009.png'},
            ],
            frameRate: 60,
            repeat: 0
        })
        

        this.time.addEvent({
            callback: this.createNewWord,
            callbackScope: this,
            delay: 2000, // 1000 = 1 second
            loop: true
        })

        this.camera = this.cameras.main;

        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
        const player = this.add.sprite(200, window.innerHeight - 200, 'ninja-run').setScale(0.4);

        // Play the 'run' animation
        player.anims.play('ninja-run');


        // Track user's input
        this.input.keyboard!.on('keydown', (event) => {
            for (const wordCloud of this.words) {
            if (wordCloud.toBeDestroyed) continue;
            const [x, y] = wordCloud.inputKey(event.key)
            if (x != -1 && y != -1) {
                wordCloud.toBeDestroyed = true
                wordCloud.stopMoving()
                player.setPosition(x, y);

                player.anims.play('ninja-jump-attack').once('animationcomplete', () => {
                    wordCloud.destroy()
                    player.setPosition(200, window.innerHeight - 200)
                    player.anims.play('ninja-run')
                })
            }
            }
        });

        EventBus.emit('current-scene-ready', this);
    }   

    changeScene () {
        this.scene.start('GameOver');
    }

    createNewWord() {
        const word = pickRandomWord();

        this.words.push(new Word(this, word, window.innerWidth, window.innerHeight / 2))
    }
}