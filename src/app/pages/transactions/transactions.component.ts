import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import { TableModule } from 'primeng/table';
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {MenuItem} from "primeng/api";
import {TransactionsService} from "../../services/transactions/transactions.service";
import {CrudService} from "../../shared/services/crud/crud.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {RequestData} from "../../shared/interfaces/request-data";
import {DataTable} from "../../shared/components/datatable/datatable";
import {ScreenReportButtonComponent} from '../../shared/components/screen-report-button/screen-report-button.component';

@Component({
    selector: 'app-transactions',
    imports: [
        LoadingComponent,
        SharedCommonModule,
        TableModule,
        PaginatorModule,
        BreadcrumbModule,
        ScreenReportButtonComponent
    ],
    providers: [
        TransactionsService,
        ToastService,
        CrudService
    ],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss'
})
export class TransactionsComponent extends BaseComponent implements OnInit {

  _currentCash: any;
  _startBalance: number = 0;
  _totalBalance: number = 0;
  _revenues: number = 0;
  _expenses: number = 0;
  _transactionID: string = "";
  _datatable: DataTable = new DataTable();
  _requestData: RequestData = new RequestData();
  readonly tableStyle = {width: "100%", "min-width": "52rem"};
  readonly breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  breadcrumbItems: MenuItem[] = [];

  constructor(
    public readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly transactionsService: TransactionsService,
    private readonly crudService : CrudService,
    private readonly toastService: ToastService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      {label: this.translateService.translate("financial_page_financial")},
      {label: this.translateService.translate("financial_page_transactions")}
    ];
  }

  onSelectedCash(){
    this.onShowLoading();
    this.transactionsService.getIDCashTransaction(this._currentCash.id).subscribe({
      next: (result) => {
        this._transactionID = result.cashTransaction;
        this.onShowLoading();
        this._requestData = new RequestData();
        this.onLoadAllData(this._requestData);
      },
      error: err => {
        this.onShowLoading();
      }
    })
  }


  onNavigateCashAction(action: number): void {
    this.router.navigate(["/home/transactions", action === 0 ? "open" : "close"]);
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
    this.transactionsService.getSumValuesCash(this._transactionID).subscribe({
      next: (res) => {
        this._revenues = !res.revenues ? 0 : res.revenues;
        this._expenses = !res.expenses ? 0 : res.expenses;
        this._startBalance = !res.initialBalance ? 0 : res.initialBalance;
        this._totalBalance = (this._startBalance + this._revenues - this._expenses);
        this.onShowLoading();
      }, error: err => {
        this.onShowLoading();
      }
    })
  }

  pageChange(event: PaginatorState): void {
    if (!this._transactionID) return;
    const request = new RequestData();
    request.size = event.rows ?? this._datatable.size;
    request.offset = event.page ?? 0;
    this._requestData = request;
    this.onLoadAllData(request);
  }

  onRefresh(): void {
    if (!this._transactionID) return;
    this.onLoadAllData(this._requestData);
  }

  get reportData(): Record<string, unknown> {
    return {
      contents: this._datatable.values,
      total: this._datatable.totalRecords,
      size: this._datatable.size,
      offset: Math.max(0, this._datatable.page - 1),
      cash: this._currentCash,
      initialBalance: this._startBalance,
      revenues: this._revenues,
      expenses: this._expenses,
      balance: this._totalBalance,
      filter: this._requestData.filter,
    };
  }

  private includeFilters(requestData: RequestData) {
    requestData.filter = `cashTransaction eq ${this._transactionID}`;
    requestData.displayFields = "description;value;transactionOperation;person.name;dateTransaction"
    return requestData;
  }

}
