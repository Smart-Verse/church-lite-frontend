import {Component, OnInit} from "@angular/core";
import {DatePipe} from "@angular/common";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {CrudService} from "../../shared/services/crud/crud.service";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {FinancialConfig} from "./financial.config";

@Component({
  selector: "app-financial",
  imports: [SharedCommonModule, BreadcrumbModule],
  providers: [ToastService, DatePipe, CrudService],
  templateUrl: "./financial.component.html",
  styleUrl: "./financial.component.scss"
})
export class FinancialComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;
  public context = "revenues";
  public financialId: string | null = null;
  public isSaving = false;
  public pageTitle = "financial_page_revenue_title";
  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  _type = "REVENUE";
  configuration = new FinancialConfig();
  _paidInvoice = false;
  _buttonText = this.translateService.translate("financial_saveAndQuit");

  get planAccountFilter(): string {
    return `financialNature eq ${this._type}`;
  }

  constructor(
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly datePipe: DatePipe,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly crudService: CrudService
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    this.context = this.route.snapshot.data["context"] ?? this.route.snapshot.paramMap.get("hash") ?? "revenues";
    this.financialId = this.route.snapshot.paramMap.get("id");
    this.setConfigContext(this.context);

    if (this.financialId && this.financialId !== "new") {
      this.loadFinancial(this.financialId);
    } else {
      this.formGroup.patchValue({issueDate: new Date(), dueDate: new Date()});
    }
  }

  private loadFinancial(id: string): void {
    this.showLoading = true;
    this.crudService.onGet("financial", id).subscribe({
      next: data => {
        data.issueDate = data.issueDate ? new Date(data.issueDate) : null;
        data.dueDate = data.dueDate ? new Date(data.dueDate) : null;
        data.paymentReceiptDate = data.paymentReceiptDate ? new Date(data.paymentReceiptDate) : null;
        this.formGroup.patchValue(data);
        this._paidInvoice = !!data.paymentReceiptDate;
        this._buttonText = this.translateService.translate(this._paidInvoice ? "financial_reverse" : "financial_saveAndQuit");
        this.showLoading = false;
      },
      error: error => {
        this.showLoading = false;
        this.toastService.error({
          summary: this.translateService.translate("common_message"),
          detail: error.error?.message ?? "Falha ao carregar o lançamento"
        });
        this.navigateToList();
      }
    });
  }

  onSave(action = 0): void {
    if (!this.formGroup.valid) {
      this.toastService.warn({
        summary: this.translateService.translate("common_message"),
        detail: this.translateService.translate("common_message_invalid_fields")
      });
      this.fieldsService.verifyIsValid();
      return;
    }

    const paymentDate = action === 1
      ? (this._paidInvoice ? null : new Date())
      : this.formGroup.get("paymentReceiptDate")?.value;
    const dto = this.configuration.convertToDTO(this.formGroup, this.datePipe, this._type, paymentDate);
    const request = this.financialId && this.financialId !== "new"
      ? this.crudService.onUpdate("financial", this.financialId, dto)
      : this.crudService.onSave("financial", dto);

    this.isSaving = true;
    this.showLoading = true;
    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.showLoading = false;
        this.toastService.success({
          summary: this.translateService.translate("common_message"),
          detail: this.translateService.translate("common_message_success")
        });
        this.navigateToList();
      },
      error: error => {
        this.isSaving = false;
        this.showLoading = false;
        this.toastService.error({
          summary: this.translateService.translate("common_message"),
          detail: error.error?.message ?? "Falha ao salvar o lançamento"
        });
      }
    });
  }

  onCancel(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(["/home/register", this.context]);
  }

  private setConfigContext(context: string): void {
    const isExpense = context === "expenses";
    this._type = isExpense ? "EXPENSE" : "REVENUE";
    this.pageTitle = isExpense ? "financial_page_expense_title" : "financial_page_revenue_title";
    const listLabel = isExpense ? "financial_page_expenses" : "financial_page_revenues";
    this.breadcrumbItems = [
      {label: this.translateService.translate("financial_page_financial")},
      {label: this.translateService.translate(listLabel), routerLink: ["/home/register", this.context]},
      {label: this.translateService.translate(this.pageTitle)}
    ];
  }
}
