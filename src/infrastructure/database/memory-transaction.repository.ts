import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class MemoryTransactionRepository implements TransactionRepository {
  private transactions: Transaction[] = [];

  async create(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async deleteAll(): Promise<void> {
    this.transactions = [];
  }
}
