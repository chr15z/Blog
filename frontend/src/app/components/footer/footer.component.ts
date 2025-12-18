import {Component} from '@angular/core';
import {BlurService} from "../../services/blur.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isDropdownOpen = false;

  constructor(private readonly dropdownService: BlurService) {
    this.dropdownService.isBlurred.subscribe(state => {
      this.isDropdownOpen = state;
    });
  }

  toggleBlur(isBlurred: boolean) {
    this.dropdownService.setBlurState(isBlurred);
  }



}
