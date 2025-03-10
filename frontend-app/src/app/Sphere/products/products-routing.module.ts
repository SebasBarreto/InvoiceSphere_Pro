import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'products-list', loadChildren: () => import('./products-list/products-list.module').then(m => m.ProductsListModule) },
  { path: 'products-management', loadChildren: () => import('./products-management/products-management.module').then(m => m.ProductsManagementModule) }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
