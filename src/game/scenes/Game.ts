import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import pickRandomWord from '../../utils/randomWords.ts';
import Word from '../../components/Word.ts';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    words: Word[];

    player: Phaser.GameObjects.Sprite;
    cloud: Phaser.GameObjects.Sprite;
    cloud_list: Phaser.GameObjects.Sprite[] = [];
    current_word: string = "spring";
    frame_counter: number = 0;
    jump: boolean = false; //manage jump state of ninja
    inputString: string = ""; //manahe input string
    spacebar_pressed: boolean = false;
    onKeyDown: boolean = false;
    onJumpUp: boolean = false;
    onJumpDown: boolean = false;

    readonly Player_Pos = { x: 200, y: 700 };
    readonly Min_Jump_Height = 500
    readonly Char_Arr: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'];

    cur_cloud_x: number = 0;
    cur_cloud_y: number = 0;
    preload() {
        this.load.atlas('ninja-run', 'assets/ninja-run.png', 'assets/ninja-run.json');
        this.load.atlas('ninja-jump', 'assets/ninja-jump.png', 'assets/ninja-jump.json');
        this.load.atlas('ninja-jump-attack', 'assets/ninja-jump-attack.png', 'assets/ninja-jump-attack.json');
        this.load.atlas('ninja-glide', 'assets/ninja-glide.png', 'assets/ninja-glide.json');
        this.load.atlas('cloud-1', 'assets/cloud-1.png', 'assets/cloud-1.json');
    }


    constructor() {
        super('Game');
        this.words = []
    }

    create() {

        // Create animations
        this.anims.create({
            key: 'ninja-run',
            frames: [
                { key: 'ninja-run', frame: "Run__000.png" },
                { key: 'ninja-run', frame: "Run__001.png" },
                { key: 'ninja-run', frame: 'Run__002.png' },
                { key: 'ninja-run', frame: 'Run__003.png' },
                { key: 'ninja-run', frame: 'Run__004.png' },
                { key: 'ninja-run', frame: 'Run__005.png' },
                { key: 'ninja-run', frame: 'Run__006.png' },
                { key: 'ninja-run', frame: 'Run__007.png' },
                { key: 'ninja-run', frame: 'Run__008.png' },
                { key: 'ninja-run', frame: 'Run__009.png' },
            ],
            frameRate: 20,
            repeat: -1
        });

        // Create jump animation
        this.anims.create({
            key: 'ninja-jump',
            frames: [
                { key: 'ninja-jump', frame: "Jump__000.png" },
                { key: 'ninja-jump', frame: "Jump__001.png" },
                { key: 'ninja-jump', frame: 'Jump__002.png' },
                { key: 'ninja-jump', frame: 'Jump__003.png' },
                { key: 'ninja-jump', frame: 'Jump__004.png' },
                { key: 'ninja-jump', frame: 'Jump__005.png' },
                { key: 'ninja-jump', frame: 'Jump__006.png' },
                { key: 'ninja-jump', frame: 'Jump__007.png' },
                { key: 'ninja-jump', frame: 'Jump__008.png' },
                { key: 'ninja-jump', frame: 'Jump__009.png' },
            ],
            frameRate: 60,
            repeat: 0
        });
        this.anims.create({
            key: 'ninja-glide',
            frames: [
                { key: 'ninja-glide', frame: "Glide__000.png" },
                { key: 'ninja-glide', frame: "Glide__001.png" },
                { key: 'ninja-glide', frame: 'Glide__002.png' },
                { key: 'ninja-glide', frame: 'Glide__003.png' },
                { key: 'ninja-glide', frame: 'Glide__004.png' },
                { key: 'ninja-glide', frame: 'Glide__005.png' },
                { key: 'ninja-glide', frame: 'Glide__006.png' },
                { key: 'ninja-glide', frame: 'Glide__007.png' },
                { key: 'ninja-glide', frame: 'Glide__008.png' },
                { key: 'ninja-glide', frame: 'Glide__009.png' },
            ],
            frameRate: 60,
            repeat: -1
        });
        /*
        this.anims.create({
            key: 'ninja-attack',
            frames: [
                { key: 'ninja-attack', frame: "Attack__000.png" },
                { key: 'ninja-attack', frame: "Attack__001.png" },
                { key: 'ninja-attack', frame: 'Attack__002.png' },
                { key: 'ninja-attack', frame: 'Attack__003.png' },
                { key: 'ninja-attack', frame: 'Attack__004.png' },
                { key: 'ninja-attack', frame: 'Attack__005.png' },
                { key: 'ninja-attack', frame: 'Attack__006.png' },
                { key: 'ninja-attack', frame: 'Attack__007.png' },
                { key: 'ninja-attack', frame: 'Attack__008.png' },
                { key: 'ninja-attack', frame: 'Attack__009.png' },
            ],
            frameRate: 60,
            repeat: 1
        });
        */
        this.anims.create({
            key: 'ninja-jump-attack',
            frames: [
                { key: 'ninja-jump-attack', frame: "Jump_Attack__000.png" },
                { key: 'ninja-jump-attack', frame: "Jump_Attack__001.png" },
                { key: 'ninja-jump-attack', frame: 'Jump_Attack__002.png' },
                { key: 'ninja-jump-attack', frame: 'Jump_Attack__003.png' },
                { key: 'ninja-jump-attack', frame: 'Jump_Attack__004.png' },
                { key: 'ninja-jump-attack', frame: 'Jump_Attack__005.png' },
                { key: 'ninja-jump-attack', frame: 'Jump_Attack__006.png' },
                { key: 'ninja-jump-attack', frame: 'Jump_Attack__007.png' },
                { key: 'ninja-jump-attack', frame: 'Jump_Attack__008.png' },
                { key: 'ninja-jump-attack', frame: 'Jump_Attack__009.png' },
            ],
            frameRate: 60,
            repeat: 0
        })

        // Cloud animation
        this.anims.create({
            key: 'cloud-1',
            frames: [
                { key: 'cloud-1', frame: "cloud_shape3_1.png" },
                { key: 'cloud-1', frame: "cloud_shape3_2.png" },
                { key: 'cloud-1', frame: 'cloud_shape3_3.png' },
                { key: 'cloud-1', frame: 'cloud_shape3_4.png' }
            ],
            frameRate: 10,
            repeat: 1
        });

        this.time.addEvent({
            callback: this.createNewWord,
            callbackScope: this,
            delay: 2000, // 1000 = 1 second
            loop: true
        });

        this.camera = this.cameras.main;

        this.background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');

        // Finish creating animations

        // Create a camera
        this.camera = this.cameras.main;



        // Add a sprite that uses the animation
        this.player = this.add.sprite(this.Player_Pos.x, this.Player_Pos.y, 'ninja-run').setScale(0.4);

        // Play the 'run' animation
        this.player.anims.play('ninja-run');

        // Track user's input

        this.add.text(
            window.innerWidth / 2,
            window.innerHeight - 200,
            this.inputString,
            { color: '#0000FF', fontSize: '32px', fontStyle: 'bold' }
        )

        this.input.keyboard!.on('keydown', (event) => {
            if (this.onKeyDown === true) return;
            this.onKeyDown = true
            console.log(event.key)
            if (event.key === " ") this.handleSpace();
            if (this.Char_Arr.includes(event.key)) {
                this.handleAlphabet(event.key)
            }
            if (event.key === "Backspace") this.handleBackSpace()
            if (event.key === "Delete") this.inputString = ""
            console.log(this.inputString);
            this.onKeyDown = false
        });

        EventBus.emit('current-scene-ready', this);
    }

    random(numbers: number[]) {
        return numbers[Math.floor(Math.random() * numbers.length)];
    }

    private handleBackSpace() {
        if (this.inputString.length === 0) return
        this.inputString = this.inputString.slice(0, -1)
    }

    private handleAlphabet(ch: string) {
        this.inputString += ch;
        // TODO: Update Word
    }

    private handleSpace() {
        if (this.inputString === '-') {
            this.inputString = ""
            this.jump = true;
            this.onJumpUp = true;
        } else {
            for (const word of this.words) {
                if (word.toBeDestroyed) continue
                if (word.checkComplete(this.inputString)) {
                    word.toBeDestroyed = true
                    word.stopMoving()
                    if (this.jump) {
                        this.player.x = word.x;
                        this.player.y = word.y;
                        this.player.anims.play('ninja-jump-attack')
                            .on("animationcomplete", () => {
                                word.destroy()
                                //return to original motion
                                this.player.anims.play('ninja-run');
                                this.jump = false;
                                this.onJumpDown = false;
                                this.onJumpUp = false
                            })

                    } else {
                        this.player.x = word.x;
                        this.player.y = word.y;
                        this.player.anims.play('ninja-jump-attack')
                            .on("animationcomplete", () => {
                                word.destroy()
                                //return to original motion
                                this.player.anims.play('ninja-run');
                            })
                    }
                    this.inputString = "";
                    return
                }
            }
        }
    }

    update() {
        if (this.jump === true && this.player.y > this.Player_Pos.y - this.Min_Jump_Height) {
            if (this.onJumpUp) {
                this.player.y -= 50
                if (this.player.y <= this.Player_Pos.y - this.Min_Jump_Height) {
                    this.onJumpDown = true
                    this.onJumpUp = false
                    this.player.anims.play("ninja-glide")
                }
            }
        }

        if (this.jump === true && this.onJumpDown === true && this.player.y <= this.Player_Pos.y) {
            this.player.y += 5
            if (this.player.y >= this.Player_Pos.y) {
                this.player.y = this.Player_Pos.y
                this.jump = false
                this.onJumpDown = false
                this.player.anims.play("ninja-run")
            }
        }


        if (this.player.y < this.Player_Pos.y && this.jump === false) {
            this.player.y += 60;
        }

        // move back to starting position
        if (this.player.x > this.Player_Pos.x && this.jump === false) {
            this.player.x -= 10;
        }
    }

    changeScene() {
        this.scene.start('GameOver');
    }

    createNewWord() {
        const word = pickRandomWord();

        this.words.push(new Word(this, word, window.innerWidth, window.innerHeight / 2))
    }
}