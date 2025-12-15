import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case';
import { CreateTransactionBodyDto } from '../dtos/create-transaction-body.dto';
import { InvalidTransactionError } from 'src/domain/errors/invalid-transaction.error';
import { DeleteAllTransactionsUseCase } from 'src/application/use-cases/delete-all-transactions.use-case';
import { GetStatisticsUseCase } from 'src/application/use-cases/get-statistics.use-case';
import { StatisticsDto } from 'src/application/dtos/statistics.dto';

@ApiTags('transactions')
@Controller()
export class TransactionController {
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
    try {
      await this.createTransactionUseCase.execute(body);
    } catch (error) {
      if (error instanceof InvalidTransactionError) {
        throw new UnprocessableEntityException(error.message);
      }
      throw error;
    }
  }

  @Delete('transactions')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deleta todas as transações.' })
  @ApiResponse({
    status: 200,
    description: 'Todas as transações deletadas com sucesso.',
  })
  async deleteAll(): Promise<void> {
    await this.deleteAllTransactionsUseCase.execute();
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
    return this.getStatisticsUseCase.execute();
  }
}
