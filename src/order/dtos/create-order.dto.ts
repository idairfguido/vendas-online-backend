import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @IsString()
  addressId: number;

  @IsOptional()
  @IsNumber()
  amountPayments?: number;

  @IsOptional()
  @IsString()
  codePix?: string;

  @IsOptional()
  @IsString()
  datePayment?: string;
}
