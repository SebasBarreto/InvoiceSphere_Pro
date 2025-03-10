import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsListModule } from './products-list/products-list.module';
import { ProductsManagementModule } from './products-management/products-management.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ProductsListModule,
    ProductsManagementModule,
    
  
  ]
})
export class ProductsModule {}
