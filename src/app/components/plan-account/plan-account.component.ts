import {Component, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {DTOConverter} from "../../../core/dto/dto-converter";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {CrudService} from "../../shared/services/crud/crud.service";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {planAccountFinancialNature, typePlanAccount} from "../../shared/util/constants";
import {fieldsPlanAccount} from "./plan-account.config";
import {RequestData} from "../../shared/interfaces/request-data";
import {getNextTreeCode} from "../../shared/util/tree-code";

@Component({
  selector: "app-plan-account",
  imports: [SharedCommonModule, BreadcrumbModule],
  providers: [ToastService, CrudService],
  templateUrl: "./plan-account.component.html",
  styleUrl: "./plan-account.component.scss"
})
export class PlanAccountComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;
  public id: string | null = null;
  public parent: any = null;
  public isSaving = false;
  protected readonly _planAccount = typePlanAccount;
  protected readonly financialNatures = planAccountFinancialNature;
  public breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  public breadcrumbItems: MenuItem[] = [];

  constructor(private fieldsService: FieldsService, public translateService: TranslateService, private toast: ToastService, private crud: CrudService, private route: ActivatedRoute, private router: Router) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(fieldsPlanAccount);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.breadcrumbItems = [{label: this.translateService.translate("entity_secretariat")}, {label: this.translateService.translate("financial_page_financial")}, {
      label: this.translateService.translate("entity_plan_account_title"),
      routerLink: "/home/planAccount"
    }, {label: this.translateService.translate(this.id && this.id !== "new" ? "entity_edit" : "entity_new")}];
    if (this.id && this.id !== "new") this.load(this.id); else {
      const parentId = this.route.snapshot.queryParamMap.get("parentId");
      if (parentId) this.loadParent(parentId); else this.loadNextCode();
    }
  }

  private load(id: string): void {
    this.showLoading = true;
    this.crud.onGet("planAccount", id).subscribe({
      next: data => {
        this.parent = data.parentCode ?? null;
        data.type = this._planAccount.find(e => e.key === data.type);
        data.financialNature = this.financialNatures.find(e => e.key === data.financialNature);
        this.formGroup.patchValue(data);
        this.formGroup.get("financialNature")?.disable();
        this.showLoading = false;
      }, error: e => {
        this.showLoading = false;
        this.error(e);
        this.onCancel();
      }
    });
  }

  private loadParent(id: string): void {
    this.showLoading = true;
    this.crud.onGet("planAccount", id).subscribe({
      next: data => {
        this.parent = data;
        this.formGroup.get("financialNature")?.setValue(this.financialNatures.find(e => e.key === data.financialNature));
        this.formGroup.get("financialNature")?.disable();
        this.loadNextCode(data.codeTree);
      }, error: e => {
        this.showLoading = false;
        this.error(e);
      }
    });
  }

  private loadNextCode(parentCode?: string): void {
    const request = new RequestData();
    request.size = 10000;
    this.showLoading = true;
    this.crud.onGetAll("planAccount", request).subscribe({
      next: response => {
        this.formGroup.get("codeTree")?.setValue(getNextTreeCode(response.contents, parentCode));
        this.showLoading = false;
      }, error: e => {
        this.showLoading = false;
        this.error(e);
      }
    });
  }

  onSave(): void {
    if (!this.formGroup.valid) {
      this.invalid();
      return;
    }
    const dto = DTOConverter.convertPlanAccountToDTO(this.formGroup);
    if (this.parent) dto.parentCode = {
      id: this.parent.id,
      description: this.parent.description,
      codeTree: this.parent.codeTree,
      type: this.parent.type,
      financialNature: this.parent.financialNature
    };
    const request = this.id && this.id !== "new" ? this.crud.onUpdate("planAccount", this.id, dto) : this.crud.onSave("planAccount", dto);
    this.persist(request);
  }

  onCancel(): void {
    this.router.navigate(["/home/planAccount"]);
  }

  private persist(request: any): void {
    this.isSaving = this.showLoading = true;
    request.subscribe({
      next: () => {
        this.isSaving = this.showLoading = false;
        this.toast.success({
          summary: this.translateService.translate("common_message"),
          detail: this.translateService.translate("common_message_success")
        });
        this.onCancel();
      }, error: (e: any) => {
        this.isSaving = this.showLoading = false;
        this.error(e);
      }
    });
  }

  private invalid(): void {
    this.toast.warn({
      summary: this.translateService.translate("common_message"),
      detail: this.translateService.translate("common_message_invalid_fields")
    });
    this.fieldsService.verifyIsValid();
  }

  private error(e: any): void {
    this.toast.error({
      summary: this.translateService.translate("common_message"),
      detail: e.error?.message ?? "Falha ao salvar o cadastro"
    });
  }
}
