import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Departure {
  line: string;
  towards: string;
  countdown: number;
  timeReal: string | null;
  barrierFree: boolean;
  type: 'ptMetro' | 'ptTram' | 'ptBusCity' | 'ptBusNight' | string;
}

export interface StopMonitor {
  stopName: string;
  stopLabel: string;
  departures: Departure[];
  error?: string;
}

export const STOPS: { rbl: number; stopLabel: string; filterLine?: string }[] = [
  // U6 Burggasse-Stadthalle – beide Richtungen
  // 4620 = Richtung Floridsdorf (Steig 1), 4609 = Richtung Siebenhirten (Steig 2)
  { rbl: 4620, stopLabel: 'U6 → Floridsdorf',    filterLine: 'U6' },
  { rbl: 4609, stopLabel: 'U6 → Siebenhirten',   filterLine: 'U6' },
  // Linie 49 Urban-Loritz-Platz → Ring (stadteinwärts)
  { rbl: 1477, stopLabel: '49 → Ring',            filterLine: '49' },
  // Linie 49 Urban-Loritz-Platz → Hütteldorf (stadtauswärts)
  { rbl: 1445, stopLabel: '49 → Hütteldorf',      filterLine: '49' },
  // Linie 18 Urban-Loritz-Platz → Schlachthausgasse (fährt von hier ab)
  { rbl: 462,  stopLabel: '18 → Schlachthausg.',  filterLine: '18' },
  // 48A Burggasse-Stadthalle → Ring (bestätigt RBL 1431)
  { rbl: 1431, stopLabel: '48A → Ring',            filterLine: '48A' },
  // Linie 5 Kaiserstraße/Burggasse → Praterstern (Richtung Prater)
  { rbl: 375,  stopLabel: '5 → Prater',            filterLine: '5' },
];

@Injectable({ providedIn: 'root' })
export class PublicTransitService {
  private readonly BASE = '/ogd_realtime/monitor';

  getMonitor(): Observable<StopMonitor[]> {
    const uniqueRbls = [...new Set(STOPS.map(s => s.rbl))];
    const rbls = uniqueRbls.map(r => `stopId=${r}`).join('&');
    const url = `${this.BASE}?${rbls}&activateTrafficInfo=stoerungkurz`;

    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);

      xhr.onload = () => {

        try {
          const json = JSON.parse(xhr.responseText);

          if (json.message?.messageCode !== 1 && !json.data?.monitors) {
            const reason = json.message?.value ?? 'API Fehler';
            console.error('[Transit] API returned error:', reason);
            observer.error(new Error(reason));
            return;
          }

          // Log welche RBLs die API zurückgegeben hat
          const returnedRbls = (json.data?.monitors ?? []).map(
            (m: any) => m.locationStop?.properties?.attributes?.rbl
          );

          const parsed = this.parse(json);

          observer.next(parsed);
          observer.complete();
        } catch (e) {
          console.error('[Transit] JSON parse error:', e);
          observer.error(e);
        }
      };

      xhr.onerror = (e) => {
        observer.error(new Error('Netzwerkfehler – Proxy prüfen'));
      };

      xhr.ontimeout = () => {
        observer.error(new Error('Timeout'));
      };

      xhr.timeout = 10_000;
      xhr.send();
    });
  }

  private parse(json: any): StopMonitor[] {
    const monitors: any[] = json.data?.monitors ?? [];
    const result: StopMonitor[] = [];

    for (const stop of STOPS) {
      const mon = monitors.find(
        (m: any) => Number(m.locationStop?.properties?.attributes?.rbl) === stop.rbl
      );

      if (!mon) {
        result.push({
          stopName: String(stop.rbl),
          stopLabel: stop.stopLabel,
          departures: [],
          error: 'Keine Daten',
        });
        continue;
      }

      const stopName: string =
        mon.locationStop?.properties?.title ?? String(stop.rbl);

      const departures: Departure[] = [];

      for (const line of mon.lines ?? []) {
        if (stop.filterLine && line.name !== stop.filterLine) continue;

        for (const dep of line.departures?.departure?.slice(0, 4) ?? []) {
          departures.push({
            line: line.name,
            towards: line.towards,
            countdown: dep.departureTime?.countdown ?? 0,
            timeReal: dep.departureTime?.timeReal ?? null,
            barrierFree: !!line.barrierFree,
            type: line.type,
          });
        }
      }

      departures.sort((a, b) => a.countdown - b.countdown);

      result.push({
        stopName,
        stopLabel: stop.stopLabel,
        departures: departures.slice(0, 4),
      });
    }

    return result;
  }

  static lineColor(line: string, type?: string): string {
    const map: Record<string, string> = {
      U1: '#e2001a', U2: '#a03070', U3: '#e87820',
      U4: '#00863a', U5: '#00a08e', U6: '#9b6e38',
    };
    if (map[line]) return map[line];
    // Trams immer rot
    if (type === 'ptTram') return '#e2001a';
    return '#344966';
  }

  static lineIcon(type: string): string {
    if (type === 'ptMetro')   return 'U';
    if (type === 'ptTram')    return '🚃';
    if (type.includes('Bus')) return '🚌';
    return '🚍';
  }
}
