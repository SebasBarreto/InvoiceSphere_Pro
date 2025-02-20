import { IsString, IsNumber, IsEnum, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';
}
