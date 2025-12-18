import {Component, OnInit} from '@angular/core';
import {HomePageSectionDTO} from "../../dtos/homePageSectionDTO";

@Component({
  selector: 'app-notFound',
  templateUrl: './boxMentalist.component.html',
  styleUrls: ['./boxMentalist.component.scss']
})
export class BoxMentalistComponent {
  homePageContent: HomePageSectionDTO[] = [];
  technologies: HomePageSectionDTO;

  constructor() {
    const first = new HomePageSectionDTO();
    first.title = "Idea";
    first.subtitle = "BoxMentalist is a prototype being used in a study. This study is testing a digital game that combines boxing with music. Using sensor-equipped boxing gloves, players punch a punching bag while guided by the game on their smartphones.<br><br>The idea behind it is to create an easily accessible offering that strengthens mental health and helps people better manage stress and distressing emotions.<br><br>With this study, we aim to better understand how participants experience a session with this game. Specifically, we are examining their self-reported mood immediately before and after playing, how helpful the game is perceived to be in coping with stress, and its potential for regular use.";
    first.image = "assets/videos/boxMentalist.mp4";
    first.id = 1;

    const second = new HomePageSectionDTO();
    second.title = "Features";
    second.subtitle =
      "The prototype provides a set of core features that demonstrate how the concept can support users with mental issues. Users can start short game sessions that combine rhythmic boxing movements with music, using smart boxing gloves as an input device.<br><br>" +
      "Before and after each session, users can perform a brief mood check. Following a session, users may optionally add a short diary entry to capture personal reflections or thoughts. This should help to reflect emotional states<br><br>" +
      "During gameplay, punches are detected by the gloves and evaluated primarily based on their timing relative to the musical rhythm. The prototype provides immediate visual feedback to support engagement and rhythm awareness.<br><br>" +
      "To encourage continued use, the prototype includes individual medals that reward repeated sessions and exploration of different content. All recorded mood entries and diary notes are stored locally and can be reviewed in a structured journal view, supporting longer-term self-reflection within the scope of the prototype.";
    second.image = "assets/videos/boxMentalist.mp4";
    second.id = 2;

    this.homePageContent = [first, second];
    this.technologies = new HomePageSectionDTO();
    this.technologies.title = "Technologies";
    this.technologies.subtitle =
      "The prototype was implemented using a focused technology stack chosen to support rapid iteration, sensor-based interaction, and evaluation within the scope of a bachelor thesis.";
    this.technologies.id = 4;
    this.technologies.technologies = [
      {
        name: "Mobile App",
        image: "assets/images/logo-swift.png",
        info: "The prototype was developed as a native iOS application using Swift and Xcode. This setup enabled direct access to Bluetooth Low Energy interfaces and ensured stable real-time interaction with the smart boxing gloves."
      },
      {
        name: "Wearable SDK",
        image: "assets/images/logo-kotlin.png",
        info: "A Kotlin Multiplatform SDK provided by the glove manufacturer was used to access sensor data such as punch timing and intensity. The SDK communicates via Bluetooth Low Energy and abstracts low-level device communication."
      },
      {
        name: "Sensor Input",
        image: "assets/images/logo-gloves.jpeg",
        info: "Smart boxing gloves equipped with inertial and force sensors serve as the primary input device. Punch events are transmitted wirelessly and processed by the application to drive gameplay and feedback."
      },
      { name: "CI/CD", image: "assets/images/logo-github.png", info:"GitHub Actions is a continuous integration/continuous deployment tool from Microsoft that is tightly integrated with GitHub. They simplify development workflows and support the implementation of tests, builds, and simple deployments." },

    ];

    for (const s of this.homePageContent) {
      this.isMuted[s.id] = true;
    }
  }

  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.ogg');
  }

  isMuted: Record<number, boolean> = {};



  toggleMute(video: HTMLVideoElement, id: number) {
    const next = !this.isMuted[id];
    this.isMuted[id] = next;
    video.muted = next;

  }
}
