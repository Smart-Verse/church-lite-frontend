import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule, TablePageEvent } from 'primeng/table';
import { DataTable } from './datatable';
import { SidebarModule } from 'primeng/sidebar';

export enum Action {
  DELETE,
  EDIT
}

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    SidebarModule
  ],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent {


  sidebarVisible: boolean = false;
  @Input() config: DataTable = new DataTable();
  @Output() selectedRegister: EventEmitter<any> = new EventEmitter();
  @Output() onAddRegister: EventEmitter<any> = new EventEmitter();

  pageChange($event: TablePageEvent) {

  }

  onShowFilters() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onSelectedItem(item: any, action: Action){
    let obj = {
      item: item,
      action: action
    }
    this.selectedRegister.emit(obj);
  }

  onAdd(){
    this.onAddRegister.emit();
  }
}
