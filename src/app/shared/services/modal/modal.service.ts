import {Injectable, Type} from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {RequestData} from "../../interfaces/request-data";

export interface ModalService {
  component: Type,
  obj: any,
  header: string,
  width: string,
  callback: Function
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  ref: DynamicDialogRef | undefined;
  originalClose: any;

  constructor(
    private readonly dialogService: DialogService
  ) {}

  onOpenModal(config: ModalService) {
    this.ref = this.dialogService.open(config.component,
      {
        header: config.header,
        width: '80vw',
        modal:true,
        draggable: true,
        maximizable: false,
        data: config.obj,
        baseZIndex: 999999,
      });


    this.originalClose = this.ref.close.bind(this.ref);
    this.ref.close = (result: any) => {
      if (result) {
        if(config.callback)
          config.callback(result);
      } else {
        this.originalClose(null);
      }
    };
  }
}
