import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Enum for product status
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Prop({ default: Date.now })
  createdAt: Date;
}

// Create the model based on the Product schema
export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
