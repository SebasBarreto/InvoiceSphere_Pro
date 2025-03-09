import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSchema } from './schema/product.schema';

/**
 * Products module to handle all product-related functionality.
 * This module imports the necessary schema, provides services, and exposes controllers for CRUD operations.
 */
@Module({
  imports: [
    // Mongoose module for connecting the Product schema with MongoDB
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductsController],  // Controllers to handle HTTP requests
  providers: [ProductsService],  // Services that contain the business logic
  exports: [ProductsService],  // Exporting ProductsService to make it available for other modules
})
export class ProductsModule {}
