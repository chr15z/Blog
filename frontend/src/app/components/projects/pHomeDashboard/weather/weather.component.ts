import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherData, DailyWeather } from './weather.service';

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

  label(code: number): string {
    return WeatherService.weatherLabel(code);
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

  get today(): DailyWeather | null {
    if (!this.weather) return null;
    const daily = this.weather.daily[0];
    if (!daily) return null;
    // Wettercode vom aktuellen Stundenblock statt dem pessimistischen Tages-Aggregat
    const currentHour = this.weather.hourly[0];
    return {
      ...daily,
      weatherCode: currentHour?.weatherCode ?? daily.weatherCode,
    };
  }
}
