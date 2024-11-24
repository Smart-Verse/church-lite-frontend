import { Component } from '@angular/core';
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {FormGroup} from "@angular/forms";
import {UserConfigurationConfig} from "./user-configuration.config";
import { language, theme } from "../../shared/util/constants";

@Component({
  selector: 'app-user-configuration',
  standalone: true,
  imports: [
    LoadingComponent,
    SharedCommonModule
  ],
  providers: [
    ToastService
  ],
  templateUrl: './user-configuration.component.html',
  styleUrl: './user-configuration.component.scss'
})
export class UserConfigurationComponent extends BaseComponent{

  public imageToken = "";
  public formGroup: FormGroup;
  configuration: UserConfigurationConfig = new UserConfigurationConfig();
  protected readonly _theme = theme;
  protected readonly _language = language;

  constructor(
    public readonly translateService: TranslateService,
    private readonly fieldsService: FieldsService,
    private readonly toastService: ToastService,
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }


  public loading(loading: boolean): void {
    this.onShowLoading();
  }



}
