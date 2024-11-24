import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";

export class UserConfigurationConfig {

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
      fieldName: 'userPhoto',
      required: false,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'theme',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'lang',
      required: true,
      hidden: false,
      type: 'string'
    },
    {
      fieldName: 'email',
      required: true,
      hidden: false,
      type: 'string'
    }
  ]

  convertToDTO(formGroup: FormGroup, foto: string): any {
    let dto = {
      id: formGroup.get('id')?.value,
      name: formGroup.get('name')?.value,
      email: formGroup.get('email')?.value,
      userPhoto: foto,
      theme: formGroup.get('theme')?.value["key"],
      lang: formGroup.get('lang')?.value["key"],
    };
    return dto;
  }
}
