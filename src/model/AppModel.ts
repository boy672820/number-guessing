import PositiveIntegerGenerator from '../console/interface/PositiveIntegerGenerator.ts';
import { selectModeMessageArr } from './constants.ts';
import { TextBuffer } from '../utils/TextEncoder.ts';

interface Processor {
  run(input: Uint8Array): Processor;
}

export class AppModel {
  private completed: boolean;
  private output: Uint8Array;
  private input: Uint8Array | null;
  private generator: PositiveIntegerGenerator;
  private processor: Processor;

  get isCompleted() {
    return this.completed;
  }

  constructor(generator: PositiveIntegerGenerator) {
    this.completed = false;
    this.output = TextBuffer.encode(selectModeMessageArr.join('\n'));
    this.input = null;

    this.generator = generator;
    this.processor = this.selectGameMode.bind(this);
  }

  public async writeOutput() {
    await Deno.stdout.write(this.output);
  }

  public async readInput() {
    const buffer = new Uint8Array(1024);
    // Reads up to 1024 bytes from the input stream.
    const n = <number>await Deno.stdin.read(buffer);
    // Decode the bytes into a string.

    this.input = buffer.subarray(0, n);
  }

  public process() {
    this.processor.run(this.input);
  }

  private selectGameMode(rawInput: Uint8Array): Processor {
    if (this.input === null) {
      return;
    }

    const input = TextBuffer.decode(rawInput).trim();

    switch (input) {
      case '1': {
        const random = this.generator.generateLessThanOrEqualToHundred();

        return this.getSinglePlayerGame(random, 1);
      }

      case '2': {
        const random = this.generator.generateLessThanOrEqualToHundred();

        return this.getMultiPlayerGame(random, 1);
      }
      case '3': {
        return this.exit();
      }

      default: {
        return this.invalidInput(input);
      }
    }
  }

  private exit() {
    this.completed = true;
    console.log('Thank you for playing!');
  }

  private invalidInput(): Processor {
    return (input: Uint8Array) => {
      this.output = TextBuffer.encode(`\n'${input}' is invalid input\n`);
    };
  }

  private getSinglePlayerGame(answer: number, tries: number): Processor {
    return (input: Uint8Array) => {
      const guess = Number(TextBuffer.decode(input).trim());
      this.output = TextBuffer.encode(`Single player game: ${guess}`);

      // if (guess < answer) {
      //   this.output = TextBuffer.encode(`Too low! ${tries} tries left.`);
      //   this.getSinglePlayerGame(answer, tries + 1);
      // }
    };
  }

  private getMultiPlayerGame(answer: string, tries: number) {
    this.output = TextBuffer.encode(`Multiplayer game: ${this.input}`);
  }
}
