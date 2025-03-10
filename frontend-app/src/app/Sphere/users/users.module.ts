// users.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersListModule } from './users-list/users-list.module'; 
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    UsersListModule, 
    UsersRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [UsersListModule]
})
export class UsersModule {}
