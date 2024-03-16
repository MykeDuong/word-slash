import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Sprite;
    cloud: Phaser.GameObjects.Sprite;
    cloud_list: Phaser.GameObjects.Sprite[] = [];
    current_word: string = "spring";
    frame_counter: number = 0;
    jump: boolean = false; //manage jump state of ninja
    input_string: string = ""; //manahe input string
    spacebar_pressed: boolean = false;

    cur_cloud_x: number = 0;
    cur_cloud_y: number = 0;
    preload() {
        this.load.atlas('ninja-run', 'assets/ninja-run.png', 'assets/ninja-run.json');
        this.load.atlas('ninja-jump', 'assets/ninja-jump.png', 'assets/ninja-jump.json');
        this.load.atlas('ninja-attack', 'assets/ninja-attack.png', 'assets/ninja-attack.json');
        this.load.atlas('ninja-jump-attack', 'assets/ninja-jump-attack.png', 'assets/ninja-jump-attack.json');
        this.load.atlas('cloud-1', 'assets/cloud-1.png', 'assets/cloud-1.json');
    }


    constructor () {
        super('Game');
    }

    create () {

        // Create animations
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
        
        // Create jump animation
        this.anims.create({
            key: 'ninja-jump',
            frames: [
                { key: 'ninja-jump',frame:"Jump__000.png"},
                { key: 'ninja-jump',frame:"Jump__001.png"},
                { key: 'ninja-jump',frame:'Jump__002.png'},
                { key: 'ninja-jump',frame:'Jump__003.png'},
                { key: 'ninja-jump',frame:'Jump__004.png'},
                { key: 'ninja-jump',frame:'Jump__005.png'},
                { key: 'ninja-jump',frame:'Jump__006.png'},
                { key: 'ninja-jump',frame:'Jump__007.png'},
                { key: 'ninja-jump',frame:'Jump__008.png'},
                { key: 'ninja-jump',frame:'Jump__009.png'},
            ],
            frameRate: 60,
            repeat: -1
        });
        
        this.anims.create({
            key: 'ninja-attack',
            frames: [
                { key: 'ninja-attack',frame:"Attack__000.png"},
                { key: 'ninja-attack',frame:"Attack__001.png"},
                { key: 'ninja-attack',frame:'Attack__002.png'},
                { key: 'ninja-attack',frame:'Attack__003.png'},
                { key: 'ninja-attack',frame:'Attack__004.png'},
                { key: 'ninja-attack',frame:'Attack__005.png'},
                { key: 'ninja-attack',frame:'Attack__006.png'},
                { key: 'ninja-attack',frame:'Attack__007.png'},
                { key: 'ninja-attack',frame:'Attack__008.png'},
                { key: 'ninja-attack',frame:'Attack__009.png'},
            ],
            frameRate: 60,
            repeat: 1
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
            frameRate: 20,
            repeat: 1
        });

        this.anims.create({
            key: 'cloud-1',
            frames: [
                { key: 'cloud-1',frame:"cloud_shape3_1.png"},
                { key: 'cloud-1',frame:"cloud_shape3_2.png"},
                { key: 'cloud-1',frame:'cloud_shape3_3.png'},
                { key: 'cloud-1',frame:'cloud_shape3_4.png'}
            ],
            frameRate: 10,
            repeat: 1
        });
        // Finish creating animations
        

        // var frameNames = this.textures.get('ninja').getFrameNames();
        // console.log('framenames', frameNames);

        // Create a camera
        this.camera = this.cameras.main;

        // Set the background color to green
        this.camera.setBackgroundColor(0x00ff00);

        // Add a background image
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
        this.player = this.add.sprite(200, 400, 'ninja-run').setScale(0.1);
        
        this
        // Play the 'run' animation
        this.player.anims.play('ninja-run');
        
        EventBus.emit('current-scene-ready', this);
    }
    random(numbers: number[]){
        return numbers[Math.floor(Math.random()*numbers.length)];
    }
    keyboardInput(){
        let keyObj = this.input.keyboard.addKey('SPACE');  // Get key object
        if (Phaser.Input.Keyboard.JustDown(keyObj))
        {
            this.spacebar_pressed = true;
        } 
        
        // Add keyboard input for letters
        let char_arr: string[] = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        for (let i = 0; i < char_arr.length; i++){
            keyObj = this.input.keyboard.addKey(char_arr[i].toUpperCase()); 
            if (Phaser.Input.Keyboard.JustDown(keyObj))
            {
                this.input_string += char_arr[i];
                console.log(this.input_string);
            }
        }
        keyObj = this.input.keyboard.addKey('MINUS');
        if (Phaser.Input.Keyboard.JustDown(keyObj))
        {
            this.input_string += '-';
            console.log(this.input_string);
        }
        // Add keyboard input for backspace
        keyObj = this.input.keyboard.addKey('BACKSPACE');
        if (Phaser.Input.Keyboard.JustDown(keyObj))
        {
            this.input_string = this.input_string.slice(0, -1);
            console.log(this.input_string);
        }
    }

    gameLogic(){
        // match current word with input string
        let error_flag: boolean = false;
        if (this.input_string[0] != '-'){
            for (let i = 0; i < this.input_string.length; i++){
                if (error_flag || this.input_string[i] != this.current_word[i]){
                    //highlight error character
                } else {
                    //highlight correct character
               }
            }
        }
 

        if (this.spacebar_pressed){
            this.spacebar_pressed = false;
            if (this.input_string[0] == '-'){
                if (this.input_string === "-air"){
                    console.log("air here");
                    // perform the jump
                    this.player.anims.play('ninja-jump');
                    this.jump = true;
                }
            }
            else if (this.input_string === this.current_word){
                console.log("match");
                if(this.jump){
                    this.player.anims.play('ninja-jump-attack');
                    console.log(this.cur_cloud_x, this.cur_cloud_y)
                    //get to cloud
                    this.player.y = this.cur_cloud_x;
                    this.player.x = this.cur_cloud_y;
                    this.player.anims.play('ninja-run');
                    this.jump = false;
                } else {
                    this.player.anims.play('ninja-attack');
                    console.log(this.cur_cloud_x, this.cur_cloud_y)
                    //dash to target
                    this.player.x = this.cur_cloud_y;
                    this.player.y = this.cur_cloud_x;
                    //return to original motion
                    this.player.anims.play('ninja-run');
                }
            }
            this.input_string = "";
        }

    }
    update(){
        // set world speed 
        let worldSpeed: number = 3;

        for (let i = 0; i < this.cloud_list.length; i++){
            this.cloud_list[i].x -= worldSpeed;
            if (this.cloud_list[i].x < 100){
                this.cloud_list[i].destroy();
                this.cloud_list.splice(i, 1);
            }
        }
        // falling back to ground if jump is not initiated. 
        if (this.player.y < 400 && this.jump == false){
            this.player.y += 60;
        }

        // move back to starting position
        if (this.player.x > 200){
            this.player.x -= 10;
        }

        // add new cloud
        if (this.frame_counter % 30 == 0){
            let temp: number = this.random([300,400,500]);
            this.cloud_list.push(this.add.sprite(1200, temp, 'cloud-1').setScale(1));
        }
        //update position of nearest cloud
        this.cur_cloud_x = this.cloud_list[0].x;
        this.cur_cloud_y = this.cloud_list[0].y;
        // Setting keyboard input
        this.keyboardInput();
        // reading keyboard input
        this.gameLogic();
        this.frame_counter += 1;
    }

    changeScene () {
        this.scene.start('GameOver');
    }
}