import { describe, expect, it } from 'vitest';
import { resumeData } from '@infrastructure/data/resumeData';
import { StaticResumeRepository } from '@infrastructure/repositories/StaticResumeRepository';

describe('StaticResumeRepository', () => {
  it('converte os dados reais do currículo sem erros de validação', async () => {
    const resume = await new StaticResumeRepository(resumeData).getResume();

    expect(resume.profile.fullName).toBe('Guilherme Bracero Gonzales');
    expect(resume.experiences).toHaveLength(resumeData.experiences.length);
    expect(resume.education.every((item) => item.period.start.year > 2000)).toBe(true);
  });

  it('usa ids únicos para experiências e projetos', () => {
    const ids = [...resumeData.experiences, ...resumeData.projects].map((item) => item.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
