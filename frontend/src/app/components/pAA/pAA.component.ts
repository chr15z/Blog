import {Component, OnInit} from '@angular/core';
import {HomePageSectionDTO} from "../../dtos/homePageSectionDTO";

@Component({
  selector: 'app-notFound',
  templateUrl: './pAA.component.html',
  styleUrls: ['./pAA.component.scss']
})
export class PAAComponent implements OnInit {
  isDropdownOpen = false;
  homePageContent = [];
  constructor() {
    const first = new HomePageSectionDTO();
    first.title = "Cracking the Code";
    first.subtitle = "Sudoku Solving Algorithms: From Basic Strategies to Complex Computational Methods";
    first.image = "assets/images/sudoku.jpeg";

    const second = new HomePageSectionDTO();
    second.title = "Behind the Scenes of Ticketline";
    second.subtitle = "Developing a Cutting-Edge Ticketing Platform for Concerts, Movies, and More";
    second.image = "assets/images/ticket2.jpg";

    this.homePageContent = [second, first, second, first, second];
  }

  ngOnInit() {
  }


}
