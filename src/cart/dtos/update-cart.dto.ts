import { IsNumber } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  amount: number;
}
