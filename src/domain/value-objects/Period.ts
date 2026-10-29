import { InvalidPeriodError } from '../errors/DomainError';
import { YearMonth } from './YearMonth';

/**
 * Intervalo entre dois meses. Sem `end`, o período está em aberto (atual).
 * Com `end` no futuro (ex.: previsão de conclusão de curso), também é considerado em andamento.
 */
export class Period {
  private constructor(
    readonly start: YearMonth,
    readonly end: YearMonth | null,
  ) {}

  static create(start: YearMonth, end: YearMonth | null = null): Period {
    if (end && end.isBefore(start)) {
      throw new InvalidPeriodError(start.toString(), end.toString());
    }
    return new Period(start, end);
  }

  isOngoingAt(reference: YearMonth): boolean {
    return this.end === null || this.end.isAfter(reference);
  }

  /** Duração inclusiva em meses (jun → out = 5 meses). Períodos abertos são medidos até `reference`. */
  durationInMonths(reference: YearMonth): number {
    const effectiveEnd = this.isOngoingAt(reference) ? reference : (this.end as YearMonth);
    return Math.max(this.start.monthsUntil(effectiveEnd) + 1, 0);
  }

  /** Comparador para ordenar do mais recente para o mais antigo. */
  static byMostRecent(a: Period, b: Period): number {
    return a.start.monthsUntil(b.start) || Period.compareEnds(a, b);
  }

  private static compareEnds(a: Period, b: Period): number {
    if (a.end === null) return b.end === null ? 0 : -1;
    if (b.end === null) return 1;
    return a.end.monthsUntil(b.end);
  }
}
