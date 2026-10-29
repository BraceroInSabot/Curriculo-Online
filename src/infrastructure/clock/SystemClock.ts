import type { Clock } from '@application/ports/Clock';
import { YearMonth } from '@domain/value-objects/YearMonth';

export class SystemClock implements Clock {
  currentYearMonth(): YearMonth {
    return YearMonth.fromDate(new Date());
  }
}
