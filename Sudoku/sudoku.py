"""Efficient Sudoku solver"""

from __future__ import annotations
from collections.abc import Iterator
from time import perf_counter

"""Vorbedingung: input muss eine gültige Koordinate sein
Nachbedingungen: Kodiert eine Koordinate wie (3,1) mit der Zeichenfolge 31"""
def key(row: int, col: int) -> str:
    return str(row) + str(col)

"""Menge aller Koordinaten"""
coords = {key(row, col) for row in range(9) for col in range(9)}

"""Liste aller Reihen (als sets von Koordinaten)"""
row_units = [{key(row, col) for col in range(9)} for row in range(9)]

"""Liste aller Spalten (als sets von Koordinaten)"""
col_units = [{key(row, col) for row in range(9)} for col in range(9)]

"""Liste aller 3x3 Boxen (als sets von Koordinaten)"""
box_units = [
    {key(3 * box_row + i, 3 * box_col + j) for i in range(3) for j in range(3)}
    for box_row in range(3)
    for box_col in range(3)
]

"""Liste aller Units"""
all_units = row_units + col_units + box_units

"""Eine Map aller Peers einer Koordinate: alle Koordniaten die in der 
gleichen unit liegen müssen andere Werte haben"""
peers: dict[str, set[str]] = {
    coord: set.union(*(unit - {coord} for unit in all_units if coord in unit))
    for coord in coords
}


"""represäntiert ein Sudoku"""
class Sudoku:

    """Vorbedinugung: values != None
    Nachbedingung: Initialisiert ein Sudoku
            valeus: Map, Koordinate -> Wert
            candidates: Map, Koordinate -> Set aller möglichen Ziffern
        """
    def __init__(self, values: dict[str, int], candidates: dict[str, set[int]] | None = None) -> None:
        self.values = values
        self.has_contradiction = False

        if candidates is None:
            self.candidates = self.get_candidate_dict()
        else:
            self.candidates = candidates

    """Vorbedingungen: Board ist eine 9x9-Liste von Ganzzahlen, die ein Sudoku-Brett repräsentiert
        Nachbedingungen: Die Methode gibt ein Sudoku-Objekt zurück, das auf dem gegebenen Brett basiert"""
    @staticmethod
    def generate_from_board(board: list[list[int]]) -> Sudoku:
        values = { key(row, col): board[row][col] for row in range(9) for col in range(9) }
        return Sudoku(values)

    """Vorbedingungen: Board ist eine String mit 81 Zeichen, der ein Sudoku-Brett repräsentiert
        Nachbedingungen: Die Methode gibt ein Sudoku-Objekt zurück, das auf dem gegebenen Brett basiert"""
    @staticmethod
    def generate_from_string(string: str) -> Sudoku:
        string = string.replace("\n", "")
        assert len(string) == 81

        def to_digit(c: str) -> int:
            return int(c) if c.isnumeric() else 0

        values = {
            key(row, col): to_digit(string[row * 9 + col])
            for row in range(9)
            for col in range(9)
        }
        return Sudoku(values)

    """Nachbedingung: Wandelt das Sudoku in eine einzeilige Zeichenkette um"""
    def to_line(self) -> str:
        return "".join(map(str, list(self.values.values())))

    """Nachbedingungen: Schöne String-Repräsentation des Sudoku, die auf der Konsole ausgegeben wird"""
    def __str__(self) -> str:
        output = " " + "-" * 23 + "\n"
        for row in range(9):
            for col in range(9):
                digit = self.values[key(row, col)]
                if col == 0:
                    output += "| "
                output += (str(digit) if digit > 0 else ".") + " "
                if col % 3 == 2:
                    output += "| "
            output += "\n"
            if row % 3 == 2:
                output += " " + "-" * 23 + "\n"
        return output

    """Nachbedingung: Gibt eine Deepcopy des aktuellen Sudokus zurück"""
    def copy(self) -> Sudoku:
        candidates_copy = {coord: self.candidates[coord].copy() for coord in coords}
        return Sudoku(self.values.copy(), candidates_copy)

    """Nachbedingungen: Generiert ein Set aller möglichen Kandidaten für eine Koordinate"""
    def get_candidates(self, coord: str) -> set[int]:
        digit = self.values[coord]
        if digit != 0:
            return {digit}
        values_of_peers = {self.values[peer] for peer in peers[coord]}
        return set(range(1, 10)) - values_of_peers

    """Nachbedingungen: Generiert eine Map, Koordinate -> Set(Peers)"""
    def get_candidate_dict(self) -> dict[str, set[int]]:
        return {coord: self.get_candidates(coord) for coord in coords}

    """Nachbedingungen: Liefert die Koordinate mit den wenigsten Kandidaten zurück oder None (falls das Sudoku schon vollständig ausgeführt ist)"""
    def get_next_coord(self) -> str | None:
        try:
            return min((coord for coord in coords if self.values[coord] == 0),
                        key=lambda coord: len(self.candidates[coord]))
        except ValueError:
            return None

    """Nachbedinugng: Entfernt einen Kandidaten einer Koordinate. Erkennt, ob ein Widerspruch vorliegt. 
    Wenn ein einziger Kandidat übrig bleibt, wird dieser als Wert festgelegt"""
    def remove_candidate(self, coord: str, digit: int) -> None:
        if digit not in self.candidates[coord]:
            return
        self.candidates[coord].remove(digit)
        if not self.candidates[coord]:
            self.has_contradiction = True
        elif len(self.candidates[coord]) == 1:
            candidate = list(self.candidates[coord])[0]
            self.set_digit(coord, candidate)

    """Nachbedingung: Setzt digit an der Stelle Koordinate und entfernt digit von allen Kandidaten von den Peers der Koordinate"""
    def set_digit(self, coord: str, digit: int) -> None:
        self.values[coord] = digit
        self.candidates[coord] = {digit}
        for peer in peers[coord]:
            self.remove_candidate(peer, digit)
            if self.has_contradiction:
                break

    """Nachbedingung: Gibt entweder None oder ein Tupel aus der hidden_single, falls vorhanden und ihrer Koordinate zurück.
    (hidden_single = Ziffer, die in einer bestimmten unit nur noch einen möglichen Platz hat)"""
    def get_hidden_single(self) -> None | tuple[int, str]:
        for digit in range(1, 10):
            for unit in all_units:
                possible_coords = [
                    coord
                    for coord in unit
                    if self.values[coord] == 0 and digit in self.candidates[coord]
                ]
                if len(possible_coords) == 1:
                    return digit, possible_coords[0]
        return None

    """Nachbedingung: Erzeugt Lösungen für das vorgegebene Sudoku, gibt diese als Iterator zurück"""
    def solutions(self) -> Iterator[Sudoku]:

        # get and set hidden single
        single = self.get_hidden_single()
        if single:
            digit, coord = single
            self.set_digit(coord, digit)
            if not self.has_contradiction:
                yield from self.solutions()
            return

        # take coordinate with least number of candidates left
        next_coord = self.get_next_coord()
        if not next_coord:
            yield self
            return

        # test all candidates
        for candidate in self.candidates[next_coord]:
            copy = self.copy() if len(self.candidates[next_coord]) > 1 else self
            copy.set_digit(next_coord, candidate)
            if not copy.has_contradiction:
                yield from copy.solutions()

    
    """Vorbedingung: data/solutions.txt, data/performance.txt, data/samples.txt (Sudokus haben nur eine Lsg) != None
    Nachbedingung: Löst alle Sudokus und misst die Zeit. Speichert Ergebnisse in .txt Dateien ab"""
