import {FormGroup} from "@angular/forms";

export class AppointmentsConfig {
  fields: any[] = [
    {
      fieldName: 'id',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'eventsType',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'user',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'initialDate',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'finalDate',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'local',
      required: false,
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
      eventsType: formGroup.get('eventsType')?.value,
      user: formGroup.get('user')?.value,
      initialDate: formGroup.get('initialDate')?.value,
      finalDate: formGroup.get('finalDate')?.value,
      local: formGroup.get('local')?.value,
      description: formGroup.get('description')?.value,
    };
  }
}
