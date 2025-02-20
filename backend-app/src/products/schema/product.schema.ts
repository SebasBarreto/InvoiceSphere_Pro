import * as mongoose from 'mongoose';

// Product Schema definition
export const ProductSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', unique: true },  // Asegúrate de tener este campo si lo necesitas
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  date: { type: Date, default: Date.now },
});

// Product Document interface
export interface ProductDocument extends mongoose.Document {
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  date: Date;
}
