function createInputGrid(){
    var container = document.querySelector('.inputs-container'); // Wähle das Container-Element aus
    var inputArray = [];
    for (var i = 0; i < 9; i++) {
        var rowArray = [];
        for (var j = 0; j < 9; j++) {
            var input = document.createElement('input'); 
            input.type = 'text';
            input.maxLength = 1;
            input.style.width = '20px';
            input.style.height = '20px';
            input.id = 'input_' + i + '_' + j; // Eindeutige ID generieren
            input.addEventListener('input', moveToNextField); // Eventlistener für Eingabe hinzufügen
            container.appendChild(input);
            rowArray.push(input.value); 
        }
        inputArray.push(rowArray); 
    }    
}
function updateInputArray(){
    var arr = [];
    for (var i = 0; i < 9; i++) {
        var rowArr = [];
        for (var j = 0; j < 9; j++) {
            rowArr.push(document.getElementById('input_' + i + '_' + j).value); 
        }
        arr.push(rowArr); 
    }
    return arr;
}
function moveToNextField(event) { // Funktion zum Bewegen zum nächsten Feld
    var target = event.target;
    if (target.value.length === 1) {
        var nextInput = target.nextElementSibling;
        if (nextInput && nextInput.tagName === 'INPUT') {
            nextInput.focus();
        }
    }
}
function createOutputGrid() {
    var container = document.querySelector('.solved'); // Container erstellen und handeln
    var inputArray = updateInputArray();
    if (container) {
        container.remove();
    }
    container = document.createElement('div');
    container.classList.add('solved');
    document.querySelector('.asdf').appendChild(container);

    var outputArray = solveSample(inputArray);
    for (var i = 0; i < 9; i++) {
        var rowArray = [];
        for (var j = 0; j < 9; j++) {
            inputArray[i][j] = document.getElementById('input_' + i + '_' + j).value;
            var output = document.createElement('input');
            output.type = 'text';
            output.maxLength = 1;
            output.style.width = '20px';
            output.style.height = '20px';
            output.value = outputArray[i][j]; 
            container.appendChild(output);
            rowArray.push(output);
        }
        outputArray.push(rowArray);
    }
}



createInputGrid();
// Eventlistener für den Button "check"
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.check-button').addEventListener('click', function () {
        createOutputGrid();
    });
});



















/**
 * Efficient Sudoku solver
 */

/**
 * Vorbedingung: input muss eine gültige Koordinate sein
 * Nachbedingungen: Kodiert eine Koordinate wie (3,1) mit der Zeichenfolge 31
 */
function key(row, col) {
    return `${row}${col}`;
}

// Menge aller Koordinaten
const coords = new Set();
for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
        coords.add(key(row, col));
    }
}

// Liste aller Reihen (als sets von Koordinaten)
const row_units = [];
for (let row = 0; row < 9; row++) {
    const unit = new Set();
    for (let col = 0; col < 9; col++) {
        unit.add(key(row, col));
    }
    row_units.push(unit);
}

// Liste aller Spalten (als sets von Koordinaten)
const col_units = [];
for (let col = 0; col < 9; col++) {
    const unit = new Set();
    for (let row = 0; row < 9; row++) {
        unit.add(key(row, col));
    }
    col_units.push(unit);
}

// Liste aller 3x3 Boxen (als sets von Koordinaten)
const box_units = [];
for (let box_row = 0; box_row < 3; box_row++) {
    for (let box_col = 0; box_col < 3; box_col++) {
        const unit = new Set();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                unit.add(key(3 * box_row + i, 3 * box_col + j));
            }
        }
        box_units.push(unit);
    }
}

// Liste aller Units
const all_units = [...row_units, ...col_units, ...box_units];

// Eine Map aller Peers einer Koordinate: alle Koordniaten die in der 
// gleichen unit liegen müssen andere Werte haben
const peers = {};
for (const coord of coords) {
    peers[coord] = new Set();
    for (const unit of all_units) {
        if (unit.has(coord)) {
            for (const peer of unit) {
                if (peer !== coord) {
                    peers[coord].add(peer);
                }
            }
        }
    }
}

