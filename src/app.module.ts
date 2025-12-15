import { Module } from '@nestjs/common';
import { TransactionRepository } from './domain/repositories/transaction.repository';
import { MemoryTransactionRepository } from './infrastructure/database/memory-transaction.repository';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { TransactionController } from './infrastructure/http/controllers/transaction.controller';
import { DeleteAllTransactionsUseCase } from './application/use-cases/delete-all-transactions.use-case';
import { GetStatisticsUseCase } from './application/use-cases/get-statistics.use-case';
import { HealthController } from './infrastructure/http/controllers/health.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 30000,
        limit: 20,
      },
    ]),
  ],
  controllers: [TransactionController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: TransactionRepository,
      useClass: MemoryTransactionRepository,
    },
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetStatisticsUseCase,
  ],
})
export class AppModule {}
