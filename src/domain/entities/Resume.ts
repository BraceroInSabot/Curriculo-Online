import type { Period } from '../value-objects/Period';

export type ContactKind = 'email' | 'linkedin' | 'github' | 'kaggle' | 'website';

export interface ContactLink {
  readonly kind: ContactKind;
  readonly label: string;
  readonly url: string;
}

export interface Profile {
  readonly fullName: string;
  readonly shortName: string;
  readonly headline: string;
  readonly tagline: string;
  readonly location: string;
  readonly avatarUrl: string;
  readonly about: readonly string[];
  /** Papéis profissionais que se alternam no hero (ex.: "desenvolvedor", "professor"). */
  readonly roles: readonly string[];
  readonly contacts: readonly ContactLink[];
}

export interface Experience {
  readonly id: string;
  readonly role: string;
  readonly organization: string;
  readonly location: string;
  readonly period: Period;
  readonly summary: string;
  readonly highlights: readonly string[];
}

export type EducationLevel = 'Graduação' | 'Pós-graduação' | 'Curso livre';

export interface Education {
  readonly id: string;
  readonly course: string;
  readonly institution: string;
  readonly level: EducationLevel;
  readonly period: Period;
}

export interface SkillGroup {
  readonly category: string;
  readonly skills: readonly string[];
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly repositoryUrl: string;
  readonly liveUrl?: string;
  readonly featured: boolean;
}

/** Agregado raiz: o currículo completo. */
export interface Resume {
  readonly profile: Profile;
  readonly experiences: readonly Experience[];
  readonly education: readonly Education[];
  readonly skillGroups: readonly SkillGroup[];
  readonly projects: readonly Project[];
}
