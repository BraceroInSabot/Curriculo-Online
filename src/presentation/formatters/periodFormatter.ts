import type { Period } from '@domain/value-objects/Period';
import type { YearMonth } from '@domain/value-objects/YearMonth';

const MONTH_ABBREVIATIONS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MONTHS_IN_YEAR = 12;

export function formatYearMonth(value: YearMonth): string {
  return `${MONTH_ABBREVIATIONS[value.month - 1]} ${value.year}`;
}

/** "jun 2024 — out 2025" ou, para períodos em aberto, "fev 2026 — atual". */
export function formatPeriod(period: Period, openEndLabel = 'atual'): string {
  const end = period.end ? formatYearMonth(period.end) : openEndLabel;
  return `${formatYearMonth(period.start)} — ${end}`;
}

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

/** 17 → "1 ano e 5 meses" */
export function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / MONTHS_IN_YEAR);
  const months = totalMonths % MONTHS_IN_YEAR;

  const parts = [
    years > 0 ? pluralize(years, 'ano', 'anos') : null,
    months > 0 ? pluralize(months, 'mês', 'meses') : null,
  ].filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join(' e ') : 'menos de 1 mês';
}
