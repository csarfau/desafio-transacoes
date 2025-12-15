export class Transaction {
  readonly amount: number;
  readonly timestamps: Date;

  constructor(amount: number, timestamps: Date | string) {
    this.amount = amount;
    this.timestamps =
      typeof timestamps === 'string' ? new Date(timestamps) : timestamps;
  }
}
