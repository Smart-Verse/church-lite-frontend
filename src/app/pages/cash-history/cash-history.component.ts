import {Component, OnInit} from '@angular/core';
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";
import {TransactionsService} from "../../services/transactions/transactions.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {DialogService} from "primeng/dynamicdialog";
import {CrudService} from "../../shared/services/crud/crud.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {DataTable} from "../../shared/components/datatable/datatable";
import {RequestData} from "../../shared/interfaces/request-data";

@Component({
  selector: 'app-cash-history',
  standalone: true,
  imports: [
    LoadingComponent,
    SharedCommonModule,
    TableModule,
    PaginatorModule
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

  constructor(
    public readonly translateService: TranslateService,
    private readonly crudService : CrudService,
  ) {
    super();
  }

  ngOnInit(): void {
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

  private includeFilters(requestData: RequestData) {
    requestData.filter = `endDate notNull`;
    return requestData;
  }

  onPrint(id: any) {

  }
}
