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
    TransactionsService
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
  ref: DynamicDialogRef | undefined;
  originalClose: any;

  constructor(
    public readonly translateService: TranslateService,
    private readonly dialogService: DialogService,
    private readonly transactionsService: TransactionsService,
  ) {
    super();
  }

  onSelectedCash(){
  }

  onOpenModal(){
    this.ref = this.dialogService.open(CashTransactionComponent,
      {
        header: "abertura do caixa",
        width: '80vw',
        modal:true,
        draggable: true,
        maximizable: false,
        data: null,
        baseZIndex: 999999,
      });


    this.originalClose = this.ref.close.bind(this.ref);
    this.ref.close = (result: any) => {
      if (result) {
        if(!result.id){
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

  }

  onCloseCash(obj: any){

  }

}
