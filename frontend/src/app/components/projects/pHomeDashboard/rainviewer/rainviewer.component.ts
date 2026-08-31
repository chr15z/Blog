import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PrecipitationForecastService,
  PrecipitationFrame,
  PrecipitationGrid,
} from './precipitation-forecast.service';

// Wien, Stephansplatz-Umgebung als Kartenzentrum
const VIENNA_LAT = 48.2082;
const VIENNA_LON = 16.3738;
const CITY_ZOOM = 11; // fixe Ansicht der Stadt, kein Zoomen/Verschieben möglich
const TILE_SIZE = 256;

interface StaticTile {
  url: string;
  left: number;
  top: number;
}

interface CellPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * ACHTUNG, komplett anderer Ansatz als vorher: KEINE Kartenbibliothek mehr.
 *
 * Wir hatten wiederholt Rendering-Bugs (fehlende/überdimensionierte
 * Kacheln), die sich durch mehrere CSS-Anläufe nur verschoben, aber nie
 * behoben haben. Ursache war letztlich, dass wir für eine 100% statische
 * Ansicht (kein Pan/Zoom, fixer Ausschnitt, primär für Mobile-Karten) die
 * volle dynamische Leaflet-Maschinerie (Panes, Zoom-Animationen,
 * ResizeObserver + Kachel-Nachladen zur Laufzeit) mitgeschleppt haben.
 *
 * Da sich der Ausschnitt NIE ändert, reicht es, einmalig zu berechnen,
 * welche genau 4 OSM-Kacheln (2x2-Block) den Wien-Ausschnitt abdecken, und
 * sie als stinknormale <img>-Elemente mit festen (einmalig berechneten,
 * nie wieder angefassten) left/top-Pixelwerten zu positionieren. Kein
 * transform, keine Zoom-Klassen, kein Nachladen, kein Resize-Timing –
 * dadurch entfällt die komplette Bug-Klasse strukturell.
 *
 * Ausgelegt für die mobile (einspaltige) Darstellung des Dashboards; der
 * 512x512px-Kachelblock deckt die dort übliche Breite/Höhe bequem ab.
 */
@Component({
  selector: 'app-rainviewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rainviewer.component.html',
  styleUrl: './rainviewer.component.scss',
})
export class RainviewerComponent implements OnInit, OnDestroy {
  loading = true;
  error = false;
  errorMsg = '';

  /** "Jetzt" bis +24h in 30-Minuten-Schritten (Index 0 = jetzt). */
  frames: PrecipitationFrame[] = [];
  activeIndex = 0;

  /** Die exakt 4 statischen Kachel-Bilder, die den fixen Ausschnitt abdecken. */
  tiles: StaticTile[] = [];
  /**
   * Verschiebung des Kachel-Mosaiks per CSS-margin, damit Wien exakt in der
   * Mitte des Containers liegt – unabhängig von dessen tatsächlicher,
   * responsiver Größe. Läuft komplett über CSS (left/top: 50% + negativer
   * margin), braucht daher keinerlei JS-Resize-Beobachtung.
   */
  mosaicOffsetX = 0;
  mosaicOffsetY = 0;

  /** Statische Pixelposition jeder Niederschlags-Gitterzelle im Mosaik (ändert sich nie, nur Farbe/Deckkraft pro Frame). */
  cellPositions: CellPosition[] = [];

  /** Pro Zelle: Füllfarbe / Deckkraft / Tooltip-Text des aktuell gewählten Frames. */
  activeColors: string[] = [];
  activeOpacities: number[] = [];
  activeTitles: string[] = [];

  private mosaicOriginPxX = 0;
  private mosaicOriginPxY = 0;

  /**
   * Trailing-Edge-Throttle für den Slider: Bei 49 Werten auf einem schmalen
   * Mobile-Slider entsprechen wenige Pixel Fingerzittern schon einem Sprung
   * zwischen zwei Nachbarwerten. Ohne Drosselung feuert JEDES Mini-Zucken
   * sofort ein volles Repaint (81 Zellen + Uhrzeit-Text) -> sichtbares
   * Zittern/Hin-und-her-Springen. Der native Thumb bleibt davon unberührt
   * (der Browser trackt die Fingerposition selbst); wir drosseln nur, wie
   * oft WIR daraus Karte+Uhrzeit neu zeichnen.
   */
  private readonly SLIDE_THROTTLE_MS = 80;
  private slideThrottleTimer?: ReturnType<typeof setTimeout>;
  private pendingSlideIndex?: number;

  constructor(private forecastService: PrecipitationForecastService) {}

