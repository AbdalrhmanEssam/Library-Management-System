import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutBookDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  borrowerId: number;
}
