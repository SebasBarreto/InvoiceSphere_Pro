import { Schema, Document } from 'mongoose';
import { Product } from 'src/products/product.entity';

export const InvoiceSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      name: { type: String },
      price: { type: Number },
    }
  ],

  total: { type: Number, required: true },

  date: { type: Date, default: Date.now },

  invoiceCode: { type: String, required: true },
});

export interface InvoiceDocument extends Document {
  user_id: string;
  products: { 
    productId: Product;
    quantity: number;
    name: string;
    price: number;
  }[];
  total: number;
  date: Date;
  invoiceCode: string;
}
