export class DataTable {
    values: any[] = [];
    fields: Column[] = [];
    route: string = "";
    classBase?: Function
}
export class Column {
    field: string = "";
    header: string = "";
}