import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {BaseComponent} from '../../shared/common/base-component/base-component';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {CrudService} from '../../shared/services/crud/crud.service';
import {FieldsService} from '../../shared/services/fields/fields.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {RecurringFinancialConfig} from './recurring-financial.config';

@Component({
  selector: 'app-recurring-financial',
  imports: [SharedCommonModule, BreadcrumbModule],
  providers: [ToastService, DatePipe, CrudService],
  templateUrl: './recurring-financial.component.html',
  styleUrl: './recurring-financial.component.scss'
})
export class RecurringFinancialComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  recurringId: string | null = null;
  isSaving = false;
  readonly breadcrumbHome: MenuItem = {icon: 'pi pi-home', routerLink: '/home/dashboard'};
  breadcrumbItems: MenuItem[] = [];
  readonly types: any[];
  readonly modes: any[];
  readonly frequencies: any[];
  readonly valueTypes: any[];
  readonly statuses: any[];
  private readonly configuration = new RecurringFinancialConfig();

  constructor(
    fieldsService: FieldsService,
    private readonly crudService: CrudService,
    private readonly datePipe: DatePipe,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly translateService: TranslateService
  ) {
    super();
    this.formGroup = fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
    this.types = this.options('type', ['REVENUE', 'EXPENSE']);
    this.modes = this.options('mode', ['INSTALLMENT', 'CONTINUOUS']);
    this.frequencies = this.options('frequency', ['WEEKLY', 'MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL']);
    this.valueTypes = this.options('value_type', ['FIXED', 'VARIABLE_ESTIMATED']);
    this.statuses = this.options('status', ['ACTIVE', 'PAUSED', 'ENDED']);
  }

  ngOnInit(): void {
    this.recurringId = this.route.snapshot.paramMap.get('id');
    this.setBreadcrumb();
    if (this.recurringId && this.recurringId !== 'new') this.load(this.recurringId);
    else {
      this.formGroup.get('typeFinancial')?.valueChanges.subscribe(() => this.formGroup.get('planAccount')?.setValue(null));
      this.formGroup.patchValue({typeFinancial: this.types[1], recurrenceMode: this.modes[0], frequency: this.frequencies[1], valueType: this.valueTypes[0], firstDueDate: new Date(), occurrenceCount: 2, status: this.statuses[0]});
    }
  }

  get installment(): boolean { return this.unwrap(this.formGroup.get('recurrenceMode')?.value) === 'INSTALLMENT'; }
  get planAccountFilter(): string {
    const nature = this.unwrap(this.formGroup.get('typeFinancial')?.value) === 'REVENUE' ? 'REVENUE' : 'EXPENSE';
    return `financialNature eq ${nature}`;
  }

  onSave(): void {
    const count = Number(this.formGroup.get('occurrenceCount')?.value);
    if (!this.formGroup.valid || (this.installment && (count < 2 || count > 60))) {
      this.toastService.warn({summary: this.translateService.translate('common_message'), detail: this.translateService.translate('common_message_invalid_fields')});
      return;
    }
    const dto = this.configuration.convertToDTO(this.formGroup.getRawValue(), this.datePipe, this.installment);
    const request = this.recurringId && this.recurringId !== 'new'
      ? this.crudService.onUpdate('recurringFinancial', this.recurringId, dto)
      : this.crudService.onSave('recurringFinancial', dto);
    this.isSaving = this.showLoading = true;
    request.subscribe({
      next: () => {this.isSaving = this.showLoading = false; this.toastService.success({summary: this.translateService.translate('common_message'), detail: this.translateService.translate('common_message_success')}); this.navigateToList();},
      error: error => {this.isSaving = this.showLoading = false; this.toastService.error({summary: this.translateService.translate('common_message'), detail: error.error?.message ?? this.translateService.translate('common_message_error')});}
    });
  }

  onCancel(): void { this.navigateToList(); }

  private load(id: string): void {
    this.showLoading = true;
    this.crudService.onGet('recurringFinancial', id).subscribe({next: data => {
      data.firstDueDate = data.firstDueDate ? new Date(data.firstDueDate + 'T12:00:00') : null;
      data.endDate = data.endDate ? new Date(data.endDate + 'T12:00:00') : null;
      data.typeFinancial = this.find(this.types, data.typeFinancial); data.recurrenceMode = this.find(this.modes, data.recurrenceMode);
      data.frequency = this.find(this.frequencies, data.frequency); data.valueType = this.find(this.valueTypes, data.valueType); data.status = this.find(this.statuses, data.status);
      this.formGroup.patchValue(data);
      ['typeFinancial', 'recurrenceMode', 'frequency', 'firstDueDate', 'endDate', 'occurrenceCount'].forEach(field => this.formGroup.get(field)?.disable());
      this.showLoading = false;
    }, error: () => {this.showLoading = false; this.navigateToList();}});
  }

  private setBreadcrumb(): void { this.breadcrumbItems = [{label: this.translateService.translate('financial_page_financial')}, {label: this.translateService.translate('financial_recurrence_title'), routerLink: ['/home/register/recurringFinancial']}, {label: this.translateService.translate(this.recurringId && this.recurringId !== 'new' ? 'financial_recurrence_edit' : 'financial_recurrence_new')}]; }
  private navigateToList(): void { this.router.navigate(['/home/register/recurringFinancial']); }
  private options(group: string, values: string[]): any[] { return values.map(value => ({value, label: this.translateService.translate(`financial_recurrence_${group}_${value.toLowerCase()}`)})); }
  private unwrap(value: any): string { return value?.value ?? value; }
  private find(options: any[], value: string): any { return options.find(option => option.value === value) ?? value; }
}
