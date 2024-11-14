import { Component } from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {status} from "../../shared/util/constants";
import {DropdownComponent} from "../../shared/components/inputs/dropdown/dropdown.component";
import {InputDateComponent} from "../../shared/components/inputs/input-date/input-date.component";

@Component({
  selector: 'app-person-members',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  templateUrl: './person-members.component.html',
  styleUrl: './person-members.component.scss'
})
export class PersonMembersComponent extends BaseComponent{

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    public readonly translatePersonMembers: TranslateService
  ) {
    super(translatePersonMembers);
  }


  onSave() {
    this.ref.close(null);
  }

  onCancel() {
    this.ref.close(null);
  }

  protected readonly status = status;
}
