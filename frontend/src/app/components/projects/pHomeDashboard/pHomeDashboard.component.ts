import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar/calendar.component';
import { WeatherComponent } from './weather/weather.component';
import { PublicTransitComponent } from './public-transit/public-transit.component';
import { RainviewerComponent } from './rainviewer/rainviewer.component';

@Component({
  selector: 'app-p-home-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    WeatherComponent,
    PublicTransitComponent,
    RainviewerComponent,
    // FootballComponent,
    // DailyQuoteComponent,
  ],
  templateUrl: './pHomeDashboard.component.html',
  styleUrl: './pHomeDashboard.component.scss',
})
export class PHomeDashboardComponent {}
