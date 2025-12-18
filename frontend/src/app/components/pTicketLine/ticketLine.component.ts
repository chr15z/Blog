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
    first.image = "assets/videos/-.mp4";
    first.id = 1;

    const second = new HomePageSectionDTO();
    second.title = "Features";
    second.subtitle =
      "ticketLine offers a wide range of features that make planning and enjoying events as convenient as possible.<br><br>" +
      "Users can search and filter events by category, date, location, or artist. Interactive seat maps enable transparent seat selection with real-time availability and pricing.<br><br>" +
      "In addition to tickets, the integrated merch shop allows users to purchase fan merchandise and event-related products. Organizers benefit from tools for managing news, merch, events, price categories.";
    second.image = "assets/videos/-.mp4";
    second.id = 2;
    this.homePageContent = [first, second];

    this.technologies = new HomePageSectionDTO();
    this.technologies.title = "Technologies";
    this.technologies.subtitle = "The app is built using modern technologies with a focus on modularity and scalability.";
    this.technologies.id = 4;
    this.technologies.technologies = [{
      name: "Frontend",
      image: "assets/images/logo-angular.png",
      info: "Angular is a TypeScript-based frontend framework developed by Google. It provides a robust component architecture, two-way data binding, and powerful tooling for building scalable web applications."
    },
      {
        name: "Backend",
        image: "assets/images/logo-java.png",
        info: "Java is a widely used, platform-independent backend language known for its stability, performance, and strong ecosystem. It is commonly used for building secure, scalable server-side applications."
      },
      {
        name: "Database",
        image: "assets/images/logo-h2.png",
        info: "H2 is a lightweight, in-memory relational database written in Java. It is often used for development and testing due to its fast performance, easy setup, and SQL compatibility."
      },
      {
        name: "CI/CD",
        image: "assets/images/logo-gitlab.png",
        info: "GitLab CI/CD is an integrated DevOps solution that automates testing, building, and deployment pipelines. It enables seamless continuous integration and delivery directly within GitLab repositories."
      }
    ];
  }

  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.ogg');
  }

  ngOnInit() {}
}
