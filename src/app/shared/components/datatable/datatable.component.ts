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
    PaginatorModule
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent {


  sidebarVisible: boolean = false;
  @Input() config: DataTable = new DataTable();

  @Output() onRegister: EventEmitter<any> = new EventEmitter();
  @Output() onRefresh: EventEmitter<RequestData> = new EventEmitter();


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
}
