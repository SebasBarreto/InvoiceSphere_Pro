import { Document } from 'mongoose';

/**
 * Interface representing the Product document in MongoDB.
 */
export interface ProductDocument extends Document {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stock: number;
  readonly status: 'active' | 'inactive';
}
