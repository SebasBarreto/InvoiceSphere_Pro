import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsManagementComponent } from './products-management.component';

const routes = [
  { path: '', component: ProductsManagementComponent }
];

@NgModule({
  declarations: [ProductsManagementComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes) 
  ],
})
export class ProductsManagementModule {}
