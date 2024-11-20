import {FormGroup} from "@angular/forms";

export class BankConfig {
  fields: any[] = [
    {
      fieldName: 'id',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'name',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'code',
      required: false,
      hidden: false,
      type: 'string'
    }
  ]

  convertToDTO(formGroup: FormGroup): any {
    let dto = {
      id: formGroup.get('id')?.value,
      name: formGroup.get('name')?.value,
      code: formGroup.get('code')?.value
    };
    return dto;
  }
}
