import { Component, OnInit } from '@angular/core';
import { HomePageSectionDTO } from '../../dtos/homePageSectionDTO';

@Component({
  selector: 'app-ticketLine',
  templateUrl: './ticketLine.component.html',
  styleUrls: ['./ticketLine.component.scss']
})
export class TicketLineComponent implements OnInit {

  homePageContent: HomePageSectionDTO[] = [];
  technologies: HomePageSectionDTO;

  constructor() {
    const first = new HomePageSectionDTO();
    first.title = "Idea";
    first.subtitle =
      "ticketLine is a modern platform for discovering, booking, and managing live events – similar to Eventim or Ö-Tickets.<br><br>" +
      "Users can browse concerts, theater performances, sports events, and more, check event details and news, and purchase tickets directly through the platform.<br><br>" +
      "With integrated seat maps, ticketLine makes it easy to choose the best available seats and complete the purchase in just a few steps. In addition, a built-in merch shop allows users to buy fan articles and related products for their favorite events.";
    first.image = "assets/videos/myJourneyDemo.mp4";
    first.id = 1;

    const second = new HomePageSectionDTO();
    second.title = "Features";
    second.subtitle =
      "ticketLine offers a wide range of features that make planning and enjoying events as convenient as possible.<br><br>" +
      "Users can search and filter events by category, date, location, or artist. Interactive seat maps enable transparent seat selection with real-time availability and pricing.<br><br>" +
      "In addition to tickets, the integrated merch shop allows users to purchase fan merchandise and event-related products. Organizers benefit from tools for managing news, merch, events, price categories.";
    second.image = "assets/videos/myJourneyDemo.mp4";
    second.id = 2;
    this.homePageContent = [first, second];

    this.technologies = new HomePageSectionDTO();
    this.technologies.title = "Technologies";
    this.technologies.subtitle = "The app is built using modern technologies with a focus on modularity and scalability.";
    this.technologies.id = 4;
    this.technologies.technologies = [
      { name: "Frontend", image: "assets/images/favicon.ico", info: "Vue.js is a JavaScript framework that uses a reactive and component-based architecture. Its large community and extensive libraries make it versatile, with a focus on easy integration and rapid development cycles." },
      { name: "Backend", image: "assets/images/favicon.ico", info: "n8n serves as an easy-to-use low-code solution for quickly implementing backend functionality and automating various services." },
      { name: "Database", image: "assets/images/favicon.ico", info:"MongoDB is a document-oriented NoSQL database that is easily customizable thanks to its flexible schema. It uses the JSON format, which allows for rapid changes while integrating well with modern applications."},
      { name: "CI/CD", image: "assets/images/favicon.ico", info:"GitHub Actions is a continuous integration/continuous deployment tool from Microsoft that is tightly integrated with GitHub. They simplify development workflows and support the implementation of tests, builds, and simple deployments." },
    ];
  }

  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.ogg');
  }

  ngOnInit() {}
}
