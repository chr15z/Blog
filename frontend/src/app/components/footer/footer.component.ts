import {Component, OnInit, Renderer2} from '@angular/core';
import {DropdownService} from "../../services/dropdown.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isDropdownOpen = false;

  constructor(private renderer: Renderer2,
              private dropdownService: DropdownService) {
    this.dropdownService.isDropdownOpen$.subscribe(state => {
      this.isDropdownOpen = state;
    });
  }

  ngOnInit() {
  }

  addUserToNewsletter(): void {

  }
  toggleBlur(isBlurred: boolean) {
    this.dropdownService.setDropdownState(isBlurred);
  }
}
