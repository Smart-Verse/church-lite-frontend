import { Component } from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AppControlValueAccessor} from "../../../interfaces/app-control-value";
import {TooltipModule} from "primeng/tooltip";
import { InputNumberModule } from 'primeng/inputnumber';
import {AutoFocusModule} from "primeng/autofocus";
import {AutoCompleteModule} from "primeng/autocomplete";

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    TooltipModule,
    InputNumberModule,
    AutoFocusModule,
    AutoCompleteModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputNumberComponent,
      multi: true
    }
  ],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss'
})
export class InputNumberComponent extends AppControlValueAccessor{

}
