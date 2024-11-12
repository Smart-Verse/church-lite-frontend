export class DataTable {
    values: any[] = [];
    fields: Column[] = [];
    route: string = "";
    classBase?: Function;
    filters?: Filters
}

export class Column {
    field: string = "";
    header: string = "";
    width: string = "";
}

export class Filters {
  field: string = "";
  type: string = "";
}
