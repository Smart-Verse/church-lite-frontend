import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {ConfirmationService, PrimeTemplate, TreeNode} from "primeng/api";
import {Ripple} from "primeng/ripple";
import {SidebarModule} from "primeng/sidebar";
import { TreeTableModule } from 'primeng/treetable';
import {DataTable} from "../datatable/datatable";
import {RequestData} from "../../interfaces/request-data";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {Action} from "../datatable/datatable.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TranslateService} from "../../services/translate/translate.service";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {CommonModule} from "@angular/common";
import {DialogService} from "primeng/dynamicdialog";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-tree-datatable',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PrimeTemplate,
    Ripple,
    SidebarModule,
    TreeTableModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PaginatorModule,
    TableModule
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './tree-datatable.component.html',
  styleUrl: './tree-datatable.component.scss'
})
export class TreeDatatableComponent {

  data!: TreeNode[];
  sidebarVisible: boolean = false;
  @Input() config: DataTable = new DataTable();

  @Output() onRegister: EventEmitter<any> = new EventEmitter();
  @Output() onRefresh: EventEmitter<RequestData> = new EventEmitter();

  constructor(
    private confirmationService: ConfirmationService,
    private readonly translateService: TranslateService
  ){}

  pageChange($event: PaginatorState) {
    var data = new RequestData();
    data.size = $event.rows;
    data.offset = $event.page ? $event.page + 1 : 0;
    this.onRefresh.emit(data);
  }

  onRegisterData(item: any, action: Action){
    let obj = {
      data: item,
      action: action
    }
    this.onRegister.emit(obj);
  }

  onRefreshData(){
    this.onRefresh.emit(new RequestData());
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
        this.onRegisterData(item,action)
      },
      reject: () => {}
    });
  }
}
