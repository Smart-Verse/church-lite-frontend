import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {PersonConfig} from "../person/person.config";
import {CashTransactionConfig} from "./cash-transaction.config";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {AutoFocus} from "primeng/autofocus";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-cash-transaction',
  standalone: true,
  imports: [
    SharedCommonModule,
    AutoFocus
  ],
  viewProviders: [
    DatePipe
  ],
  providers: [ToastService],
  templateUrl: './cash-transaction.component.html',
  styleUrl: './cash-transaction.component.scss'
})
export class CashTransactionComponent extends BaseComponent implements OnInit{

  public formGroup: FormGroup;
  configuration: CashTransactionConfig = new CashTransactionConfig();

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly datePipe: DatePipe,
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    if(this.config.data === 0) {
      this.formGroup.patchValue({startDate: new Date()});
    }
  }

  onSave() {
    if(this.formGroup.valid) {
      var dto = null;
      if(this.config.data === 0){
         dto = this.configuration.convertToDTO(this.formGroup, this.datePipe, null);
      } else {
        dto = this.configuration.convertToDTO(this.formGroup, this.datePipe, new Date());
      }
      dto.action = this.config.data;
      this.ref.close(dto);
    }
    else {
      this.toastService.warn({summary: this.translateService.translate("common_message"), detail: this.translateService.translate("common_message_invalid_fields")});
      this.fieldsService.verifyIsValid();
    }
  }

  onCancel() {
    this.ref.close(null);
  }

}
