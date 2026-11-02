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
    expect(bowlingGame.roll(5).score()).toBe(25);
  });

  test("strike has the next roll or 2 rolls as a bonus added", () => {
    const bowlingGame = new BowlingGame();
    expect(bowlingGame.roll(10).score()).toBe(10);
    expect(bowlingGame.roll(5).score()).toBe(20);
    expect(bowlingGame.roll(5).score()).toBe(30);
  });

  // Frames are separated by "|". A strike or spare that still waits for its
  // bonus rolls only counts the pins rolled so far.
  test.each([
    {
      frames: "3,4 | X | 5,3 (full last frame)",
      rolls: [3, 4, 10, 5, 3],
      expected: 7 + (10 + 5 + 3) + 8,
    },
    {
      frames: "3,4 | X | 5 (half last frame)",
      rolls: [3, 4, 10, 5],
      expected: 7 + (10 + 5) + 5,
    },
    {
      frames: "6,/ | 7,2 | 5,/ | 3,4 (full last frame)",
      rolls: [6, 4, 7, 2, 5, 5, 3, 4],
      expected: 6 + 4 + 7 + 9 + (5 + 5 + 3) + 7,
    },
    {
      frames: "6,/ | 7,2 | 5,/ | 3 (half last frame)",
      rolls: [6, 4, 7, 2, 5, 5, 3],
      expected: 6 + 4 + 7 + 9 + (5 + 5 + 3) + 3,
    },
    {
      frames: "X | X | X | 3,6 (full last frame)",
      rolls: [10, 10, 10, 3, 6],
      expected: 10 + 10 + 10 + (10 + 10 + 3) + (10 + 3 + 6) + 9,
    },
    {
      frames: "X | X | X | 3 (half last frame)",
      rolls: [10, 10, 10, 3],
      expected: 10 + 10 + 10 + (10 + 10 + 3) + (10 + 3) + 3,
    },
  ])("scores $frames", ({ rolls, expected }) => {
    for (const pins of rolls) {
      game.roll(pins);
    }

    expect(game.score()).toBe(expected);
  });

  test("scores X | 7,/ | 9,- | X | -,8 | 8,/ | 6,1 (full last frame)", () => {
    const rolls = [10, 7, 3, 9, 0, 10, 0, 8, 8, 2, 6, 1];
    for (const pins of rolls) {
      game.roll(pins);
    }

    expect(game.score()).toBe(
      10 + 7 + 3 + (7 + 3 + 9) + 9 + (10 + 0 + 8) + 8 + (8 + 2 + 6) + 7,
    );
  });

  test("scores X | 7,/ | 9,- | X | -,8 | 8,/ | 6 (half last frame)", () => {
    const rolls = [10, 7, 3, 9, 0, 10, 0, 8, 8, 2, 6];
    for (const pins of rolls) {
      game.roll(pins);
    }

    expect(game.score()).toBe(
      10 + 7 + 3 + (7 + 3 + 9) + 9 + (10 + 0 + 8) + 8 + (8 + 2 + 6) + 6,
    );
  });

  test("strike bonus counts a gutter ball as the second roll of the next frame", () => {
    const rolls = [10, 9, 0, 5];
    for (const pins of rolls) {
      game.roll(pins);
    }

    expect(game.score()).toBe(10 + 9 + 0 + (9 + 0) + 5);
  });
});
