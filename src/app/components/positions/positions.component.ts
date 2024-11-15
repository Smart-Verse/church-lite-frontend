import { Component } from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {ToastService} from "../../services/toast/toast.service";
import {FormGroup} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {PersonConfig} from "../person-members/person.config";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {Position} from "./position";

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
export class PositionsComponent extends BaseComponent  {

  public positionFormGroup: FormGroup;

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    public readonly translatePersonMembers: TranslateService,
    private readonly fieldsService: FieldsService,
    private readonly toastService: ToastService
  ) {
    super();
    this.positionFormGroup = this.fieldsService.onCreateFormBuiderDynamic(new Position().fields);
  }

  onSave() {
    this.ref.close(null);
  }

  onCancel() {
    this.ref.close(null);
  }

}
