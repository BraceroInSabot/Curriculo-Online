import type {
  Education,
  Experience,
  Profile,
  Project,
  Resume,
  SkillGroup,
} from '@domain/entities/Resume';
import type { ResumeRepository } from '@domain/repositories/ResumeRepository';
import { Period } from '@domain/value-objects/Period';
import type { YearMonth } from '@domain/value-objects/YearMonth';
import type { Clock } from '../ports/Clock';

export interface ExperienceOverview extends Experience {
  readonly isCurrent: boolean;
  readonly durationInMonths: number;
}

export type EducationStatus = 'em-andamento' | 'concluido';

export interface EducationOverview extends Education {
  readonly status: EducationStatus;
}

/** Saída do caso de uso: dados prontos para qualquer interface (web, PDF, CLI...). */
export interface ResumeOverview {
  readonly profile: Profile;
  readonly currentPosition: ExperienceOverview | null;
  readonly experiences: readonly ExperienceOverview[];
  readonly education: readonly EducationOverview[];
  readonly skillGroups: readonly SkillGroup[];
  readonly featuredProjects: readonly Project[];
  readonly otherProjects: readonly Project[];
}

export class GetResumeOverview {
  constructor(
    private readonly repository: ResumeRepository,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<ResumeOverview> {
    const resume = await this.repository.getResume();
    const today = this.clock.currentYearMonth();
    const experiences = this.toExperienceOverviews(resume, today);

    return {
      profile: resume.profile,
      currentPosition: experiences.find((experience) => experience.isCurrent) ?? null,
      experiences,
      education: this.toEducationOverviews(resume, today),
      skillGroups: resume.skillGroups,
      featuredProjects: resume.projects.filter((project) => project.featured),
      otherProjects: resume.projects.filter((project) => !project.featured),
    };
  }

  private toExperienceOverviews(resume: Resume, today: YearMonth): ExperienceOverview[] {
    return [...resume.experiences]
      .sort((a, b) => Period.byMostRecent(a.period, b.period))
      .map((experience) => ({
        ...experience,
        isCurrent: experience.period.isOngoingAt(today),
        durationInMonths: experience.period.durationInMonths(today),
      }));
  }

  private toEducationOverviews(resume: Resume, today: YearMonth): EducationOverview[] {
    return [...resume.education]
      .sort((a, b) => Period.byMostRecent(a.period, b.period))
      .map((education) => ({
        ...education,
        status: education.period.isOngoingAt(today) ? 'em-andamento' : 'concluido',
      }));
  }
}
