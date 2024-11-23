import { Component } from '@angular/core';
import {LoadingComponent} from "../../shared/components/loading/loading.component";

import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
      LoadingComponent
  ],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent extends BaseComponent{

  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }
}