// Klasse, die ein Sudoku repräsentiert
class Sudoku {
    /**
     * Vorbedinugung: values != null
     * Nachbedingung: Initialisiert ein Sudoku
     *     values: Map, Koordinate -> Wert
     *     candidates: Map, Koordinate -> Set aller möglichen Ziffern
     */
    constructor(values, candidates = null) {
        this.values = values;
        this.has_contradiction = false;
        if (candidates === null) {
            this.candidates = this.getCandidateDict();
        } else {
            this.candidates = candidates;
        }
    }

    /**
     * Vorbedingungen: board ist eine 9x9-Liste von Ganzzahlen, die ein Sudoku-Brett repräsentiert
     * Nachbedingungen: Die Methode gibt ein Sudoku-Objekt zurück, das auf dem gegebenen Brett basiert
     */
    static generateFromBoard(board) {
        const values = {};
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = board[row][col];
                if (!isNaN(parseInt(cell)) && parseInt(cell) >= 1 && parseInt(cell) <= 9){

                    values[key(row, col)] = parseInt(board[row][col]);
                }
                else {
                    values[key(row, col)] = 0; 
                }
            }
        }
        return new Sudoku(values);
    }

    /**
     * Vorbedingungen: board ist eine String mit 81 Zeichen, der ein Sudoku-Brett repräsentiert
     * Nachbedingungen: Die Methode gibt ein Sudoku-Objekt zurück, das auf dem gegebenen Brett basiert
     */
    static generateFromString(string) {
        string = string.replace(/\n/g, "");
        if (string.length !== 81) {
            throw new Error("Invalid string length");
        }

        function toDigit(c) {
            return c.match(/\d/) ? parseInt(c, 10) : 0;
        }

        const values = {};
        for (let i = 0; i < string.length; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            values[key(row, col)] = toDigit(string[i]);
        }
        return new Sudoku(values);
    }

    /**
     * Nachbedingungen: Schöne String-Repräsentation des Sudoku, die auf der Konsole ausgegeben wird
     */
    toString() {
        let output = " " + "-".repeat(23) + "\n";
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const digit = this.values[key(row, col)];
                if (col === 0) {
                    output += "| ";
                }
                output += (digit > 0 ? digit : ".") + " ";
                if ((col + 1) % 3 === 0) {
                    output += "| ";
                }
            }
            output += "\n";
            if ((row + 1) % 3 === 0) {
                output += " " + "-".repeat(23) + "\n";
            }
        }
        return output;
    }

    /**
     * Nachbedingung: Gibt eine Deepcopy des aktuellen Sudokus zurück
     */
    copy() {
        const candidatesCopy = {};
        for (const coord of coords) {
            candidatesCopy[coord] = new Set(this.candidates[coord]);
        }
        return new Sudoku({ ...this.values }, candidatesCopy);
    }

    /**
     * Nachbedingungen: Generiert ein Set aller möglichen Kandidaten für eine Koordinate
     */
    getCandidates(coord) {
        const digit = this.values[coord];
        if (digit !== 0) {
            return new Set([digit]);
        }
        const valuesOfPeers = new Set();
        for (const peer of peers[coord]) {
            valuesOfPeers.add(this.values[peer]);
        }
        const candidates = new Set();
        for (let i = 1; i <= 9; i++) {
            if (!valuesOfPeers.has(i)) {
                candidates.add(i);
            }
        }
        return candidates;
    }

    /**
     * Nachbedingungen: Generiert eine Map, Koordinate -> Set(Peers)
     */
    getCandidateDict() {
        const candidateDict = {};
        for (const coord of coords) {
            candidateDict[coord] = this.getCandidates(coord);
        }
        return candidateDict;
    }

    /**
     * Nachbedingung: Liefert die Koordinate mit den wenigsten Kandidaten zurück oder null (falls das Sudoku schon vollständig ausgeführt ist)
     */
    getNextCoord() {
        let minCoord = null;
        let minCandidates = Infinity;
        for (const coord of coords) {
            if (this.values[coord] === 0 && this.candidates[coord].size < minCandidates) {
                minCoord = coord;
                minCandidates = this.candidates[coord].size;
            }
        }
        return minCoord;
    }

    /**
     * Nachbedinugng: Entfernt einen Kandidaten einer Koordinate. Erkennt, ob ein Widerspruch vorliegt. 
     * Wenn ein einziger Kandidat übrig bleibt, wird dieser als Wert festgelegt
     */
    removeCandidate(coord, digit) {
        if (!this.candidates[coord].has(digit)) {
            return;
        }
        this.candidates[coord].delete(digit);
        if (this.candidates[coord].size === 0) {
            this.has_contradiction = true;
        } else if (this.candidates[coord].size === 1) {
            const candidate = Array.from(this.candidates[coord])[0];
            this.setDigit(coord, candidate);
        }
    }

    /**
     * Nachbedingung: Setzt digit an der Stelle Koordinate und entfernt digit von allen Kandidaten von den Peers der Koordinate
     */
    setDigit(coord, digit) {
        this.values[coord] = digit;
        this.candidates[coord] = new Set([digit]);
        for (const peer of peers[coord]) {
            this.removeCandidate(peer, digit);
            if (this.has_contradiction) {
                break;
            }
        }
    }

    /**
     * Nachbedingung: Gibt entweder null oder ein Tupel aus der hidden_single, falls vorhanden und ihrer Koordinate zurück.
     * (hidden_single = Ziffer, die in einer bestimmten unit nur noch einen möglichen Platz hat)
     */
    getHiddenSingle() {
        for (let digit = 1; digit <= 9; digit++) {
            for (const unit of all_units) {
                const possibleCoords = [];
                for (const coord of unit) {
                    if (this.values[coord] === 0 && this.candidates[coord].has(digit)) {
                        possibleCoords.push(coord);
                    }
                }
                if (possibleCoords.length === 1) {
                    return [digit, possibleCoords[0]];
                }
            }
        }
        return null;
    }

    /**
     * Nachbedingung: Erzeugt Lösungen für das vorgegebene Sudoku, gibt diese als Iterator zurück
     */
    *solutions() {
        // get and set hidden single
        const single = this.getHiddenSingle();
        if (single) {
            const [digit, coord] = single;
            this.setDigit(coord, digit);
            if (!this.has_contradiction) {
                yield* this.solutions();
            }
            return;
        }

        // take coordinate with least number of candidates left
        const nextCoord = this.getNextCoord();
        if (nextCoord === null) {
            yield this;
            return;
        }

        // test all candidates
        for (const candidate of this.candidates[nextCoord]) {
            const copy = this.candidates[nextCoord].size > 1 ? this.copy() : this;
            copy.setDigit(nextCoord, candidate);
            if (!copy.has_contradiction) {
                yield* copy.solutions();
            }
        }
    }

            /**
     * Nachbedingungen: 2d-Array-Repräsentation des Sudoku
     */
    toArray(){
        let output = [];
            for (let row = 0; row < 9; row++) {
                let rows = [];
                for (let col = 0; col < 9; col++) {
                    const digit = this.values[key(row, col)];
                    rows.push(digit)
                                      
                }
                output.push(rows)
            }
                
        return output;
    }

    /**
     * Nachbedingung: Erzeugt eine Lösung für das vorgegebene Sudoku, gibt diese als Array zurück
     */
    solve(){
        for (const sol of this.solutions()) {
            if(sol.has_contradiction) return this.values
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    this.values[key(row, col)] =  sol.values[key(row, col)];
                }
            }
            break;
        }
    }
}

// Nachbedingung: Gibt ein Sudoku und seine Lösung aus
function solveSample(input) {

    if(isValidSudoku(input)){
        const sudoku = Sudoku.generateFromBoard(input);
        
        sudoku.solve();

        arr_solved = sudoku.toArray();
        return arr_solved
    }
    else{
        return input
    } 
}

function isValidSudoku(board) {
    const seen = new Set();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = board[i][j];
            if (!isNaN(parseInt(cell)) && parseInt(cell) >= 1 && parseInt(cell) <= 9) {
                const rowKey = `row ${i} has ${cell}`;
                const colKey = `col ${j} has ${cell}`;
                const blockKey = `block ${Math.floor(i / 3)}-${Math.floor(j / 3)} has ${cell}`;
                
                if (seen.has(rowKey) || seen.has(colKey) || seen.has(blockKey)) {
                    return false;
                }
                
                seen.add(rowKey);
                seen.add(colKey);
                seen.add(blockKey);
            } 
        }
    }

    return true;
}

