import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SudokuSimulatedAnnealingServiceService {

  private originalMatrix: number[][] = [];
  private displayedMatrix: number[][] = [];
  private speed: number = 1;
  private readonly alpha = 0.995;
  private bestCost: number;
  private bestCostSubject = new BehaviorSubject<number>(null);
  public bestCost$ = this.bestCostSubject.asObservable();

  public solve(
    matrix: number[][],
    speed: number,
    isRunning: () => boolean,
    onFinish: () => void
  ): void {
    this.displayedMatrix = matrix;
    this.originalMatrix = matrix.map(row => [...row]);
    this.speed = speed;

    this.solveSimulatedAnnealing(isRunning, onFinish);
  }

  /** helper functions **/

  private updateBestCost(value: number) {
    this.bestCost = value;
    this.bestCostSubject.next(value);
  }

  private solveSimulatedAnnealing(isRunning: () => boolean, onFinish: () => void): void {

    let currentMatrix = this.fillMatrix();
    let currentCost = this.calculateCost(currentMatrix);
    let bestMatrix = currentMatrix.map(row => [...row]);
    let bestCost = currentCost;

    let T = 1.0;


    const iterate = () => {

      setTimeout(() => {
        console.log(this.bestCost)
      }, this.speed);


      if (!isRunning() || currentCost === 0) {
        onFinish();
        console.log(bestMatrix);
        return;
      }

      const neighbor = this.generateNeighbor(currentMatrix);
      const neighborCost = this.calculateCost(neighbor);

      const delta = neighborCost - currentCost;

      if (delta < 0 || Math.exp(-delta / T) > Math.random()) {
        currentMatrix = neighbor;
        currentCost = neighborCost;
        if (currentCost < bestCost) {
          bestMatrix = currentMatrix.map(row => [...row]);
          bestCost = currentCost;
          this.displayMatrix(bestMatrix);
          this.updateBestCost(bestCost);
        }
      }

      T *= this.alpha;

      setTimeout(iterate, this.speed);
    };

    iterate();
  }

  private calculateCost(board: number[][]): number {
    let cost = 0;

    // Column conflicts
    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        if (seen.has(board[row][col])) {
          cost++;
        } else {
          seen.add(board[row][col]);
        }
      }
    }

    // Box conflicts
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const val = board[boxRow * 3 + i][boxCol * 3 + j];
            if (seen.has(val)) {
              cost++;
            } else {
              seen.add(val);
            }
          }
        }
      }
    }

    return cost;
  }

  private generateNeighbor(matrix: number[][]): number[][] {
    const newMatrix = matrix.map(row => [...row]);
    const row = Math.floor(Math.random() * 9);

    const fixedCols = this.originalMatrix[row].map((val, col) => (val !== 0 ? col : null)).filter(c => c !== null);
    const variableCols = Array.from({ length: 9 }, (_, i) => i).filter(i => !fixedCols.includes(i));

    if (variableCols.length < 2) return newMatrix;

    const [col1, col2] = this.sampleTwo(variableCols);
    [newMatrix[row][col1], newMatrix[row][col2]] = [newMatrix[row][col2], newMatrix[row][col1]];

    return newMatrix;
  }

  private sampleTwo(arr: number[]): [number, number] {
    const a = arr[Math.floor(Math.random() * arr.length)];
    let b = a;
    while (b === a) {
      b = arr[Math.floor(Math.random() * arr.length)];
    }
    return [a, b];
  }

  private shuffleArray(arr: number[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  private fillMatrix(): number[][] {
    const matrix = this.originalMatrix.map(row => [...row]);
    for (let row = 0; row < 9; row++) {
      const existing = new Set<number>();
      const emptyIndices: number[] = [];

      for (let col = 0; col < 9; col++) {
        if (matrix[row][col] !== 0) {
          existing.add(matrix[row][col]);
        } else {
          emptyIndices.push(col);
        }
      }

      const remaining = Array.from({ length: 9 }, (_, i) => i + 1).filter(n => !existing.has(n));
      this.shuffleArray(remaining);
      emptyIndices.forEach((col, idx) => {
        matrix[row][col] = remaining[idx];
      });
    }
    return matrix;
  }

  private displayMatrix(matrix){
    for (let row = 0; row < this.displayedMatrix.length; row++) {
      for (let col = 0; col < this.displayedMatrix[row].length; col++) {
        this.displayedMatrix[row][col] = matrix[row][col];
      }
    }
  }
}
