export class Transaction {
  readonly amount: number;
  readonly timestamp: Date;

  constructor(amount: number, timestamp: Date | string) {
    this.amount = amount;
    this.timestamp =
      typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  }
}
