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
    second.link = "/ticketLine";

    const third = new HomePageSectionDTO();
    third.title = "Cracking the Code";
    third.subtitle = "Sudoku Solving Algorithms: From Basic Strategies to Complex Computational Methods";
    third.image = "assets/images/sudoku.jpeg";
    third.id = 3;
    third.link = "/sudoku";

    const fourth = new HomePageSectionDTO();
    fourth.title = "Box Mentalist";
    fourth.subtitle = "A Study, developing and testing a digital game that combines boxing with music to support mental health";
    fourth.image = "assets/videos/boxMentalist.mp4";
    fourth.id = 4;
    fourth.link = "/boxMentalist";

    this.homePageContent = [first, second, third, fourth];
  }
  isMuted: boolean[] = [];

  ngOnInit() {
    // alle Videos initial stumm
    this.isMuted = this.homePageContent.map(() => true);
  }

  toggleMute(video: HTMLVideoElement, index: number) {
    this.isMuted[index] = !this.isMuted[index];
    video.muted = this.isMuted[index];
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
