import {Component, Input} from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";
import {CalendarModule} from "primeng/calendar";
import {TooltipModule} from "primeng/tooltip";
import {DropdownModule} from "primeng/dropdown";
import {InputMaskModule} from "primeng/inputmask";
import {AppControlValueAccessor} from "../../../interfaces/app-control-value";
import {FieldsService} from "../../../services/fields/fields.service";
import {AutoFocusModule} from "primeng/autofocus";
import {AutoCompleteModule} from "primeng/autocomplete";


@Component({
  selector: 'app-input-mask',
  standalone: true,
  imports: [
    CommonModule,
    InputMaskModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    TooltipModule,
    DropdownModule,
    AutoFocusModule,
    AutoCompleteModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputMaskComponent,
      multi: true
    }
  ],
  templateUrl: './input-mask.component.html',
  styleUrl: './input-mask.component.scss'
})
export class InputMaskComponent extends AppControlValueAccessor {

  @Input() mask: string = "";

  constructor(
    private readonly fieldServiceInputText: FieldsService,
  ){
    super(fieldServiceInputText)
  }
}
