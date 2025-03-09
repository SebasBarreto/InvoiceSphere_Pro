import * as mongoose from 'mongoose';

// Enum for user roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// User schema definition with validation
export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Unique constraint on email
  password: { type: String, required: true },
  role: { type: String, enum: UserRole, required: true }, // 'admin' or 'user' roles only
});

// Middleware to log when saving the user
UserSchema.pre('save', function(next) {
  console.log(`Saving user with email: ${this.email}`);
  next();
});

// Interface representing the User document in MongoDB
export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: UserRole; // 'admin' or 'user' role
}
