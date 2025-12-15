import { MemoryTransactionRepository } from '../../infrastructure/database/memory-transaction.repository';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { InvalidTransactionError } from '../../domain/errors/invalid-transaction.error';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let repository: MemoryTransactionRepository;

  beforeEach(() => {
    repository = new MemoryTransactionRepository();
    useCase = new CreateTransactionUseCase(repository);
  });

  it('should create a transaction successfully', async () => {
    const input = {
      amount: 100,
      timestamp: new Date().toISOString(),
    };

    await expect(useCase.execute(input)).resolves.not.toThrow();

    const transactions = await repository.findAll();
    expect(transactions).toHaveLength(1);
    expect(transactions[0].amount).toBe(100);
  });

  it('should throw error if amount is negative', async () => {
    const input = {
      amount: -10,
      timestamp: new Date().toISOString(),
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      InvalidTransactionError,
    );
  });

  it('should throw error if date is in the future', async () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);

    const input = {
      amount: 50,
      timestamp: futureDate.toISOString(),
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      InvalidTransactionError,
    );
  });
});
