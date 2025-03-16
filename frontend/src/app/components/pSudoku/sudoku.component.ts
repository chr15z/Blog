import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
  ANTX = 9; // Anzahl der Spalten
  ANTY = 9; // Anzahl der Zeilen
  N = this.ANTX * this.ANTY; // Gesamtanzahl der Felder

  matrix: number[][] = [];
  isMatrixClear: boolean;
  solvingInProgress = false;
  speed = 1;

  options = [
    { name: 'Naked Pairs', active: true, info: 'Identification of cells in which only a certain number of candidates are possible.' },
    { name: 'Hidden Singles', active: true, info: 'Numbers that are only possible in a specific cell within a row, column or region' },
    { name: 'X-Wing', active: true, info: 'Advanced pattern recognition' },
  ];


  constructor() { }

  ngOnInit(): void {
    this.initMatrix();
  }
  toggleOption(option: any) {
    option.active = !option.active;
  }
  stopSolving() {
    this.solvingInProgress = false;
  }

  initMatrix(): void {
    this.isMatrixClear = true;
    this.matrix = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  clearBoard(): void {
    this.initMatrix();
  }

  updateMatrix(event: Event, row: number, col: number): void {
    this.isMatrixClear = false;
    const input = (event.target as HTMLInputElement).value;
    const value = parseInt(input, 10) || 0;
    this.matrix[row][col] = value >= 1 && value <= 9 ? value : 0;
  }

  solve(): void {
    this.isMatrixClear = false
      if (!this.solvingInProgress) {
        this.solvingInProgress = true;
        this.findSolution(0, () => {
          this.solvingInProgress = false;
          console.log('No solution! :(');
        });
    }
  }

  changeSpeed(event: Event): void {
    const speed = parseInt((event.target as HTMLSelectElement).value, 10);
    this.speed = speed || 1;
  }

  isValid(row: number, col: number, num: number): boolean {
    // Überprüfen, ob `num` in der Zeile oder Spalte existiert
    for (let i = 0; i < this.ANTX; i++) {
      if (this.matrix[row][i] === num || this.matrix[i][col] === num) {
        return false;
      }
    }

    // Überprüfen, ob `num` im 3x3-Block existiert
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.matrix[startRow + i][startCol + j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  findSolution(n: number, backtrack: () => void): void {
    if (!this.solvingInProgress) {
      return;
    }
    if (n === this.N) {
      this.solvingInProgress = false;
      console.log('Complete!');
      return;
    }

    const row = Math.floor(n / this.ANTX);
    const col = n % this.ANTY;

    if (this.matrix[row][col] !== 0) {
      this.findSolution(n + 1, backtrack);
      return;
    }

    let num = 1; // Starte mit der ersten Zahl
    const tryNumber = () => {
      if (num > 9) {
        setTimeout(() => {
          this.matrix[row][col] = 0; // Reset der Zelle
          backtrack();
        }, this.speed);
        return;
      }

      if (this.isValid(row, col, num)) {
        setTimeout(() => {
          this.matrix[row][col] = num; // Setze die Zahl
          this.findSolution(n + 1, () => {
            this.matrix[row][col] = 0; // Rücksetzen, wenn es keine Lösung gibt
            num++;
            tryNumber(); // Versuche die nächste Zahl
          });
        }, this.speed);
      } else {
        num++; // Versuche die nächste Zahl
        tryNumber();
      }
    };
    tryNumber();
  }
}
