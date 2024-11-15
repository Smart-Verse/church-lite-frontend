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
              fieldName: 'birthdate',
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
}
