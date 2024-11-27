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
import {CrudService} from "../../shared/services/crud/crud.service";
import {TransactionsService} from "../../services/transactions/transactions.service";


@Component({
  selector: 'app-cash-transaction',
  standalone: true,
  imports: [
    SharedCommonModule,
    AutoFocus
  ],
  viewProviders: [
    DatePipe,
  ],
  providers: [ToastService,TransactionsService],
  templateUrl: './cash-transaction.component.html',
  styleUrl: './cash-transaction.component.scss'
})
export class CashTransactionComponent extends BaseComponent implements OnInit{

  public formGroup: FormGroup;
  configuration: CashTransactionConfig = new CashTransactionConfig();
  _filter: string = "";
  _close: boolean = false;
  _open: boolean = false;
  _classDynamic: string = "";
  _classBalance: string = "";
  _disabledCloseCash = false;


  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly datePipe: DatePipe,
    private readonly transactionsService: TransactionsService,
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    this.onConfigView()
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

  private onConfigView() {
    if(this.config.data === 0) {
      this.formGroup.patchValue({startDate: new Date()});
      this._filter = "typeCash eq 0 and status eq 1"
      this._close = true;
      this._open = false;
      this._disabledCloseCash = false;
      this._classDynamic = "field col-12 md:col-8 c-margin";
      this._classBalance = "field col-12 md:col-6 c-margin";
    }
    else {
      this._close = false;
      this._open = true;
      this._filter = "typeCash eq 0 and status eq 0"
      this._classDynamic = "field col-12 md:col-4 c-margin"
      this._classBalance = "field col-12 md:col-4 c-margin";
      this._disabledCloseCash = true;
    }
  }

  onGetCashTransaction() {
    let cash = this.formGroup.get("cash")?.value;
    this.transactionsService.getResumeTransaction(cash.id).subscribe({
      next: data => {
        if(this.config.data === 0){
          this.formGroup.patchValue({previousBalance: data.output.finalBalance,initialBalance: data.output.finalBalance });
        } else {
          data.output.startDate = new Date(data.output.startDate);
          data.output.endDate = new Date();
          data.output.finalBalance =  data.output.initialBalance + data.output.balance;
          this.formGroup.patchValue(data.output);
        }

      },
      error: err => {

      }
    })
  }


}
