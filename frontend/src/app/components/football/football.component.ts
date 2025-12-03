import { Component, OnInit } from '@angular/core';
import { FootballService, TicTacToe, PlayerLite, CellCheck } from 'src/app/services/football.service';
import { Observable, of } from 'rxjs';

type CellStatus = 'empty' | 'checking' | 'ok' | 'wrong' | 'error';
interface Cell {
  text: string;
  status: CellStatus;
  hint?: string;
}

@Component({
  selector: 'app-football',
  template: `
    <section *ngIf="ttt$ | async as t">
      <div class="header">
        <h4>Tic-Tac-Toe Challenge</h4>
        <button (click)="reroll()">Neu würfeln</button>
      </div>

      <table class="ttt">
        <thead>
        <tr>
          <th></th>
          <th *ngFor="let nat of t.nationalities">{{ nat }}</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let league of t.leagues; let r = index">
          <th>{{ league }}</th>
          <td *ngFor="let nat of t.nationalities; let c = index">
            <div class="cell">
              <input
                [(ngModel)]="grid[r][c].text"
                (keyup.enter)="submitCell(r, c, league, nat)"
                (blur)="submitCell(r, c, league, nat)"
                [disabled]="grid[r][c].status==='ok'"
                placeholder="Nachname…"
              />
              <span class="status"
                    [class.ok]="grid[r][c].status==='ok'"
                    [class.wrong]="grid[r][c].status==='wrong'"
                    [class.checking]="grid[r][c].status==='checking'">
                  {{ icon(grid[r][c].status) }}
                </span>
              <small *ngIf="grid[r][c].hint">{{ grid[r][c].hint }}</small>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  `,
  styleUrls: ['./football.component.scss']
})
export class FootballComponent implements OnInit {
  ttt$: Observable<TicTacToe> = of({ leagues: [], nationalities: [] });
  grid: Cell[][] = [];

  constructor(private api: FootballService) {}

  ngOnInit() {
    this.reroll();
  }

  reroll() {
    this.ttt$ = this.api.getRandomTicTacToe();
    this.ttt$.subscribe(t => {
      this.grid = Array.from({ length: t.leagues.length }, () =>
        Array.from({ length: t.nationalities.length }, () => ({ text: '', status: 'empty' as CellStatus }))
      );
    });
  }

  submitCell(r: number, c: number, league: string, nationality: string) {
    const cell = this.grid[r][c];
    const lastName = (cell.text || '').trim();
    if (!lastName) {
      cell.status = 'empty';
      cell.hint = '';
      return;
    }
    cell.status = 'checking';
    cell.hint = '';

    this.api.validatePlayer(lastName, league, nationality).subscribe({
      next: (res: CellCheck) => {
        if (res.ok) {
          console.log(lastName)
          console.log(league)
          console.log(nationality)
          cell.status = 'ok';
          cell.hint = res.playerName ? `✓ Gefunden: ${res.playerName}` : '✓ Treffer';
        } else {
          cell.status = 'wrong';
          cell.hint = 'Kein passender Spieler gefunden';
        }
      },
      error: () => {
        cell.status = 'error';
        cell.hint = 'Fehler bei der Abfrage';
      }
    });
  }

  icon(status: CellStatus): string {
    switch (status) {
      case 'ok': return '✅';
      case 'wrong': return '❌';
      case 'checking': return '…';
      default: return '—';
    }
  }
}
