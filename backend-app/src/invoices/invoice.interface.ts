import { Document } from 'mongoose';

export interface Invoice {
  user_id: string;
  products: { 
    product_id: string;
    quantity: number;
  }[];
  total: number;
  date: Date;
}

export type InvoiceDocument = Invoice & Document;
