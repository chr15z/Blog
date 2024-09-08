import {Component, OnInit, Renderer2} from '@angular/core';
import {DropdownService} from "../../services/dropdown.service";
import {NewsletterService} from "../../services/newsletter.service";
import {UserDTO} from "../../dtos/userDTO";
import {ValidationException} from "../../exception/ValidationException";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isDropdownOpen = false;
  userName: string = '';
  userEmail: string = '';
  errorMessages: string[] = [];
  showErrorToast: boolean = false;

  constructor(private renderer: Renderer2,
              private dropdownService: DropdownService,
              private newsletterService: NewsletterService) {
    this.dropdownService.isDropdownOpen$.subscribe(state => {
      this.isDropdownOpen = state;
    });
  }

  ngOnInit() {
  }

  toggleBlur(isBlurred: boolean) {
    this.dropdownService.setDropdownState(isBlurred);
  }

  onAddUser(): void {
    const user: UserDTO = {
      name: this.userName,
      email: this.userEmail
    };

    try {
      this.newsletterService.addUserToNewsletter(user);
      this.errorMessages = [];
    } catch (error) {
      if (error instanceof ValidationException) {
        this.errorMessages = error.errors;
        this.showErrorToast = true;
        setTimeout(() => {
          this.showErrorToast = false;
        }, 5000);

      } else {
        console.error('Ein unbekannter Fehler ist aufgetreten:', error);
      }
    }
  }
  closeErrorToast(): void {
    this.showErrorToast = false;
  }

}
