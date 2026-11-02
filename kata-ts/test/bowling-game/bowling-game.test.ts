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

  test("score a single roll", () => {
    expect(new BowlingGame().roll(0).score()).toBe(0);
    expect(new BowlingGame().roll(5).score()).toBe(5);
    expect(new BowlingGame().roll(10).score()).toBe(10);
  });

  test("spare has the next roll as a bonus added", () => {
    const bowlingGame = new BowlingGame();
    expect(bowlingGame.roll(5).score()).toBe(5);
    expect(bowlingGame.roll(5).score()).toBe(10);
    expect(bowlingGame.roll(5).score()).toBe(20);
  });

  test("strike has the next roll or 2 rolls as a bonus added", () => {
    const bowlingGame = new BowlingGame();
    expect(bowlingGame.roll(10).score()).toBe(10);
    expect(bowlingGame.roll(5).score()).toBe(20);
    expect(bowlingGame.roll(5).score()).toBe(30);
  });
});
