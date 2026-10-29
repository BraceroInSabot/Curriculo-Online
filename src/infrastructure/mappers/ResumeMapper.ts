import type { Resume } from '@domain/entities/Resume';
import { Period } from '@domain/value-objects/Period';
import { YearMonth } from '@domain/value-objects/YearMonth';
import type { RawPeriod, RawResume } from '../data/resumeData';

/** Converte dados brutos (strings) em entidades de domínio validadas. */
export class ResumeMapper {
  static toDomain(raw: RawResume): Resume {
    return {
      profile: raw.profile,
      experiences: raw.experiences.map((experience) => ({
        ...experience,
        period: ResumeMapper.toPeriod(experience.period),
      })),
      education: raw.education.map((education) => ({
        ...education,
        period: ResumeMapper.toPeriod(education.period),
      })),
      skillGroups: raw.skillGroups,
      projects: raw.projects,
    };
  }

  private static toPeriod({ start, end }: RawPeriod): Period {
    return Period.create(YearMonth.parse(start), end ? YearMonth.parse(end) : null);
  }
}
