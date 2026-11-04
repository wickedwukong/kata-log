import { describe, expect, test } from "vitest";
import { toRoman } from "../../src/roman-numerals/roman-numerals.ts";

describe("converting single digit to roman numerals", () => {
  const cases: [number, string][] = [
    [1, "I"],
    [2, "II"],
    [3, "III"],
    [4, "IV"],
    [5, "V"],
    [6, "VI"],
    [7, "VII"],
    [8, "VIII"],
    [9, "IX"],
    [10, "X"],
  ];

  test.each(cases)("converts %i to %s", (number, expected) => {
    expect(toRoman(number)).toBe(expected);
  });
});

describe("converting numbers from 10 to 19 to roman numerals", () => {
  const cases: [number, string][] = [
    [11, "XI"],
    [12, "XII"],
    [13, "XIII"],
    [14, "XIV"],
    [15, "XV"],
    [16, "XVI"],
    [17, "XVII"],
    [18, "XVIII"],
    [19, "XIX"],
  ];

  test.each(cases)("converts %i to %s", (number, expected) => {
    expect(toRoman(number)).toBe(expected);
  });
});

describe("converting tens, hundreds and thousands", () => {
  const cases: [number, string][] = [
    [20, "XX"],
    [30, "XXX"],
    [40, "XL"],
    [50, "L"],
    [90, "XC"],
    [100, "C"],
    [400, "CD"],
    [900, "CM"],
    [2000, "MM"],
    [3000, "MMM"],
  ];

  test.each(cases)("converts %i to %s", (number, expected) => {
    expect(toRoman(number)).toBe(expected);
  });
});

describe("converting mixed numbers across all places", () => {
  const cases: [number, string][] = [
    [39, "XXXIX"],
    [246, "CCXLVI"],
    [789, "DCCLXXXIX"],
    [2421, "MMCDXXI"],
    [3888, "MMMDCCCLXXXVIII"],
    [3999, "MMMCMXCIX"],
  ];

  test.each(cases)("converts %i to %s", (number, expected) => {
    expect(toRoman(number)).toBe(expected);
  });
});
