import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { BaseComponent } from '../../shared/common/base-component/base-component';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { TranslateService } from '../../shared/services/translate/translate.service';
import { UsersService } from '../../services/users/users.service';
import { UserAdminConfig } from './user-admin.config';

@Component({
  selector: 'app-user-admin',
  imports: [SharedCommonModule, BreadcrumbModule],
  providers: [ToastService],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.scss'
})
export class UserAdminComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  id: string | null = null;
  isSaving = false;
  breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/home/dashboard' };
  breadcrumbItems: MenuItem[] = [
    { label: 'Configurações' },
    { label: 'Usuários', routerLink: '/home/register/users' }
  ];

  private readonly configuration = new UserAdminConfig();

  constructor(
    private readonly fieldsService: FieldsService,
    private readonly usersService: UsersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toast: ToastService,
    public readonly translateService: TranslateService
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'new') {
      this.formGroup.get('password')?.clearValidators();
      this.formGroup.get('password')?.updateValueAndValidity();
      this.load(this.id);
    }
  }

  onSave(): void {
    if (!this.formGroup.valid) {
      this.toast.warn({ summary: 'Usuários', detail: 'Preencha os campos obrigatórios' });
      this.fieldsService.verifyIsValid();
      return;
    }

    this.isSaving = this.showLoading = true;
    const request: Observable<unknown> = this.id && this.id !== 'new'
      ? this.usersService.update(this.id, this.configuration.toUpdateInput(this.formGroup))
      : this.usersService.create(this.configuration.toCreateInput(this.formGroup));

    request.subscribe({
      next: () => {
        this.isSaving = this.showLoading = false;
        this.toast.success({ summary: 'Usuários', detail: 'Usuário salvo com sucesso' });
        this.onCancel();
      },
      error: (error: any) => {
        this.isSaving = this.showLoading = false;
        this.toast.error({
          summary: 'Usuários',
          detail: error?.error?.message ?? 'Não foi possível salvar o usuário'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/home/register/users']);
  }

  private load(id: string): void {
    this.showLoading = true;
    this.usersService.get(id).subscribe({
      next: user => {
        this.formGroup.patchValue(user);
        this.showLoading = false;
      },
      error: (error: any) => {
        this.showLoading = false;
        this.toast.error({
          summary: 'Usuários',
          detail: error?.error?.message ?? 'Não foi possível carregar o usuário'
        });
        this.onCancel();
      }
    });
  }
}
