import { FormGroup } from "@angular/forms";
import { TranslateService } from "../../services/translate/translate.service";

export class BaseComponent {
    public showLoading: boolean = false;


    constructor(
        private readonly translateService: TranslateService
    ){}


    public onShowLoading() {
        this.showLoading = this.showLoading ? false : true;
    }

    public onValidator(form: FormGroup){
        return form.valid ? true : false;
    }
}
