import { Component } from '@angular/core';
import { ContentService, TechnologieKey } from '../../services/content.service';
import { TechnologieDTO } from '../../dtos/technologieDTO';
import { DetailViewDTO } from '../../dtos/detailViewDTO';

type HeroSectionVM = {
  id: number;
  title: string;
  subtitle: string; // html string
  image: string;
};

type TechnologiesSectionVM = {
  title: string;
  subtitle: string;
  technologies: TechnologieDTO[];
};

@Component({
  selector: 'app-notFound',
  templateUrl: './boxMentalist.component.html',
  styleUrls: ['./boxMentalist.component.scss'],
})
export class BoxMentalistComponent {
  homePageContent: HeroSectionVM[] = [];
  technologies!: TechnologiesSectionVM;

  private readonly techKeys: TechnologieKey[] = [
    'swift',
    'kotlin',
    'gloves',
    'githubActions',
  ];

  isMuted: Record<number, boolean> = {};

  constructor(private contentService: ContentService) {
    const detail = this.contentService.getDetailViewSection('boxMentalist') as DetailViewDTO;

    this.homePageContent = [
      this.buildHeroSection(1, 'Idea', detail.explanation, detail.image),
      this.buildHeroSection(2, 'Features', detail.features, detail.image),
    ];

    this.technologies = {
      title: 'Technologies',
      subtitle: detail.tech,
      technologies: this.techKeys
        .map((k) => this.contentService.getTechnologieSection(k))
        .filter((t): t is TechnologieDTO => t !== null),
    };

    for (const s of this.homePageContent) {
      this.isMuted[s.id] = true;
    }
  }

  private buildHeroSection(
    id: number,
    title: string,
    subtitle: string,
    image: string
  ): HeroSectionVM {
    return { id, title, subtitle, image };
  }

  isVideo(filePath: string): boolean {
    return (
      filePath.endsWith('.mp4') ||
      filePath.endsWith('.webm') ||
      filePath.endsWith('.ogg')
    );
  }

  toggleMute(video: HTMLVideoElement, id: number) {
    const next = !this.isMuted[id];
    this.isMuted[id] = next;
    video.muted = next;
  }
}
