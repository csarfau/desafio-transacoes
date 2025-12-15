import { Module } from '@nestjs/common';
import { TransactionRepository } from './domain/repositories/transaction.repository';
import { MemoryTransactionRepository } from './infrastructure/database/memory-transaction.repository';

@Module({
  providers: [
    {
      provide: TransactionRepository,
      useClass: MemoryTransactionRepository,
    },
  ],
})
export class AppModule {}
