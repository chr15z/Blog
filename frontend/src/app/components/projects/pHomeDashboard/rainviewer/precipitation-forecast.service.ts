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
  /** Gesamte Abdeckung des Gitters (Wien + Umgebungsradius) für den initialen Kartenausschnitt. */
  bounds: { south: number; west: number; north: number; east: number };
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

const LOG = '[PrecipitationForecastService]';

@Injectable({ providedIn: 'root' })
export class PrecipitationForecastService {
  // Kostenlose, öffentliche API – kein Key nötig für nicht-kommerzielle Nutzung
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';

  getGrid(): Observable<PrecipitationGrid> {
    const cells = this.buildGrid();
    const bounds = this.buildBounds();

    console.group(`${LOG} getGrid() – Anfrage vorbereiten`);
    console.log('Gittergröße:', `${GRID_SIZE}x${GRID_SIZE}`, '=', cells.length, 'Punkte');
    console.log('Erste Zelle:', cells[0]);
    console.log('Letzte Zelle:', cells[cells.length - 1]);
    console.log('Bounds (Wien + Radius):', bounds);
    console.groupEnd();

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

    console.log(LOG, 'Request-URL:', url);
    console.log(LOG, 'URL-Länge:', url.length, 'Zeichen');

    return new Observable((observer) => {
      const startedAt = performance.now();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);

      xhr.onload = () => {
        const durationMs = Math.round(performance.now() - startedAt);

        console.group(`${LOG} Antwort erhalten (${durationMs} ms)`);
        console.log('HTTP-Status:', xhr.status, xhr.statusText);
        console.log('Antwortgröße:', xhr.responseText.length, 'Zeichen');

        try {
          const raw = JSON.parse(xhr.responseText);
          console.log('Rohdaten (geparst):', raw);

          // Bei mehreren Koordinaten liefert Open-Meteo direkt ein Array, ein Objekt pro Punkt
          const perLocation: any[] = Array.isArray(raw) ? raw : [raw];
          console.log(
            'Anzahl Locations in Antwort:',
            perLocation.length,
            '(erwartet:',
            cells.length,
            ')',
          );

          if (perLocation.length !== cells.length || !perLocation[0]?.minutely_15?.time) {
            console.error(LOG, 'Unerwartetes Antwortformat!', {
              perLocationLength: perLocation.length,
              expectedLength: cells.length,
              firstLocation: perLocation[0],
            });
            console.groupEnd();
            observer.error(new Error('Unerwartetes Antwortformat der Open-Meteo-API'));
            return;
          }

          const times: string[] = perLocation[0].minutely_15.time;
          console.log('Zeitpunkte insgesamt (minutely_15):', times.length);
          console.log('Erster Zeitpunkt (roh, lokal):', times[0]);
          console.log('Letzter Zeitpunkt (roh, lokal):', times[times.length - 1]);

          const now = Date.now();
          console.log(
            'Aktuelle Zeit laut Browser:',
            new Date(now).toString(),
            '/ ISO:',
            new Date(now).toISOString(),
          );

          let nowIndex = times.findIndex((t) => new Date(t).getTime() >= now);
          if (nowIndex === -1) {
            console.warn(LOG, 'Kein Zeitpunkt >= jetzt gefunden – falle auf Index 0 zurück');
            nowIndex = 0;
          }
          console.log('nowIndex:', nowIndex, '-> Zeitpunkt:', times[nowIndex]);

          const endIndex = Math.min(nowIndex + STEPS_NEEDED * SUBSAMPLE, times.length - 1);
          console.log('endIndex:', endIndex, '-> Zeitpunkt:', times[endIndex]);
          console.log(
            'SUBSAMPLE:',
            SUBSAMPLE,
            `(jeder ${SUBSAMPLE}. 15-Min-Rohwert wird zu einem 30-Min-Frame)`,
          );

          const frames: PrecipitationFrame[] = [];
          for (let i = nowIndex; i <= endIndex; i += SUBSAMPLE) {
            const values = perLocation.map((loc) => loc.minutely_15.precipitation[i] ?? 0);
            frames.push({ time: times[i], values });
          }

          console.log('Anzahl erzeugter Frames:', frames.length, '(erwartet: ~', STEPS_NEEDED + 1, ')');

          if (frames.length > 0) {
            const allValues: number[] = [];
            frames.forEach((f) => allValues.push(...f.values));
            const maxMm = Math.max(...allValues);
            const nonZeroCount = allValues.filter((v) => v > 0).length;

            console.log('Frame 0 (jetzt) – Rohwerte pro Zelle:', frames[0].values);
            console.log(
              'Maximaler Niederschlagswert über alle Frames/Zellen:',
              maxMm,
              'mm/15min',
            );
            console.log(
              'Werte > 0 insgesamt:',
              nonZeroCount,
              'von',
              allValues.length,
              `(${((nonZeroCount / allValues.length) * 100).toFixed(1)}%)`,
            );

            console.table(
              frames.map((f, idx) => ({
                index: idx,
                zeit: f.time,
                maxInFrame: Math.max(...f.values).toFixed(2),
                zellenMitRegen: f.values.filter((v) => v > 0).length,
              })),
            );
          } else {
            console.warn(LOG, 'Keine Frames erzeugt – nowIndex/endIndex prüfen!');
          }

          console.groupEnd();

          observer.next({
            cells,
            cellSizeLat: LAT_STEP,
            cellSizeLon: LON_STEP,
            bounds,
            frames,
          });
          observer.complete();
        } catch (e) {
          console.error(LOG, 'Fehler beim Parsen der Antwort:', e);
          console.groupEnd();
          observer.error(e);
        }
      };

      xhr.onerror = () => {
        console.error(LOG, 'Netzwerkfehler bei der Anfrage an:', url);
        observer.error(new Error('Netzwerkfehler'));
      };

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

  /** Randkoordinaten des Gitters (Wien + Umgebungsradius), inkl. der halben Randzelle. */
  private buildBounds(): { south: number; west: number; north: number; east: number } {
    const half = Math.floor(GRID_SIZE / 2) + 0.5;
    return {
      south: VIENNA_LAT - half * LAT_STEP,
      north: VIENNA_LAT + half * LAT_STEP,
      west: VIENNA_LON - half * LON_STEP,
      east: VIENNA_LON + half * LON_STEP,
    };
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
