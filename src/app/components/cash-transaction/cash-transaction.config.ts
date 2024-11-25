import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";

export class CashTransactionConfig {

  fields: any[] = [
    {
      fieldName: 'id',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'startDate',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'balance',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'initialBalance',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'finalBalance',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'cash',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'endDate',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'previousBalance',
      required: true,
      hidden: false,
      type: 'string'
    },
  ]

  convertToDTO(formGroup: FormGroup, datePipe: DatePipe,dateClose: any): any {
    let dto = {
      id: formGroup.get('id')?.value,
      startDate: formGroup.get('startDate')?.value,
      balance: formGroup.get('balance')?.value,
      initialBalance: formGroup.get('initialBalance')?.value,
      finalBalance: formGroup.get('finalBalance')?.value,
      cash: formGroup.get('cash')?.value,
      endDate: dateClose,
    };
    dto.startDate = datePipe.transform(dto.startDate, 'yyyy-MM-dd')!;
    if(dateClose !== null){
      dto.endDate = datePipe.transform(dto.endDate, 'yyyy-MM-dd')!;
    }
    return dto;
  }

}
