import { Component, OnInit } from '@angular/core';
// TODO: check if solving is possible with input grid, else its not terminating

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
  numCols = 9;
  numRows = 9;
  numOfFields = this.numCols * this.numRows;
  matrix: number[][] = [];
  isBoardEmpty: boolean;
  solvingInProgress = false;
  speed = 1;

  options = [
    { name: 'Naked Pairs', active: true, info: 'Identification of cells in which only a certain number of candidates are possible.' },
    { name: 'Hidden Singles', active: true, info: 'Numbers that are only possible in a specific cell within a row, column or region' },
    { name: 'X-Wing', active: true, info: 'Advanced pattern recognition' },
    { name: 'Simulated Annealing', active: false, info: 'Solving randomly by applying a cost function'},
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
    this.isBoardEmpty = true;
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

  editMatrixManually(event: Event, row: number, col: number): void {
    this.isBoardEmpty = false;
    const input = (event.target as HTMLInputElement).value;
    const value = parseInt(input, 10) || 0;
    this.matrix[row][col] = value >= 1 && value <= 9 ? value : 0;
  }

  solve(): void {
    this.isBoardEmpty = false
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

  isNumberAllowed(row: number, col: number, num: number): boolean {
    // num in row or col ?
    for (let i = 0; i < this.numCols; i++) {
      if (this.matrix[row][i] === num || this.matrix[i][col] === num) {
        return false;
      }
    }

    // num in 3x3 grid ?
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

  /** Helper functions **/
  private findSolution(n: number, backtrack: () => void): void {
    if (!this.solvingInProgress) {
      return;
    }

    if (this.hasAllCellsVisited(n)) {
      this.solvingInProgress = false;
      console.log('Complete!');
      return;
    }

    const { row, col } = this.getCoords(n, this.numCols);

    if (this.isCellAlreadyOccupied(row, col)) {
      this.findSolution(n + 1, backtrack);
      return;
    }

    let num = 1;

    const resetCellAndBacktrack = () => {
      setTimeout(() => {
        this.matrix[row][col] = 0;
        backtrack();
      }, this.speed);
    };

    const placeNumberAndContinue = () => {
      setTimeout(() => {
        this.matrix[row][col] = num;

        this.findSolution(n + 1, () => {
          this.matrix[row][col] = 0;
          num++;
          tryNextNumber();
        });
      }, this.speed);
    };

    const tryNextNumber = () => {
      if (num > 9) {
        resetCellAndBacktrack();
        return;
      }

      if (this.isNumberAllowed(row, col, num)) {
        placeNumberAndContinue();
      } else {
        num++;
        tryNextNumber();
      }
    };

    tryNextNumber();

  }

  private getCoords(n: number, width: number): { row: number, col: number } {
    return {
      row: Math.floor(n / width),
      col: n % width
    };
  }

  private isCellAlreadyOccupied(row: number, col: number) {
    return this.matrix[row][col] !== 0;
  }

  private hasAllCellsVisited(n: number): boolean {
    return n === this.numOfFields;
  }


}
