import {Component, OnInit} from '@angular/core';
import {HomePageSectionDTO} from "../../dtos/homePageSectionDTO";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  homePageContent = [];

  constructor() {
    const first = new HomePageSectionDTO();
    first.title = "MyJourney";
    first.subtitle = "Organise your health stress-free: Keep an eye on appointments, vital signs and preventive medical check-ups. Benefit from reminders, gamification and a personal overview.";
    first.image = "assets/videos/myJourneyDemo.mp4";
    first.id = 1;
    first.link = "/myJourney";

    const second = new HomePageSectionDTO();
    second.title = "Behind the Scenes of Ticketline";
    second.subtitle = "Developing a Cutting-Edge Ticketing Platform for Concerts, Movies, and More";
    second.image = "assets/images/ticket2.jpg";
    second.id = 2;
    second.link = "/notFound";

    const third = new HomePageSectionDTO();
    third.title = "Cracking the Code";
    third.subtitle = "Sudoku Solving Algorithms: From Basic Strategies to Complex Computational Methods";
    third.image = "assets/images/sudoku.jpeg";
    third.id = 3;
    third.link = "/notFound";

    this.homePageContent = [first, second, third];
  }

  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.ogg');
  }
  scrollToProjects(): void {
    const section = document.getElementById('projectsSection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }


}
