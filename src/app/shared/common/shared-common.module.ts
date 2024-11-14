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
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoadingComponent } from '../components/loading/loading.component';
import { DatatableComponent } from '../components/datatable/datatable.component';
import {InputTextComponent} from "../components/inputs/input-text/input-text.component";
import {AutoCompleteComponent} from "../components/inputs/auto-complete/auto-complete.component";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoadingComponent,
    DatatableComponent,
    InputTextComponent,
    AutoCompleteComponent
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
    TimelineModule,
    FloatLabelModule,
    LoadingComponent,
    DatatableComponent,
    InputTextComponent,
    AutoCompleteComponent
  ]
})
export class SharedCommonModule { }
