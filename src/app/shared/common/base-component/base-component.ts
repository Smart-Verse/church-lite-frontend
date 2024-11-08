import { TranslateService } from "../../services/translate/translate.service";

export class BaseComponent {
    public showLoading: boolean = false;

    constructor(
        private readonly translateService: TranslateService
    ){}
}