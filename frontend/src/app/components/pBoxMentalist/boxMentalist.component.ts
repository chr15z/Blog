import {Component} from '@angular/core';
import {HomePageSectionDTO} from "../../dtos/homePageSectionDTO";
import {ContentService, TechnologieKey} from "../../services/content.service";
import {TechnologieDTO} from "../../dtos/technologieDTO";

@Component({
  selector: 'app-notFound',
  templateUrl: './boxMentalist.component.html',
  styleUrls: ['./boxMentalist.component.scss']
})
export class BoxMentalistComponent {
  homePageContent: HomePageSectionDTO[] = [];
  technologies: HomePageSectionDTO;
  private readonly techKeys: TechnologieKey[] = [
    'swift',
    'kotlin',
    'gloves',
    'githubActions',
  ];
  isMuted: Record<number, boolean> = {};

  constructor(contentService: ContentService) {
    const boxMentalist = contentService.getDetailViewSection("boxMentalist")
    const first = new HomePageSectionDTO();
    first.title = "Idea";
    first.subtitle = boxMentalist.explanation;
    first.image = boxMentalist.image;

    const second = new HomePageSectionDTO();
    second.title = "Features";
    second.subtitle = boxMentalist.features;
    second.image = boxMentalist.image;

    this.homePageContent = [first, second];

    const third = new HomePageSectionDTO();
    third.title = "Technologies";
    third.subtitle = boxMentalist.tech
    third.technologies = this.techKeys
      .map((k) => contentService.getTechnologieSection(k))
      .filter((x): x is TechnologieDTO => x !== null);

    this.technologies = third;

    for (const s of this.homePageContent) {
      this.isMuted[s.id] = true;
    }
  }

  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.ogg');
  }

  toggleMute(video: HTMLVideoElement, id: number) {
    const next = !this.isMuted[id];
    this.isMuted[id] = next;
    video.muted = next;
  }

}
