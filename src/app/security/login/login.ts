export class Login{

    fields: any[] = [
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
        }
    ]
}