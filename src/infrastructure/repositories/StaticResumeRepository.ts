import type { Resume } from '@domain/entities/Resume';
import type { ResumeRepository } from '@domain/repositories/ResumeRepository';
import type { RawResume } from '../data/resumeData';
import { ResumeMapper } from '../mappers/ResumeMapper';

/**
 * Implementação que lê o currículo de um objeto estático.
 * Para buscar de uma API ou CMS, basta criar outra classe que implemente ResumeRepository
 * e trocá-la no composition root (src/main/container.ts).
 */
export class StaticResumeRepository implements ResumeRepository {
  constructor(private readonly source: RawResume) {}

  async getResume(): Promise<Resume> {
    return ResumeMapper.toDomain(this.source);
  }
}
