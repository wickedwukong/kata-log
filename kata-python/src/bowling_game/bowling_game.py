class BowlingGame:
    def __init__(self) -> None:
        self._rolls: list[int] = []

    def roll(self, pins: int) -> "BowlingGame":
        self._rolls.append(pins)
        return self

    def score(self) -> int:
        return sum(self._rolls)
