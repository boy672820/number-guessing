import { selectModeMessageArr } from './constants.ts';
import { TextBuffer } from '../utils/TextEncoder.ts';

export class AppModel {
  private completed: boolean;
  private output: Uint8Array;

  get isCompleted() {
    return this.completed;
  }

  constructor() {
    this.completed = false;
    this.output = TextBuffer.encode(selectModeMessageArr.join('\n'));
  }

  public async writeOutput() {
    await Deno.stdout.write(this.output);
  }

  public async readInput() {
    const buffer = new Uint8Array(1024);
    // Reads up to 1024 bytes from the input stream.
    const n = <number>await Deno.stdin.read(buffer);
    // Decode the bytes into a string.
    const input = TextBuffer.decode(buffer.subarray(0, n)).trim();

    return input;
  }

  public selectGameMode(input: string) {
    switch (input) {
      case '1':
        this.getSinglePlayerGame();
        break;
      case '2':
        break;
      case '3':
        this.exit();
        break;
      default:
        this.completed = true;
        break;
    }
  }

  private exit() {
    this.completed = true;
    console.log('Thank you for playing!');
  }

  private getSinglePlayerGame() {}
}
