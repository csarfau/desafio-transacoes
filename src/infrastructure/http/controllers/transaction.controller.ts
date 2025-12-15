import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case';
import { CreateTransactionBodyDto } from '../dtos/create-transaction-body.dto';
import { InvalidTransactionError } from 'src/domain/errors/invalid-transaction.error';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
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
}
