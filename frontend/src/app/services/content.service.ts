import {TechnologieDTO} from "../dtos/technologieDTO";

export type HomePageSectionKey =
  | 'myJourney'
  | 'ticketLine'
  | 'sudoku'
  | 'boxMentalist';

export type TechnologieKey =
  | 'swift'
  | 'kotlin'
  | 'gloves'
  | 'githubActions'
  | 'vue'
  | 'n8n'
  | 'mongodb'
  | 'angular'
  | 'java'
  | 'h2'
  | 'gitlab';
import { Injectable } from '@angular/core';
import { HomePageSectionDTO } from '../dtos/homePageSectionDTO';
import {DetailViewDTO} from "../dtos/detailViewDTO";

@Injectable({
  providedIn: 'root',
})
export class ContentService {

  private homePageContent = new Map<HomePageSectionKey, HomePageSectionDTO>();
  private technologieContent = new Map<TechnologieKey, TechnologieDTO>();
  private detailContent = new Map<HomePageSectionKey, DetailViewDTO>();

  constructor() {
    this.initializeHomePageContent();
    this.initializeTechnologieContent();
    this.initializeDetailContent();
  }

  // --------------------
  // Home Page Sections
  // --------------------
  private initializeHomePageContent(): void {
    const myJourney = new HomePageSectionDTO();
    myJourney.title = 'MyJourney';
    myJourney.subtitle =
      'Organise your health stress-free: Keep an eye on appointments, vital signs and preventive medical check-ups. Benefit from reminders, gamification and a personal overview.';
    myJourney.image = 'assets/videos/myJourneyDemo.mp4';
    myJourney.link = '/myJourney';
    this.homePageContent.set('myJourney', myJourney);

    const ticketLine = new HomePageSectionDTO();
    ticketLine.title = 'Behind the Scenes of Ticketline';
    ticketLine.subtitle =
      'Developing a Cutting-Edge Ticketing Platform for Concerts, Movies, and More';
    ticketLine.image = 'assets/images/ticket2.jpg';
    ticketLine.link = '/ticketLine';
    this.homePageContent.set('ticketLine', ticketLine);

    const sudoku = new HomePageSectionDTO();
    sudoku.title = 'Cracking the Code';
    sudoku.subtitle =
      'Sudoku Solving Algorithms: From Basic Strategies to Complex Computational Methods';
    sudoku.image = 'assets/images/sudoku.jpeg';
    sudoku.link = '/sudoku';
    this.homePageContent.set('sudoku', sudoku);

    const boxMentalist = new HomePageSectionDTO();
    boxMentalist.title = 'Box Mentalist';
    boxMentalist.subtitle =
      'A Study, developing and testing a digital game that combines boxing with music to support mental health';
    boxMentalist.image = 'assets/videos/boxMentalist.mp4';
    boxMentalist.link = '/boxMentalist';
    this.homePageContent.set('boxMentalist', boxMentalist);
  }

  // --------------------
  // Technologie Sections
  // --------------------

