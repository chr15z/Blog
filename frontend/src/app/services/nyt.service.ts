// src/app/services/nyt.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface TagesschauHomepageResponse {
  news: TagesschauArticle[];
}

export interface TagesschauArticle {
  date: string;
  topline: string;
  title: string;
  firstSentence: string;
  shareURL: string;
  details: string;   // <- wichtig für Volltext
  [key: string]: any;
}

// grobe Typisierung für das Artikel-JSON
export interface TagesschauArticleDetails {
  title: string;
  content?: { value: string }[]; // Textblöcke, oft HTML
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class NytService {
  private baseUrl = 'https://www.tagesschau.de/api2u';

  constructor(private http: HttpClient) {}

  getHomepageNews(): Observable<TagesschauArticle[]> {
    const url = `${this.baseUrl}/homepage/`;
    return this.http.get<TagesschauHomepageResponse>(url).pipe(
      map(res => res.news || [])
    );
  }

  getFirstHomepageNews(): Observable<TagesschauArticle | null> {
    return this.getHomepageNews().pipe(
      map(articles => (articles.length ? articles[0] : null))
    );
  }

  getArticleDetails(detailsUrl: string): Observable<TagesschauArticleDetails> {
    // detailsUrl ist meist schon eine komplette URL; falls nicht, prefixen:
    const url = detailsUrl.startsWith('http')
      ? detailsUrl
      : `${this.baseUrl}${detailsUrl}`;
    return this.http.get<TagesschauArticleDetails>(url);
  }
}
