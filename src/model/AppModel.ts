import PositiveIntegerGenerator from '../console/interface/PositiveIntegerGenerator.ts';
import { selectModeMessageArr } from './constants.ts';
import { TextBuffer } from '../utils/TextEncoder.ts';

// type Processor = (input: Uint8Array) => Processor;
interface Processor {
  run(input: Uint8Array): Processor | null;
}

export class AppModel {
  private completed: boolean;
  private output: Uint8Array;
  private processor: Processor;

  get isCompleted() {
    return this.completed;
  }

  constructor(private readonly generator: PositiveIntegerGenerator) {
    this.completed = false;
    this.output = TextBuffer.encode(selectModeMessageArr.join('\n'));

    this.generator = generator;
    this.processor = this.selectGameMode(new Uint8Array(0));
  }

  public async writeOutput() {
    await Deno.stdout.write(this.output);
  }

  public async processInput() {
    const buffer = new Uint8Array(1024);
    // Reads up to 1024 bytes from the input stream.
    const n = <number>await Deno.stdin.read(buffer);

    this.processor.run(buffer.subarray(0, n));
  }

  private selectGameMode(_: Uint8Array): Processor {
    const random = this.generator.generateLessThanOrEqualToHundred();

    return this.getSinglePlayerGame(random, 1);
  }

  // private exit() {
  //   this.completed = true;
  //   console.log('Thank you for playing!');

  //   return null;
  // }

  // private invalidInput(): Processor {
  //   return {
  //     run: (input: Uint8Array) => {
  //       const decode = TextBuffer.decode(input).trim();
  //       this.output = TextBuffer.encode(`\n'${decode}' is invalid input\n`);

  //       return this.selectGameMode(input);
  //     },
  //   };
  // }

  private getSinglePlayerGame(answer: number, tries: number): Processor {
    return {
      run: (input: Uint8Array) => {
        const guess = Number(TextBuffer.decode(input).trim());

        if (guess < answer) {
          this.output = TextBuffer.encode(`Too low! ${tries} tries left: `);
          return this.getSinglePlayerGame(answer, (tries += 1));
        } else if (guess > answer) {
          this.output = TextBuffer.encode(`Too high! ${tries} tries left: `);
          return this.getSinglePlayerGame(answer, (tries += 1));
        } else {
          console.log(`You got it, Thank you for paying! tries: ${tries}, Guess was: ${guess}`);
          this.completed = true;
          return null;
        }
      },
    };
  }

  // private getMultiPlayerGame(answer: string, tries: number): Processor {
  //   return {
  //     run: (input: Uint8Array): Processor => {
  //       const guess = Number(TextBuffer.decode(input).trim());
  //       this.output = TextBuffer.encode(`Multiplayer game: ${guess}`);

  //       return this.getMultiPlayerGame(answer, tries + 1);
  //     },
  //   };
  // }
}
