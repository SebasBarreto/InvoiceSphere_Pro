import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Sphere/auth/auth.guard';
import { RolesGuard } from './Sphere/auth/roles.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ProductsManagementModule } from './Sphere/products/products-management/products-management.module';

const routes: Routes = [
  // Redirect the empty path to /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login and Register routes do not use the main layout
  {
    path: 'login',
    loadChildren: () =>
      import('./Sphere/users/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./Sphere/users/register/register.module').then(m => m.RegisterModule)
  },

  // Protected routes with main layout (sidebar, navbar, etc.)
  {
    path: '',
    component: MainLayoutComponent,  // Layout with sidebar, navbar, etc.
    children: [
      {
        path: 'product-list',
        loadChildren: () =>
          import('./Sphere/products/products.module').then(m => m.ProductsModule),
        canActivate: [AuthGuard]  // Protected route, requires login
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./Sphere/invoices/invoices.module').then(m => m.InvoicesModule),
        canActivate: [AuthGuard]  // Protected route, requires login
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('./Sphere/users/users-profile/users-profile.module').then(m => m.UserProfileModule),
        canActivate: [AuthGuard]  // Protected route, requires login
      },
      // Add more child routes if needed
    ]
  },

  // Route for admin with RolesGuard (and AuthGuard if you want to ensure prior authentication)
  {
    path: 'admin',
    component: MainLayoutComponent, 
    canActivate: [AuthGuard, RolesGuard],  
    data: { expectedRole: 'admin' },
    children: [
      {
        path: 'product-management',
        loadChildren: () =>
          import('./Sphere/products/products-management/products-management.module').then(m=>ProductsManagementModule),
        canActivate: [RolesGuard],
        data: { expectedRole: 'admin' }
      },

      {
        path: 'users-list',
        loadChildren: () =>
          import('./Sphere/users/users-list/users-list.module').then(m => m.UsersListModule),
        canActivate: [RolesGuard],
        data: { expectedRole: 'admin' }
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./Sphere/analytics/analytics.module').then(m => m.Analyticsmodule),  
        canActivate: [RolesGuard],
        data: { expectedRole: 'admin' }
      },
      
      {
        path: 'invoices-list',
        loadChildren: () =>
          import('./Sphere/invoices/invoices-list/invoices-list.module').then(m=> m.InvoicesListtModule),
        canActivate: [RolesGuard],  
        data: { expectedRole: 'admin' }
      },
    ]
  },

  // Any unrecognized route redirects to login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Import routes into the application
  exports: [RouterModule]  // Export RouterModule so other parts of the app can use it
})
export class AppRoutingModule {}
