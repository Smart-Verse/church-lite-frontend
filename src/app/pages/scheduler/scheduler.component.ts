import { Component } from '@angular/core';
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {LoadingComponent} from "../../shared/components/loading/loading.component";

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [
    LoadingComponent
  ],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent  extends BaseComponent{


  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }
}
