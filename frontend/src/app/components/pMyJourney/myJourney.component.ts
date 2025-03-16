import { Component, OnInit } from '@angular/core';
import { HomePageSectionDTO } from '../../dtos/homePageSectionDTO';

@Component({
  selector: 'app-myJourney',
  templateUrl: './myJourney.component.html',
  styleUrls: ['./myJourney.component.scss']
})
export class MyJourneyComponent implements OnInit {
  homePageContent: HomePageSectionDTO[] = [];
  technologies: HomePageSectionDTO;

  constructor() {
    const first = new HomePageSectionDTO();
    first.title = "Idea";
    first.subtitle = "myJourney is a mobile app for better organizing healthcare and treatments.<br><br>Users can manage appointments, vital signs, and treatment plans to reduce stress and gain a better overview of their health.<br><br>The app reminds users of checkups, vaccinations, and medical treatments to promote early diagnosis and prevention. It also enables the digital exchange of relevant health information with doctors.";
    first.image = "assets/videos/myJourneyDemo.mp4";
    first.id = 1;

    const second = new HomePageSectionDTO();
    second.title = "Features";
    second.subtitle = "The app offers a variety of functions to simplify users' everyday lives. After creating a personal profile, disease progression and medical treatments can be documented in detail. <br><br>Vaccinations and other relevant health data can be stored in a digital vaccination record. A key feature of myJourney is the ability to create customized patient journeys that track specific treatments or preventative measures. <br><br>Users can add new nodes with just a few clicks, for example, to record a vaccination or a doctor's visit. Automatic reminders ensure that upcoming health measures are not forgotten. <br><br>In addition, the app enables structured management of documents such as lab reports or medication plans. To improve interaction with healthcare providers, physicians can access a JSON-based view of the patient journey, which provides a quick and clear insight into the user's health history.";
    second.image = "assets/videos/myJourneyDemo.mp4";
    second.id = 2;

    this.homePageContent = [first, second];

    this.technologies = new HomePageSectionDTO();
    this.technologies.title = "Technologies";
    this.technologies.subtitle = "The app is built using modern technologies with a focus on modularity and scalability.";
    this.technologies.id = 4;
    this.technologies.technologies = [
      { name: "Frontend", image: "assets/images/logo-vuejs.png", info: "Vue.js is a JavaScript framework that uses a reactive and component-based architecture. Its large community and extensive libraries make it versatile, with a focus on easy integration and rapid development cycles." },
      { name: "Backend", image: "assets/images/logo-n8n.png", info: "n8n serves as an easy-to-use low-code solution for quickly implementing backend functionality and automating various services." },
      { name: "Database", image: "assets/images/logo-mongodb.png", info:"MongoDB is a document-oriented NoSQL database that is easily customizable thanks to its flexible schema. It uses the JSON format, which allows for rapid changes while integrating well with modern applications."},
      { name: "CI/CD", image: "assets/images/logo-github.png", info:"GitHub Actions is a continuous integration/continuous deployment tool from Microsoft that is tightly integrated with GitHub. They simplify development workflows and support the implementation of tests, builds, and simple deployments." },
    ];
  }

  ngOnInit() {}

  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.ogg');
  }
}
