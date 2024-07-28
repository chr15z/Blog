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
    first.image = "assets/images/sudoku3.jpeg";

    const second = new HomePageSectionDTO();
    second.title = "Decoding Sudoku";
    second.subtitle = "Advanced Solving Techniques. A Comprehensive Guide to Algorithmic Puzzle Solving";
    second.image = "assets/images/sudoku3.jpeg";
    this.homePageContent = [first, second]
  }

  ngOnInit() {
    this.dropdownService.isDropdownOpen$.subscribe(state => {
      this.isDropdownOpen = state;
    });
  }


}
