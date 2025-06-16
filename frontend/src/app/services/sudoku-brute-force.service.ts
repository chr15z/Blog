import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SudokuBruteForceService {
  private matrix: number[][] = [];
  private speed: number;
  private recursiveCallsSubject = new BehaviorSubject<number>(null);
  public recursiveCalls$ = this.recursiveCallsSubject.asObservable();
  private recursiveCalls = 0;

  public solve(matrix: number[][], speed: number, isRunning: () => boolean, onFinish: () => void): void {
    this.matrix = matrix;
    this.speed = speed;
    this.recursiveCalls = 0;

    this.solveBruteForce(0, isRunning, () => {
      onFinish();
    });

  }

  private increaseRecursiveCalls() {
    this.recursiveCalls++;
    this.recursiveCallsSubject.next(this.recursiveCalls);
  }

  private solveBruteForce(n: number, isRunning: () => boolean, backtrack: () => void): void {
    this.increaseRecursiveCalls()

    if (!isRunning()) {
      console.log('Stoped manually!')
      return;
    }

    if (this.hasAllCellsVisited(n)) {
      console.log('Complete!');
      return;
    }

    const { row, col } = this.getCoords(n);

    if (this.isCellAlreadyOccupied(row, col)) {
      this.solveBruteForce(n + 1, isRunning, backtrack);
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
        this.solveBruteForce(n + 1, isRunning, () => {
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

  private getCoords(n: number): { row: number, col: number } {
    return {
      row: Math.floor(n / 9),
      col: n % 9
    };
  }

  private isCellAlreadyOccupied(row: number, col: number): boolean {
    return this.matrix[row][col] !== 0;
  }

  private hasAllCellsVisited(n: number): boolean {
    return n === 81;
  }

  private isNumberAllowed(row: number, col: number, num: number): boolean {
    // check row and column
    for (let i = 0; i < 9; i++) {
      if (this.matrix[row][i] === num || this.matrix[i][col] === num) {
        return false;
      }
    }

    // check 3x3 box
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
}
