import { FormGroup } from "@angular/forms";
import { Fields } from "./fields";

export class FieldsForm {
    /**
     * Campos do formulario, não é necessário preencher, será preenchido automaticamente
     */
    fields?: Fields[];
    /**
     * Form Group, não é necessário preencher
     */
    formgroup?: FormGroup;
}
