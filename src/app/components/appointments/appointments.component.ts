import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {ColorPickerModule} from "primeng/colorpicker";
import {InputTextComponent} from "../../shared/components/inputs/input-text/input-text.component";
import {PaginatorModule} from "primeng/paginator";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {EventTypesConfig} from "../events-type/events-type.config";
import {AppointmentsConfig} from "./appointments.config";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {ToastService} from "../../shared/services/toast/toast.service";

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    Button,
    ColorPickerModule,
    InputTextComponent,
    PaginatorModule,
    ReactiveFormsModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent extends BaseComponent implements OnInit {

  public formGroup: FormGroup;
  private configuration: AppointmentsConfig = new AppointmentsConfig();

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
      this.formGroup.patchValue(this.config.data);
    }
  }

  onSave() {
    if(this.formGroup.valid) {
      this.ref.close(this.configuration.convertToDTO(this.formGroup));
    }else {
      this.toastService.warn({summary: "Mensagem", detail: "Existem campos inválidos"});
      this.fieldsService.verifyIsValid();
    }
  }

  onCancel() {
    this.ref.close(null);
  }

}
