import { FormGroup } from "@angular/forms";
import { TranslateService } from "../../services/translate/translate.service";
import {OnInit} from "@angular/core";

export class BaseComponent{
    public showLoading: boolean = false;



    constructor(){}


    public onShowLoading() {
        this.showLoading = !this.showLoading;
    }

    public onValidator(form: FormGroup){
        return form.valid;
    }



}
