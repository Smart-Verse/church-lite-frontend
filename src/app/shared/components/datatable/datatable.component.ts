import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule, TablePageEvent } from 'primeng/table';
import { DataTable } from './datatable';
import { SidebarModule } from 'primeng/sidebar';
import {RequestData} from "../../interfaces/request-data";
import {Ripple} from "primeng/ripple";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../services/translate/translate.service';

export enum Action {
  DELETE,
  EDIT,
  ADD
}

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    SidebarModule,
    Ripple,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PaginatorModule,
    ConfirmDialogModule
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent {


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

  onShowFilters() {
    this.sidebarVisible = !this.sidebarVisible;
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
