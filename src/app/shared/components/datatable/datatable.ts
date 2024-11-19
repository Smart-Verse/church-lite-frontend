export class DataTable {
    values: any[] = [];
    fields: Column[] = [];
    totalRecords: number = 0;
    page: number = 1;
    size: number = 10;
    route: string = "";
    classBase?: Function;
    filters?: Filters;
    treeValues: any[] = [];
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
