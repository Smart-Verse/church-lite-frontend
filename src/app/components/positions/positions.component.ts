import { Component, OnInit } from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {ToastService} from "../../shared/services/toast/toast.service";
import {FormGroup} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {PersonConfig} from "../person/person.config";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {PositionConfig} from "./position.config";
import { DTOConverter } from '../../../core/dto/dto-converter';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService
  ],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.scss'
})
export class PositionsComponent extends BaseComponent implements OnInit {

  public positionFormGroup: FormGroup;

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translatePersonMembers: TranslateService,
    private readonly toastService: ToastService
  ) {
    super();
    this.positionFormGroup = this.fieldsService.onCreateFormBuiderDynamic(new PositionConfig().fields);
  }


  ngOnInit(): void {
    if(this.config.data){
      this.positionFormGroup.patchValue(this.config.data);
    }
  }

  onSave() {
    if(this.positionFormGroup.valid) {
      this.ref.close(DTOConverter.convertPositionToDTO(this.positionFormGroup));
    }else {
      this.toastService.warn({summary: "Mensagem", detail: "Existem campos inválidos"});
      this.fieldsService.verifyIsValid();
    }
  }

  onCancel() {
    this.ref.close(null);
  }

}
