import { DeleteAllTransactionsUseCase } from './delete-all-transactions.use-case';
import { MemoryTransactionRepository } from '../../infrastructure/database/memory-transaction.repository';

describe('DeleteAllTransactionsUseCase', () => {
  let useCase: DeleteAllTransactionsUseCase;
  let repository: MemoryTransactionRepository;

  beforeEach(() => {
    repository = new MemoryTransactionRepository();
    useCase = new DeleteAllTransactionsUseCase(repository);
  });

  it('should delete all transactions', async () => {
    await repository.create({ amount: 10, timestamps: new Date() });

    const deleteSpy = jest.spyOn(repository, 'deleteAll');

    await useCase.execute();

    expect(deleteSpy).toHaveBeenCalled();

    const transactions = await repository.findAll();
    expect(transactions).toHaveLength(0);
  });
});
