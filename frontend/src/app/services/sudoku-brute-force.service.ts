import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SudokuBruteForceService {
  private recursiveCalls = 0;
  private recursiveCallsSubject = new BehaviorSubject<number>(0);
  recursiveCalls$ = this.recursiveCallsSubject.asObservable();

  private matrix: number[][];
  private speed = 1;

  public solve(
    matrix: number[][],
    speed: number,
    isRunning: () => boolean,
    onFailure: () => void,
    onSuccess: () => void
  ): void {
    this.matrix = matrix;
    this.speed = speed;
    this.recursiveCalls = 0;
    this.solveBruteForce(0, isRunning, onFailure, onSuccess);
  }

  private solveBruteForce(
    n: number,
    isRunning: () => boolean,
    onFailure: () => void,
    onSuccess: () => void
  ): void {
    this.increaseRecursiveCalls();

    if (!isRunning()) {
      onFailure(); // manuell abgebrochen
      return;
    }

    if (this.hasAllCellsVisited(n)) {
      setTimeout(() => onSuccess(), this.speed);
      return;
    }

    const {row, col} = this.getCoords(n);

    if (this.isCellAlreadyOccupied(row, col)) {
      this.solveBruteForce(n + 1, isRunning, onFailure, onSuccess);
      return;
    }

    let num = 1;

    const resetAndBacktrack = () => {
      setTimeout(() => {
        this.matrix[row][col] = 0;
        onFailure();
      }, this.speed);
    };

    const tryNext = () => {
      if (num > 9) {
        resetAndBacktrack();
        return;
      }

      if (this.isNumberAllowed(row, col, num)) {
        this.matrix[row][col] = num;
        setTimeout(() => {
          this.solveBruteForce(n + 1, isRunning, () => {
            this.matrix[row][col] = 0;
            num++;
            tryNext();
          }, onSuccess);
        }, this.speed);
      } else {
        num++;
        tryNext();
      }
    };

    tryNext();
  }

  private hasAllCellsVisited(n: number): boolean {
    return n >= 81;
  }

  private getCoords(n: number): { row: number, col: number } {
    return {
      row: Math.floor(n / 9),
      col: n % 9
    };
  }

  private isCellAlreadyOccupied(row: number, col: number): boolean {
    return this.matrix[row][col] !== 0;
  }

  private isNumberAllowed(row: number, col: number, num: number): boolean {
    return (
      !this.matrix[row].includes(num) &&
      !this.matrix.some(r => r[col] === num) &&
      this.getBoxValues(row, col).every(val => val !== num)
    );
  }

  private getBoxValues(row: number, col: number): number[] {
    const box: number[] = [];
    const boxStartRow = row - row % 3;
    const boxStartCol = col - col % 3;
    for (let i = boxStartRow; i < boxStartRow + 3; i++) {
      for (let j = boxStartCol; j < boxStartCol + 3; j++) {
        box.push(this.matrix[i][j]);
      }
    }
    return box;
  }

  private increaseRecursiveCalls(): void {
    this.recursiveCalls++;
    this.recursiveCallsSubject.next(this.recursiveCalls);
  }
}
