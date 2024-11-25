import { Component } from '@angular/core';
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import { TableModule } from 'primeng/table';
import {PaginatorModule} from "primeng/paginator";

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    LoadingComponent,
    SharedCommonModule,
    TableModule,
    PaginatorModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent extends BaseComponent{

  _currentCash: any;
  _startBalance: number = 0;
  _endBalance: number = 0;
  _revenues: number = 0;
  _expenses: number = 0;

  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }

  onSelectedCash(){
    console.log("selectedCash");
  }
}
