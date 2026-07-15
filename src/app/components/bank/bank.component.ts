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
import {BankConfig} from "./bank.config";

@Component({selector: "app-bank", imports: [SharedCommonModule, BreadcrumbModule], providers: [ToastService, CrudService], templateUrl: "./bank.component.html", styleUrl: "./bank.component.scss"})
export class BankComponent extends BaseComponent implements OnInit {
  private configuration = new BankConfig();
  public formGroup: FormGroup;
  public id: string | null = null;
  public isSaving = false;
  public breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  public breadcrumbItems: MenuItem[] = [];
  constructor(private fieldsService: FieldsService, public translateService: TranslateService, private toast: ToastService, private crud: CrudService, private route: ActivatedRoute, private router: Router) { super(); this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields); }
  ngOnInit(): void { this.id = this.route.snapshot.paramMap.get("id"); this.breadcrumbItems = this.makeBreadcrumb("entity_bank_title", "/home/register/bank"); if (this.id && this.id !== "new") this.load(this.id); }
  private load(id: string): void { this.showLoading = true; this.crud.onGet("bank", id).subscribe({next: data => {this.formGroup.patchValue(data); this.showLoading = false;}, error: e => {this.showLoading = false; this.error(e); this.onCancel();}}); }
  onSave(): void { if (!this.formGroup.valid) {this.invalid(); return;} const dto = this.configuration.convertToDTO(this.formGroup); const request = this.id && this.id !== "new" ? this.crud.onUpdate("bank", this.id, dto) : this.crud.onSave("bank", dto); this.persist(request); }
  onCancel(): void { this.router.navigate(["/home/register/bank"]); }
  private persist(request: any): void { this.isSaving = this.showLoading = true; request.subscribe({next: () => {this.isSaving = this.showLoading = false; this.success(); this.onCancel();}, error: (e: any) => {this.isSaving = this.showLoading = false; this.error(e);}}); }
  private makeBreadcrumb(title: string, link: string): MenuItem[] { return [{label: this.translateService.translate("entity_secretariat")}, {label: this.translateService.translate("financial_page_financial")}, {label: this.translateService.translate(title), routerLink: link}, {label: this.translateService.translate(this.id && this.id !== "new" ? "entity_edit" : "entity_new")}]; }
  private invalid(): void {this.toast.warn({summary: this.translateService.translate("common_message"), detail: this.translateService.translate("common_message_invalid_fields")}); this.fieldsService.verifyIsValid();}
  private success(): void {this.toast.success({summary: this.translateService.translate("common_message"), detail: this.translateService.translate("common_message_success")});}
  private error(e: any): void {this.toast.error({summary: this.translateService.translate("common_message"), detail: e.error?.message ?? "Falha ao salvar o cadastro"});}
}
