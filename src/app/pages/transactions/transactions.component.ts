import { Component } from '@angular/core';
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import { TableModule } from 'primeng/table';
import {PaginatorModule} from "primeng/paginator";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {CashTransactionComponent} from "../../components/cash-transaction/cash-transaction.component";
import {TransactionsService} from "../../services/transactions/transactions.service";
import {CrudService} from "../../shared/services/crud/crud.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {RequestData} from "../../shared/interfaces/request-data";
import {DataTable} from "../../shared/components/datatable/datatable";

@Component({
  selector: 'app-transactions',
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
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent extends BaseComponent{

  _currentCash: any;
  _startBalance: number = 0;
  _totalBalance: number = 0;
  _revenues: number = 0;
  _expenses: number = 0;
  _transactionID: string = "";
  _datatable: DataTable = new DataTable();
  ref: DynamicDialogRef | undefined;
  originalClose: any;
  _requestData: RequestData = new RequestData();

  constructor(
    public readonly translateService: TranslateService,
    private readonly dialogService: DialogService,
    private readonly transactionsService: TransactionsService,
    private readonly crudService : CrudService,
    private readonly toastService: ToastService,
  ) {
    super();
  }

  onSelectedCash(){
    this.onShowLoading();
    this.transactionsService.getIDCashTransaction(this._currentCash.id).subscribe({
      next: (result) => {
        this._transactionID = result.cashTransaction;
        this.onShowLoading();
        this.onLoadAllData(new RequestData());
      },
      error: err => {
        this.onShowLoading();
      }
    })
  }


  onOpenModal(action: number){
    this.ref = this.dialogService.open(CashTransactionComponent,
      {
        header: this.translateService.translate("transactions_openingCash"),
        width: '70vw',
        modal:true,
        draggable: true,
        maximizable: false,
        data: action,
        baseZIndex: 999999,
      });


    this.originalClose = this.ref.close.bind(this.ref);
    this.ref.close = (result: any) => {
      if (result) {
        if(result.action === 0){
          this.onOpenCash(result);
        } else {
          this.onCloseCash(result);
        }
      } else {
        this.originalClose(null);
      }
    };
  }

  onOpenCash(obj: any){
    this.crudService.onSave("cashTransactions", obj).subscribe({
      next: (result) => {
        this.toastService.success({summary: "Mensagem", detail: this.translateService.translate("common_message_success")});
        this.originalClose(null);
      },
      error: (err) => {
        this.toastService.success({summary: "Mensagem", detail: err.error.message});
      }
    });
  }

  onCloseCash(obj: any){

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

  private includeFilters(requestData: RequestData) {
    requestData.filter = `cashTransaction eq ${this._transactionID}`;
    requestData.displayFields = "description;value;transactionOperation;person.name;dateTransaction"
    return requestData;
  }

}
