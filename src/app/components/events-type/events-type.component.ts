import {Component, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {ColorPickerModule} from "primeng/colorpicker";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {CrudService} from "../../shared/services/crud/crud.service";
import {FieldsService} from "../../shared/services/fields/fields.service";
import {ToastService} from "../../shared/services/toast/toast.service";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {EventTypesConfig} from "./events-type.config";
@Component({selector: "app-events-type", imports: [SharedCommonModule, ColorPickerModule, BreadcrumbModule], providers: [ToastService, CrudService], templateUrl: "./events-type.component.html", styleUrl: "./events-type.component.scss"})
export class EventsTypeComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup; private configuration = new EventTypesConfig(); public id: string | null = null; public isSaving = false; public breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"}; public breadcrumbItems: MenuItem[] = [];
  constructor(private fieldsService: FieldsService, public translateService: TranslateService, private toast: ToastService, private crud: CrudService, private route: ActivatedRoute, private router: Router) {super(); this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);}
  ngOnInit(): void {this.id = this.route.snapshot.paramMap.get("id"); this.breadcrumbItems = [{label: this.translateService.translate("entity_secretariat")}, {label: this.translateService.translate("entity_others")}, {label: this.translateService.translate("entity_event_type_title"), routerLink: "/home/register/eventsType"}, {label: this.translateService.translate(this.id && this.id !== "new" ? "entity_edit" : "entity_new")}]; if (this.id && this.id !== "new") this.load(this.id);}
  private load(id: string): void {this.showLoading = true; this.crud.onGet("eventsType", id).subscribe({next: data => {this.formGroup.patchValue(data); this.showLoading = false;}, error: e => {this.showLoading = false; this.error(e); this.onCancel();}});}
  onSave(): void {if (!this.formGroup.valid) {this.toast.warn({summary: this.translateService.translate("common_message"), detail: this.translateService.translate("common_message_invalid_fields")}); this.fieldsService.verifyIsValid(); return;} const dto = this.configuration.convertToDTO(this.formGroup); const request = this.id && this.id !== "new" ? this.crud.onUpdate("eventsType", this.id, dto) : this.crud.onSave("eventsType", dto); this.persist(request);}
  onCancel(): void {this.router.navigate(["/home/register/eventsType"]);}
  private persist(request: any): void {this.isSaving = this.showLoading = true; request.subscribe({next: () => {this.isSaving = this.showLoading = false; this.toast.success({summary: this.translateService.translate("common_message"), detail: this.translateService.translate("common_message_success")}); this.onCancel();}, error: (e: any) => {this.isSaving = this.showLoading = false; this.error(e);}});}
  private error(e: any): void {this.toast.error({summary: this.translateService.translate("common_message"), detail: e.error?.message ?? "Falha ao salvar o cadastro"});}
}
