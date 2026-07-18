import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {ConfirmDialogModule} from "primeng/confirmdialog";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {ConfirmationService} from "primeng/api";
import {TreeTableModule} from "primeng/treetable";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {TableModule} from "primeng/table";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {MenuItem} from "primeng/api";
import {CrudService} from "../../shared/services/crud/crud.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {DataTable} from "../../shared/components/datatable/datatable";
import {RegisterService} from "../../services/register/register.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {RequestData} from "../../shared/interfaces/request-data";
import {Action} from "../../shared/components/datatable/datatable.component";
import {MobileTreeAction, MobileTreeListComponent} from "../../shared/components/mobile-tree-list/mobile-tree-list.component";

@Component({
    selector: 'app-cost-center',
    imports: [
        SharedCommonModule,
        ConfirmDialogModule,
        IconFieldModule,
        InputIconModule,
        TreeTableModule,
        PaginatorModule,
        TableModule,
        BreadcrumbModule,
        MobileTreeListComponent,
    ],
    providers: [
        CrudService,
        ToastService,
        ConfirmationService
    ],
    templateUrl: './cost-center.component.html',
    styleUrl: './cost-center.component.scss'
})
export class CostCenterComponent  extends BaseComponent implements OnInit {

  configuration: any = {
    header: "financial_costCenter",
    view: "costCenter",
    route: "costCenter"
  }

  datatable: DataTable = new DataTable();
  sidebarVisible: boolean = false;
  readonly tableStyle = {width: "100%", "min-width": "42rem"};
  breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  breadcrumbItems: MenuItem[] = [];
  incrementalLoading = false;

  constructor(
    private readonly crudService: CrudService,
    private readonly registerService: RegisterService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    public readonly translateService: TranslateService,
    private confirmationService: ConfirmationService,
  ){
    super();
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      {label: this.translateService.translate("entity_secretariat")},
      {label: this.translateService.translate("financial_page_financial")},
      {label: this.translateService.translate(this.configuration.header)}
    ];
    var obj = this.registerService.getModel("costCenter");
    this.onSetPropertiesDatatable(obj);
  }

  onSetPropertiesDatatable(obj: any): void  {
    this.datatable.fields = obj.fields;
    this.onLoadAllData(new RequestData());
  }

  onLoadAllData(requestData: RequestData): void {
    requestData.filter = [requestData.filter, "parentCode isNull"].filter(Boolean).join(" and ");
    const append = requestData.append === true;
    this.incrementalLoading = append;
    if (!append) this.showLoading = true;
    this.crudService.onGetAll(this.configuration.route,requestData).subscribe({
      next: (res) => {
        const contents = res.contents ?? [];
        this.datatable.values = append ? this.uniqueById([...this.datatable.values, ...contents]) : contents;
        this.datatable.totalRecords = res.total;
        this.datatable.page = res.offset + 1;
        this.datatable.size = res.size;
        this.datatable.treeValues = this.onLoadChildren(this.datatable.values).filter(e => !String(e.data.codeTree).includes("."));
        this.showLoading = false;
        this.incrementalLoading = false;
      },
      error: (err) => {
        this.showLoading = false;
        this.incrementalLoading = false;
      }
    });
  }

  loadMoreMobile(): void {
    const request = new RequestData();
    request.size = this.datatable.size;
    request.offset = this.datatable.page + 1;
    request.append = true;
    this.onLoadAllData(request);
  }

  onMobileAction(event: MobileTreeAction): void {
    const action = event.action === 'delete' ? Action.DELETE : event.action === 'edit' ? Action.EDIT : Action.ADD;
    action === Action.DELETE ? this.onDeleteData(event.data, action) : this.onRegisterData(event.data, action, null);
  }

  private uniqueById(values: any[]): any[] {
    const seen = new Set<unknown>();
    return values.filter(value => !seen.has(value?.id) && !!seen.add(value?.id));
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


  pageChange($event: PaginatorState) {
    var data = new RequestData();
    data.size = $event.rows;
    data.offset = $event.page ? $event.page + 1 : 0;
    this.onLoadAllData(data);
  }

  onRegisterData(item: any, action: Action, rowNode: any): void {
    if (item && action === 0) { this.onDelete(item.id); return; }
    const target = action === 1 && item ? item.id : "new";
    const parentId = action === 2 && item ? item.id : rowNode?.parent?.data?.id;
    this.router.navigate(["/home/costCenter", target], {queryParams: parentId ? {parentId} : {}});
  }

  onRefreshData(){
    this.sidebarVisible = false;
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
