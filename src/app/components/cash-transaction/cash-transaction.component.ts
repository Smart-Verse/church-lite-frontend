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
import {TransactionsService} from "../../services/transactions/transactions.service";
import {CashTransactionConfig} from "./cash-transaction.config";

@Component({
  selector: "app-cash-transaction",
  imports: [SharedCommonModule, BreadcrumbModule],
  viewProviders: [DatePipe],
  providers: [ToastService, TransactionsService, CrudService],
  templateUrl: "./cash-transaction.component.html",
  styleUrl: "./cash-transaction.component.scss"
})
export class CashTransactionComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup;
  public isSaving = false;
  public action = 0;
  public pageTitle = "transactions_openingCash";
  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  configuration = new CashTransactionConfig();
  _filter = "";
  _close = false;
  _open = false;
  _disabledCloseCash = false;

  constructor(
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService,
    private readonly datePipe: DatePipe,
    private readonly transactionsService: TransactionsService,
    private readonly crudService: CrudService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    this.action = Number(this.route.snapshot.data["action"] ?? 0);
    this.pageTitle = this.action === 0 ? "transactions_openingCash" : "transactions_endCash";
    this.breadcrumbItems = [
      {label: this.translateService.translate("financial_page_financial")},
      {label: this.translateService.translate("financial_page_transactions"), routerLink: "/home/transactions"},
      {label: this.translateService.translate(this.pageTitle)}
    ];
    this.onConfigView();
  }

  onSave(): void {
    if (!this.formGroup.valid) {
      this.toastService.warn({
        summary: this.translateService.translate("common_message"),
        detail: this.translateService.translate("common_message_invalid_fields")
      });
      this.fieldsService.verifyIsValid();
      return;
    }

    const dto = this.configuration.convertToDTO(this.formGroup, this.datePipe, this.action === 0 ? null : new Date());
    dto.action = this.action;
    this.isSaving = true;
    this.showLoading = true;
    this.crudService.onSave("cashTransactions", dto).subscribe({
      next: response => {
        this.isSaving = false;
        this.showLoading = false;
        const detail = this.action !== 0 && !response.endDate ? 'cash_closing_pending' : 'common_message_success';
        this.toastService.success({
          summary: this.translateService.translate("common_message"),
          detail: this.translateService.translate(detail)
        });
        this.router.navigate(["/home/transactions"]);
      },
      error: error => {
        this.isSaving = false;
        this.showLoading = false;
        this.toastService.error({
          summary: this.translateService.translate("common_message"),
          detail: error.error?.message ?? "Falha ao salvar a movimentação"
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(["/home/transactions"]);
  }

  private onConfigView(): void {
    if (this.action === 0) {
      this.formGroup.patchValue({startDate: new Date()});
      this._filter = "typeCash eq 0 and status eq 1";
      this._close = true;
      this._open = false;
      this._disabledCloseCash = false;
    } else {
      this._close = false;
      this._open = true;
      this._filter = "typeCash eq 0 and status eq 0";
      this._disabledCloseCash = true;
    }
  }

  onGetCashTransaction(): void {
    const cash = this.formGroup.get("cash")?.value;
    if (!cash?.id) return;
    this.showLoading = true;
    this.transactionsService.getResumeTransaction(cash.id).subscribe({
      next: data => {
        const transaction = data?.output ?? null;
        if (this.action === 0) {
          const previousBalance = transaction?.finalBalance ?? 0;
          this.formGroup.patchValue({previousBalance, initialBalance: previousBalance});
        } else {
          if (!transaction) {
            this.showLoading = false;
            this.toastService.warn({
              summary: this.translateService.translate("common_message"),
              detail: "Não foi encontrada uma abertura ativa para este caixa."
            });
            return;
          }
          transaction.startDate = new Date(transaction.startDate);
          transaction.endDate = new Date();
          transaction.finalBalance = (transaction.initialBalance ?? 0) + (transaction.balance ?? 0);
          this.formGroup.patchValue(transaction);
        }
        this.showLoading = false;
      },
      error: error => {
        this.showLoading = false;
        this.toastService.error({
          summary: this.translateService.translate("common_message"),
          detail: error.error?.message ?? "Não foi possível consultar o saldo do caixa."
        });
      }
    });
  }
}
