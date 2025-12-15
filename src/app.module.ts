import { Module } from '@nestjs/common';
import { TransactionRepository } from './domain/repositories/transaction.repository';
import { MemoryTransactionRepository } from './infrastructure/database/memory-transaction.repository';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { TransactionController } from './infrastructure/http/controllers/transaction.controller';
import { DeleteAllTransactionsUseCase } from './application/use-cases/delete-all-transactions.use-case';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [
    {
      provide: TransactionRepository,
      useClass: MemoryTransactionRepository,
    },
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
  ],
})
export class AppModule {}