  private initializeTechnologieContent(): void {
    this.technologieContent.set('swift', {
      name: 'Mobile App (Swift)',
      image: 'assets/images/logo-swift.png',
      info:
        'Native iOS app built with Swift and Xcode, enabling direct BLE access and stable real-time interaction with smart boxing gloves.',
    });

    this.technologieContent.set('kotlin', {
      name: 'Wearable SDK (Kotlin)',
      image: 'assets/images/logo-kotlin.png',
      info:
        'Kotlin Multiplatform SDK for accessing sensor data such as punch timing and intensity via Bluetooth Low Energy.',
    });

    this.technologieContent.set('gloves', {
      name: 'Sensor Input',
      image: 'assets/images/logo-gloves.jpeg',
      info:
        'Smart boxing gloves with inertial and force sensors providing real-time punch data for gameplay and feedback.',
    });

    this.technologieContent.set('githubActions', {
      name: 'CI/CD (GitHub Actions)',
      image: 'assets/images/logo-github.png',
      info:
        'Automated testing, builds, and deployments tightly integrated into GitHub workflows.',
    });

    this.technologieContent.set('vue', {
      name: 'Frontend (Vue.js)',
      image: 'assets/images/logo-vuejs.png',
      info:
        'Reactive, component-based JavaScript framework optimized for rapid development and easy integration.',
    });

    this.technologieContent.set('n8n', {
      name: 'Backend (n8n)',
      image: 'assets/images/logo-n8n.png',
      info:
        'Low-code backend solution for automating services and implementing backend workflows quickly.',
    });

    this.technologieContent.set('mongodb', {
      name: 'Database (MongoDB)',
      image: 'assets/images/logo-mongodb.png',
      info:
        'Flexible NoSQL document database using JSON, ideal for rapidly evolving applications.',
    });

    this.technologieContent.set('angular', {
      name: 'Frontend (Angular)',
      image: 'assets/images/logo-angular.png',
      info:
        'TypeScript-based frontend framework by Google for scalable and structured web applications.',
    });

    this.technologieContent.set('java', {
      name: 'Backend (Java)',
      image: 'assets/images/logo-java.png',
      info:
        'Stable, platform-independent backend language with a strong ecosystem for scalable applications.',
    });

    this.technologieContent.set('h2', {
      name: 'Database (H2)',
      image: 'assets/images/logo-h2.png',
      info:
        'Lightweight, in-memory SQL database used mainly for development and testing.',
    });

    this.technologieContent.set('gitlab', {
      name: 'CI/CD (GitLab)',
      image: 'assets/images/logo-gitlab.png',
      info:
        'Integrated DevOps pipeline solution for automating builds, tests, and deployments.',
    });
  }

  initializeDetailContent(){
    this.detailContent.set('boxMentalist', {
      explanation: "BoxMentalist is a prototype being used in a study. This study is testing a digital game that combines boxing with music. Using sensor-equipped boxing gloves, players punch a punching bag while guided by the game on their smartphones.<br><br>The idea behind it is to create an easily accessible offering that strengthens mental health and helps people better manage stress and distressing emotions.<br><br>With this study, we aim to better understand how participants experience a session with this game. Specifically, we are examining their self-reported mood immediately before and after playing, how helpful the game is perceived to be in coping with stress, and its potential for regular use.",
      features: "The prototype provides a set of core features that demonstrate how the concept can support users with mental issues. Users can start short game sessions that combine rhythmic boxing movements with music, using smart boxing gloves as an input device.<br><br>" +
        "Before and after each session, users can perform a brief mood check. Following a session, users may optionally add a short diary entry to capture personal reflections or thoughts. This should help to reflect emotional states<br><br>" +
        "During gameplay, punches are detected by the gloves and evaluated primarily based on their timing relative to the musical rhythm. The prototype provides immediate visual feedback to support engagement and rhythm awareness.<br><br>" +
        "To encourage continued use, the prototype includes individual medals that reward repeated sessions and exploration of different content. All recorded mood entries and diary notes are stored locally and can be reviewed in a structured journal view, supporting longer-term self-reflection within the scope of the prototype.",
      tech: "The prototype was implemented using a focused technology stack chosen to support rapid iteration, sensor-based interaction, and evaluation within the scope of a bachelor thesis.\n",
      image: 'assets/videos/boxMentalist.mp4',
    });
  }
  // --------------------
  // Public API
  // --------------------
  getHomePageSection(key: HomePageSectionKey): HomePageSectionDTO | null {
    return this.homePageContent.get(key) ?? null;
  }

  getTechnologieSection(key: TechnologieKey): TechnologieDTO | null {
    return this.technologieContent.get(key) ?? null;
  }

  getDetailViewSection(key: HomePageSectionKey): DetailViewDTO | null {
    return this.detailContent.get(key) ?? null;
  }

}
