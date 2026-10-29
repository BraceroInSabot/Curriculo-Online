import { InvalidYearMonthError } from '../errors/DomainError';

const YEAR_MONTH_PATTERN = /^(\d{4})-(\d{2})$/;
const MONTHS_IN_YEAR = 12;

/** Value object imutável que representa um mês de um ano (ex.: 2024-06). */
export class YearMonth {
  private constructor(
    readonly year: number,
    readonly month: number,
  ) {}

  static of(year: number, month: number): YearMonth {
    const isValidMonth = Number.isInteger(month) && month >= 1 && month <= MONTHS_IN_YEAR;
    const isValidYear = Number.isInteger(year) && year > 0;

    if (!isValidMonth || !isValidYear) {
      throw new InvalidYearMonthError(`${year}-${month}`);
    }
    return new YearMonth(year, month);
  }

  static parse(value: string): YearMonth {
    const match = YEAR_MONTH_PATTERN.exec(value);
    if (!match) throw new InvalidYearMonthError(value);

    return YearMonth.of(Number(match[1]), Number(match[2]));
  }

  static fromDate(date: Date): YearMonth {
    return YearMonth.of(date.getFullYear(), date.getMonth() + 1);
  }

  /** Quantidade absoluta de meses desde o ano zero — útil para comparar e medir distâncias. */
  private get absoluteMonths(): number {
    return this.year * MONTHS_IN_YEAR + (this.month - 1);
  }

  monthsUntil(other: YearMonth): number {
    return other.absoluteMonths - this.absoluteMonths;
  }

  isBefore(other: YearMonth): boolean {
    return this.monthsUntil(other) > 0;
  }

  isAfter(other: YearMonth): boolean {
    return this.monthsUntil(other) < 0;
  }

  equals(other: YearMonth): boolean {
    return this.monthsUntil(other) === 0;
  }

  toString(): string {
    return `${this.year}-${String(this.month).padStart(2, '0')}`;
  }
}