def measure_time() -> None:
    sudoku_counter: int = 0
    total: float = 0
    with open("data/solutions.txt", "w", encoding="utf8") as sol_file:
        with open("data/performance.txt", "w", encoding="utf8") as perf_file:
            with open("data/samples.txt", "r", encoding="utf8") as sample_file:
                for line in sample_file:
                    if line.startswith("#"):
                        continue
                    sudoku_counter += 1
                    sudoku = Sudoku.generate_from_string(line)
                    print("solving sudoku", sudoku_counter)
                    start = perf_counter()
                    sols = list(sudoku.solutions())
                    end = perf_counter()
                    perf_file.write(str(end - start) + "\n")
                    total += end - start
                    assert len(sols) == 1
                    sol_file.write(sols[0].to_line() + "\n")
            perf_file.write("total: " + str(total) + "\n")
            average = total / sudoku_counter
            perf_file.write("average: " + str(average) + "\n")
    print("results written to data/performance.txt and data/solutions.txt")

"""Nachbedingung: Gibt die ein Sudoku und seine Lösung aus"""
def solve_sample() -> None:
    board = [
        [0, 0, 0, 6, 0, 0, 4, 0, 0],
        [7, 0, 0, 0, 0, 3, 6, 0, 0],
        [0, 0, 0, 0, 9, 1, 0, 8, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 5, 0, 1, 8, 0, 0, 0, 3],
        [0, 0, 0, 3, 0, 6, 0, 4, 5],
        [0, 4, 0, 2, 0, 0, 0, 6, 0],
        [9, 0, 3, 0, 0, 0, 0, 0, 0],
        [0, 2, 0, 0, 0, 0, 1, 0, 0],
    ]
    sudoku = Sudoku.generate_from_board(board)
    print("Sample:\n")
    print(sudoku)
    print("Solutions:\n")
    start = perf_counter()
    for sol in sudoku.solutions():
        print(sol)
    end = perf_counter()
    print("Elapsed time: ", end - start, "\n")

if __name__ == "__main__":
    solve_sample()
    measure_time()


# candidates machts schneller. Backtracking machts langsamer. Hidden single machts schneller    
# andere Methoden: naked pair, hidden pair, triples, empty rectangle, x-wing, swordfish