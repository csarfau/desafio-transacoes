import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { InvalidTransactionError } from '../../domain/errors/invalid-transaction.error';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: CreateTransactionDto) {
    const { amount, timestamp } = input;
    const transactionDate = new Date(timestamp);
    const now = new Date();

    if (amount < 0) {
      throw new InvalidTransactionError(
        'O valor total da transação não pode ser negativo.',
      );
    }

    if (transactionDate.getTime() > now.getTime()) {
      throw new InvalidTransactionError(
        'A data da transação não pode ser no futuro.',
      );
    }

    const transaction = new Transaction(amount, timestamp);
    await this.transactionRepository.create(transaction);
  }
}
