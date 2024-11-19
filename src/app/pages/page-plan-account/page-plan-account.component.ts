import {Component, OnInit} from '@angular/core';
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {CrudService} from "../../shared/services/crud/crud.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../shared/services/toast/toast.service";
import {DataTable} from "../../shared/components/datatable/datatable";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {ActivatedRoute} from "@angular/router";
import {RegisterService} from "../../services/register/register.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {RequestData} from "../../shared/interfaces/request-data";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {Ripple} from "primeng/ripple";
import {TreeTableModule} from "primeng/treetable";
import {PaginatorState} from "primeng/paginator";
import {Action} from "../../shared/components/datatable/datatable.component";
import {ConfirmationService} from "primeng/api";
import {PlanAccountComponent} from "../../components/plan-account/plan-account.component";

@Component({
  selector: 'app-page-plan-account',
  standalone: true,
  imports: [
    SharedCommonModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    Ripple,
    TreeTableModule,

  ],
  providers: [
    CrudService,
    DialogService,
    ToastService,
    ConfirmationService
  ],
  templateUrl: './page-plan-account.component.html',
  styleUrl: './page-plan-account.component.scss'
})
export class PagePlanAccountComponent extends BaseComponent implements OnInit  {


  configuration: any = {
    header: "Cadastro de plano de contas",
    view: "planAccount",
    route: "planAccount",
    component: PlanAccountComponent
  }

  ref: DynamicDialogRef | undefined;

  datatable: DataTable = new DataTable();
  routeComponent: string | null = "";
  originalClose: any;
  sidebarVisible: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly crudService: CrudService,
    private readonly registerService: RegisterService,
    private readonly dialogService: DialogService,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private confirmationService: ConfirmationService,
  ){
    super();
  }

  ngOnInit(): void {

    var obj = this.registerService.getModel("planAccount");
    this.onSetPropertiesDatatable(obj);
  }

  onSetPropertiesDatatable(obj: any): void  {
    this.datatable.fields = obj.fields;
    this.onLoadAllData(new RequestData());
  }

  onLoadAllData(requestData: RequestData): void {
    this.onShowLoading();
    this.crudService.onGetAll(this.configuration.route,requestData).subscribe({
      next: (res) => {
        this.datatable.values = res.contents;
        this.datatable.totalRecords = res.total;
        this.datatable.page = res.offset + 1;
        this.datatable.size = res.size;
        this.datatable.treeValues = this.onLoadChildren(res.contents).filter(e => e.data.codeTree.length == 1);
        this.onShowLoading();
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  onLoadData(data: any): void {
    this.onShowLoading();
    this.crudService.onGet(this.configuration.route,data.id).subscribe({
      next: (res) => {
        this.onShowLoading();
        res.action = data.action;
        res.parentCode = data.parentCode;
        this.onOpenModal(res);
      },
      error: (err) => {
        this.onShowLoading();
        this.onToast(0,err.error.message);
      }
    });
  }

  onDelete(id: any): void {
    this.onShowLoading();
    this.crudService.onDelete(this.configuration.route,id).subscribe({
      next: (res) => {
        this.onLoadAllData(new RequestData());
        this.onShowLoading();
        this.onToast(1,"");
      },
      error: (err) => {
        this.onShowLoading();
        this.onToast(0,err.error.message);
      }
    });
  }

  onSave(param: any): void {
    this.onShowLoading();
    this.crudService.onSave(this.configuration.route,param).subscribe({
      next: (res) => {
        this.datatable.values = res.contents;
        this.onLoadAllData(new RequestData());
        this.onShowLoading();
        this.originalClose(null);
        this.onToast(1,"");
      },
      error: (err) => {
        this.onShowLoading();
        this.onToast(0,err.error.message);
      }
    });
  }

  onUpdate(param: any): void {
    this.onShowLoading();
    this.crudService.onUpdate(this.configuration.route,param.id,param).subscribe({
      next: (res) => {
        this.onLoadAllData(new RequestData());
        this.onShowLoading();
        this.originalClose(null);
        this.onToast(1,"");
      },
      error: (err) => {
        this.onShowLoading();
        this.onToast(0,err.error.message);
      }
    });
  }

  onOpenModal(obj: any){
    this.ref = this.dialogService.open(this.configuration.component,
      {
        header: this.configuration.header,
        width: '80vw',
        modal:true,
        maximizable: false,
        data: obj,
        baseZIndex: 999999,
      });


    this.originalClose = this.ref.close.bind(this.ref);
    this.ref.close = (result: any) => {
      if (result) {
        if(!result.id){
          this.onSave(result);
        } else {
          this.onUpdate(result);
        }
      } else {
        this.originalClose(null);
      }
    };
  }

  pageChange($event: PaginatorState) {
    var data = new RequestData();
    data.size = $event.rows;
    data.offset = $event.page ? $event.page + 1 : 0;
    this.onLoadAllData(data);
  }

  onRegisterData(item: any, action: Action, rowNode: any){
    let obj = {
      data: item,
      action: action,
      parent: null
    }

    if(item){
      if(obj.action === 0){// delete data
        this.onDelete(obj.data.id);
      } else {
        obj.data.parentCode = (rowNode.parent === null ? null : rowNode.parent.data);
        obj.data.action = action;
        this.onLoadData(obj.data);
      }
    } else{
      this.onOpenModal(obj);
    }

  }

  onRefreshData(){
    this.onLoadAllData(new RequestData());
  }

  onShowFilters() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onDeleteData(item: any, action: Action){
    this.confirmationService.confirm({
      message: this.translateService.translate("common_message_confirmation_delete"),
      header: this.translateService.translate("common_message_header_confirmation_delete"),
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptLabel: this.translateService.translate("common_action_yes"),
      rejectLabel: this.translateService.translate("common_action_no"),
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.onRegisterData(item, action, null)
      },
      reject: () => {}
    });
  }

  onLoadChildren(obj: any[]): any[] {
    var tree: any[] = [];
    obj.forEach(item => {
      var data:{data: any, children: any[]} = {
        data: item,
        children: []
      }
      if(item.children && item.children.length === 0){
        data.children = item.children;
        tree.push(data);
      }
      else {
        var a = this.onLoadChildren(item.children);
        data.children = a;
        tree.push(data);
      }

    });
    return tree;
  }

  onToast(type: number, message: string): void {
    if(type === 0){
      this.toastService.error({summary: "Mensagem", detail: message});
    } else {
      this.toastService.success({summary: "Mensagem", detail: this.translateService.translate("common_message_success")});
    }
  }

}
