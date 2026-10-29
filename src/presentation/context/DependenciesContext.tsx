import { createContext, useContext } from 'react';
import type { ResumeOverview } from '@application/use-cases/GetResumeOverview';

export interface UseCase<Output> {
  execute(): Promise<Output>;
}

/** Contrato do que a camada de apresentação precisa — sem conhecer implementações concretas. */
export interface Dependencies {
  readonly getResumeOverview: UseCase<ResumeOverview>;
}

const DependenciesContext = createContext<Dependencies | null>(null);

export const DependenciesProvider = DependenciesContext.Provider;

export function useDependencies(): Dependencies {
  const dependencies = useContext(DependenciesContext);
  if (!dependencies) {
    throw new Error('useDependencies deve ser usado dentro de <DependenciesProvider>.');
  }
  return dependencies;
}
