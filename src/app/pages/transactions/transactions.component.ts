import { Component } from '@angular/core';
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {SharedCommonModule} from "../../shared/common/shared-common.module";

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    LoadingComponent,
    SharedCommonModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent extends BaseComponent{

  _currentCash: any;

  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }

  onSelectedCash(){
    console.log("selectedCash");
  }
}
