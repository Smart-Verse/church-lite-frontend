import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {gender, maritalStatus, status} from "../../shared/util/constants";
import { FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { PersonConfig } from './person.config';
import { ToastService } from '../../shared/services/toast/toast.service';
import {DatePipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

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
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss'
})
export class PersonComponent extends BaseComponent implements OnInit{

  public personFormGroup: FormGroup;
  protected readonly _status = status;
  protected readonly _gender = gender;
  protected readonly _maritalStatus = maritalStatus;
  configPerson: PersonConfig = new PersonConfig();
  _type: string = "MEMBER";

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translatePersonMembers: TranslateService,
    private readonly toastService: ToastService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    super();
    this.personFormGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configPerson.person);
  }

  ngOnInit(): void {
    const segments = this.route.snapshot.url;
    this.setConfigContext(segments[segments.length - 1]?.path || '')
    if(this.config.data){
      this.config.data.status = status.find(e => e.key === this.config.data.status);
      this.config.data.personalDocs.birthDate =  this.config.data.personalDocs.birthDate != null ? new Date(this.config.data.personalDocs.birthDate) : null;
      this.personFormGroup.patchValue(this.config.data);
    }
  }

  onSave() {
    if(this.personFormGroup.valid) {
      this.ref.close(this.configPerson.convertPersonToDTO(this.personFormGroup,this.datePipe,this._type));
    }else {
      this.toastService.warn({summary: "Mensagem", detail: this.translatePersonMembers.translate("common_message_invalid_fields")});
      this.fieldsService.verifyIsValid();
    }
  }

  onCancel() {
    this.ref.close(null);
  }

  private setConfigContext(context: string) {

    if(context === 'personMembers'){
      this._type = 'MEMBER'
    }
    else if(context === 'personSupplier'){
      this._type = 'SUPPLIER'
    }
    else if(context === 'personVisitor'){
      this._type = 'VISITOR'
    }else if(context === 'personNewConvert'){
      this._type = 'NEW_CONVERT'
    }
  }
}
