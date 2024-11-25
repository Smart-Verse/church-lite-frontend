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


@Component({
  selector: 'app-cash-transaction',
  standalone: true,
  imports: [
    SharedCommonModule,
    AutoFocus
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
    private readonly toastService: ToastService
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    if(this.config.data) {

    }
  }

}
