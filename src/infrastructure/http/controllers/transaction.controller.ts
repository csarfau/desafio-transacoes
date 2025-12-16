import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUseCase } from '../../../application/use-cases/create-transaction.use-case';
import { CreateTransactionBodyDto } from '../dtos/create-transaction-body.dto';
import { DeleteAllTransactionsUseCase } from '../../../application/use-cases/delete-all-transactions.use-case';
import { GetStatisticsUseCase } from '../../../application/use-cases/get-statistics.use-case';
import { StatisticsDto } from '../../../application/dtos/statistics.dto';

@ApiTags('transactions')
@Controller()
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {}

  @Post('transactions')
  @HttpCode(201)
  @ApiOperation({ summary: 'Cria uma nova transação' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Formato JSON ou tipos inválidos.' })
  @ApiResponse({
    status: 422,
    description:
      'Regra de negócio violada (data de transação futura ou valor menor que zero).',
  })
  async create(@Body() body: CreateTransactionBodyDto) {
    this.logger.log(`Receiving transaction request: ${JSON.stringify(body)}`);
    await this.createTransactionUseCase.execute(body);
    this.logger.log('Transaction processed successfully');
  }

  @Delete('transactions')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deleta todas as transações.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as transações deletadas com sucesso.',
  })
  async deleteAll(): Promise<void> {
    this.logger.log('Delete all transactions request received.');

    await this.deleteAllTransactionsUseCase.execute();

    this.logger.log('All transactions deleted.');
  }

  @Get('statistics')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Retorna estatísticas das transações (últimos 60s).',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso.',
    type: StatisticsDto,
  })
  async getStatistics(): Promise<StatisticsDto> {
    this.logger.log('Get statistics request received.');
    return this.getStatisticsUseCase.execute();
  }
}
