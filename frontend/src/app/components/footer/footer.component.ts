import {Component, OnInit, Renderer2} from '@angular/core';
import {BlurService} from "../../services/blur.service";
import {NewsletterService} from "../../services/newsletter.service";
import {UserDTO} from "../../dtos/userDTO";
import {ValidationException} from "../../exception/ValidationException";

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
