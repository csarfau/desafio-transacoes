import { GetStatisticsUseCase } from './get-statistics.use-case';
import { MemoryTransactionRepository } from '../../infrastructure/database/memory-transaction.repository';

describe('GetStatisticsUseCase', () => {
  let useCase: GetStatisticsUseCase;
  let repository: MemoryTransactionRepository;

  beforeEach(() => {
    repository = new MemoryTransactionRepository();
    useCase = new GetStatisticsUseCase(repository);
  });

  it('should return all zeros if no transactions exist', async () => {
    const stats = await useCase.execute();
    expect(stats).toEqual({ count: 0, sum: 0, avg: 0, min: 0, max: 0 });
  });

  it('should calculate statistics correctly for recent transactions', async () => {
    await repository.create({ amount: 10, timestamp: new Date() });
    await repository.create({ amount: 20, timestamp: new Date() });

    const stats = await useCase.execute();

    expect(stats.count).toBe(2);
    expect(stats.sum).toBe(30);
    expect(stats.avg).toBe(15);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(20);
  });

  it('should ignore transactions older than 60 seconds', async () => {
    const now = new Date();
    const oldDate = new Date(now.getTime() - 61000);

    await repository.create({ amount: 100, timestamp: now });
    await repository.create({ amount: 50, timestamp: oldDate });

    const stats = await useCase.execute();

    expect(stats.count).toBe(1);
    expect(stats.sum).toBe(100);
    expect(stats.min).toBe(100);
  });
});
