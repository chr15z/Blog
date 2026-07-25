export class TechnologieDTO {
  public name: string;
  public image: string;
  public info: string;
  public type: TechnologieCategory;
}

export enum TechnologieCategory {
  ProgrammingLanguage = 'Programming Languages',
  FrameworksLibraries = 'Frameworks & Libraries',
  Database = 'Databases',
  DevOpsCiCd = 'DevOps & CI/CD',
  ToolsAutomation = 'Tools & Automation',
  Hardware = 'Hardware',
}
