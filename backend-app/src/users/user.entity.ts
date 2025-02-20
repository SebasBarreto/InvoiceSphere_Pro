import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from './role.enum';  // Enum representing user roles

export type UserDocument = User & Document;

@Schema({ timestamps: true })  // Adds `createdAt` and `updatedAt` fields automatically
export class User {

  @Prop({ required: true, unique: true })
  email: string; // Unique email for the user

  @Prop({ required: true })
  password: string; // User's password (should be hashed)

  @Prop({ required: true, enum: Role, default: Role.User })
  role: Role; // User's role, default is 'user'

  @Prop({ required: true })
  name: string; // User's name
}

// Create schema for the User model
export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to log user save operation
UserSchema.pre('save', function(next) {
  console.log(`Saving user with email: ${this.email}`);
  
  // Add password hashing if needed (e.g., bcryptjs)
  // if (this.isModified('password')) {
  //   const hashedPassword = bcrypt.hashSync(this.password, 10);
  //   this.password = hashedPassword;
  // }
  
  next();  // Continue with saving the document
});
