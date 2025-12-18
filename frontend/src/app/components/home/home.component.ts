import {Component} from '@angular/core';
import {ContentService} from "../../services/content.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  homePageContent = [];

  constructor(contentService: ContentService) {
    const boxMentalist = contentService.getHomePageSection("boxMentalist")
    const myJourney = contentService.getHomePageSection("myJourney")
    const ticketLine = contentService.getHomePageSection("ticketLine")
    const sudoku = contentService.getHomePageSection("sudoku")

    this.homePageContent = [boxMentalist, myJourney, ticketLine, sudoku];
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
