import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherData, DailyWeather, HourlyWeather } from './weather.service';

/** Ein Eintrag der Stundenleiste: entweder ein Wetter-Stundenwert oder ein Sonnenauf-/-untergang. */
export interface TimelineItem {
  time: string;
  hour?: HourlyWeather;
  sun?: { type: 'sunrise' | 'sunset' };
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit {
  weather: WeatherData | null = null;
  loading = true;
  error = false;
  errorMsg = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.getWeather().subscribe({
      next: (data) => {
        this.weather = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err?.message ?? 'Unbekannter Fehler';
        this.error = true;
        this.loading = false;
      },
    });
  }

  icon(code: number, isDay = 1): string {
    return WeatherService.weatherIcon(code, isDay);
  }

  isRain(code: number): boolean {
    return WeatherService.isRain(code);
  }

  formatHour(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    if (d.getHours() === now.getHours() && d.getDate() === now.getDate()) {
      return 'Jetzt';
    }
    return `${d.getHours()} Uhr`;
  }

  formatDay(iso: string): string {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const d = new Date(iso + 'T00:00:00'); // verhindert Timezone-Verschiebung
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Heute';
    return days[d.getDay()];
  }

  formatTime(iso: string): string {
    // iso kann "2026-06-27T05:12" sein
    return iso.length >= 16 ? iso.slice(11, 16) : iso;
  }

  barStyle(day: DailyWeather, allDays: DailyWeather[]): { [key: string]: string } {
    const globalMin = Math.min(...allDays.map((d) => d.tempMin));
    const globalMax = Math.max(...allDays.map((d) => d.tempMax));
    const range = globalMax - globalMin || 1;
    const left = ((day.tempMin - globalMin) / range) * 100;
    const width = Math.max(((day.tempMax - day.tempMin) / range) * 100, 8);
    const heat = (day.tempMax - globalMin) / range;
    const g = Math.round(180 - heat * 130);
    return {
      left: `${left}%`,
      width: `${width}%`,
      background: `linear-gradient(to right, rgb(255,${g + 50},0), rgb(255,${g},0))`,
    };
  }

  /**
   * Stundenwerte und Sonnenauf-/-untergänge chronologisch zu einer Zeitleiste
   * zusammengeführt, damit Sonnenereignisse an der passenden Stelle im
   * 24h-Scroll erscheinen statt in einem eigenen Header.
   */
  get hourlyTimeline(): TimelineItem[] {
    if (!this.weather || this.weather.hourly.length === 0) return [];

    const hourly = this.weather.hourly;
    const start = new Date(hourly[0].time).getTime();
    const end = new Date(hourly[hourly.length - 1].time).getTime();

    const items: TimelineItem[] = hourly.map((h) => ({ time: h.time, hour: h }));

    for (const day of this.weather.daily) {
      const events: Array<['sunrise' | 'sunset', string]> = [
        ['sunrise', day.sunrise],
        ['sunset', day.sunset],
      ];
      for (const [type, time] of events) {
        const t = new Date(time).getTime();
        if (t >= start && t <= end) {
          items.push({ time, sun: { type } });
        }
      }
    }

    return items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }
}
