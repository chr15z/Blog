import { Injectable } from '@angular/core';
import {HomePageSectionDTO} from "../dtos/homePageSectionDTO";

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  currentContent: HomePageSectionDTO[] = [];
  private fillData() {
    const first = new HomePageSectionDTO();
    first.title = "Cracking the Code";
    first.subtitle = "Sudoku Solving Algorithms: From Basic Strategies to Complex Computational Methods";
    first.image = "assets/images/sudoku.jpeg";
    first.id = 1;
    const second = new HomePageSectionDTO();

    second.title = "Behind the Scenes of Ticketline";
    second.subtitle = "Developing a Cutting-Edge Ticketing Platform for Concerts, Movies, and More";
    second.image = "assets/images/ticket2.jpg";
    second.id = 2;
  }

  public getHomePageSectionById(id: number): HomePageSectionDTO {
    console.log("getHomePageSectionById", id);
    this.fillData();

    if (this.currentContent.length < id || id < 1) return null;
    return HomePageSectionDTO[id - 1];
  }
}
