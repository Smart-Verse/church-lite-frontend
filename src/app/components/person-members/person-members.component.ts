import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {status} from "../../shared/util/constants";
import { FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { PersonConfig } from './person.config';
import { ToastService } from '../../services/toast/toast.service';
import {DTOConverter} from "../../../core/dto/dto-converter";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-person-members',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    ToastService,
    DatePipe
  ],
  templateUrl: './person-members.component.html',
  styleUrl: './person-members.component.scss'
})
export class PersonMembersComponent extends BaseComponent implements OnInit{

  public personFormGroup: FormGroup;


  protected readonly status = status;

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    private readonly toastService: ToastService,
    public readonly translatePersonMembers: TranslateService,
    private datePipe: DatePipe
  ) {
    super();
    this.personFormGroup = this.fieldsService.onCreateFormBuiderDynamic(new PersonConfig().person);
  }

  ngOnInit(): void {
    if(this.config.data){
      this.personFormGroup.patchValue(this.config.data);
    }
  }

  onSave() {
    if(this.personFormGroup.valid) {
      this.ref.close(DTOConverter.convertPersonToDTO(this.personFormGroup,this.datePipe));
    }
  }

  onCancel() {
    this.ref.close(null);
  }



}
