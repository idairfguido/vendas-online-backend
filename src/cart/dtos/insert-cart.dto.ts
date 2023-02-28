import { IsNumber } from 'class-validator';

export class InsertCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  amount: number;
}
