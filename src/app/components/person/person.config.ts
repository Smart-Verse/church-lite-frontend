import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";

export class PersonConfig {

    person: any[] = [
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
            fieldName: 'status',
            required: true,
            hidden: false,
            type: 'string'
        },
        {
          fieldName: 'gender',
          required: false,
          hidden: false,
          type: 'string'
        },
        {
          fieldName: 'nationality',
          required: false,
          hidden: false,
          type: 'string'
        },
        {
          fieldName: 'maritalStatus',
          required: false,
          hidden: false,
          type: 'string'
        },
        {
          fieldName: 'birthplace',
          required: false,
          hidden: false,
          type: 'string'
        },
        {
          fieldName: 'image',
          required: false,
          hidden: false,
          type: 'string'
        },
        {
          fieldName: 'personalDocs',
          required: true,
          hidden: false,
          type: 'object',
          fields: [
            {
              fieldName: 'id',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'cpf',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'rg',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'birthDate',
              required: false,
              hidden: false,
              type: 'date'
            }
          ]
        },
        {
          fieldName: 'personAddress',
          required: false,
          hidden: false,
          type: 'object',
          fields: [
            {
              fieldName: 'id',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'postalCode',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'address',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'number',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'neighborhood',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'complement',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'city',
              required: false,
              hidden: false,
              type: 'string'
            }
          ]
        },
        {
          fieldName: 'personalEmail',
          required: false,
          hidden: false,
          type: 'object',
          fields: [
            {
              fieldName: 'id',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'email',
              required: false,
              hidden: false,
              type: 'email'
            }
          ]
        },
        {
          fieldName: 'personalTelphone',
          required: false,
          hidden: false,
          type: 'object',
          fields:  [
            {
              fieldName: 'id',
              required: false,
              hidden: false,
              type: 'string'
            },

            {
              fieldName: 'phone',
              required: false,
              hidden: false,
              type: 'string'
            },
            {
              fieldName: 'cellPhone',
              required: false,
              hidden: false,
              type: 'string'
            }
          ]
        },
    ]

  convertPersonToDTO(formGroup: FormGroup, datePipe: DatePipe, type: string, imageToken: string): any {
      let dto = {
        id: formGroup.get('id')?.value,
        name: formGroup.get('name')?.value,
        status: formGroup.get('status')?.value["key"],
        gender: formGroup.get('gender')?.value["key"],
        maritalStatus: formGroup.get('maritalStatus')?.value["key"],
        nationality: formGroup.get('nationality')?.value,
        birthplace: formGroup.get('birthplace')?.value,
        image: imageToken,
        type: type,
        personAddress: formGroup.get('personAddress')?.value,
        personalDocs: formGroup.get('personalDocs')?.value,
        personalTelphone: formGroup.get('personalTelphone')?.value,
        personalEmail: formGroup.get('personalEmail')?.value,
      };
      dto.personalDocs.birthDate = datePipe.transform(dto.personalDocs.birthDate, 'yyyy-MM-dd')!;
      return dto;
    }
}
