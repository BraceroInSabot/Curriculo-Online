import type { Resume } from '../entities/Resume';

/** Porta de saída: de onde o currículo vem é um detalhe de infraestrutura. */
export interface ResumeRepository {
  getResume(): Promise<Resume>;
}
