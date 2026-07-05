import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BlurService } from "./services/blur.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CZ Blog ';
  isBlurred = false;
  hideChrome = false;

  constructor(
    private readonly dropdownService: BlurService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.dropdownService.isBlurred.subscribe(state => {
      this.isBlurred = state;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.hideChrome = event.urlAfterRedirects.startsWith('/homeDashboard');
    });
  }
}
