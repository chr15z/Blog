import {Component, OnInit} from '@angular/core';
import {ContentService, TechnologieKey} from '../../services/content.service';
import {TechnologieDTO} from '../../dtos/technologieDTO';

type TechCard = {
  title: string;
  category?: string;
  image: string;
  bullets: string[];
};

@Component({
  selector: 'app-notFound',
  templateUrl: './aboutMe.html',
  styleUrls: ['./aboutMe.component.scss']
})
export class AboutMeComponent implements OnInit {

  constructor(private readonly contentService: ContentService) { }

  techStack: TechCard[] = [];

  roles: string[] = [
    'I am a developer.',
    'I am a student.',
    'Check out my CV.',
  ];
  currentRoleIndex: number = 0;
  currentRole: string = this.roles[0];

  ngOnInit(): void {
    this.startRoleRotation();
    this.loadTechStack();
  }

  private loadTechStack(): void {
    // Keep an explicit order so the layout stays stable.
    const keys: TechnologieKey[] = [
      'angular',
      'vue',
      'java',
      'mongodb',
      'h2',
      'gitlab',
      'githubActions',
      'swift',
      'kotlin',
      'gloves',
      'n8n',
    ];

    const dtos: TechnologieDTO[] = keys
      .map((k) => this.contentService.getTechnologieSection(k))
      .filter((t): t is TechnologieDTO => !!t);

    this.techStack = dtos.map((t) => this.toTechCard(t));
  }

  private toTechCard(dto: TechnologieDTO): TechCard {
    const parsed = this.parseTechName(dto.name);
    return {
      title: parsed.title,
      category: parsed.category,
      image: dto.image,
      bullets: this.toBullets(dto.info),
    };
  }

  private parseTechName(name: string): { title: string; category?: string } {
    const match = name.match(/^(.*?)\((.*?)\)\s*$/);
    if (!match) return { title: name.trim() };

    const category = match[1].trim().replace(/\s+$/, '');
    const title = match[2].trim();
    return {
      title: title || name.trim(),
      category: category || undefined,
    };
  }

  private toBullets(info: string): string[] {
    if (!info?.trim()) return [];

    // Split into readable bullets (keep it short so cards stay compact).
    const parts = info
      .replace(/\s+/g, ' ')
      .split(/\.\s+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((p) => (p.endsWith('.') ? p : `${p}.`));

    return parts.length ? parts : [info.trim()];
  }

  startRoleRotation(): void {
    setInterval(() => {
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      this.currentRole = this.roles[this.currentRoleIndex];
    }, 2000);
  }
}
