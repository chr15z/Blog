import {Component, OnInit} from '@angular/core';
import {SudokuBruteForceService} from "../../services/sudoku-brute-force.service";
import {SudokuSimulatedAnnealingServiceService} from "../../services/sudoku-simulated-annealing-service.service";
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
  currentMatrix: number[][];
  matrix: number[][];
  isBoardEmpty: boolean;
  solvingInProgress = false;
  speed = 1;
  bestCostSimulatedAnnealing: number;
  recursiveCallsBruteForce: number;
  selectedOption = 'Brute Force';

  options = [
    {
      name: 'Brute Force',
      active: true,
      info: 'Try every possibility.',
      text: 'Brute force tries every possible combination until it finds a solution.\n' +
        'For Sudoku, it means filling in empty cells one by one, checking if the current number placement is valid. If a conflict is found, it backtracks and tries a different number.\n' +
        'This method guarantees a correct solution if one exists, but it can be slow for complex puzzles.\n'
    },
    {
      name: 'Simulated Annealing',
      active: false,
      info: 'Solving randomly by applying a cost function.',
      text: 'Simulated Annealing is inspired by the process of heating and slowly cooling metal to reduce flaws.\n' +
        'For Sudoku, it starts with a full grid that may have some rule violations. It then makes small changes (like swapping numbers) to reduce those violations with a cost function.\n' +
        'Sometimes it accepts worse changes to escape local optima, but over time it becomes more selective.\n'
    },
  ];

  constructor(
    private readonly bruteForceSolver: SudokuBruteForceService,
    private readonly simulatedAnnealingSolver: SudokuSimulatedAnnealingServiceService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initMatrix();
    this.simulatedAnnealingSolver.bestCost$.subscribe(cost => {
      this.bestCostSimulatedAnnealing = cost;
    });
    this.bruteForceSolver.recursiveCalls$.subscribe(calls => {
      this.recursiveCallsBruteForce = calls;
    });
  }

  stopSolving() {
    this.solvingInProgress = false;
  }

  initMatrix(): void {
    this.pickRandomBoard();
    this.isBoardEmpty = true;
  }

  clearBoard(): void {
    this.currentMatrix = this.matrix.map(row => [...row]);
    this.recursiveCallsBruteForce = 0;
    this.bestCostSimulatedAnnealing = 0;
  }

  editMatrixManually(event: Event, row: number, col: number): void {
    this.isBoardEmpty = false;
    const input = (event.target as HTMLInputElement).value;
    const value = parseInt(input, 10) || 0;
    this.currentMatrix[row][col] = value >= 1 && value <= 9 ? value : 0;
  }

  solve(): void {
    this.isBoardEmpty = false;
    if (this.solvingInProgress) return;
    this.solvingInProgress = true;

    if (this.isStrategieActive("Brute Force")) {
      this.bruteForceSolver.solve(
        this.currentMatrix,
        this.speed,
        () => this.solvingInProgress,
        () => {
          this.solvingInProgress = false;
          console.log('No solution! ❌');
        },
        () => {
          this.solvingInProgress = false;
          console.log('Solved successfully! ✅');
        }
      );
    }

    if (this.isStrategieActive("Simulated Annealing")) {
      this.simulatedAnnealingSolver.solve(
        this.currentMatrix,
        this.speed,
        () => this.solvingInProgress,
        () => {
          this.solvingInProgress = false;
          console.log('No solution! ❌');
        }
      );
    }
  }

  changeSpeed(event: Event): void {
    const speed = parseInt((event.target as HTMLSelectElement).value, 10);
    this.speed = speed || 1;
  }

  selectOption(option: any) {
    this.options.forEach(o => o.active = false);
    option.active = true;
    this.selectedOption = option.name;
  }

  pickRandomBoard() {
    this.http.get<number[][][]>('assets/boards.json').subscribe({
      next: (boards) => {
        const randomIndex = Math.floor(Math.random() * boards.length);
        this.matrix = boards[randomIndex].map(row => [...row]);
        this.currentMatrix = this.matrix.map(row => [...row]);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Boards:', err);
      }
    });
  }

  getSelectedOptionText(): string {
    const selected = this.options.find(o => o.name === this.selectedOption);
    return selected?.text || '';
  }

  private isStrategieActive(strategie: string): boolean {
    return this.options.find(opt => opt.name === strategie)?.active;
  }
}
