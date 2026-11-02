class Frame {
  private readonly firstRoll: number;
  private secondRoll?: number;
  private next?: Frame;

  constructor(firstRoll: number) {
    this.firstRoll = firstRoll;
  }

  private points(): number {
    if (this.firstRoll === 10) {
      return this.firstRoll + this.next2RollsAfterCurrentFrame();
    }

    const secondRollPoints = this.secondRoll ?? 0;

    if (this.firstRoll + secondRollPoints === 10) {
      return this.next
        ? this.firstRoll + secondRollPoints + this.next?.firstRoll
        : this.firstRoll + secondRollPoints;
    }

    return this.firstRoll + secondRollPoints;
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
