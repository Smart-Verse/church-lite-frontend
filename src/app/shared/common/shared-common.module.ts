import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { HttpModule } from '../../config/http/http.module';
import { TimelineModule } from 'primeng/timeline';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    NgIf,
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    SidebarModule,
    DropdownModule,
    FormsModule,
    HttpModule,
    TimelineModule
  ]
})
export class SharedCommonModule { }
