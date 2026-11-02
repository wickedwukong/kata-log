import pytest

from bowling_game.bowling_game import BowlingGame


@pytest.fixture
def game() -> BowlingGame:
    return BowlingGame()


def roll_many(game: BowlingGame, times: int, pins: int) -> None:
    for _ in range(times):
        game.roll(pins)


def test_gutter_game_scores_zero(game: BowlingGame):
    roll_many(game, 20, 0)

    assert game.score() == 0


def test_all_ones_scores_twenty(game: BowlingGame):
    roll_many(game, 20, 1)

    assert game.score() == 20
