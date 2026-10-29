import type { YearMonth } from '@domain/value-objects/YearMonth';

/** Abstração do tempo para manter os casos de uso determinísticos e testáveis. */
export interface Clock {
  currentYearMonth(): YearMonth;
}
