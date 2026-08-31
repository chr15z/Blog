import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** Ein Zeitschritt der Prognose: Niederschlagsmenge (mm/15min) je Gitterzelle. */
export interface PrecipitationFrame {
  time: string; // ISO-Zeit, lokal (Europe/Vienna)
  values: number[]; // gleiche Reihenfolge wie PrecipitationGrid.cells
}

export interface PrecipitationGrid {
  cells: Array<{ lat: number; lon: number }>;
  /** Kantenlänge einer Gitterzelle in Grad, für die Kartendarstellung. */
  cellSizeLat: number;
  cellSizeLon: number;
  /** "Jetzt" bis +24h in 30-Minuten-Schritten (max. ~49 Frames). */
  frames: PrecipitationFrame[];
}

const VIENNA_LAT = 48.2082;
const VIENNA_LON = 16.3738;
const GRID_SIZE = 9; // 9x9 Gitter = 81 Punkte, deckt ~40x40 km ab
const LAT_STEP = 0.045; // ≈ 5 km
const LON_STEP = 0.0675; // ≈ 5 km bei ~48°N (Breitengrad-Korrektur)

const RAW_STEP_MIN = 15; // Auflösung der Open-Meteo minutely_15-Daten
const TARGET_STEP_MIN = 30; // gewünschte Slider-Auflösung
const SUBSAMPLE = TARGET_STEP_MIN / RAW_STEP_MIN; // = 2
const HORIZON_HOURS = 24;
const STEPS_NEEDED = (HORIZON_HOURS * 60) / TARGET_STEP_MIN; // = 48

@Injectable({ providedIn: 'root' })
export class PrecipitationForecastService {
  // Kostenlose, öffentliche API – kein Key nötig für nicht-kommerzielle Nutzung
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';

  getGrid(): Observable<PrecipitationGrid> {
    const cells = this.buildGrid();
    const lat = cells.map((c) => c.lat).join('%2C');
    const lon = cells.map((c) => c.lon).join('%2C');

    const url = [
      this.apiUrl,
      `?latitude=${lat}`,
      `&longitude=${lon}`,
      '&minutely_15=precipitation',
      '&forecast_days=2', // deckt "jetzt" + 24h sicher ab
      '&timezone=Europe%2FVienna',
    ].join('');

    return new Observable((observer) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = () => {
        try {
          const raw = JSON.parse(xhr.responseText);
          // Bei mehreren Koordinaten liefert Open-Meteo direkt ein Array, ein Objekt pro Punkt
          const perLocation: any[] = Array.isArray(raw) ? raw : [raw];

          if (perLocation.length !== cells.length || !perLocation[0]?.minutely_15?.time) {
            observer.error(new Error('Unerwartetes Antwortformat der Open-Meteo-API'));
            return;
          }

          const times: string[] = perLocation[0].minutely_15.time;
          const now = Date.now();
          let nowIndex = times.findIndex((t) => new Date(t).getTime() >= now);
          if (nowIndex === -1) nowIndex = 0;

          const endIndex = Math.min(nowIndex + STEPS_NEEDED * SUBSAMPLE, times.length - 1);

          const frames: PrecipitationFrame[] = [];
          for (let i = nowIndex; i <= endIndex; i += SUBSAMPLE) {
            frames.push({
              time: times[i],
              values: perLocation.map((loc) => loc.minutely_15.precipitation[i] ?? 0),
            });
          }

          observer.next({ cells, cellSizeLat: LAT_STEP, cellSizeLon: LON_STEP, frames });
          observer.complete();
        } catch (e) {
          observer.error(e);
        }
      };
      xhr.onerror = () => observer.error(new Error('Netzwerkfehler'));
      xhr.send();
    });
  }

  private buildGrid(): Array<{ lat: number; lon: number }> {
    const cells: Array<{ lat: number; lon: number }> = [];
    const half = Math.floor(GRID_SIZE / 2);
    for (let i = -half; i <= half; i++) {
      for (let j = -half; j <= half; j++) {
        cells.push({
          lat: Math.round((VIENNA_LAT + i * LAT_STEP) * 10000) / 10000,
          lon: Math.round((VIENNA_LON + j * LON_STEP) * 10000) / 10000,
        });
      }
    }
    return cells;
  }

  static formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });
  }

  /** Füllfarbe + Deckkraft für eine Niederschlagsmenge in mm/15min (Blauton wie RainViewer "Universal Blue"). */
  static colorFor(mm: number): { color: string; opacity: number } {
    if (mm <= 0.01) return { color: 'transparent', opacity: 0 };
    if (mm < 0.05) return { color: '#c9e6f5', opacity: 0.3 };
    if (mm < 0.1) return { color: '#8ecae6', opacity: 0.35 };
    if (mm < 0.5) return { color: '#4a9fd8', opacity: 0.5 };
    if (mm < 1.5) return { color: '#2f7dd1', opacity: 0.65 };
    if (mm < 4) return { color: '#1e50a2', opacity: 0.75 };
    return { color: '#4b1e91', opacity: 0.85 };
  }
}
