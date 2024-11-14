import { Component } from '@angular/core';
import {AppControlValueAccessor} from "../../../interfaces/app-control-value";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {FloatLabelModule} from "primeng/floatlabel";
import {TooltipModule} from "primeng/tooltip";
import {FieldsService} from "../../../services/fields/fields.service";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-input-date',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    TooltipModule,
    DropdownModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputDateComponent,
      multi: true
    }
  ],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss'
})
export class InputDateComponent extends AppControlValueAccessor {

  constructor(
    private readonly fieldServiceInputText: FieldsService,
  ){
    super(fieldServiceInputText)
  }
}
