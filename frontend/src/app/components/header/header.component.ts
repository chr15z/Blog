import {Component, OnInit, Renderer2} from '@angular/core';
import {BlurService} from "../../services/blur.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDarkMode = true;
  isDropdownOpen = false;

  constructor(private renderer: Renderer2,
              private dropdownService: BlurService) {
    this.dropdownService.isBlurred.subscribe(state => {
      this.isDropdownOpen = state;
    });
  }
  ngOnInit() {}

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.removeAttribute(document.documentElement, 'data-theme');
    } else {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'light');
    }
  }
  toggleBlur(isBlurred: boolean) {
    this.dropdownService.setBlurState(isBlurred);
  }


}
