export class SignUp{

    fields: any[] = [
        {
            fieldName: 'name',
            required: false,
            hidden: false,
            type: 'string'
        },
        {
            fieldName: 'email',
            required: false,
            hidden: false,
            type: 'email'
        },
        {
            fieldName: 'password',
            required: false,
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