import { Transaction } from '../entities/transaction.entity';

export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<void>;
  abstract findAll(): Promise<Transaction[]>;
  abstract deleteAll(): Promise<void>;
}
