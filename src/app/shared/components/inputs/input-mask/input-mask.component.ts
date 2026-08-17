import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";
import {InputMaskModule} from "primeng/inputmask";
import {AppControlValueAccessor} from "../../../interfaces/app-control-value";
import {FieldsService} from "../../../services/fields/fields.service";
import {AutoFocusModule} from "primeng/autofocus";
import {AutoCompleteModule} from "primeng/autocomplete";


@Component({
    selector: 'app-input-mask',
    imports: [
        CommonModule,
        InputMaskModule,
        FormsModule,
        ReactiveFormsModule,
        FloatLabelModule,
        TooltipModule,
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
  @Output() blurred = new EventEmitter<void>();

  constructor(
    private readonly fieldServiceInputText: FieldsService,
  ){
    super(fieldServiceInputText)
  }
}
