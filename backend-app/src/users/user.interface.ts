import { Document } from 'mongoose';
import { Role } from './role.enum';  // Enum for user roles

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: Role;  // Role from the Role enum for type safety
}
