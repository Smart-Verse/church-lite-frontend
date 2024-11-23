import { Component } from '@angular/core';
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    LoadingComponent,
    SharedCommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent extends BaseComponent{

  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }
}
