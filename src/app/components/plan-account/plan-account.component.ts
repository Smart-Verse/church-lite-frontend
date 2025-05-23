import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {FormGroup} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {fieldsPlanAccount} from "./plan-account.config";
import {DTOConverter} from "../../../core/dto/dto-converter";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {typePlanAccount} from "../../shared/util/constants";


@Component({
  selector: 'app-plan-account',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService
  ],
  templateUrl: './plan-account.component.html',
  styleUrl: './plan-account.component.scss'
})
export class PlanAccountComponent extends BaseComponent implements OnInit {

  public formGroup: FormGroup;
  public parent: any;
  protected readonly _planAccount = typePlanAccount;

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(fieldsPlanAccount);
  }

  ngOnInit(): void {
    if(this.config.data) {
      if(this.config.data.action === 1) {
        this.parent = this.config.data.parentCode;
        this.config.data.type = this._planAccount.find(e => e.key === this.config.data.type);
        this.formGroup.patchValue(this.config.data);
      } else {
        this.parent = this.config.data;
      }
    }
  }

  onSave() {
    if(this.formGroup.valid) {
      var dto = DTOConverter.convertPlanAccountToDTO(this.formGroup);
      if(this.parent && this.config.data.action === 2){
        if(this.parent.parentCode){
          delete this.parent.parentCode;// exclui demais arvores
        }
        if(this.parent.data !== null)
          dto.parentCode = this.parent;
        this.ref.close(dto);
      } else if(this.parent && this.config.data.action === 1){
        dto.parentCode = this.parent;
        delete dto.parentCode.children;
        this.ref.close(dto);
      } else{
        this.ref.close(dto);
      }

    }else {
      this.toastService.warn({summary: "Mensagem", detail: this.translateService.translate("common_message_invalid_fields")});
      this.fieldsService.verifyIsValid();
    }
  }

  onCancel() {
    this.ref.close(null);
  }

}
