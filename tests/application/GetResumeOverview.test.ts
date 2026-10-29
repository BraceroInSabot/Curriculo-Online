import { describe, expect, it } from 'vitest';
import type { Clock } from '@application/ports/Clock';
import { GetResumeOverview } from '@application/use-cases/GetResumeOverview';
import type { Resume } from '@domain/entities/Resume';
import type { ResumeRepository } from '@domain/repositories/ResumeRepository';
import { Period } from '@domain/value-objects/Period';
import { YearMonth } from '@domain/value-objects/YearMonth';

const ym = YearMonth.parse;

const fixedClock = (value: string): Clock => ({ currentYearMonth: () => ym(value) });

const inMemoryRepository = (resume: Resume): ResumeRepository => ({
  getResume: async () => resume,
});

const buildResume = (): Resume => ({
  profile: {
    fullName: 'Guilherme Bracero',
    shortName: 'Bracero',
    headline: 'Dev',
    tagline: 'Sou professor e desenvolvedor de software com experiência em suporte técnico e desenvolvimento web.',
    location: 'Jales, SP',
    avatarUrl: '',
    about: [],
    roles: [],
    contacts: [],
  },
  experiences: [
    { id: 'antiga', role: 'Estágio', organization: 'X', location: '', summary: '', highlights: [], period: Period.create(ym('2023-12'), ym('2024-06')) },
    { id: 'atual', role: 'Professor', organization: 'Y', location: '', summary: '', highlights: [], period: Period.create(ym('2026-02')) },
    { id: 'meio', role: 'Suporte', organization: 'Z', location: '', summary: '', highlights: [], period: Period.create(ym('2024-06'), ym('2025-10')) },
  ],
  education: [
    { id: 'grad', course: 'ADS', institution: 'Fatec', level: 'Graduação', period: Period.create(ym('2023-02'), ym('2025-12')) },
    { id: 'pos', course: 'Arquitetura', institution: 'FIAP', level: 'Pós-graduação', period: Period.create(ym('2026-04'), ym('2027-04')) },
  ],
  skillGroups: [],
  projects: [
    { id: 'p1', name: 'P1', category: '', description: '', stack: [], repositoryUrl: '', featured: true },
    { id: 'p2', name: 'P2', category: '', description: '', stack: [], repositoryUrl: '', featured: false },
  ],
});

describe('GetResumeOverview', () => {
  const execute = () =>
    new GetResumeOverview(inMemoryRepository(buildResume()), fixedClock('2026-10')).execute();

  it('ordena as experiências da mais recente para a mais antiga', async () => {
    const overview = await execute();

    expect(overview.experiences.map((experience) => experience.id)).toEqual(['atual', 'meio', 'antiga']);
  });

  it('identifica o cargo atual e calcula durações', async () => {
    const overview = await execute();

    expect(overview.currentPosition?.id).toBe('atual');
    expect(overview.experiences.map((experience) => experience.durationInMonths)).toEqual([9, 17, 7]);
  });

  it('marca a pós-graduação como em andamento e a graduação como concluída', async () => {
    const overview = await execute();

    expect(overview.education.map((item) => [item.id, item.status])).toEqual([
      ['pos', 'em-andamento'],
      ['grad', 'concluido'],
    ]);
  });

  it('separa projetos em destaque dos demais', async () => {
    const overview = await execute();

    expect(overview.featuredProjects.map((project) => project.id)).toEqual(['p1']);
    expect(overview.otherProjects.map((project) => project.id)).toEqual(['p2']);
  });
});
