import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { FormsModule } from '@angular/forms';
import { MyInvoicesComponent } from './my-invoices/my-invoices.component';
import { InvoiceService } from './invoice.service';


  @NgModule({
  declarations: [
    InvoicesListComponent,
    MyInvoicesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InvoicesRoutingModule,
    
  ],
  providers: [InvoiceService],
  exports: [
    InvoicesListComponent,
    MyInvoicesComponent
    
  ]
})
export class InvoicesModule {}

