import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {ToastService} from "../../shared/services/toast/toast.service";
import {DatePipe} from "@angular/common";
import {FormGroup} from "@angular/forms";
import {FinancialConfig} from "./financial.config";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ActivatedRoute} from "@angular/router";
import {AutoFocus} from "primeng/autofocus";

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [
    SharedCommonModule,
    AutoFocus
  ],
  providers: [
    ToastService,
    DatePipe
  ],
  templateUrl: './financial.component.html',
  styleUrl: './financial.component.scss'
})
export class FinancialComponent extends BaseComponent implements OnInit{

  public formGroup: FormGroup;
  _type: string = "REVENUES";
  configuration: FinancialConfig = new FinancialConfig();
  _paidInvoice: boolean = false;
  _buttonText: string = this.translateService.translate('financial_saveAndQuit');

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    const segments = this.route.snapshot.url;
    this.setConfigContext(segments[segments.length - 1]?.path || '')
    if(this.config.data.data !== null){
      this.config.data.issueDate =  this.config.data.issueDate != null ? new Date(this.config.data.issueDate) : null;
      this.config.data.dueDate =  this.config.data.dueDate != null ? new Date(this.config.data.dueDate) : null;
      this.config.data.paymentReceiptDate =  this.config.data.paymentReceiptDate != null ? new Date(this.config.data.paymentReceiptDate) : null;
      this.formGroup.patchValue(this.config.data);
    } else{
      this.formGroup.get('issueDate')?.setValue(new Date());
      this.formGroup.get('dueDate')?.setValue(new Date());
    }

    // verifica se esta quitada ou tem que estornar
    if(this.config.data.paymentReceiptDate){
      this._paidInvoice = true
      this._buttonText = this.translateService.translate('financial_reverse');
    }
  }

  onSave(action: number) {
    if(this.formGroup.valid) {
      if(action == 1){
        var date = this.config.data.paymentReceiptDate === null ? new Date() : null;
        this.ref.close(this.configuration.convertToDTO(this.formGroup,this.datePipe,this._type, date));
      }
      else {
        this.ref.close(this.configuration.convertToDTO(this.formGroup,this.datePipe,this._type, null));
      }

    }else {
      this.toastService.warn({summary: "Mensagem", detail: this.translateService.translate("common_message_invalid_fields")});
      this.fieldsService.verifyIsValid();
    }
  }

  onCancel() {
    this.ref.close(null);
  }

  private setConfigContext(context: string) {

    if(context === 'revenues'){
      this._type = 'REVENUE'
    }
    else if(context === 'expenses'){
      this._type = 'EXPENSE'
    }
  }
}
