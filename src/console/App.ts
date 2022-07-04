import { AppModel } from '../model/AppModel.ts';
import { RandomGenerator } from '../model/RandomGenerator.ts';

export class App {
  public static main() {
    const generator = new RandomGenerator();
    const model = new AppModel(generator);

    App.runLoop(model);
  }

  private static async runLoop(model: AppModel): Promise<void> {
    let i = 0;
    while (!model.isCompleted) {
      await model.writeOutput();
      await model.readInput();

      model.process();

      console.log(i += 1);
    }
  }
}
