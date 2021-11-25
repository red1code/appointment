import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditUsersRoutingModule } from './edit-users-routing.module';
import { EditUsersComponent } from './edit-users.component';


@NgModule({
  declarations: [
    EditUsersComponent
  ],
  imports: [
    CommonModule,
    EditUsersRoutingModule
  ]
})
export class EditUsersModule { }
