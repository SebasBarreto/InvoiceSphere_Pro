import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.entity';  // Assuming User and UserSchema are correctly exported

/**
 * UsersModule is responsible for user-related operations.
 * It registers the User schema, provides the necessary service,
 * and exposes the controller for user CRUD operations.
 */
@Module({
  imports: [
    // Registering the User schema with Mongoose, so it's linked to the 'User' model
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
  ],
  controllers: [UsersController],  // Controllers to handle user-related HTTP requests
  providers: [UsersService],       // Providers that contain the business logic for users
  exports: [UsersService],         // Export UsersService to make it available in other modules
})
export class UsersModule {}
