import {
  IsInt,
  IsNumber,
  IsString,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  sku: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Price can have at most 2 decimal places.',
    },
  )
  @Min(0.01)
  price: number;

  @IsInt()
  @Min(0)
  stockQuantity: number;
}
