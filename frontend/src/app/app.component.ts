import { Component } from '@angular/core';
import {BlurService} from "./services/blur.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CZ Blog ';
  constructor(private readonly dropdownService: BlurService) { }
  isBlurred = false;
  ngOnInit(): void {
    this.dropdownService.isBlurred.subscribe(state => {
      this.isBlurred = state;
    });
  }
}
