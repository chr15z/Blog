import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService, TechnologieKey } from '../../../services/content.service';
import { TechnologieDTO } from '../../../dtos/technologieDTO';
import { DetailViewDTO } from '../../../dtos/detailViewDTO';

type HeroSectionVM = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

type TechnologiesSectionVM = {
  title: string;
  subtitle: string;
  technologies: TechnologieDTO[];
};

@Component({
  selector: 'app-ctrl',
  templateUrl: './ctrl.component.html',
  styleUrls: ['./ctrl.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CtrlComponent {
  homePageContent: HeroSectionVM[] = [];
  technologies!: TechnologiesSectionVM;

  private readonly techKeys: TechnologieKey[] = [
    'angular',
    'springBoot',
    'postgresql',
    'docker',
    'gitlab',
    'junit',
  ];

  isMuted: Record<number, boolean> = {};

  constructor(private contentService: ContentService) {
    const detail = this.contentService.getDetailViewSection('ctrl') as DetailViewDTO;

    this.homePageContent = [
      this.buildHeroSection(1, 'Idea', detail.explanation, 'assets/videos/ctrlHome.mp4'),
      this.buildHeroSection(2, 'Features', detail.features, 'assets/videos/ctrlFeatures.mp4'),
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
