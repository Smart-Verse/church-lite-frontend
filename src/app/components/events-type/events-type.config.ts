import {FormGroup} from "@angular/forms";

export class EventTypesConfig {
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
      fieldName: 'color',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'description',
      required: false,
      hidden: false,
      type: 'string'
    }
  ]

  convertToDTO(formGroup: FormGroup): any {
    return {
      id: formGroup.get('id')?.value,
      name: formGroup.get('name')?.value,
      color: formGroup.get('color')?.value,
      description: formGroup.get('description')?.value
    };
  }
}
