import { Component } from '@angular/core';
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {DataTable} from "../../shared/components/datatable/datatable";
import {RequestData} from "../../shared/interfaces/request-data";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {DialogService} from "primeng/dynamicdialog";
import {TransactionsService} from "../../services/transactions/transactions.service";
import {CrudService} from "../../shared/services/crud/crud.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";

@Component({
  selector: 'app-bank-statement',
  standalone: true,
  imports: [
    LoadingComponent,
    SharedCommonModule,
    TableModule,
    PaginatorModule
  ],
  providers: [
    DialogService,
    TransactionsService,
    ToastService,
    CrudService
  ],
  templateUrl: './bank-statement.component.html',
  styleUrl: './bank-statement.component.scss'
})
export class BankStatementComponent extends BaseComponent {

  _currentAccount: any;
  _totalBalance: number = 0;
  _revenues: number = 0;
  _expenses: number = 0;
  _datatable: DataTable = new DataTable();
  _requestData: RequestData = new RequestData();

  constructor(
    public readonly translateService: TranslateService,
    private readonly transactionsService: TransactionsService,
    private readonly crudService : CrudService
  ) {
    super();
  }


  onSelectedBankAccount(){
    this.onLoadAllData(new RequestData());
  }

  onLoadAllData(requestData: RequestData): void {
    this.onShowLoading();
    requestData = this.includeFilters(requestData);
    this.crudService.onGetAll("transactions",requestData).subscribe({
      next: (res) => {
        this._datatable.values = res.contents;
        this._datatable.totalRecords = res.total;
        this._datatable.page = res.offset + 1;
        this._datatable.size = res.size;
        this.onShowLoading();
        this.onGetTotal();
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  onGetTotal(){
    this.onShowLoading();
    this.transactionsService.getBalanceBankAccount(this._currentAccount.id).subscribe({
      next: (res) => {
        this._revenues = !res.revenues ? 0 : res.revenues;
        this._expenses = !res.expenses ? 0 : res.expenses;
        this._totalBalance = (this._revenues - this._expenses);
        this.onShowLoading();
      }, error: err => {
        this.onShowLoading();
      }
    })
  }


  private includeFilters(requestData: RequestData) {
    requestData.filter = `financial.cash.id eq ${this._currentAccount.id}`;
    requestData.displayFields = "description;value;transactionOperation;person.name;dateTransaction"
    return requestData;
  }


}
