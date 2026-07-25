export class TechnologieDTO {
  public name: string;
  public image: string;
  public info: string;
  public type: TechnologieCategory;
}

export enum TechnologieCategory {
  ProgrammingLanguage = 'Programming Language',
  WebBackendDb = 'Web, Backend & DB',
  CiCd = 'CI / CD',
  Hardware = 'Hardware'
}
