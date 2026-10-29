import { describe, expect, it } from 'vitest';
import { InvalidYearMonthError } from '@domain/errors/DomainError';
import { YearMonth } from '@domain/value-objects/YearMonth';

describe('YearMonth', () => {
  it('converte uma string AAAA-MM', () => {
    const value = YearMonth.parse('2024-06');

    expect(value.year).toBe(2024);
    expect(value.month).toBe(6);
    expect(value.toString()).toBe('2024-06');
  });

  it.each(['2024-13', '2024-00', '24-06', 'junho/2024', ''])('rejeita o valor inválido "%s"', (raw) => {
    expect(() => YearMonth.parse(raw)).toThrow(InvalidYearMonthError);
  });

  it('calcula a distância em meses atravessando anos', () => {
    expect(YearMonth.parse('2024-06').monthsUntil(YearMonth.parse('2025-10'))).toBe(16);
  });

  it('compara datas', () => {
    const june = YearMonth.parse('2024-06');
    const october = YearMonth.parse('2024-10');

    expect(june.isBefore(october)).toBe(true);
    expect(october.isAfter(june)).toBe(true);
    expect(june.equals(YearMonth.of(2024, 6))).toBe(true);
  });
});
