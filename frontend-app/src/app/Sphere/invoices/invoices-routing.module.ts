import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';  // Ruta a la lista de facturas
import { MyInvoicesComponent } from './my-invoices/my-invoices.component';  // Ruta a las facturas del usuario

const routes: Routes = [
  { path: 'invoices-list', component: InvoicesListComponent },
  { path: 'my-invoices', component: MyInvoicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule {}
