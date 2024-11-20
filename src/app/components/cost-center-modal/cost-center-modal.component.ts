import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {DropdownComponent} from "../../shared/components/inputs/dropdown/dropdown.component";
import {InputTextComponent} from "../../shared/components/inputs/input-text/input-text.component";
import {PaginatorModule} from "primeng/paginator";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {typePlanAccount} from "../../shared/util/constants";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {fieldsPlanAccount} from "../plan-account/plan-account.config";
import {fields} from "./cost-center.config";
import {DTOConverter} from "../../../core/dto/dto-converter";
import {SharedCommonModule} from "../../shared/common/shared-common.module";

@Component({
  selector: 'app-cost-center-modal',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService
  ],
  templateUrl: './cost-center-modal.component.html',
  styleUrl: './cost-center-modal.component.scss'
})
export class CostCenterModalComponent extends BaseComponent implements OnInit {

  public formGroup: FormGroup;
  public parent: any;

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(fields);
  }

  ngOnInit(): void {
    if(this.config.data) {
      if(this.config.data.action === 1) {
        this.parent = this.config.data.parentCode;
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
