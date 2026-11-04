ALL_PINS = 10
TEN_FRAMES = 10


class Frame:
    def __init__(self, pins: int):
        self._first_roll = pins
        self._second_roll = None
        self.next_frame = None

    def add(self, pins: int) -> "Frame":
        if self._is_strike() or self._is_spare():
            if self.next_frame is None:
                self.next_frame = Frame(pins)
                return self
            else:
                self.next_frame.add(pins)
                return self

        if self._second_roll is None:
            self._second_roll = pins
            return self
        elif self.next_frame is None:
            self.next_frame = Frame(pins)
            return self
        else:
            self.next_frame.add(pins)
            return self

    def total_points(self, num_of_frames: int = TEN_FRAMES) -> int:
        the_frames = self._all_frames()[:num_of_frames]
        for frame in the_frames:
            if frame.next_frame is None:
                return frame._points()
            else:
                return frame._points() + frame.next_frame.total_points(
                    num_of_frames - 1
                )
        return 0

    def _points(self):
        if self._second_roll is None:
            return self._first_roll + self._bonus()

        return self._first_roll + self._second_roll + self._bonus()

    def _bonus(self):
        if self._is_spare() and self.next_frame is not None:
            return self._next_rolls_from_here(1)
        elif self._is_strike() and self.next_frame is not None:
            return self._next_rolls_from_here(2)

        return 0

    def _is_strike(self):
        return self._first_roll == ALL_PINS

    def _is_spare(self):
        if self._second_roll is None:
            return False

        return self._first_roll + self._second_roll == ALL_PINS

    def _next_rolls_from_here(self, count: int) -> int:
        rolls = []
        next_frame = self.next_frame
        while len(rolls) < count and next_frame is not None:
            rolls.extend(next_frame.rolls())
            next_frame = next_frame.next_frame

        return sum(rolls[:count])

    def rolls(self) -> list[int]:
        if self._second_roll is None:
            return [self._first_roll]
        else:
            return [self._first_roll, self._second_roll]

    def _all_frames(self):
        frames: list[Frame] = [self]
        while len(frames) < TEN_FRAMES and frames[-1].next_frame is not None:
            frames.append(frames[-1].next_frame)

        return frames


class BowlingGame:
    def __init__(self) -> None:
        self._first_frame: Frame | None = None

    def roll(self, pins: int) -> "BowlingGame":
        if self._first_frame is not None and self._is_complete():
            raise Exception("The game is already complete")

        if self._first_frame is None:
            self._first_frame = Frame(pins)
        else:
            self._first_frame.add(pins)

        return self

    def score(self) -> int:
        if self._first_frame is None:
            return 0

        return self._first_frame.total_points()

    def _is_complete(self):
        if self._first_frame is None:
            return False

        first_ten_frames = self._first_frame._all_frames()

        if len(first_ten_frames) < TEN_FRAMES:
            return False

        tenth_frame = first_ten_frames[-1]

        if tenth_frame._second_roll is None and tenth_frame.next_frame is None:
            return False

        next_frame = tenth_frame.next_frame

        if tenth_frame._is_spare():
            return (
                next_frame is not None and self._count_rolls(next_frame) >= 1
            )

        if tenth_frame._is_strike():
            return (
                next_frame is not None and self._count_rolls(next_frame) >= 2
            )

        return True

    @staticmethod
    def _count_rolls(frame: "Frame | None") -> int:
        count = 0
        while frame is not None:
            count += len(frame.rolls())
            frame = frame.next_frame

        return count
