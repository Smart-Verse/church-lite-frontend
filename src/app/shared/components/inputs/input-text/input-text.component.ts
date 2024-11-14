import { Component } from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import { AppControlValueAccessor } from '../../../interfaces/app-control-value';
import { FieldsService } from '../../../services/fields/fields.service';
import { SharedCommonModule } from '../../../common/shared-common.module';
import {TooltipModule} from "primeng/tooltip";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {FloatLabelModule} from "primeng/floatlabel";

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    TooltipModule
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

  constructor(private readonly fieldServiceInputText: FieldsService){
    super(fieldServiceInputText)
  }
}
