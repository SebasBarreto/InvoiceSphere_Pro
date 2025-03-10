import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserListComponent } from './users-list.component';

const routes = [
  { path: '', component: UserListComponent }
];

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
  ],
})
export class UsersListModule {}
