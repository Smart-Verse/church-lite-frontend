export class DataTable {
    values: any[] = [];
    fields: Column[] = [];
    totalRecords: number = 0;
    page: number = 1;
    size: number = 10;
    route: string = "";
    storageKey: string = "";
    classBase?: Function;
    filters: Filters[] = [];
    treeValues: any[] = [];
}

export class Column {
    field: string = "";
    header: string = "";
    width: string = "";
}

export class Filters {
  field: string = "";
  key?: string;
  fieldSourceKey?: string;
  defaultValue?: string;
  type: string = "string";
  label: string = "";
  options?: {label: string; value: string}[];
  operator?: "eq" | "ge" | "le" | "gte" | "lte" | "nullability";
  route?: string;
  optionLabel?: string;
}
