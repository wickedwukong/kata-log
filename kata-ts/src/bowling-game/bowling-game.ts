class Frame {
  private readonly firstRoll: number;
  private secondRoll?: number;
  public next?: Frame;

  constructor(firstRoll: number) {
    this.firstRoll = firstRoll;
  }

  points(): number {
    if (this.firstRoll === 10) {
      return this.next ? this.firstRoll + this.next.points() : this.firstRoll;
    }

    const secondRollPoints = this.secondRoll ?? 0;

    if (this.firstRoll + secondRollPoints === 10) {
      return this.next
        ? this.firstRoll + secondRollPoints + this.next?.firstRoll
        : this.firstRoll + secondRollPoints;
    }

    return this.firstRoll + secondRollPoints;
  }

  add(pins: number): Frame {
    if (this.firstRoll !== 10 && this.secondRoll) {
      this.next = new Frame(pins);
    } else {
      this.secondRoll = pins;
    }
    return this;
  }

  lastFrame() {
    let last: Frame = this;
    while (last.next) {
      last = last.next;
    }
    return last;
  }
}
class Frames {
  private firstFrame?: Frame;

  add(pins: number): Frames {
    if (this.firstFrame) {
      this.firstFrame.lastFrame().add(pins);
    } else {
      this.firstFrame = new Frame(pins);
    }

    return this;
  }

  score() {
    let total = 0;
    let currentFrame = this.firstFrame;
    while (currentFrame) {
      total += currentFrame.points();
      currentFrame = currentFrame.next;
    }
    return total;
  }
}

export class BowlingGame {
  private readonly frames: Frames = new Frames();

  roll(pins: number): BowlingGame {
    this.frames.add(pins);
    return this;
  }

  score(): number {
    return this.frames.score();
  }
}
