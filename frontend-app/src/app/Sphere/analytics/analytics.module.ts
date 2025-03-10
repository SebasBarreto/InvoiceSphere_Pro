import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from '../products/products-routing.module';
import { AnalyticsRoutingModule } from './analytics-routing.module';


@NgModule({
  declarations: [ AnalyticsComponent

  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    AnalyticsRoutingModule,
  ],
  exports: [AnalyticsComponent]
})
export class Analyticsmodule {}
