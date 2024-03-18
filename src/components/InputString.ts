import { Game } from "../game/scenes/Game";

export default class InputString {
  inputString: string;
  scene: Game
  inputPrinter: Phaser.GameObjects.Text

  constructor(scene: Game, inputString: string) {
    this.inputString = inputString;
    this.scene = scene
    const x = this.scene.cameras.main.centerX;
    const y = this.scene.cameras.main.height - 50; // Adjust the Y position as needed
    this.inputPrinter = this.scene.add.text(x, y, "Current Input: ", { 
      color: '#FFFFFF', fontSize: '32px', fontStyle: 'bold' 
    }).setOrigin(0.5, 1);
  }

  setInput(inputString: string) {
    this.inputString = inputString 
    this.updatePrinter();
  }

  getInput() : string {return this.inputString }

  reset() {
    this.inputString = ''
    this.updatePrinter();
  }

  private updatePrinter() {
    this.inputPrinter.setText(`Current Input: ${this.inputString}`)

  }
}