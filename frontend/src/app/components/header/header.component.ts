import {Component, OnInit, Renderer2} from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {DropdownService} from "../../services/dropdown.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDarkMode = true;
  isDropdownOpen = false;

  constructor(private renderer: Renderer2, private dropdownService: DropdownService) {
    this.dropdownService.isDropdownOpen$.subscribe(state => {
      this.isDropdownOpen = state;
    });
  }
  ngOnInit() {}
  selectedItem: any;
  suggestions: any[] = [];

  search(event: any) {
    // Your search logic here
    const query = event.query;
    this.suggestions = this.getSuggestions(query);
  }  getSuggestions(query: string): any[] {
    // Replace with actual suggestion logic
    return [
      { name: 'Item1' },
      { name: 'Item2' },
      { name: 'Item3' }
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.removeAttribute(document.documentElement, 'data-theme');
    } else {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'light');
    }
  }
  toggleBlur(isBlurred: boolean) {
    this.dropdownService.setDropdownState(isBlurred);
  }


}
