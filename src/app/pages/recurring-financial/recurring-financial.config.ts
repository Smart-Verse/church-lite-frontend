import {DatePipe} from '@angular/common';

export class RecurringFinancialConfig {
  fields: any[] = [
    {fieldName: 'description', required: true, hidden: false, type: 'string'},
    {fieldName: 'typeFinancial', required: true, hidden: false, type: 'string'},
    {fieldName: 'recurrenceMode', required: true, hidden: false, type: 'string'},
    {fieldName: 'frequency', required: true, hidden: false, type: 'string'},
    {fieldName: 'valueType', required: true, hidden: false, type: 'string'},
    {fieldName: 'value', required: true, hidden: false, type: 'number'},
    {fieldName: 'firstDueDate', required: true, hidden: false, type: 'date'},
    {fieldName: 'endDate', required: false, hidden: false, type: 'date'},
    {fieldName: 'occurrenceCount', required: false, hidden: false, type: 'number'},
    {fieldName: 'status', required: true, hidden: false, type: 'string'},
    {fieldName: 'cash', required: true, hidden: false, type: 'string'},
    {fieldName: 'person', required: false, hidden: false, type: 'string'},
    {fieldName: 'planAccount', required: true, hidden: false, type: 'string'},
    {fieldName: 'costCenter', required: true, hidden: false, type: 'string'}
  ];

  convertToDTO(raw: any, datePipe: DatePipe, installment: boolean): any {
    const valueOf = (value: any) => value?.value ?? value;
    return {
      ...raw,
      typeFinancial: valueOf(raw.typeFinancial),
      recurrenceMode: valueOf(raw.recurrenceMode),
      frequency: valueOf(raw.frequency),
      valueType: valueOf(raw.valueType),
      status: valueOf(raw.status),
      firstDueDate: datePipe.transform(raw.firstDueDate, 'yyyy-MM-dd'),
      endDate: raw.endDate ? datePipe.transform(raw.endDate, 'yyyy-MM-dd') : null,
      occurrenceCount: installment ? Number(raw.occurrenceCount) : null,
      generatedOccurrences: raw.generatedOccurrences ?? 0
    };
  }
}
