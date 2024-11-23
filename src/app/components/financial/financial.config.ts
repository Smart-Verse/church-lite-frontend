import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";

export class FinancialConfig {

  fields: any[] = [
    {
      fieldName: 'id',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'issueDate',
      required: true,
      hidden: false,
      type: 'date'
    },
    {
      fieldName: 'dueDate',
      required: true,
      hidden: false,
      type: 'date'
    },
    {
      fieldName: 'paymentReceiptDate',
      required: true,
      hidden: false,
      type: 'date'
    },
    {
      fieldName: 'description',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'value',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'person',
      required: false,
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
      fieldName: 'typeFinancial',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'planAccount',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'costCenter',
      required: true,
      hidden: false,
      type: 'string'
    },

  ]

  convertToDTO(formGroup: FormGroup, datePipe: DatePipe, type: string,dateReceive: Date): any {
    let dto = {
      id: formGroup.get('id')?.value,
      description: formGroup.get('description')?.value,
      typeFinancial: type,
      cash: formGroup.get('cash')?.value,
      value: formGroup.get('value')?.value,
      person: formGroup.get('person')?.value,
      planAccount: formGroup.get('planAccount')?.value,
      costCenter: formGroup.get('costCenter')?.value,
      issueDate: formGroup.get('issueDate')?.value,
      dueDate: formGroup.get('dueDate')?.value,
      paymentReceiptDate: dateReceive.toDateString(),
    };
    dto.issueDate = datePipe.transform(dto.issueDate, 'yyyy-MM-dd')!;
    dto.dueDate = datePipe.transform(dto.dueDate, 'yyyy-MM-dd')!;
    dto.paymentReceiptDate = datePipe.transform(dto.paymentReceiptDate, 'yyyy-MM-dd')!;
    return dto;
  }
}
