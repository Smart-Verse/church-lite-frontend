import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {FloatLabelModule} from "primeng/floatlabel";
import {TooltipModule} from "primeng/tooltip";
import {DropdownModule} from "primeng/dropdown";
import {AppControlValueAccessor} from "../../../interfaces/app-control-value";
import {FieldsService} from "../../../services/fields/fields.service";
import {CrudService} from "../../../services/crud/crud.service";
import {AutoCompleteModule} from "primeng/autocomplete";
import {AutoFocusModule} from "primeng/autofocus";


@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    TooltipModule,
    AutoCompleteModule,
    AutoFocusModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownComponent,
      multi: true
    }
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent extends AppControlValueAccessor {

  @Input() options: any[] = [];
  @Input() optionLabel: string = "";

  constructor(
    private readonly fieldServiceInputText: FieldsService,
  ){
    super(fieldServiceInputText)
  }
}
