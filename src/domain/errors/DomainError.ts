export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidYearMonthError extends DomainError {
  constructor(value: string) {
    super(`Data inválida: "${value}". Use o formato AAAA-MM.`);
  }
}

export class InvalidPeriodError extends DomainError {
  constructor(start: string, end: string) {
    super(`Período inválido: o fim (${end}) é anterior ao início (${start}).`);
  }
}
