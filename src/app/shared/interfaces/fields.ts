
export class Fields {
    name: string = "";
    label: String = "";
    type?: string;
    size: number = 0;
    hidden?: boolean = false;
    order: number = 0;
    guidance?: string = "";
    validators?: any[];
    required?: boolean;
    /**
     * Propriedade para definir se o campo será visivel e dispoibiliczado para filtragem dos dados
     */
    enableFieldsFilter?: boolean = false;
    /*
        Usado quando a tela possui abas, usa-se o reference para indicar a qual aba pertenci o field
    */
    reference?: any;
}
