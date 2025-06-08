import { Component, OnInit } from '@angular/core';
import {SudokuBruteForceService} from "../../services/sudoku-brute-force.service";
import {SudokuSimulatedAnnealingServiceService} from "../../services/sudoku-simulated-annealing-service.service";

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
  matrix: number[][] = [];
  isBoardEmpty: boolean;
  solvingInProgress = false;
  speed = 1;

  options = [
    { name: 'Brute Force', active: true, info: 'Try every possibility.' },
    { name: 'Simulated Annealing', active: false, info: 'Solving randomly by applying a cost function.'},
  ];


  constructor(private readonly bruteForceSolver: SudokuBruteForceService, private readonly simulatedAnnealingSolver: SudokuSimulatedAnnealingServiceService) { }

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
    let nakedPairs = [
      [2, 9, 0, 0, 0, 0, 0, 0, 0],
      [1, 5, 6, 0, 0, 0, 0, 0, 0],
      [4, 0, 0, 0, 0, 0, 8, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.matrix = nakedPairs;
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
    this.isBoardEmpty = false;
    if (!this.solvingInProgress) {
      this.solvingInProgress = true;

      if (this.isStrategieActive("Brute Force")){
        this.bruteForceSolver.solve(
          this.matrix,
          this.speed,
          () => this.solvingInProgress,
          () => {
            this.solvingInProgress = false;
            console.log('No solution! :(');
          }
        );
      }

      if (this.isStrategieActive("Simulated Annealing")) {
        this.simulatedAnnealingSolver.solve(
          this.matrix,
          this.speed,
          () => this.solvingInProgress,
          () => {
            this.solvingInProgress = false;
            console.log('No solution! :(');
          }
        );
      }

    }
  }


  changeSpeed(event: Event): void {
    const speed = parseInt((event.target as HTMLSelectElement).value, 10);
    this.speed = speed || 1;
  }


  private isStrategieActive(strategie: string): boolean{
    return this.options.find(opt => opt.name === strategie)?.active;
  }

}
