const LAST_FRAME_NUMBER = 10;

function sum(points: number[]): number {
  return points.reduce((acc, cur) => acc + cur, 0);
}

class Frame {
  private readonly firstRoll: number;
  private secondRoll?: number;
  private next?: Frame;

  constructor(firstRoll: number) {
    this.firstRoll = firstRoll;
  }

  totalScore(framesLeft = LAST_FRAME_NUMBER): number {
    if (framesLeft === 0) {
      return 0;
    }

    return (
      this.points() + (this.next ? this.next.totalScore(framesLeft - 1) : 0)
    );
  }

  add(pins: number): Frame {
    if (this.next) {
      this.next.add(pins);
    } else if (this.isComplete()) {
      this.next = new Frame(pins);
    } else {
      this.secondRoll = pins;
    }

    return this;
  }

  totalFrames(): number {
    return 1 + (this.next?.totalFrames() ?? 0);
  }

  private points(): number {
    const bonus = this.next?.rollsFromHere(this.bonusCount()) ?? [];
    return sum([...this.ownRolls(), ...bonus]);
  }

  isStrike(): boolean {
    return this.firstRoll === 10;
  }

  isSpare(): boolean {
    return (
      this.secondRoll !== undefined && this.firstRoll + this.secondRoll === 10
    );
  }

  isGameOver(): boolean {
    const frameCount = this.totalFrames();
    if (frameCount < LAST_FRAME_NUMBER) {
      return false;
    }

    const tenthFrame = this.frameAt(LAST_FRAME_NUMBER);
    const lastFrame = this.lastFrame();

    if (frameCount === LAST_FRAME_NUMBER) {
      if (!tenthFrame.isComplete()) {
        return false;
      }
      return !tenthFrame.isStrike() && !tenthFrame.isSpare();
    }

    if (frameCount === LAST_FRAME_NUMBER + 1) {
      if (tenthFrame.isSpare()) {
        return true;
      }
      return lastFrame.isComplete() && !lastFrame.isStrike();
    }

    return true;
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

  private rollsFromHere(count: number): number[] {
    const rolls = this.ownRolls().slice(0, count);
    const missing = count - rolls.length;

    const missingRolls = this.next?.rollsFromHere(missing) ?? [];

    return [...rolls, ...missingRolls];
  }

  private isComplete() {
    return this.isStrike() || this.secondRoll !== undefined;
  }

  private lastFrame() {
    let current: Frame = this;
    let next = this.next;
    while (next !== undefined) {
      current = next;
      next = current.next;
    }
    return current;
  }

  private frameAt(count: number): Frame {
    let current: Frame = this;
    for (let i = 1; i < count && current.next !== undefined; i++) {
      current = current.next;
    }
    return current;
  }
}

export class BowlingGame {
  private firstFrame?: Frame;

  roll(pins: number): BowlingGame {
    if (this.firstFrame?.isGameOver()) {
      throw new Error(
        `The game is over: all ${LAST_FRAME_NUMBER} frames have been played`,
      );
    }

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
