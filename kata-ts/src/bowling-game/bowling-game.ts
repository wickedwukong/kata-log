class Frame {
  private readonly firstRoll: number;
  private secondRoll?: number;
  private next?: Frame;

  constructor(firstRoll: number) {
    this.firstRoll = firstRoll;
  }

  private points(): number {
    const bonus = this.next?.rollsAfter(this.bonusCount()) ?? [];
    return this.sum([...this.ownRolls(), ...bonus]);
  }

  private isStrike(): boolean {
    return this.firstRoll === 10;
  }

  private isSpare(): boolean {
    const secondRollPoints = this.secondRoll ?? 0;
    return this.firstRoll + secondRollPoints === 10;
  }

  private sum(points: number[]): number {
    return points.reduce((acc, cur) => acc + cur, 0);
  }

  totalScore(): number {
    return this.points() + (this.next ? this.next.totalScore() : 0);
  }

  add(pins: number): Frame {
    if (this.next) {
      this.next.add(pins);
    } else if (this.firstRoll === 10 || this.secondRoll !== undefined) {
      this.next = new Frame(pins);
    } else {
      this.secondRoll = pins;
    }

    return this;
  }

  private next2RollsAfterCurrentFrame() {
    if (this.next) {
      return this.next.twoRolls();
    }
    return 0;
  }

  private twoRolls() {
    if (this.secondRoll !== undefined) {
      return this.firstRoll + this.secondRoll;
    } else if (this.next) {
      return this.firstRoll + this.next.firstRoll;
    }

    return this.firstRoll;
  }

  private ownRolls() {
    return this.secondRoll === undefined
      ? [this.firstRoll]
      : [this.firstRoll, this.secondRoll];
  }

  private bonusCount() {
    if (this.isStrike()) {
      return 2;
    } else if (this.isSpare()) {
      return 1;
    }

    return 0;
  }

  private rollsAfter(count: number) {
    const rolls: number[] = [
      ...this.ownRolls(),
      ...(this.next?.rollsAfter(count) ?? []),
    ];
    return rolls.slice(0, count);
  }
}

export class BowlingGame {
  private firstFrame?: Frame;

  roll(pins: number): BowlingGame {
    if (this.firstFrame) {
      this.firstFrame.add(pins);
    } else {
      this.firstFrame = new Frame(pins);
    }

    return this;
  }

  score(): number {
    return this.firstFrame?.totalScore() ?? 0;
  }
}
