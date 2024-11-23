import { Component } from '@angular/core';
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {BaseComponent} from "../../shared/common/base-component/base-component";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
      LoadingComponent
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
