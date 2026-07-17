export class MemberFunctionConfig {
  fields: any[] = [
    {
      fieldName: 'id',
      required: false,
      hidden: false,
      type: 'string',
    },
    {
      fieldName: 'name',
      required: true,
      hidden: false,
      type: 'string',
    },
    {
      fieldName: 'description',
      required: false,
      hidden: false,
      type: 'string',
    },
  ];
}
