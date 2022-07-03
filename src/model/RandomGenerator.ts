export class RandomGenerator implements PositiveIntegerGenerator {
  generateLessThanOrEqualToHundred(): number {
    return Math.floor(Math.random() * 100) + 1;
  }
}
