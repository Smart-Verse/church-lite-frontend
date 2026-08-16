import { Component, OnInit } from '@angular/core';
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
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {MenuItem} from "primeng/api";
import {ScreenReportButtonComponent} from '../../shared/components/screen-report-button/screen-report-button.component';

@Component({
    selector: 'app-bank-statement',
    imports: [
        LoadingComponent,
        SharedCommonModule,
        TableModule,
        PaginatorModule,
        BreadcrumbModule,
        ScreenReportButtonComponent
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
export class BankStatementComponent extends BaseComponent implements OnInit {

  _currentAccount: any;
  _totalBalance: number = 0;
  _revenues: number = 0;
  _expenses: number = 0;
  _datatable: DataTable = new DataTable();
  _requestData: RequestData = new RequestData();
  readonly tableStyle = {width: "100%", "min-width": "52rem"};
  readonly breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  breadcrumbItems: MenuItem[] = [];

  constructor(
    public readonly translateService: TranslateService,
    private readonly transactionsService: TransactionsService,
    private readonly crudService : CrudService
  ) {
    super();
  }


  ngOnInit(): void {
    this.breadcrumbItems = [
      {label: this.translateService.translate("financial_page_financial")},
      {label: this.translateService.translate("bank_statament")}
    ];
  }

  onSelectedBankAccount(){
    this._requestData = new RequestData();
    this.onLoadAllData(this._requestData);
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


  pageChange(event: PaginatorState): void {
    if (!this._currentAccount?.id) return;
    const request = new RequestData();
    request.size = event.rows ?? this._datatable.size;
    request.offset = event.page ?? 0;
    this._requestData = request;
    this.onLoadAllData(request);
  }

  onRefresh(): void {
    if (!this._currentAccount?.id) return;
    this.onLoadAllData(this._requestData);
  }

  get reportData(): Record<string, unknown> {
    return {
      contents: this._datatable.values,
      total: this._datatable.totalRecords,
      size: this._datatable.size,
      offset: Math.max(0, this._datatable.page - 1),
      account: this._currentAccount,
      revenues: this._revenues,
      expenses: this._expenses,
      balance: this._totalBalance,
      filter: this._requestData.filter,
    };
  }

  private includeFilters(requestData: RequestData) {
    requestData.filter = `financial.cash.id eq ${this._currentAccount.id}`;
    requestData.displayFields = "description;value;transactionOperation;person.name;dateTransaction"
    return requestData;
  }


}
