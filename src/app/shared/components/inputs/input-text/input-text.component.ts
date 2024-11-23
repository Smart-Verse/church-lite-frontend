import { Component, Input } from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import { AppControlValueAccessor } from '../../../interfaces/app-control-value';
import { FieldsService } from '../../../services/fields/fields.service';
import {TooltipModule} from "primeng/tooltip";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {FloatLabelModule} from "primeng/floatlabel";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoFocusModule } from 'primeng/autofocus';
import {AutoCompleteModule} from "primeng/autocomplete";

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    TooltipModule,
    InputTextareaModule,
    AutoFocusModule,
    AutoCompleteModule
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputTextComponent,
      multi: true
    }
  ]
})
export class InputTextComponent extends AppControlValueAccessor{

  @Input() fieldType: string = "input-text";

  constructor(private readonly fieldServiceInputText: FieldsService){
    super(fieldServiceInputText)
  }
}
