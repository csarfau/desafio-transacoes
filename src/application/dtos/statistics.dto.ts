import { ApiProperty } from '@nestjs/swagger';

export class StatisticsDto {
  @ApiProperty({
    example: 10,
    description: 'Quantidade total de transações nos últimos 60s',
  })
  count!: number;

  @ApiProperty({ example: 1234.56, description: 'Soma total dos valores' })
  sum!: number;

  @ApiProperty({ example: 123.45, description: 'Média dos valores' })
  avg!: number;

  @ApiProperty({ example: 12.34, description: 'Menor valor' })
  min!: number;

  @ApiProperty({ example: 456.78, description: 'Maior valor' })
  max!: number;
}
