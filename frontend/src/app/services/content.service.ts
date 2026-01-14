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

  private readonly homePageContent = new Map<HomePageSectionKey, HomePageSectionDTO>();
  private readonly technologieContent = new Map<TechnologieKey, TechnologieDTO>();
  private readonly detailContent = new Map<HomePageSectionKey, DetailViewDTO>();

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
      name: 'Swift',
      image: 'assets/images/logo-swift.png',
      info:
        'Swift is a powerful programming language for iOS.',
    });

    this.technologieContent.set('kotlin', {
      name: 'Wearable SDK (Kotlin)',
      image: 'assets/images/logo-kotlin.png',
      info:
        'Kotlin is a statically typed, cross-platform programming language.',
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
        'GitHub Actions is a CI/CD platform.',
    });

    this.technologieContent.set('vue', {
      name: 'Frontend (Vue.js)',
      image: 'assets/images/logo-vuejs.png',
      info:
        'Reactive, component-based JavaScript framework.',
    });

    this.technologieContent.set('n8n', {
      name: 'Backend (n8n)',
      image: 'assets/images/logo-n8n.png',
      info:
        'backend solution for automating services and backend workflows.',
    });

    this.technologieContent.set('mongodb', {
      name: 'Database (MongoDB)',
      image: 'assets/images/logo-mongodb.png',
      info:
        'Flexible NoSQL document database using JSON.',
    });

    this.technologieContent.set('angular', {
      name: 'Frontend (Angular)',
      image: 'assets/images/logo-angular.png',
      info:
        'TypeScript-based frontend component based framework.',
    });

    this.technologieContent.set('java', {
      name: 'Backend (Java)',
      image: 'assets/images/logo-java.png',
      info:
        'backend language with helpful frameworks as JUint and spring boot.',
    });

    this.technologieContent.set('h2', {
      name: 'Database (H2)',
      image: 'assets/images/logo-h2.png',
      info:
        'H2 is a lightweight, in-memory SQL database.',
    });

    this.technologieContent.set('gitlab', {
      name: 'CI/CD (GitLab)',
      image: 'assets/images/logo-gitlab.png',
      info:
        'GitLab is a CI/CD platform.',
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

    this.detailContent.set('myJourney', {
      explanation: "myJourney is a mobile app for better organizing healthcare and treatments.<br><br>Users can manage appointments, vital signs, and treatment plans to reduce stress and gain a better overview of their health.<br><br>The app reminds users of checkups, vaccinations, and medical treatments to promote early diagnosis and prevention. It also enables the digital exchange of relevant health information with doctors.",
      features: "The app offers a variety of functions to simplify users' everyday lives. After creating a personal profile, disease progression and medical treatments can be documented in detail. <br><br>Vaccinations and other relevant health data can be stored in a digital vaccination record. A key feature of myJourney is the ability to create customized patient journeys that track specific treatments or preventative measures. <br><br>Users can add new nodes with just a few clicks, for example, to record a vaccination or a doctor's visit. Automatic reminders ensure that upcoming health measures are not forgotten. <br><br>In addition, the app enables structured management of documents such as lab reports or medication plans. To improve interaction with healthcare providers, physicians can access a JSON-based view of the patient journey, which provides a quick and clear insight into the user's health history.",
      tech: "The app is built using modern technologies with a focus on modularity and scalability.",
      image: 'assets/videos/myJourneyDemo.mp4',
    });

    this.detailContent.set('ticketLine', {
      explanation:
        'TicketLine is a ticketing platform for discovering, booking, and managing live event similar to Eventim or Ö-Tickets. <br><br>With integrated seat maps, ticketLine makes it easy to choose the best available seats and complete the purchase in just a few steps. In addition, a built-in merch shop allows users to buy fan articles and related products for their favorite events.',
      features:
        '• Management of events such as concerts, movies, and theater performances with configurable dates, venues, prices, and seating layouts.<br>' +
        '• Reservation of specific event tickets with real-time availability checks.<br>' +
        '• Complete ticket purchase workflow from selection to confirmation.<br>' +
        '• Integrated merchandise shop for additional products related to events.<br>' +
        '• News page for announcements, updates, and featured events.<br>' +
        '• Global Search to find everything you need quickly.<br><br>' +
        'The platform supports different user roles:<br>' +
        '• Customer role: browsing events, reserving tickets, purchasing tickets, and buying merchandise.<br>' +
        '• Admin role: creating and managing events, ticket contingents, pricing, and published content.',
      tech:
        'TicketLine was built with Angular, Java, H2 and GitLab CI/CD.',
      image: 'assets/images/sepm/sepm5.png',
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
