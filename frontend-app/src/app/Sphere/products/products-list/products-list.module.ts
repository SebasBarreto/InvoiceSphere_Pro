import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsListComponent } from './products-list.component';
import { RouterModule } from '@angular/router';

const routes = [
  { path: '', component: ProductsListComponent }
];

@NgModule({
  declarations: [ProductsListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes) ,
  ],
})
export class ProductsListModule {}
