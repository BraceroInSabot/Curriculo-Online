import { describe, expect, it } from 'vitest';
import { InvalidPeriodError } from '@domain/errors/DomainError';
import { Period } from '@domain/value-objects/Period';
import { YearMonth } from '@domain/value-objects/YearMonth';

const ym = YearMonth.parse;
const TODAY = ym('2026-10');

describe('Period', () => {
  it('não aceita fim anterior ao início', () => {
    expect(() => Period.create(ym('2025-10'), ym('2024-06'))).toThrow(InvalidPeriodError);
  });

  it('mede a duração de forma inclusiva', () => {
    expect(Period.create(ym('2024-06'), ym('2025-10')).durationInMonths(TODAY)).toBe(17);
  });

  it('mede períodos em aberto até a data de referência', () => {
    const current = Period.create(ym('2026-02'));

    expect(current.isOngoingAt(TODAY)).toBe(true);
    expect(current.durationInMonths(TODAY)).toBe(9);
  });

  it('considera em andamento um período com término no futuro', () => {
    expect(Period.create(ym('2026-04'), ym('2027-04')).isOngoingAt(TODAY)).toBe(true);
    expect(Period.create(ym('2023-02'), ym('2025-12')).isOngoingAt(TODAY)).toBe(false);
  });

  it('ordena do mais recente para o mais antigo', () => {
    const oldest = Period.create(ym('2023-12'), ym('2024-06'));
    const middle = Period.create(ym('2024-06'), ym('2025-10'));
    const current = Period.create(ym('2026-02'));

    const sorted = [middle, oldest, current].sort(Period.byMostRecent);

    expect(sorted).toEqual([current, middle, oldest]);
  });

  it('desempata pelo término quando o início é igual', () => {
    const finished = Period.create(ym('2024-01'), ym('2024-05'));
    const ongoing = Period.create(ym('2024-01'));

    expect([finished, ongoing].sort(Period.byMostRecent)).toEqual([ongoing, finished]);
  });
});
