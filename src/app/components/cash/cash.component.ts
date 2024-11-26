import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {CashConfig} from "./cash.config";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {typeCash} from "../../shared/util/constants";

@Component({
  selector: 'app-cash',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService
  ],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.scss'
})
export class CashComponent extends BaseComponent implements OnInit {

  private configuration: CashConfig = new CashConfig();
  protected readonly _typeCash = typeCash;
  public formGroup: FormGroup;

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
    if(this.config.data){
      this.config.data.typeCash = this._typeCash.find(e => e.key === this.config.data.typeCash);
      this.formGroup.patchValue(this.config.data);
    }
  }

  onSave() {
    if(this.formGroup.valid) {
      if(this.config.data.id) {
        this.ref.close(this.configuration.convertToDTO(this.formGroup, this.config.data.status));
      } else {
        this.ref.close(this.configuration.convertToDTO(this.formGroup, 'CLOSE_CASH'));
      }

    }else {
      this.toastService.warn({summary: this.translateService.translate("common_message"), detail: this.translateService.translate("common_message_invalid_fields")});
      this.fieldsService.verifyIsValid();
    }
  }

  onCancel() {
    this.ref.close(null);
  }
}
