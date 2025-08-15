import { IsString, IsNotEmpty, IsNumber, Min, IsISBN } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsISBN()
  @IsNotEmpty()
  isbn: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  availableQuantity: number;

  @IsString()
  @IsNotEmpty()
  shelfLocation: string;
}
