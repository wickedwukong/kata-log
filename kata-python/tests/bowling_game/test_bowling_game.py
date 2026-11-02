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


def test_score_a_single_roll():
    assert BowlingGame().roll(0).score() == 0
    assert BowlingGame().roll(5).score() == 5
    assert BowlingGame().roll(10).score() == 10


def test_spare_has_the_next_roll_as_a_bonus_added():
    bowling_game = BowlingGame()
    assert bowling_game.roll(5).score() == 5
    assert bowling_game.roll(5).score() == 10
    assert bowling_game.roll(5).score() == 20
    assert bowling_game.roll(5).score() == 25


def test_strike_has_the_next_roll_or_2_rolls_as_a_bonus_added():
    bowling_game = BowlingGame()
    assert bowling_game.roll(10).score() == 10
    assert bowling_game.roll(5).score() == 20
    assert bowling_game.roll(5).score() == 30


# Frames are separated by "|". A strike or spare that still waits for its
# bonus rolls only counts the pins rolled so far.
@pytest.mark.parametrize(
    "frames, rolls, expected",
    [
        (
            "3,4 | X | 5,3 (full last frame)",
            [3, 4, 10, 5, 3],
            7 + (10 + 5 + 3) + 8,
        ),
        (
            "3,4 | X | 5 (half last frame)",
            [3, 4, 10, 5],
            7 + (10 + 5) + 5,
        ),
        (
            "6,/ | 7,2 | 5,/ | 3,4 (full last frame)",
            [6, 4, 7, 2, 5, 5, 3, 4],
            6 + 4 + 7 + 9 + (5 + 5 + 3) + 7,
        ),
        (
            "6,/ | 7,2 | 5,/ | 3 (half last frame)",
            [6, 4, 7, 2, 5, 5, 3],
            6 + 4 + 7 + 9 + (5 + 5 + 3) + 3,
        ),
        (
            "X | X | X | 3,6 (full last frame)",
            [10, 10, 10, 3, 6],
            10 + 10 + 10 + (10 + 10 + 3) + (10 + 3 + 6) + 9,
        ),
        (
            "X | X | X | 3 (half last frame)",
            [10, 10, 10, 3],
            10 + 10 + 10 + (10 + 10 + 3) + (10 + 3) + 3,
        ),
    ],
)
def test_scores_frames(
    game: BowlingGame, frames: str, rolls: list[int], expected: int
):
    for pins in rolls:
        game.roll(pins)

    assert game.score() == expected


def test_scores_x_spare_open_strike_open_spare_full_last_frame(
    game: BowlingGame,
):
    rolls = [10, 7, 3, 9, 0, 10, 0, 8, 8, 2, 6, 1]
    for pins in rolls:
        game.roll(pins)

    assert (
        game.score()
        == 10 + 7 + 3 + (7 + 3 + 9) + 9 + (10 + 0 + 8) + 8 + (8 + 2 + 6) + 7
    )


def test_scores_x_spare_open_strike_open_spare_half_last_frame(
    game: BowlingGame,
):
    rolls = [10, 7, 3, 9, 0, 10, 0, 8, 8, 2, 6]
    for pins in rolls:
        game.roll(pins)

    assert (
        game.score()
        == 10 + 7 + 3 + (7 + 3 + 9) + 9 + (10 + 0 + 8) + 8 + (8 + 2 + 6) + 6
    )


def test_strike_bonus_counts_a_gutter_ball_as_the_second_roll_of_the_next_frame(
    game: BowlingGame,
):
    rolls = [10, 9, 0, 5]
    for pins in rolls:
        game.roll(pins)

    assert game.score() == 10 + 9 + 0 + (9 + 0) + 5


class TestTenFrameLimit:
    def test_perfect_game_of_twelve_strikes_scores_300(
        self, game: BowlingGame
    ):
        roll_many(game, 12, 10)

        assert game.score() == 300

    def test_all_spares_with_a_bonus_roll_of_5_scores_150(
        self, game: BowlingGame
    ):
        roll_many(game, 21, 5)

        assert game.score() == 150

    def test_strike_in_the_10th_frame_earns_two_bonus_rolls_that_are_not_scored_as_frames(
        self, game: BowlingGame
    ):
        roll_many(game, 18, 0)
        game.roll(10).roll(10).roll(10)

        assert game.score() == 10 + 10 + 10

    def test_strike_in_the_10th_frame_adds_a_bonus_of_two_open_rolls(
        self, game: BowlingGame
    ):
        roll_many(game, 18, 0)
        game.roll(10).roll(3).roll(4)

        assert game.score() == 10 + 3 + 4

    def test_spare_in_the_10th_frame_earns_one_bonus_roll_that_is_not_scored_as_a_frame(
        self, game: BowlingGame
    ):
        roll_many(game, 18, 0)
        game.roll(5).roll(5).roll(7)

        assert game.score() == 5 + 5 + 7

    def test_open_10th_frame_earns_no_bonus_roll(self, game: BowlingGame):
        roll_many(game, 18, 0)
        game.roll(3).roll(4)

        assert game.score() == 3 + 4

    def test_scores_a_full_game_with_strikes_spares_and_open_frames(
        self, game: BowlingGame
    ):
        # X | 9,/ | 5,/ | 7,2 | X | X | X | 9,- | 8,/ | 9,/,X
        rolls = [10, 9, 1, 5, 5, 7, 2, 10, 10, 10, 9, 0, 8, 2, 9, 1, 10]
        for pins in rolls:
            game.roll(pins)

        assert game.score() == 187

    def test_rejects_a_roll_after_an_open_10th_frame(self, game: BowlingGame):
        roll_many(game, 20, 0)

        with pytest.raises(Exception):
            game.roll(1)

    def test_rejects_a_roll_after_the_10th_frames_bonus_rolls(
        self, game: BowlingGame
    ):
        roll_many(game, 18, 0)
        game.roll(10).roll(10).roll(10)

        with pytest.raises(Exception):
            game.roll(1)
