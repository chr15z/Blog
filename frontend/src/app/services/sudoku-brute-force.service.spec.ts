import { TestBed } from '@angular/core/testing';

import { SudokuBruteForceService } from './sudoku-brute-force.service';

describe('SudokuSolverService', () => {
  let service: SudokuBruteForceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuBruteForceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
