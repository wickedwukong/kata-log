import { beforeEach, describe, expect, test } from "vitest";
import { BowlingGame } from "../../src/bowling-game/bowling-game.ts";

describe("BowlingGame", () => {
  let game: BowlingGame;

  beforeEach(() => {
    game = new BowlingGame();
  });

  function rollMany(times: number, pins: number) {
    for (let i = 0; i < times; i++) {
      game.roll(pins);
    }
  }

  test("gutter game scores zero", () => {
    rollMany(20, 0);

    expect(game.score()).toBe(0);
  });

  test("all ones scores twenty", () => {
    rollMany(20, 1);

    expect(game.score()).toBe(20);
  });
});
