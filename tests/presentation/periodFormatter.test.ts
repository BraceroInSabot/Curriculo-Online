import { describe, expect, it } from 'vitest';
import { Period } from '@domain/value-objects/Period';
import { YearMonth } from '@domain/value-objects/YearMonth';
import { formatDuration, formatPeriod, formatYearMonth } from '@presentation/formatters/periodFormatter';

const ym = YearMonth.parse;

describe('periodFormatter', () => {
  it('formata mês e ano em pt-BR', () => {
    expect(formatYearMonth(ym('2024-06'))).toBe('jun 2024');
  });

  it('formata períodos fechados e abertos', () => {
    expect(formatPeriod(Period.create(ym('2024-06'), ym('2025-10')))).toBe('jun 2024 — out 2025');
    expect(formatPeriod(Period.create(ym('2026-02')))).toBe('fev 2026 — atual');
  });

  it.each([
    [0, 'menos de 1 mês'],
    [1, '1 mês'],
    [7, '7 meses'],
    [12, '1 ano'],
    [17, '1 ano e 5 meses'],
    [26, '2 anos e 2 meses'],
  ])('formata %i meses como "%s"', (months, expected) => {
    expect(formatDuration(months)).toBe(expected);
  });
});
