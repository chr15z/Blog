import { Injectable } from '@angular/core';
import { HomePageSectionDTO } from '../dtos/homePageSectionDTO';

export type HomePageSectionKey =
  | 'myJourney'
  | 'ticketLine'
  | 'sudoku'
  | 'boxMentalist';

@Injectable({
  providedIn: 'root',
})
export class ContentService {

  private contentMap = new Map<HomePageSectionKey, HomePageSectionDTO>();

  constructor() {
    this.fillData();
  }

  private fillData(): void {
    // MyJourney
    const myJourney = new HomePageSectionDTO();
    myJourney.title = 'MyJourney';
    myJourney.subtitle =
      'Organise your health stress-free: Keep an eye on appointments, vital signs and preventive medical check-ups. Benefit from reminders, gamification and a personal overview.';
    myJourney.image = 'assets/videos/myJourneyDemo.mp4';
    myJourney.link = '/myJourney';

    this.contentMap.set('myJourney', myJourney);

    // TicketLine
    const ticketLine = new HomePageSectionDTO();
    ticketLine.title = 'Behind the Scenes of Ticketline';
    ticketLine.subtitle =
      'Developing a Cutting-Edge Ticketing Platform for Concerts, Movies, and More';
    ticketLine.image = 'assets/images/ticket2.jpg';
    ticketLine.link = '/ticketLine';

    this.contentMap.set('ticketLine', ticketLine);

    // Cracking the Code
    const sudoku = new HomePageSectionDTO();
    sudoku.title = 'Cracking the Code';
    sudoku.subtitle =
      'Sudoku Solving Algorithms: From Basic Strategies to Complex Computational Methods';
    sudoku.image = 'assets/images/sudoku.jpeg';
    sudoku.link = '/sudoku';

    this.contentMap.set('sudoku', sudoku);

    // Box Mentalist
    const boxMentalist = new HomePageSectionDTO();
    boxMentalist.title = 'Box Mentalist';
    boxMentalist.subtitle =
      'A Study, developing and testing a digital game that combines boxing with music to support mental health';
    boxMentalist.image = 'assets/videos/boxMentalist.mp4';
    boxMentalist.link = '/boxMentalist';

    this.contentMap.set('boxMentalist', boxMentalist);
  }

  public getHomePageSection(
    key: HomePageSectionKey
  ): HomePageSectionDTO | null {
    return this.contentMap.get(key) ?? null;
  }

  public getAllHomePageSections(): HomePageSectionDTO[] {
    return Array.from(this.contentMap.values());
  }
}
