import {Component, OnInit} from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { DataTable } from '../../shared/components/datatable/datatable';
import {RegisterService} from "../../services/register/register.service";
import {ActivatedRoute} from "@angular/router";
import {CrudService} from "../../services/crud/crud.service";
import {config, RegisterRoutes} from "./register";
import {RequestData} from "../../shared/interfaces/request-data";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    SharedCommonModule
  ],
  providers: [
    CrudService,
    DialogService
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit  {

  ref: DynamicDialogRef | undefined;

  datatable: DataTable = new DataTable();
  routeComponent: string | null = "";
  configuration: RegisterRoutes = new RegisterRoutes();

  constructor(
      private readonly activatedRoute: ActivatedRoute,
      private readonly crudService: CrudService,
      private readonly registerService: RegisterService,
      private readonly dialogService: DialogService
  ){
    super();
  }

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe(params => {
        this.routeComponent = params.get('hash');
        var obj = this.registerService.getModel(this.routeComponent || "");
        this.onSetPropertiesDatatable(obj);
      });
  }

  onSetPropertiesDatatable(obj: any): void  {
    this.configuration = config.filter(e => e.view === obj.hash)[0];
    this.datatable.fields = obj.fields;
    this.onGetAllData(new RequestData());
  }


  onGetAllData(requestData: RequestData): void {
    this.onShowLoading();
    this.crudService.onGetAll(this.configuration.route,requestData).subscribe({
      next: (res) => {
        this.datatable.values = res.contents;
        this.onShowLoading();
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  onLoadData(id: any): void {
    this.onShowLoading();
    this.crudService.onGet(this.configuration.route,id).subscribe({
      next: (res) => {
        this.onShowLoading();
        this.onOpenModal(res);
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  onDelete(id: any): void {

    this.crudService.onDelete(this.configuration.route,id).subscribe({
      next: (res) => {
        this.onGetAllData(new RequestData());
        this.onShowLoading();
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  onSave(param: any): void {
    this.onShowLoading();
    this.crudService.onSave(this.configuration.route,param).subscribe({
      next: (res) => {
        this.datatable.values = res.contents;
        this.onGetAllData(new RequestData());
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  onUpdate(param: any): void {
    this.onShowLoading();
    this.crudService.onUpdate(this.configuration.route,param.id,param).subscribe({
      next: (res) => {
        this.onGetAllData(new RequestData());
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  onSelectedData(obj: any): void {
    if(obj.data){
      if(obj.action === 0){// delete data
        this.onDelete(obj.data.id);
      } else {
        this.onLoadData(obj.data.id);
      }
    } else{
      this.onOpenModal(obj);
    }
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

    this.ref.onClose.subscribe((obj: any) => {
      if (obj) {

      }
      this.ref = undefined;
    });
  }
}
