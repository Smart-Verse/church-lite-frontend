import { Component } from '@angular/core';
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {LoadingComponent} from "../../shared/components/loading/loading.component";

@Component({
  selector: 'app-user-configuration',
  standalone: true,
  imports: [
    LoadingComponent
  ],
  templateUrl: './user-configuration.component.html',
  styleUrl: './user-configuration.component.scss'
})
export class UserConfigurationComponent extends BaseComponent{

  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }
}
