import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import {
  PrecipitationForecastService,
  PrecipitationFrame,
  PrecipitationGrid,
} from './precipitation-forecast.service';

// Wien, Stephansplatz-Umgebung als Kartenzentrum
const VIENNA: L.LatLngTuple = [48.2082, 16.3738];
const DEFAULT_ZOOM = 9;

@Component({
  selector: 'app-rainviewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rainviewer.component.html',
  styleUrl: './rainviewer.component.scss',
})
export class RainviewerComponent implements OnInit, OnDestroy {
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;

  loading = true;
  error = false;
  errorMsg = '';

  /** "Jetzt" bis +24h in 30-Minuten-Schritten (Index 0 = jetzt). */
  frames: PrecipitationFrame[] = [];
  activeIndex = 0;

  private map?: L.Map;
  private cellRects: L.Rectangle[] = [];
  private resizeObserver?: ResizeObserver;
  private stabilizeUntil = 0;

  constructor(private forecastService: PrecipitationForecastService) {}

  ngOnInit(): void {
    this.initMap();

    this.forecastService.getGrid().subscribe({
      next: (grid) => {
        this.frames = grid.frames;
        this.loading = false;

        if (this.frames.length === 0) {
          this.error = true;
          this.errorMsg = 'Keine Vorhersagedaten verfügbar.';
          return;
        }

        this.buildCells(grid);
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
    this.resizeObserver?.disconnect();
    this.map?.remove();
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
    this.activeIndex = index;
    this.paintFrame(index);
  }

  /** Setzt die Karte auf Ausgangsposition (Wien, Standard-Zoom) zurück. */
  recenter(): void {
    this.map?.setView(VIENNA, DEFAULT_ZOOM);
  }

  private initMap(): void {
    this.map = L.map(this.mapEl.nativeElement, {
      center: VIENNA,
      zoom: DEFAULT_ZOOM,
      minZoom: 7,
      maxZoom: 12,
      attributionControl: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      attribution:
        '© OpenStreetMap-Mitwirkende | Niederschlag: <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>',
    }).addTo(this.map);

    // Leaflet misst seinen Container beim Erzeugen einmalig. Wird die
    // Komponente in einem Grid/Flex-Layout gerendert, das die finale Größe
    // erst NACH diesem Zeitpunkt zuweist (z. B. CSS-Grid-Spalten des
    // Dashboards), stimmen Kachel-Raster und Zentrum danach nicht mehr exakt
    // überein – sichtbar als Versatz vom eigentlichen Zentrum und als weiße
    // Flecken beim Verschieben, weil neue Kacheln nach falschen Koordinaten
    // nachgeladen werden. Innerhalb eines kurzen Stabilisierungsfensters nach
    // dem Laden wird bei jeder Größenänderung deshalb nicht nur die Größe
    // korrigiert, sondern zusätzlich hart auf Wien zurückgesetzt. Nach Ablauf
    // des Fensters bleibt nur die reine Größenanpassung aktiv, damit späteres
    // manuelles Verschieben durch die Person nicht überschrieben wird.
    this.stabilizeUntil = Date.now() + 1200;

    const fixLayout = () => {
      if (!this.map) return;
      this.map.invalidateSize();
      if (Date.now() < this.stabilizeUntil) {
        this.map.setView(VIENNA, DEFAULT_ZOOM, { animate: false });
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(fixLayout));

    this.resizeObserver = new ResizeObserver(fixLayout);
    this.resizeObserver.observe(this.mapEl.nativeElement);
  }

  private buildCells(grid: PrecipitationGrid): void {
    if (!this.map) return;
    this.cellRects = grid.cells.map((cell) => {
      const bounds: L.LatLngBoundsExpression = [
        [cell.lat - grid.cellSizeLat / 2, cell.lon - grid.cellSizeLon / 2],
        [cell.lat + grid.cellSizeLat / 2, cell.lon + grid.cellSizeLon / 2],
      ];
      const rect = L.rectangle(bounds, {
        stroke: false,
        fillColor: 'transparent',
        fillOpacity: 0,
        interactive: true, // nötig, damit der Debug-Tooltip beim Hover erscheint
      }).addTo(this.map!);
      rect.bindTooltip('0 mm / 15min', { sticky: true, className: 'rainviewer__tooltip' });
      return rect;
    });
  }

  private paintFrame(index: number): void {
    const frame = this.frames[index];
    if (!frame) return;

    frame.values.forEach((mm, i) => {
      const { color, opacity } = PrecipitationForecastService.colorFor(mm);
      const rect = this.cellRects[i];
      if (!rect) return;
      rect.setStyle({ fillColor: color, fillOpacity: opacity });
      rect.setTooltipContent(`${mm.toFixed(2)} mm / 15min`);
    });
  }
}
