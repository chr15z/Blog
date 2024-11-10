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
  solvingInProgress = false;
  speed = 1;

  ngOnInit(): void {
    this.initMatrix();
  }

  // Initialisiert die Sudoku-Matrix
  initMatrix(): void {
    this.matrix = [
      [0, 3, 0, 0, 0, 9, 0, 6, 0],
      [0, 1, 0, 0, 4, 0, 0, 9, 0],
      [0, 9, 0, 3, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 2, 0, 0],
      [0, 8, 0, 0, 0, 0, 0, 7, 0],
      [0, 0, 9, 0, 0, 0, 0, 0, 1],
      [0, 5, 0, 0, 0, 4, 0, 2, 0],
      [0, 2, 6, 0, 0, 0, 5, 4, 0],
      [0, 7, 0, 9, 0, 0, 0, 8, 0],
    ];
  }

  // Aktualisiert die Matrix bei Benutzereingaben
  updateMatrix(event: Event, row: number, col: number): void {
    const input = (event.target as HTMLInputElement).value;
    const value = parseInt(input, 10) || 0;
    this.matrix[row][col] = value >= 1 && value <= 9 ? value : 0;
  }

  // Löst das Sudoku rekursiv
  solve(): void {
    if (!this.solvingInProgress) {
      this.solvingInProgress = true;
      this.findSolution(0, () => {
        this.solvingInProgress = false;
        alert('No solution! :(');
      });
    }
  }

  // Löscht das Board
  clearBoard(): void {
    this.initMatrix();
  }

  // Geschwindigkeit ändern
  changeSpeed(event: Event): void {
    const speed = parseInt((event.target as HTMLSelectElement).value, 10);
    this.speed = speed || 1;
  }

  // Prüft, ob eine Zahl in die aktuelle Zelle passt
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

  // Sudoku-Solver (Backtracking)
  findSolution(n: number, backtrack: () => void): void {
    if (n === this.N) {
      this.solvingInProgress = false;
      alert('Complete!');
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
