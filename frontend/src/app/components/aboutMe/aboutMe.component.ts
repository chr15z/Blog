import {Component, OnInit} from '@angular/core';
import {ContentService, TechnologieKey} from '../../services/content.service';
import {TechnologieCategory} from '../../dtos/technologieDTO';

type TechCard = {
  key: TechnologieKey;
  title: string;
  image: string;
  type: TechnologieCategory;
};

type TechGroup = {
  type: TechnologieCategory;
  items: TechCard[];
};

@Component({
  selector: 'app-notFound',
  templateUrl: './aboutMe.html',
  styleUrls: ['./aboutMe.component.scss']
})
export class AboutMeComponent implements OnInit {

  constructor(private readonly contentService: ContentService) { }

  // Fixed display order for the tech categories (also used for the filter chips).
  readonly categories: TechnologieCategory[] = [
    TechnologieCategory.ProgrammingLanguage,
    TechnologieCategory.WebBackendDb,
    TechnologieCategory.CiCd,
  ];

  techGroups: TechGroup[] = [];
  activeFilter: TechnologieCategory | 'all' = 'all';

  // GitHub contribution graph (rendered via ghchart.rshah.org as an SVG image)
  private readonly githubUsername = 'chr15z';
  readonly githubChartUrl = `https://ghchart.rshah.org/${this.githubUsername}`;

  ngOnInit(): void {
    this.loadTechStack();
  }

  get visibleGroups(): TechGroup[] {
    return this.activeFilter === 'all'
      ? this.techGroups
      : this.techGroups.filter((group) => group.type === this.activeFilter);
  }

  setFilter(filter: TechnologieCategory | 'all'): void {
    this.activeFilter = filter;
  }

  trackByKey(_index: number, tech: TechCard): TechnologieKey {
    return tech.key;
  }

  private loadTechStack(): void {
    const keys: TechnologieKey[] = [
      'swift', 'kotlin', 'java',
      'angular', 'vue', 'n8n', 'mongodb', 'h2',
      'githubActions', 'gitlab', 'docker',
    ];

    const cards: TechCard[] = keys
      .map((key) => ({key, dto: this.contentService.getTechnologieSection(key)}))
      .filter((entry) => !!entry.dto)
      .map(({key, dto}) => ({
        key,
        title: dto!.name,
        image: dto!.image,
        type: dto!.type,
      }));

    this.techGroups = this.categories
      .map((type) => ({type, items: cards.filter((card) => card.type === type)}))
      .filter((group) => group.items.length > 0);
  }
}
