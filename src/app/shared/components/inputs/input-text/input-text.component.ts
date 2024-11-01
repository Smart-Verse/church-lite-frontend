import { Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppControlValueAccessor } from '../../../interfaces/app-control-value';
import { FieldsService } from '../../../services/fields.service';
import { SharedCommonModule } from '../../../common/shared-common.module';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [SharedCommonModule],
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
