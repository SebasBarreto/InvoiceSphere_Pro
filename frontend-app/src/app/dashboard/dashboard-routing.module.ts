// dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyInvoicesComponent } from '../Sphere/invoices/my-invoices/my-invoices.component';
import { ProductsListComponent } from '../Sphere/products/products-list/products-list.component';
import { InvoicesListComponent } from '../Sphere/invoices/invoices-list/invoices-list.component';
import { UserProfileComponent } from '../Sphere/users/users-profile/users-profile.component';
import { ProductsManagementComponent } from '../Sphere/products/products-management/products-management.component';
import { UserListComponent } from '../Sphere/users/users-list/users-list.component';
import { AnalyticsComponent } from '../Sphere/analytics/analytics.component';
import { AuthGuard } from '../Sphere/auth/auth.guard';
import { RolesGuard } from '../Sphere/auth/roles.guard';
import { InvoicesModule } from '../Sphere/invoices/invoices.module';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent, 
    children: [
      { path: 'my-invoices', component: MyInvoicesComponent, canActivate: [AuthGuard] },
      { path: 'product-list', component: ProductsListComponent, canActivate: [AuthGuard] },
      { path: 'invoices-list', component: InvoicesListComponent, canActivate: [RolesGuard], data: { expectedRole: 'admin' } },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
      { path: 'product-management', component: ProductsManagementComponent, canActivate: [RolesGuard], data: { expectedRole: 'admin' } },
      { path: 'users-list', component: UserListComponent, canActivate: [RolesGuard], data: { expectedRole: 'admin' } },
      { path: 'analytics', component: AnalyticsComponent, canActivate: [RolesGuard], data: { expectedRole: 'admin' } },
      { path: '', redirectTo: 'product-list', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), InvoicesModule],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
