import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionBodyDto {
  @ApiProperty({ description: 'Valor da transação', example: 120.5 })
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @ApiProperty({
    description: 'Data da transação em ISO 8601',
    example: '2024-02-20T12:34:56.789Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  timestamp!: string;
}
