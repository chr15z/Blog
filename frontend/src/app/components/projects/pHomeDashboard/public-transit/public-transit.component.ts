import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicTransitService, StopMonitor } from './public-transit.service';

@Component({
  selector: 'app-public-transit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-transit.component.html',
  styleUrl: './public-transit.component.scss',
})
export class PublicTransitComponent implements OnInit, OnDestroy {
  stops: StopMonitor[] = [];
  loading = true;
  error = false;
  lastUpdated: Date | null = null;

  private refreshInterval: any;

  constructor(private transitService: PublicTransitService) {}

  ngOnInit(): void {
    this.load();
    // Alle 30 Sekunden aktualisieren (Wiener Linien fair-use: min 15s)
    this.refreshInterval = setInterval(() => this.load(), 30_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

  load(): void {
    this.transitService.getMonitor().subscribe({
      next: (data) => {
        this.stops = data;
        this.lastUpdated = new Date();
        this.loading = false;
        this.error = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  lineColor(line: string, type?: string): string {
    return PublicTransitService.lineColor(line, type);
  }

  countdown(minutes: number): string {
    if (minutes <= 0) return 'jetzt';
    if (minutes === 1) return '1 min';
    return `${minutes} min`;
  }

  isMetro(stop: StopMonitor): boolean {
    return stop.departures[0]?.type === 'ptMetro';
  }

  formatTime(iso: string | null): string {
    if (!iso) return '';
    return iso.slice(11, 16);
  }

  formatUpdated(d: Date | null): string {
    if (!d) return '';
    return d.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  /** Gruppiert Abfahrten nach Linie + Richtung, je max. 3 Zeiten */
  groupByLine(departures: any[]): { line: string; towards: string; type: string; departures: any[] }[] {
    const map = new Map<string, { line: string; towards: string; type: string; departures: any[] }>();
    for (const dep of departures) {
      const key = `${dep.line}__${dep.towards}`;
      if (!map.has(key)) {
        map.set(key, { line: dep.line, towards: dep.towards, type: dep.type, departures: [] });
      }
      const group = map.get(key)!;
      if (group.departures.length < 3) group.departures.push(dep);
    }
    return Array.from(map.values());
  }
}
