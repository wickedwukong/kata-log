import pytest

from roman_numerals.roman_numerals import to_roman


@pytest.mark.parametrize(
    "number, expected",
    [
        (1, "I"),
        (2, "II"),
        (3, "III"),
        (4, "IV"),
        (5, "V"),
        (6, "VI"),
        (7, "VII"),
        (8, "VIII"),
        (9, "IX"),
        (10, "X"),
    ],
)
def test_converts_single_digits(number: int, expected: str):
    assert to_roman(number) == expected


@pytest.mark.parametrize(
    "number, expected",
    [
        (11, "XI"),
        (12, "XII"),
        (13, "XIII"),
        (14, "XIV"),
        (15, "XV"),
        (16, "XVI"),
        (17, "XVII"),
        (18, "XVIII"),
        (19, "XIX"),
    ],
)
def test_converts_numbers_from_10_to_19(number: int, expected: str):
    assert to_roman(number) == expected


@pytest.mark.parametrize(
    "number, expected",
    [
        (20, "XX"),
        (30, "XXX"),
        (40, "XL"),
        (50, "L"),
        (90, "XC"),
        (100, "C"),
        (400, "CD"),
        (900, "CM"),
        (2000, "MM"),
        (3000, "MMM"),
    ],
)
def test_converts_tens_hundreds_and_thousands(number: int, expected: str):
    assert to_roman(number) == expected


@pytest.mark.parametrize(
    "number, expected",
    [
        (39, "XXXIX"),
        (246, "CCXLVI"),
        (789, "DCCLXXXIX"),
        (2421, "MMCDXXI"),
        (3888, "MMMDCCCLXXXVIII"),
        (3999, "MMMCMXCIX"),
    ],
)
def test_converts_mixed_numbers_across_all_places(number: int, expected: str):
    assert to_roman(number) == expected
