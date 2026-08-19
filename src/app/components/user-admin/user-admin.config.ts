import {FormGroup} from '@angular/forms';
import {ChurchUserInput, UserConfiguration} from '../../services/users/users.service';

export class UserAdminConfig {
  fields: any[] = [
    {fieldName: 'id', required: false, hidden: true, type: 'string'},
    {fieldName: 'hash', required: false, hidden: true, type: 'string'},
    {fieldName: 'name', required: true, hidden: false, type: 'string'},
    {fieldName: 'email', required: true, hidden: false, type: 'email'},
    {fieldName: 'phone', required: false, hidden: false, type: 'string'},
    {fieldName: 'password', required: true, hidden: false, type: 'password'},
    {fieldName: 'userPhoto', required: false, hidden: true, type: 'string'},
    {fieldName: 'theme', required: false, hidden: true, type: 'string'},
    {fieldName: 'lang', required: false, hidden: true, type: 'string'}
  ];

  toCreateInput(form: FormGroup): ChurchUserInput {
    const value = form.getRawValue();
    return {
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: value.password
    };
  }

  toUpdateInput(form: FormGroup): UserConfiguration {
    const value = form.getRawValue();
    return {
      id: value.id,
      hash: value.hash,
      name: value.name,
      email: value.email,
      phone: value.phone,
      userPhoto: value.userPhoto,
      theme: value.theme,
      lang: value.lang
    };
  }
}
