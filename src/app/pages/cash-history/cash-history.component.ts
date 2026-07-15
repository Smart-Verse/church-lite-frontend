import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {CrudService} from "../../shared/services/crud/crud.service";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {DataTable} from "../../shared/components/datatable/datatable";
import {RequestData} from "../../shared/interfaces/request-data";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {MenuItem} from "primeng/api";
import {PaginatorState} from "primeng/paginator";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";

@Component({
    selector: 'app-cash-history',
    imports: [
        LoadingComponent,
        SharedCommonModule,
        TableModule,
        PaginatorModule,
        BreadcrumbModule,
        IconFieldModule,
        InputIconModule
    ],
    providers: [
        CrudService
    ],
    templateUrl: './cash-history.component.html',
    styleUrl: './cash-history.component.scss'
})
export class CashHistoryComponent extends BaseComponent implements OnInit {

  _datatable: DataTable = new DataTable();
  _requestData: RequestData = new RequestData();
  readonly tableStyle = {width: "100%", "min-width": "48rem"};
  breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  breadcrumbItems: MenuItem[] = [];

  constructor(
    public readonly translateService: TranslateService,
    private readonly crudService : CrudService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      {label: this.translateService.translate("financial_page_financial")},
      {label: this.translateService.translate("financial_page_transactions")},
      {label: this.translateService.translate("history")}
    ];
    this.onLoadAllData(new RequestData())
  }

  onLoadAllData(requestData: any) {
    this.onShowLoading();
    requestData = this.includeFilters(requestData);
    this.crudService.onGetAll("cashTransactions",requestData).subscribe({
      next: (res) => {
        this._datatable.values = res.contents;
        this._datatable.totalRecords = res.total;
        this._datatable.page = res.offset + 1;
        this._datatable.size = res.size;
        this.onShowLoading();
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  pageChange(event: PaginatorState): void {
    const request = new RequestData();
    request.size = event.rows ?? this._datatable.size;
    request.offset = event.page ?? 0;
    this._requestData = request;
    this.onLoadAllData(request);
  }

  onRefresh(): void {
    this._requestData = new RequestData();
    this.onLoadAllData(this._requestData);
  }

  private includeFilters(requestData: RequestData) {
    requestData.filter = `endDate notNull`;
    return requestData;
  }

  onPrint(id: any) {

  }
}
