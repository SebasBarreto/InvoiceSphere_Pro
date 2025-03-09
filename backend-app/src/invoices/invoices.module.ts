import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoiceSchema } from './schema/invoices.schema';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

/**
 * Invoices module to handle invoice-related functionality.
 */
@Module({
  imports: [
    UsersModule, 
    ProductsModule, 
    MongooseModule.forFeature([{ name: 'Invoice', schema: InvoiceSchema }])
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
