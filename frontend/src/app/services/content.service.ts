import {TechnologieDTO, TechnologieCategory} from "../dtos/technologieDTO";

export type HomePageSectionKey =
  | 'myJourney'
  | 'ticketLine'
  | 'sudoku'
  | 'boxMentalist'
  | 'ctrl';

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
  | 'gitlab'
  | 'docker'
  | 'python'
  | 'javascript'
  | 'php'
  | 'sql'
  | 'postgresql'
  | 'springBoot'
  | 'junit'
  | 'phpunit';
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

    const ctrl = new HomePageSectionDTO();
    ctrl.title = 'CTRL';
    ctrl.subtitle =
      'A social media platform built for conscious media consumption and full user control';
    ctrl.image = 'assets/videos/ctrlHome.mp4';
    ctrl.link = '/ctrl';
    this.homePageContent.set('ctrl', ctrl);
  }

  // --------------------
  // Technologie Sections
  // --------------------

  private initializeTechnologieContent(): void {
    // Programming Languages
    this.technologieContent.set('swift', {
      name: 'Swift',
      image: 'assets/images/logo-swift.png',
      info:
        'Swift is a powerful programming language for iOS.',
      type: TechnologieCategory.ProgrammingLanguage,
    });

    this.technologieContent.set('kotlin', {
      name: 'Kotlin',
      image: 'assets/images/logo-kotlin.png',
      info:
        'Kotlin is a statically typed, cross-platform programming language.',
      type: TechnologieCategory.ProgrammingLanguage,
    });

    this.technologieContent.set('java', {
      name: 'Java',
      image: 'assets/images/logo-java.png',
      info:
        'Backend language with helpful frameworks such as JUnit and Spring Boot.',
      type: TechnologieCategory.ProgrammingLanguage,
    });

    this.technologieContent.set('python', {
      name: 'Python',
      image: 'assets/images/logo-python.png',
      info:
        'Versatile, interpreted programming language used for backend development, scripting and automation.',
      type: TechnologieCategory.ProgrammingLanguage,
    });

    this.technologieContent.set('javascript', {
      name: 'JavaScript',
      image: 'assets/images/logo-javascript.png',
      info:
        'Dynamic scripting language for interactive web frontends and Node.js-based backends.',
      type: TechnologieCategory.ProgrammingLanguage,
    });

    this.technologieContent.set('php', {
      name: 'PHP',
      image: 'assets/images/logo-php.png',
      info:
        'Server-side scripting language widely used for dynamic web applications.',
      type: TechnologieCategory.ProgrammingLanguage,
    });

    this.technologieContent.set('sql', {
      name: 'SQL',
      image: 'assets/images/logo-sql.png',
      info:
        'Standard language for querying and managing relational databases.',
      type: TechnologieCategory.ProgrammingLanguage,
    });

    // Frameworks & Libraries
    this.technologieContent.set('angular', {
      name: 'Angular',
      image: 'assets/images/logo-angular.png',
      info:
        'TypeScript-based frontend component based framework.',
      type: TechnologieCategory.FrameworksLibraries,
    });

    this.technologieContent.set('vue', {
      name: 'Vue.js',
      image: 'assets/images/logo-vuejs.png',
      info:
        'Reactive, component-based JavaScript framework.',
      type: TechnologieCategory.FrameworksLibraries,
    });

    this.technologieContent.set('springBoot', {
      name: 'Spring Boot',
      image: 'assets/images/logo-java.png',
      info:
        'Java framework for building production-ready backend applications quickly.',
      type: TechnologieCategory.FrameworksLibraries,
    });

    this.technologieContent.set('junit', {
      name: 'JUnit',
      image: 'assets/images/logo-java.png',
      info:
        'Testing framework for Java used to write and run unit tests.',
      type: TechnologieCategory.FrameworksLibraries,
    });

    this.technologieContent.set('phpunit', {
      name: 'PHPUnit',
      image: 'assets/images/logo-php.png',
      info:
        'Testing framework for PHP used to write and run unit tests.',
      type: TechnologieCategory.FrameworksLibraries,
    });

    // Databases
    this.technologieContent.set('mongodb', {
      name: 'MongoDB',
      image: 'assets/images/logo-mongodb.png',
      info:
        'Flexible NoSQL document database using JSON.',
      type: TechnologieCategory.Database,
    });

    this.technologieContent.set('h2', {
      name: 'H2',
      image: 'assets/images/logo-h2.png',
      info:
        'H2 is a lightweight, in-memory SQL database.',
      type: TechnologieCategory.Database,
    });

    this.technologieContent.set('postgresql', {
      name: 'PostgreSQL',
      image: 'assets/images/logo-postgresql.png',
      info:
        'Powerful open-source relational database known for reliability and standards compliance.',
      type: TechnologieCategory.Database,
    });

    // DevOps & CI/CD
    this.technologieContent.set('githubActions', {
      name: 'GitHub Actions',
      image: 'assets/images/logo-github.png',
      info:
        'GitHub Actions is a CI/CD platform.',
      type: TechnologieCategory.DevOpsCiCd,
    });

    this.technologieContent.set('gitlab', {
      name: 'GitLab',
      image: 'assets/images/logo-gitlab.png',
      info:
        'GitLab is a CI/CD platform.',
      type: TechnologieCategory.DevOpsCiCd,
    });

    this.technologieContent.set('docker', {
      name: 'Docker',
      image: 'assets/images/logo-docker.png',
      info:
        'Docker packages applications and their dependencies into portable containers for consistent builds and deployments.',
      type: TechnologieCategory.DevOpsCiCd,
    });

    // Tools & Automation
    this.technologieContent.set('n8n', {
      name: 'n8n',
      image: 'assets/images/logo-n8n.png',
      info:
        'Backend solution for automating services and backend workflows.',
      type: TechnologieCategory.ToolsAutomation,
    });

    // Hardware
    this.technologieContent.set('gloves', {
      name: 'Sensor Input',
      image: 'assets/images/logo-gloves.jpeg',
      info:
        'Smart boxing gloves with inertial and force sensors providing real-time punch data for gameplay and feedback.',
      type: TechnologieCategory.Hardware,
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

    this.detailContent.set('ctrl', {
      explanation:
        'CTRL is a web-based social media platform that replaces the classic infinite feed with clearly bounded content sessions. Instead of keeping users on the platform for as long as possible, CTRL hands control over content and usage time back to them.<br><br>' +
        'Once a configured number of posts or a set time span is reached, a session ends deliberately - continuing to scroll becomes an active decision instead of an automatic default.<br><br>' +
        'This makes CTRL a European counter-design to platforms like Instagram or TikTok, built around transparency, trustworthy content and conscious media consumption instead of maximizing screen time.',
      features:
        '• Fixed content sessions instead of an infinite feed, with a configurable length (time or number of posts)<br>' +
        '• Public feed for verified creators and a private feed for mutual friends<br>' +
        '• Configurable algorithm ranking (recency, source quality, topics) plus a "Why am I seeing this?" explanation<br>' +
        '• Trust labels for posts and sources based on community voting<br>' +
        '• ID-Austria identity verification mock for public posting, along with reporting and moderation tools<br>' +
        '• Built-in chat for sharing posts and communicating directly with friends and much more!',
      tech:
        'The backend runs on Spring Boot with a PostgreSQL database, tested with JUnit and shipped as Docker containers through a GitLab CI/CD pipeline. The frontend is built with Angular.',
      image: 'assets/videos/ctrlHome.mp4',
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
