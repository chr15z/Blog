import { TestBed } from '@angular/core/testing';

import { SudokuSimulatedAnnealingServiceService } from './sudoku-simulated-annealing-service.service';

describe('SudokuSimulatedAnnealingServiceService', () => {
  let service: SudokuSimulatedAnnealingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuSimulatedAnnealingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
