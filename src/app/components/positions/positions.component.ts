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
import {PositionConfig} from "./position.config";
@Component({selector: "app-positions", imports: [SharedCommonModule, BreadcrumbModule], providers: [ToastService, CrudService], templateUrl: "./positions.component.html", styleUrl: "./positions.component.scss"})
export class PositionsComponent extends BaseComponent implements OnInit {
  public positionFormGroup: FormGroup; public id: string | null = null; public isSaving = false; public breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"}; public breadcrumbItems: MenuItem[] = [];
  constructor(private fieldsService: FieldsService, public translateService: TranslateService, private toast: ToastService, private crud: CrudService, private route: ActivatedRoute, private router: Router) {super(); this.positionFormGroup = this.fieldsService.onCreateFormBuiderDynamic(new PositionConfig().fields);}
  ngOnInit(): void {this.id = this.route.snapshot.paramMap.get("id"); this.breadcrumbItems = [{label: this.translateService.translate("entity_secretariat")}, {label: this.translateService.translate("entity_others")}, {label: this.translateService.translate("entity_position_title"), routerLink: "/home/register/positions"}, {label: this.translateService.translate(this.id && this.id !== "new" ? "entity_edit" : "entity_new")}]; if (this.id && this.id !== "new") this.load(this.id);}
  private load(id: string): void {this.showLoading = true; this.crud.onGet("positions", id).subscribe({next: data => {this.positionFormGroup.patchValue(data); this.showLoading = false;}, error: e => {this.showLoading = false; this.error(e); this.onCancel();}});}
  onSave(): void {if (!this.positionFormGroup.valid) {this.toast.warn({summary: this.translateService.translate("common_message"), detail: this.translateService.translate("common_message_invalid_fields")}); this.fieldsService.verifyIsValid(); return;} const dto = DTOConverter.convertPositionToDTO(this.positionFormGroup); const request = this.id && this.id !== "new" ? this.crud.onUpdate("positions", this.id, dto) : this.crud.onSave("positions", dto); this.persist(request);}
  onCancel(): void {this.router.navigate(["/home/register/positions"]);}
  private persist(request: any): void {this.isSaving = this.showLoading = true; request.subscribe({next: () => {this.isSaving = this.showLoading = false; this.toast.success({summary: this.translateService.translate("common_message"), detail: this.translateService.translate("common_message_success")}); this.onCancel();}, error: (e: any) => {this.isSaving = this.showLoading = false; this.error(e);}});}
  private error(e: any): void {this.toast.error({summary: this.translateService.translate("common_message"), detail: e.error?.message ?? "Falha ao salvar o cadastro"});}
}
