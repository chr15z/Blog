import { Component } from '@angular/core';
import { ContentService, TechnologieKey } from '../../services/content.service';
import { TechnologieDTO } from '../../dtos/technologieDTO';
import { DetailViewDTO } from '../../dtos/detailViewDTO';

type HeroSectionVM = {
  id: number;
  title: string;
  subtitle: string; // HTML string
  image: string;
};

type TechnologiesSectionVM = {
  title: string;
  subtitle: string; // HTML string
  technologies: TechnologieDTO[];
};

@Component({
  selector: 'app-ticketLine',
  templateUrl: './ticketLine.component.html',
  styleUrls: ['./ticketLine.component.scss'],
})
export class TicketLineComponent {
  homePageContent: HeroSectionVM[] = [];
  technologies!: TechnologiesSectionVM;

  readonly galleryImages: string[] = Array.from({ length: 27 }, (_, i) => this.buildSepmPath(i + 1));

  private readonly screenshotIndexBySection: Record<number, number> = {};

  private readonly techKeys: TechnologieKey[] = ['angular', 'java', 'h2', 'gitlab'];

  isMuted: Record<number, boolean> = {};

  constructor(private contentService: ContentService) {
    const detail = this.contentService.getDetailViewSection('ticketLine') as DetailViewDTO;
    console.log(detail);

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
      this.isMuted[s.id] = true; // default: muted
      this.screenshotIndexBySection[s.id] = 0;
    }
  }

  private buildHeroSection(id: number, title: string, subtitle: string, image: string): HeroSectionVM {
    return { id, title, subtitle, image };
  }

  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.ogg');
  }

  toggleMute(video: HTMLVideoElement, id: number) {
    const next = !this.isMuted[id];
    this.isMuted[id] = next;
    video.muted = next;
  }

  // --- Screenshot gallery helpers ---

  private buildSepmPath(n: number): string {
    return `assets/images/sepm/sepm${n}.png`;
  }

  currentScreenshot(sectionId: number): string {
    const idx = this.screenshotIndexBySection[sectionId] ?? 0;
    return this.galleryImages[Math.max(0, Math.min(idx, this.galleryImages.length - 1))];
  }

  screenshotCounter(sectionId: number): string {
    const idx = (this.screenshotIndexBySection[sectionId] ?? 0) + 1;
    return `${idx} / ${this.galleryImages.length}`;
  }

  prevScreenshot(sectionId: number): void {
    const len = this.galleryImages.length;
    if (!len) return;
    const cur = this.screenshotIndexBySection[sectionId] ?? 0;
    this.screenshotIndexBySection[sectionId] = (cur - 1 + len) % len;
  }

  nextScreenshot(sectionId: number): void {
    const len = this.galleryImages.length;
    if (!len) return;
    const cur = this.screenshotIndexBySection[sectionId] ?? 0;
    this.screenshotIndexBySection[sectionId] = (cur + 1) % len;
  }
}
