import { IsString, IsArray, IsNumber, IsDate, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Product } from 'src/products/product.entity';

export class CreateInvoiceDto {
  @IsString()
  user_id: string;

  @IsArray()
  @IsMongoId({ each: true })
  products: { 
    productId: string;
    quantity: number;
    price: number;
  }[];

  @IsNumber()
  total: number;

  @IsDate()
  date: Date;

  @IsString()
  invoiceCode: string;

  userName?: string;

  productsWithNames?: { 
    productName: string;
    quantity: number;
  }[];
}
