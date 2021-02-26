import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  _id?: string;

  @IsNotEmpty()
  uid: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  priceEach: number;

  @IsNotEmpty()
  status: string;
}
