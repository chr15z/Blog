// football.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {catchError, map, retry, timeout, switchMap, tap} from 'rxjs/operators';

export interface PlayerLite { name: string; club: string; }
export interface TicTacToe { leagues: string[]; nationalities: string[]; }
export interface CellCheck { ok: boolean; playerName?: string; reason?: string; }

@Injectable({ providedIn: 'root' })
export class FootballService {
  // via Angular-Dev-Proxy (/wdqs -> https://query.wikidata.org)
  private endpoint = '/wdqs/sparql';
  private headers = new HttpHeaders({
    Accept: 'application/sparql-results+json'
  });
  private httpTimeoutMs = 15000;

  // Ligen (Label -> QID)
  private static readonly LEAGUE_QID: Record<string, string> = {
    'Premier League': 'Q9448',
    'La Liga': 'Q324867',
    'Serie A': 'Q15804',
    'Bundesliga': 'Q82595',
    'Ligue 1': 'Q13394',
    'Eredivisie': 'Q167541',
    'Primeira Liga': 'Q182994',
    'Süper Lig': 'Q485568',
  };

  // Länder (deutsches Label -> QID)
  private static readonly COUNTRY_QID: Record<string, string> = {
    'Argentinien':'Q414','Brasilien':'Q155','Deutschland':'Q183','Frankreich':'Q142','Spanien':'Q29','Italien':'Q38','Portugal':'Q45',
    'Niederlande':'Q55','England':'Q21','Belgien':'Q31','Kroatien':'Q224','Uruguay':'Q77','Kolumbien':'Q739','Chile':'Q298','Mexiko':'Q96',
    'USA':'Q30','Kanada':'Q16','Schweiz':'Q39','Österreich':'Q40','Dänemark':'Q35','Norwegen':'Q20','Schweden':'Q34','Polen':'Q36',
    'Tschechien':'Q213','Serbien':'Q403','Türkei':'Q43','Marokko':'Q1028','Algerien':'Q262','Nigeria':'Q1033','Ghana':'Q117'
  };

  // Für dein TicTacToe
  private static readonly BEST_8_LEAGUES: readonly string[] = [
    'Premier League','La Liga','Serie A','Bundesliga','Ligue 1','Eredivisie','Primeira Liga','Süper Lig'
  ] as const;

  private static readonly TOP_30_NATIONALITIES: readonly string[] = [
    'Argentinien','Brasilien','Deutschland','Frankreich','Spanien','Italien','Portugal',
    'Niederlande','England','Belgien','Kroatien','Uruguay','Kolumbien','Chile','Mexiko',
    'USA','Kanada','Schweiz','Österreich','Dänemark','Norwegen','Schweden','Polen',
    'Tschechien','Serbien','Türkei','Marokko','Algerien','Nigeria','Ghana',
  ] as const;

  constructor(private http: HttpClient) {}


  /** 3 zufällige Ligen + 3 zufällige Nationalitäten */
  getRandomTicTacToe(): Observable<TicTacToe> {
    const pickN = <T,>(arr: readonly T[], n: number): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, n);
    };
    return of({
      leagues: pickN(FootballService.BEST_8_LEAGUES, 3),
      nationalities: pickN(FootballService.TOP_30_NATIONALITIES, 3),
    });
  }

  /**
   * Check: Nachname + (irgendein) Nationalteam des Landes + Klub in Liga.
   * Zwei Phasen (Kandidaten -> Constraints), QID-basiert, POST, mit Timeout/Retry.
   */
  validatePlayer(lastName: string, leagueLabel: string, countryLabel: string): Observable<CellCheck> {
    const leagueQ = FootballService.LEAGUE_QID[leagueLabel];
    const countryQ = FootballService.COUNTRY_QID[countryLabel];

    // einfache Guards
    const ln = (lastName || '').trim().toLowerCase();
    if (!ln || !leagueQ || !countryQ) {
      return of({ ok: false, reason: 'Bad input' });
    }

    // Eine kompakte Abfrage: Spieler (Nachname matcht), hat mind. ein
    // Nationalteam des Landes und mind. einen Klub in der Ziel-Liga.
    const query = `
    SELECT ?playerLabel WHERE {
      ?player wdt:P31 wd:Q5 ; wdt:P106 wd:Q937857 .
      # Nachname: Familienname (P734) ODER Label-Ende
      OPTIONAL { ?player wdt:P734 ?fam . ?fam rdfs:label ?famLabel .
                 FILTER(LANG(?famLabel) IN ("de","en")) }
      ?player rdfs:label ?pLabel .
      FILTER(LANG(?pLabel) IN ("de","en"))
      FILTER(
        (BOUND(?famLabel) && LCASE(STR(?famLabel)) = '${ln}')
        || REGEX(LCASE(STR(?pLabel)), "(^|\\\\s)${ln}$")
      )

      # Nationalteam (inkl. U-Teams) des Landes
      ?player p:P54 ?stNat .
      ?stNat ps:P54 ?natTeam .
      ?natTeam wdt:P31/wdt:P279* wd:Q6979593 ; wdt:P17 wd:${countryQ} .

      # Club in Ziel-Liga
      ?player p:P54 ?stClub .
      ?stClub ps:P54 ?club .
      FILTER(?club != ?natTeam)
      ?club wdt:P118 ?league .
      ?league wdt:P279* wd:${leagueQ} .

      SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
    }
    LIMIT 1
  `;

    // POST an WDQS (über deinen Dev-Proxy /wdqs/sparql)
    const params = new HttpParams().set('format', 'json');
    const headers = this.headers.set('Content-Type', 'application/sparql-query');

    return this.http.post(this.endpoint, query, { headers, params }).pipe(
      map((res: any) => {
        console.log(res);
        const hit = res?.results?.bindings?.[0]?.playerLabel?.value;
        return hit ? { ok: true, playerName: hit } : { ok: false };
      }),
      timeout(this.httpTimeoutMs),
      retry(1),
      catchError(() => of({ ok: false }))
    );
  }



}
