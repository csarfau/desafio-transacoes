import { Injectable } from '@nestjs/common';
import { StatisticsDto } from '../dtos/statistics.dto';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable()
export class GetStatisticsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<StatisticsDto> {
    const allTransactions = await this.transactionRepository.findAll();

    const now = new Date();
    const sixtySecondsAgo = new Date(now.getTime() - 60000);

    const recentTransactions = allTransactions.filter(
      (t) => t.timestamp >= sixtySecondsAgo,
    );

    if (recentTransactions.length === 0) {
      return {
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      };
    }

    const stats = recentTransactions.reduce(
      (acc, curr) => {
        return {
          sum: acc.sum + curr.amount,
          min: Math.min(acc.min, curr.amount),
          max: Math.max(acc.max, curr.amount),
        };
      },
      {
        sum: 0,
        min: Number.MAX_VALUE,
        max: Number.MIN_VALUE,
      },
    );

    const count = recentTransactions.length;
    const avg = stats.sum / count;

    return {
      count: count,
      sum: stats.sum,
      avg: avg,
      min: stats.min,
      max: stats.max,
    };
  }
}
