import { Component } from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {status} from "../../shared/util/constants";
import { FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { Person } from './person';
import { ToastService } from '../../services/toast/toast.service';


@Component({
  selector: 'app-person-members',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService
  ],
  templateUrl: './person-members.component.html',
  styleUrl: './person-members.component.scss'
})
export class PersonMembersComponent extends BaseComponent {

  public personFormGroup: FormGroup;
  protected readonly status = status;

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    private readonly toastService: ToastService,
    public readonly translatePersonMembers: TranslateService
  ) {
    super();
    this.personFormGroup = this.fieldsService.onCreateFormBuiderDynamic(new Person().fields);
  }


  onSave() {
    this.ref.close(null);
  }

  onCancel() {
    this.ref.close(null);
  }


}
