import {Component, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {CrudService} from "../../shared/services/crud/crud.service";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {typeCash} from "../../shared/util/constants";
import {CashConfig} from "./cash.config";
import {SubscriptionService} from '../../shared/services/subscription/subscription.service';
import {SubscriptionResource} from '../../shared/services/subscription/subscription.models';

@Component({
  selector: "app-cash",
  imports: [SharedCommonModule, BreadcrumbModule],
  providers: [ToastService, CrudService],
  templateUrl: "./cash.component.html",
  styleUrl: "./cash.component.scss"
})
export class CashComponent extends BaseComponent implements OnInit {
  private configuration = new CashConfig();
  protected readonly _typeCash = typeCash;
  public formGroup: FormGroup;
  public id: string | null = null;
  public isSaving = false;
  private status = "CLOSE_CASH";
  private originalType: string | null = null;
  public breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  public breadcrumbItems: MenuItem[] = [];

  constructor(private fieldsService: FieldsService, public translateService: TranslateService, private toast: ToastService, private crud: CrudService, private route: ActivatedRoute, private router: Router, private subscription: SubscriptionService) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.breadcrumbItems = [{label: this.translateService.translate("entity_secretariat")}, {label: this.translateService.translate("financial_page_financial")}, {
      label: this.translateService.translate("entity_cash_title"),
      routerLink: "/home/register/cash"
    }, {label: this.translateService.translate(this.id && this.id !== "new" ? "entity_edit" : "entity_new")}];
    if (this.id && this.id !== "new") this.load(this.id);
  }

  private load(id: string): void {
    this.showLoading = true;
    this.crud.onGet("cash", id).subscribe({
      next: data => {
        this.status = data.status;
        this.originalType = data.typeCash;
        data.typeCash = this._typeCash.find(e => e.key === data.typeCash);
        this.formGroup.patchValue(data);
        this.showLoading = false;
      }, error: e => {
        this.showLoading = false;
        this.error(e);
        this.onCancel();
      }
    });
  }

  onSave(): void {
    if (!this.formGroup.valid) {
      this.toast.warn({
        summary: this.translateService.translate("common_message"),
        detail: this.translateService.translate("common_message_invalid_fields")
      });
      this.fieldsService.verifyIsValid();
      return;
    }
    if (this.limitReached) {
      this.subscription.requestUpgrade();
      this.toast.warn({
        summary: this.translateService.translate("common_message"),
        detail: this.translateService.translate("subscription_resource_limit_reached")
      });
      return;
    }
    const dto = this.configuration.convertToDTO(this.formGroup, this.status);
    const request = this.id && this.id !== "new" ? this.crud.onUpdate("cash", this.id, dto) : this.crud.onSave("cash", dto);
    this.isSaving = this.showLoading = true;
    request.subscribe({
      next: () => {
        this.subscription.load(true);
        this.isSaving = this.showLoading = false;
        this.toast.success({
          summary: this.translateService.translate("common_message"),
          detail: this.translateService.translate("common_message_success")
        });
        this.onCancel();
      }, error: e => {
        this.isSaving = this.showLoading = false;
        this.error(e);
      }
    });
  }

  get limitReached(): boolean {
    const type = this.formGroup.value.typeCash?.key ?? this.formGroup.value.typeCash;
    if (!type || (this.id && this.id !== "new" && type === this.originalType)) return false;
    return !this.subscription.canCreate(this.resourceFor(type));
  }

  private resourceFor(type: string): SubscriptionResource {
    return type === "BANK" ? "BANK_ACCOUNT" : "CASH_ACCOUNT";
  }

  onCancel(): void {
    this.router.navigate(["/home/register/cash"]);
  }

  private error(e: any): void {
    this.toast.error({
      summary: this.translateService.translate("common_message"),
      detail: e.error?.message ?? "Falha ao salvar o cadastro"
    });
  }
}
