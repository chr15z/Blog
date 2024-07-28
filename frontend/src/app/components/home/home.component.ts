import {Component, OnInit} from '@angular/core';
import {DropdownService} from "../../services/dropdown.service";
import {HomePageSectionDTO} from "../../dtos/homePageSectionDTO";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isDropdownOpen = false;
  homePageContent = [];

  constructor(private dropdownService: DropdownService) {
    const first = new HomePageSectionDTO();
    first.title = "Cracking the Code";
    first.subtitle = "Sudoku Solving Algorithms: From Basic Strategies to Complex Computational Methods";
    first.image = "assets/images/sudoku.jpeg";

    const second = new HomePageSectionDTO();
    second.title = "Behind the Scenes of Ticketline";
    second.subtitle = "Developing a Cutting-Edge Ticketing Platform for Concerts, Movies, and More";
    second.image = "assets/images/ticket.jpg";

    this.homePageContent = [second, first];
  }

  ngOnInit() {
    this.dropdownService.isDropdownOpen$.subscribe(state => {
      this.isDropdownOpen = state;
    });
  }


}
