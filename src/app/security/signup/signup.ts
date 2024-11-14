export class SignUp {

    fields: any[] = [
        {
            fieldName: 'name',
            required: true,
            hidden: false,
            type: 'string'
        },
        {
            fieldName: 'email',
            required: true,
            hidden: false,
            type: 'email'
        },
        {
            fieldName: 'password',
            required: true,
            hidden: false,
            type: 'password'
        },
        {
            fieldName: 'confirPassword',
            required: false,
            hidden: false,
            type: 'password'
        }
    ]
}