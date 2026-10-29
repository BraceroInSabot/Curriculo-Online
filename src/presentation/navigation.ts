export interface NavigationItem {
  readonly id: string;
  readonly label: string;
}

export const SECTION_IDS = {
  top: 'topo',
  about: 'sobre',
  experience: 'experiencia',
  education: 'formacao',
  skills: 'habilidades',
  projects: 'projetos',
  contact: 'contato',
} as const;

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { id: SECTION_IDS.about, label: 'Sobre' },
  { id: SECTION_IDS.experience, label: 'Experiência' },
  { id: SECTION_IDS.education, label: 'Formação' },
  { id: SECTION_IDS.projects, label: 'Projetos' },
  { id: SECTION_IDS.contact, label: 'Contato' },
];
