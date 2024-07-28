import {Component, OnInit} from '@angular/core';
import {DropdownService} from "../../services/dropdown.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isDropdownOpen = false;

  constructor(private dropdownService: DropdownService) {}

  ngOnInit() {
    this.dropdownService.isDropdownOpen$.subscribe(state => {
      this.isDropdownOpen = state;
    });
  }


}
