import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import pickRandomWord from '../../utils/randomWords.ts';
import Word from '../../components/Word.ts';
import HealthBar from '../../components/HealthBar.ts';


export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    words: Word[];
    sprite_list: Phaser.GameObjects.Sprite[] = [];

    sprite: Phaser.GameObjects.Sprite;
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
    healthbar: HealthBar
    backdrop: Phaser.GameObjects.TileSprite


    readonly Player_Pos = { x: 200, y: 600 };
    readonly Min_Jump_Height = 500
    readonly Char_Arr: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'];

    cur_cloud_x: number = 0;
    cur_cloud_y: number = 0;
    speed_to_x: number = 0;
    speed_to_y: number = 0;
    dash_to_target: boolean = false;
    dash_time: number = 500;
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
            repeat: 0
        });

        this.time.addEvent({
            callback: this.createNewWord,
            callbackScope: this,
            delay: 2000, // 1000 = 1 second
            loop: true
        });
        this.camera = this.cameras.main;

        this.backdrop = this.add.tileSprite(0, 0, 0, 0, 'dark-forest').setOrigin(0, 0)

        this.add.rectangle(0, 1190, window.innerWidth * 2, 1000, 0x000000),

            // Finish creating animations

            // Create a camera
            this.camera = this.cameras.main;

        // Add a sprite that uses the animation
        this.player = this.add.sprite(this.Player_Pos.x, this.Player_Pos.y, 'ninja-run').setScale(0.4);
        // Play the 'run' animation
        this.player.anims.play('ninja-run');

        // Health bar
        this.healthbar = new HealthBar(this)


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
    temp() {
        this.sprite = this.add.sprite(45, 5, 'cloud-1');
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
                if (!word.canDestroy(this.jump)) continue;
                if (word.checkComplete(this.inputString)) {
                    word.toBeDestroyed = true
                    word.stopMoving()
                    this.cur_cloud_x = word.x;
                    this.cur_cloud_y = word.y;

                    if (this.jump) {
                        this.dash_to_target = true;
                        this.player.anims.play('ninja-run');
                        this.teleportToTarget(word.x, word.y);
                        setTimeout(() => this.player.anims.play('ninja-jump-attack')
                            .on("animationcomplete", () => {
                                word.playAnimation('cloud-1').on("animationcomplete", () => {
                                    word.destroyNew();
                                })

                                this.dash_to_target = false;
                                //return to original motion
                                this.player.anims.play('ninja-run');
                                this.jump = false;
                                this.onJumpDown = false;
                                this.onJumpUp = false
                            }), this.dash_time);

                    } else {
                        this.dash_to_target = true;
                        this.teleportToTarget(word.x, word.y);
                        setTimeout(() => this.player.anims.play('ninja-jump-attack')
                            .on("animationcomplete", () => {
                                word.playAnimation('cloud-1').on("animationcomplete", () => {
                                    word.destroyNew();
                                })
                                this.dash_to_target = false;
                                //return to original motion
                                this.player.anims.play('ninja-run');
                            }), this.dash_time);

                    }
                    this.inputString = "";
                    return
                }
            }
        }
        this.inputString = ""
    }

    teleportToTarget(x: number, y: number) {
        this.dash_time = Math.sqrt((x - this.player.x) * (x - this.player.x) + (y - this.player.y) * (y - this.player.y)) / 6;
        this.speed_to_x = (x - this.player.x) * 25 / this.dash_time;
        this.speed_to_y = (y - this.player.y) * 25 / this.dash_time;
        console.log(this.speed_to_x, this.speed_to_y);
        this.dash_to_target = true;
        console.log(this.dash_to_target);
    }

    update() {
        this.backdrop.tilePositionX += 0.5;

        if (this.dash_to_target && this.player.x <= this.cur_cloud_x) {
            this.player.x += this.speed_to_x;
            this.player.y += this.speed_to_y;
            console.log("execute dash");
        } else if (this.dash_to_target) {
            this.dash_to_target = false;
        } else {
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

            if (this.player.y < this.Player_Pos.y && this.onJumpDown === true && this.player.x > this.Player_Pos.x) {
                this.player.x -= 5;
            }

            if (this.player.y < this.Player_Pos.y && this.jump === false) {
                this.player.y += 60;
                if (this.player.y > this.Player_Pos.y) {
                    this.player.y = this.Player_Pos.y
                }
            }

            // move back to starting position
            if (this.player.x > this.Player_Pos.x && this.jump === false) {
                this.player.x -= 10;
            }
        }
    }

    changeScene() {
        this.scene.start('GameOver');
    }
    airOrNot() {
        return Math.round(Math.random()) == 1
    }
    createNewWord() {
        const word = pickRandomWord();
        let wordText = new Word(this, word, window.innerWidth, window.innerHeight / 2 - 400, this.airOrNot());
        this.words.push(wordText);

    }
}