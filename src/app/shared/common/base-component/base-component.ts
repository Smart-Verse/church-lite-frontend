import { TranslateService } from "../../services/translate/translate.service";

export class BaseComponent {
    public showLoading: boolean = false;

    public onShowLoading() {
        this.showLoading = this.showLoading ? false : true;
    }

    constructor(
        private readonly translateService: TranslateService
    ){}
}