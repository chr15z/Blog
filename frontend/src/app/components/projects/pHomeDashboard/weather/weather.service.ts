import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HourlyWeather {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: number;
}

export interface DailyWeather {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  precipitationProbabilityMax: number;
}

export interface WeatherData {
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  getWeather(): Observable<WeatherData> {
    // Hardcoded URL – kein Encoding, kein URLSearchParams, kein HttpClient
    const url = [
      'https://api.open-meteo.com/v1/forecast',
      '?latitude=48.2085',
      '&longitude=16.3721',
      '&hourly=temperature_2m%2Cweather_code%2Cis_day',
      '&daily=weather_code%2Ctemperature_2m_max%2Ctemperature_2m_min%2Csunrise%2Csunset%2Cprecipitation_probability_max',
      '&forecast_days=7',
      '&timezone=Europe%2FVienna',
    ].join('');

    return new Observable((observer) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = () => {
        try {
          const raw = JSON.parse(xhr.responseText);
          if (raw.error) {
            observer.error(new Error(raw.reason));
          } else {
            observer.next(this.parseResponse(raw));
            observer.complete();
          }
        } catch (e) {
          observer.error(e);
        }
      };
      xhr.onerror = () => observer.error(new Error('Netzwerkfehler'));
      xhr.send();
    });
  }

  private parseResponse(raw: any): WeatherData {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const hourly: HourlyWeather[] = raw.hourly.time
      .map((t: string, i: number) => ({
        time: t,
        temperature: Math.round(raw.hourly.temperature_2m[i]),
        weatherCode: raw.hourly.weather_code[i],
        isDay: raw.hourly.is_day[i],
      }))
      .filter((h: HourlyWeather) => {
        const hTime = new Date(h.time);
        const isCurrentHour =
          hTime.getFullYear() === now.getFullYear() &&
          hTime.getMonth() === now.getMonth() &&
          hTime.getDate() === now.getDate() &&
          hTime.getHours() === now.getHours();
        return isCurrentHour || (hTime > now && hTime <= in24h);
      });

    const daily: DailyWeather[] = raw.daily.time.map((t: string, i: number) => ({
      date: t,
      weatherCode: raw.daily.weather_code[i],
      tempMax: Math.round(raw.daily.temperature_2m_max[i]),
      tempMin: Math.round(raw.daily.temperature_2m_min[i]),
      sunrise: raw.daily.sunrise[i],
      sunset: raw.daily.sunset[i],
      precipitationProbabilityMax: raw.daily.precipitation_probability_max[i],
    }));

    // Heute: aktuellen Stundencode statt pessimistischem Tages-Aggregat
    if (daily.length > 0 && hourly.length > 0) {
      daily[0] = { ...daily[0], weatherCode: hourly[0].weatherCode };
    }

    return { hourly, daily };
  }

  static weatherIcon(code: number, isDay = 1): string {
    if (code === 0)  return isDay ? '☀️' : '🌙';
    if (code <= 2)   return isDay ? '🌤️' : '🌙';
    if (code === 3)  return '☁️';
    if (code <= 49)  return '🌫️';
    if (code <= 59)  return '🌦️';
    if (code <= 69)  return '🌧️';
    if (code <= 79)  return '🌨️';
    if (code <= 82)  return '🌧️';
    if (code <= 86)  return '🌨️';
    if (code <= 99)  return '⛈️';
    return '❓';
  }

  static weatherLabel(code: number): string {
    if (code === 0)  return 'Klar';
    if (code <= 2)   return 'Leicht bewölkt';
    if (code === 3)  return 'Bewölkt';
    if (code <= 49)  return 'Neblig';
    if (code <= 59)  return 'Nieselregen';
    if (code <= 69)  return 'Regen';
    if (code <= 79)  return 'Schneefall';
    if (code <= 82)  return 'Schauer';
    if (code <= 86)  return 'Schneeschauer';
    if (code <= 99)  return 'Gewitter';
    return 'Unbekannt';
  }
}
