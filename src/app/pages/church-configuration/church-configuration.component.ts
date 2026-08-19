import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {forkJoin, Observable, of, switchMap} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {BaseComponent} from '../../shared/common/base-component/base-component';
import {CrudService} from '../../shared/services/crud/crud.service';
import {RequestData} from '../../shared/interfaces/request-data';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {UserConfigurationService} from '../../services/user-configuration/user-configuration.service';
import {PostalCodeService} from '../../shared/services/address/postal-code.service';
import {
  MemberTransparencyService,
  PlanVisibility,
  TransparencyPlanAccount
} from '../../services/member-portal/member-transparency.service';

@Component({
  selector: 'app-church-configuration',
  imports: [SharedCommonModule],
  providers: [CrudService, ToastService],
  templateUrl: './church-configuration.component.html',
  styleUrl: './church-configuration.component.scss'
})
export class ChurchConfigurationComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  configuration: any = null;
  assignments: any[] = [];
  saving = false;
  approvalPolicies: any[] = [];
  users: any[] = [];
  transparencyModes: any[] = [];
  visibilityOptions: any[] = [];
  memberApprovalOptions: any[] = [];
  transparencyPlanAccounts: TransparencyPlanAccount[] = [];
  private lastPostalCode = '';

  constructor(fb: FormBuilder, private crud: CrudService, private toast: ToastService, public translate: TranslateService, private userConfigurationService: UserConfigurationService, private postalCodeService: PostalCodeService, private transparencyService: MemberTransparencyService) {
    super();
    this.form = fb.group({
      cnpj: ['', Validators.required],
      name: ['', Validators.required],
      foundationDate: [null],
      postalCode: [''],
      address: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [null],
      phone: [''],
      leader: [null],
      treasurers: [[]],
      financialApprovers: [[]],
      cashApprovalPolicy: ['DISABLED', Validators.required],
      transparencyMode: ['DISABLED', Validators.required],
      memberApprovalEnabled: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.approvalPolicies = ['DISABLED', 'ANY', 'ALL'].map(value => ({
      value,
      label: this.translate.translate(`church_approval_${value.toLowerCase()}`)
    }));
    this.transparencyModes = ['DISABLED', 'FULL', 'PARTIAL'].map(value => ({
      value,
      label: this.translate.translate(`church_transparency_${value.toLowerCase()}`)
    }));
    this.visibilityOptions = ['HIDDEN', 'TOTAL_ONLY', 'DETAILED'].map(value => ({
      value,
      label: this.translate.translate(`church_visibility_${value.toLowerCase()}`)
    }));
    this.memberApprovalOptions = [{value: true, label: 'Habilitada'}, {value: false, label: 'Desabilitada'}];
    this.load();
  }

  private all(route: string, size = 100): Observable<any> {
    const request = new RequestData();
    request.offset = 0;
    request.size = size;
    return this.crud.onGetAll(route, request);
  }

  private load(): void {
    this.showLoading = true;
    forkJoin({
      configurations: this.all('churchConfiguration', 1),
      assignments: this.all('churchResponsibleUser'),
      users: this.all('userConfiguration', 10000),
      currentUser: this.userConfigurationService.getUser(),
      transparency: this.transparencyService.get()
    }).subscribe({
      next: ({configurations, assignments, users, currentUser, transparency}) => {
        const current = currentUser?.output;
        this.users = this.uniqueUsers([...(users.contents ?? []), ...(current ? [current] : [])]);
        this.configuration = configurations.contents?.[0] ?? null;
        this.assignments = assignments.contents ?? [];
        this.transparencyPlanAccounts = transparency.planAccounts;
        const treasurers = this.assignments.filter(x => x.treasurer).map(x => x.userConfiguration);
        const financialApprovers = this.assignments.filter(x => x.financialApprover).map(x => x.userConfiguration);
        if (this.configuration) this.form.patchValue({
          ...this.configuration,
          cashApprovalPolicy: this.approvalPolicies.find(option => option.value === this.configuration.cashApprovalPolicy),
          treasurers,
          financialApprovers
        });
        this.form.patchValue({
          transparencyMode: this.transparencyModes.find(option => option.value === transparency.mode),
          memberApprovalEnabled: this.memberApprovalOptions.find(option => option.value === transparency.memberApprovalEnabled)
        });
        this.showLoading = false;
      },
      error: error => {
        this.showLoading = false;
        this.showError(error);
      }
    });
  }

  private uniqueUsers(users: any[]): any[] {
    return [...new Map(users.filter(user => user?.id).map(user => [user.id, user])).values()];
  }

  lookupPostalCode(): void {
    const postalCode = String(this.form.get('postalCode')?.value ?? '').replace(/\D/g, '');
    if (postalCode.length !== 8 || postalCode === this.lastPostalCode) return;
    this.postalCodeService.lookup(postalCode).subscribe({
      next: result => {
        this.lastPostalCode = postalCode;
        this.form.patchValue({
          postalCode: result.postalCode,
          address: result.address,
          neighborhood: result.neighborhood,
          city: result.city, ...(result.complement ? {complement: result.complement} : {})
        });
      },
      error: error => this.toast.warn({
        summary: this.translate.translate('common_message'),
        detail: this.translate.translate(error.error?.message ?? 'postal_code_lookup_error')
      })
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warn({
        summary: this.translate.translate('common_message'),
        detail: this.translate.translate('common_message_invalid_fields')
      });
      return;
    }
    const value = this.form.getRawValue();
    const payload = {...value, cashApprovalPolicy: value.cashApprovalPolicy?.value ?? value.cashApprovalPolicy};
    delete payload.treasurers;
    delete payload.financialApprovers;
    delete payload.transparencyMode;
    delete payload.memberApprovalEnabled;
    const saveConfiguration = this.configuration ? this.crud.onUpdate('churchConfiguration', this.configuration.id, payload) : this.crud.onSave('churchConfiguration', payload);
    this.saving = this.showLoading = true;
    saveConfiguration.pipe(switchMap(() => this.syncAssignments(value.treasurers ?? [], value.financialApprovers ?? [])), switchMap(() => this.transparencyService.update({
      mode: value.transparencyMode?.value ?? value.transparencyMode,
      memberApprovalEnabled: value.memberApprovalEnabled?.value ?? value.memberApprovalEnabled,
      planAccounts: this.transparencyPlanAccounts
    }))).subscribe({
      next: () => {
        this.saving = this.showLoading = false;
        this.toast.success({
          summary: this.translate.translate('common_message'),
          detail: this.translate.translate('common_message_success')
        });
        this.load();
      }, error: error => {
        this.saving = this.showLoading = false;
        this.showError(error);
      }
    });
  }

  isPartialTransparency(): boolean {
    const value = this.form.get('transparencyMode')?.value;
    return (value?.value ?? value) === 'PARTIAL';
  }

  updateVisibility(account: TransparencyPlanAccount, value: PlanVisibility): void {
    account.visibility = value;
  }

  private syncAssignments(treasurers: any[], approvers: any[]): Observable<any> {
    const treasurerIds = new Set(treasurers.map(x => x.id));
    const approverIds = new Set(approvers.map(x => x.id));
    const users = new Map([...treasurers, ...approvers].map(user => [user.id, user]));
    const existing = new Map(this.assignments.map(item => [item.userConfiguration?.id, item]));
    const requests: Observable<any>[] = [];
    users.forEach((user, id) => {
      const payload = {
        userConfiguration: user,
        treasurer: treasurerIds.has(id),
        financialApprover: approverIds.has(id)
      };
      const current = existing.get(id);
      requests.push(current ? this.crud.onUpdate('churchResponsibleUser', current.id, payload) : this.crud.onSave('churchResponsibleUser', payload));
    });
    this.assignments.filter(item => !users.has(item.userConfiguration?.id)).forEach(item => requests.push(this.crud.onDelete('churchResponsibleUser', item.id)));
    return requests.length ? forkJoin(requests) : of([]);
  }

  private showError(error: any): void {
    this.toast.error({
      summary: this.translate.translate('common_message'),
      detail: error.error?.message ?? this.translate.translate('common_message_error')
    });
  }
}