  ngOnInit(): void {
    this.setupStaticMosaic();

    this.forecastService.getGrid().subscribe({
      next: (grid) => {
        console.log('[RainviewerComponent] Grid empfangen:', {
          zellen: grid.cells.length,
          frames: grid.frames.length,
        });
        this.frames = grid.frames;
        this.loading = false;

        if (this.frames.length === 0) {
          this.error = true;
          this.errorMsg = 'Keine Vorhersagedaten verfügbar.';
          return;
        }

        this.buildCellPositions(grid);
        this.activeIndex = 0; // erster Frame = "jetzt"
        this.paintFrame(this.activeIndex);
      },
      error: (err) => {
        this.errorMsg = err?.message ?? 'Unbekannter Fehler';
        this.error = true;
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.slideThrottleTimer !== undefined) {
      clearTimeout(this.slideThrottleTimer);
    }
  }

  formatTime(iso: string): string {
    return PrecipitationForecastService.formatTime(iso);
  }

  isNow(index: number): boolean {
    return index === 0;
  }

  hoursAhead(index: number): number {
    return Math.round(index * 0.5 * 10) / 10; // Index-Schritt = 30 Min
  }

  onSlide(event: Event): void {
    const index = Number((event.target as HTMLInputElement).value);
    this.pendingSlideIndex = index;

    // Läuft schon ein Timer? Dann übernimmt der beim nächsten "Tick" ohnehin
    // den neuesten pendingSlideIndex – nichts weiter zu tun (das ist der
    // Unterschied zu Debounce: hier wird NICHT zurückgesetzt, sonst gäbe es
    // während des Ziehens gar kein Live-Update mehr, sondern nur am Ende).
    if (this.slideThrottleTimer !== undefined) {
      return;
    }

    this.slideThrottleTimer = setTimeout(() => {
      this.slideThrottleTimer = undefined;
      if (this.pendingSlideIndex === undefined) return;
      this.activeIndex = this.pendingSlideIndex;
      this.paintFrame(this.activeIndex);
    }, this.SLIDE_THROTTLE_MS);
  }

  /** Web-Mercator-Projektion: lat/lon -> Weltpixel-Koordinate bei gegebenem Zoom (Standardformel, identisch zu OSM/Google/Leaflet). */
  private static project(lat: number, lon: number, zoom: number): { x: number; y: number } {
    const scale = TILE_SIZE * Math.pow(2, zoom);
    const sinLat = Math.sin((lat * Math.PI) / 180);
    const x = (lon + 180) / 360;
    const y = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
    return { x: x * scale, y: y * scale };
  }

  /**
   * Berechnet EINMALIG (nicht bei Resize, nicht bei Zoom – es gibt keins),
   * welche 4 OSM-Kacheln den fixen Wien-Ausschnitt abdecken, und wie weit
   * das Mosaik verschoben werden muss, damit Wien in der Mitte des
   * Containers liegt.
   */
  private setupStaticMosaic(): void {
    const centerPx = RainviewerComponent.project(VIENNA_LAT, VIENNA_LON, CITY_ZOOM);
    const centerTileX = centerPx.x / TILE_SIZE;
    const centerTileY = centerPx.y / TILE_SIZE;

    // 2x2-Kachelblock so wählen, dass Wien möglichst nah an der mittleren
    // Kachelgrenze liegt (beste optische Zentrierung innerhalb des Blocks).
    const tileX0 = Math.round(centerTileX) - 1;
    const tileY0 = Math.round(centerTileY) - 1;

    this.mosaicOriginPxX = tileX0 * TILE_SIZE;
    this.mosaicOriginPxY = tileY0 * TILE_SIZE;

    this.tiles = [
      { x: tileX0, y: tileY0, left: 0, top: 0 },
      { x: tileX0 + 1, y: tileY0, left: TILE_SIZE, top: 0 },
      { x: tileX0, y: tileY0 + 1, left: 0, top: TILE_SIZE },
      { x: tileX0 + 1, y: tileY0 + 1, left: TILE_SIZE, top: TILE_SIZE },
    ].map(({ x, y, left, top }) => ({
      url: `https://tile.openstreetmap.org/${CITY_ZOOM}/${x}/${y}.png`,
      left,
      top,
    }));

    this.mosaicOffsetX = centerPx.x - this.mosaicOriginPxX;
    this.mosaicOffsetY = centerPx.y - this.mosaicOriginPxY;

    console.log('[RainviewerComponent] Statisches Kachel-Mosaik berechnet', {
      tiles: this.tiles.map((t) => t.url),
      mosaicOffsetX: this.mosaicOffsetX,
      mosaicOffsetY: this.mosaicOffsetY,
    });
  }

  /** Statische Pixelposition jeder Gitterzelle relativ zur Mosaik-Ecke – einmalig berechnet, ändert sich nie. */
  private buildCellPositions(grid: PrecipitationGrid): void {
    this.cellPositions = grid.cells.map((cell) => {
      const topLeft = RainviewerComponent.project(
        cell.lat + grid.cellSizeLat / 2,
        cell.lon - grid.cellSizeLon / 2,
        CITY_ZOOM,
      );
      const bottomRight = RainviewerComponent.project(
        cell.lat - grid.cellSizeLat / 2,
        cell.lon + grid.cellSizeLon / 2,
        CITY_ZOOM,
      );
      return {
        left: topLeft.x - this.mosaicOriginPxX,
        top: topLeft.y - this.mosaicOriginPxY,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
      };
    });
  }

  private paintFrame(index: number): void {
    const frame = this.frames[index];
    if (!frame) return;

    const colors: string[] = [];
    const opacities: number[] = [];
    const titles: string[] = [];
    let coloredCount = 0;

    frame.values.forEach((mm) => {
      const { color, opacity } = PrecipitationForecastService.colorFor(mm);
      colors.push(color);
      opacities.push(opacity);
      titles.push(`${mm.toFixed(2)} mm / 15min`);
      if (opacity > 0) coloredCount++;
    });

    this.activeColors = colors;
    this.activeOpacities = opacities;
    this.activeTitles = titles;

    console.log('[RainviewerComponent] paintFrame', {
      index,
      zeit: frame.time,
      eingefärbteZellen: `${coloredCount} / ${frame.values.length}`,
    });
  }
}
