import {Component, OnInit} from '@angular/core';
import {BlurService} from "../../services/blur.service";
import {HomePageSectionDTO} from "../../dtos/homePageSectionDTO";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  homePageContent = [];

  constructor() {
    const first = new HomePageSectionDTO();
    first.title = "Cracking the Code";
    first.subtitle = "Sudoku Solving Algorithms: From Basic Strategies to Complex Computational Methods";
    first.image = "assets/images/sudoku.jpeg";
    first.id = 1;
    first.link = "/sudoku";
    const second = new HomePageSectionDTO();

    second.title = "Behind the Scenes of Ticketline";
    second.subtitle = "Developing a Cutting-Edge Ticketing Platform for Concerts, Movies, and More";
    second.image = "assets/images/ticket2.jpg";
    second.id = 2;
    second.link = "/notFound";

    this.homePageContent = [second, first];
  }

  ngOnInit() {
  }


}
