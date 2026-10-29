import { GetResumeOverview } from '@application/use-cases/GetResumeOverview';
import { SystemClock } from '@infrastructure/clock/SystemClock';
import { resumeData } from '@infrastructure/data/resumeData';
import { StaticResumeRepository } from '@infrastructure/repositories/StaticResumeRepository';
import type { Dependencies } from '@presentation/context/DependenciesContext';

/** Composition root: o único lugar que conhece as implementações concretas. */
export function createContainer(): Dependencies {
  const repository = new StaticResumeRepository(resumeData);
  const clock = new SystemClock();

  return {
    getResumeOverview: new GetResumeOverview(repository, clock),
  };
}
