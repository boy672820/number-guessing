import { AppModel } from '../model/AppModel.ts';

export class App {
  public static main() {
    const model = new AppModel();

    App.runLoop(model);
  }

  private static async runLoop(model: AppModel): Promise<void> {
    while (!model.isCompleted) {
      await model.writeOutput();
      const input = await model.readInput();

      model.selectGameMode(input);
    }
  }
}
