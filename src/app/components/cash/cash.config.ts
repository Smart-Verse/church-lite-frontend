import {FormGroup} from "@angular/forms";

export class CashConfig {
  fields: any[] = [
    {
      fieldName: 'id',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'description',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'typeCash',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'bank',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'numberAccount',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'digit',
      required: false,
      hidden: false,
      type: 'string'
    }
  ]

  convertToDTO(formGroup: FormGroup): any {
    let dto = {
      id: formGroup.get('id')?.value,
      description: formGroup.get('description')?.value,
      typeCash: formGroup.get('typeCash')?.value["key"],
      bank: (formGroup.get('bank')?.value === "" ? null : formGroup.get('bank')?.value),
      numberAccount: formGroup.get('numberAccount')?.value,
      digit: formGroup.get('digit')?.value
    };
    return dto;
  }
}
