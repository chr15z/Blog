import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeDeAt from '@angular/common/locales/de-AT';

registerLocaleData(localeDeAt);

interface Holiday {
  date: Date;
  name: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  providers: [{ provide: LOCALE_ID, useValue: 'de-AT' }],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  calendarDays: (Date | null)[] = [];
  weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  private allHolidays: Holiday[] = [];

  ngOnInit(): void {
    this.allHolidays = this.buildHolidays(this.currentDate.getFullYear());
    this.buildCalendar();
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  prevMonth(): void {
    const d = new Date(this.currentDate);
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    this.currentDate = d;
    this.allHolidays = this.buildHolidays(this.currentDate.getFullYear());
    this.buildCalendar();
  }

  nextMonth(): void {
    const d = new Date(this.currentDate);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    this.currentDate = d;
    this.allHolidays = this.buildHolidays(this.currentDate.getFullYear());
    this.buildCalendar();
  }

  // ─── Calendar grid ─────────────────────────────────────────────────────────

  private buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday-based week: getDay() returns 0=Sun; shift so Mon=0
    const startOffset = (firstDay.getDay() + 6) % 7;

    this.calendarDays = [];

    // Empty slots before first day
    for (let i = 0; i < startOffset; i++) {
      this.calendarDays.push(null);
    }

    // All days in month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      this.calendarDays.push(new Date(year, month, d));
    }

    // Fill up to full rows (multiples of 7)
    while (this.calendarDays.length % 7 !== 0) {
      this.calendarDays.push(null);
    }

  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  getHoliday(date: Date): string | null {
    const found = this.allHolidays.find(
      (h) =>
        h.date.getFullYear() === date.getFullYear() &&
        h.date.getMonth() === date.getMonth() &&
        h.date.getDate() === date.getDate()
    );
    return found ? found.name : null;
  }

  // ─── Österreichische Feiertage ─────────────────────────────────────────────
  // Feste Feiertage + bewegliche (Ostern nach Gauß-Algorithmus)

  private buildHolidays(year: number): Holiday[] {
    const fixed: { month: number; day: number; name: string }[] = [
      { month: 1, day: 1, name: 'Neujahr' },
      { month: 1, day: 6, name: 'Heilige Drei Könige' },
      { month: 5, day: 1, name: 'Staatsfeiertag' },
      { month: 8, day: 15, name: 'Mariä Himmelfahrt' },
      { month: 10, day: 26, name: 'Nationalfeiertag' },
      { month: 11, day: 1, name: 'Allerheiligen' },
      { month: 12, day: 8, name: 'Mariä Empfängnis' },
      { month: 12, day: 25, name: 'Christtag' },
      { month: 12, day: 26, name: 'Stefanitag' },
    ];

    const holidays: Holiday[] = fixed.map((f) => ({
      date: new Date(year, f.month - 1, f.day),
      name: f.name,
    }));

    // Osterberechnung (Gaußsche Osterformel)
    const easter = this.calcEaster(year);

    const movable: { offset: number; name: string }[] = [
      { offset: -2, name: 'Karfreitag' }, // kein gesetzl. Feiertag in Ö, aber häufig frei
      { offset: 0, name: 'Ostersonntag' },
      { offset: 1, name: 'Ostermontag' },
      { offset: 39, name: 'Christi Himmelfahrt' },
      { offset: 49, name: 'Pfingstsonntag' },
      { offset: 50, name: 'Pfingstmontag' },
      { offset: 60, name: 'Fronleichnam' },
    ];

    for (const m of movable) {
      const d = new Date(easter);
      d.setDate(d.getDate() + m.offset);
      holidays.push({ date: d, name: m.name });
    }

    return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /** Gauß'sche Osterformel – gibt Ostersonntag zurück */
  private calcEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }
}
