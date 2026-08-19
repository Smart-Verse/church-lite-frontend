import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {MenuItem} from 'primeng/api';
import {Observable} from 'rxjs';
import {BaseComponent} from '../../shared/common/base-component/base-component';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {FieldsService} from '../../shared/services/fields/fields.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {UsersService} from '../../services/users/users.service';
import {UserAdminConfig} from './user-admin.config';

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
  userHash: string | null = null;
  selectedMember: any = null;
  isSaving = false;
  breadcrumbHome: MenuItem = {icon: 'pi pi-home', routerLink: '/home/dashboard'};
  breadcrumbItems: MenuItem[] = [
    {label: 'Configurações'},
    {label: 'Usuários', routerLink: '/home/register/users'}
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
      this.toast.warn({summary: 'Usuários', detail: 'Preencha os campos obrigatórios'});
      this.fieldsService.verifyIsValid();
      return;
    }

    this.isSaving = this.showLoading = true;
    const memberId = this.selectedMember?.personMember?.id ?? this.selectedMember?.personMember?.hash;
    if ((!this.id || this.id === 'new') && memberId) {
      this.usersService.promoteMember(memberId).subscribe({
        next: () => this.finishSave('Membro promovido para usuário administrativo com sucesso'),
        error: (error: any) => {
          if (String(error?.error?.message ?? '').includes('ainda não possui acesso')) {
            this.createAndLinkMember(memberId);
            return;
          }
          this.failSave(error, 'Não foi possível promover o membro para usuário administrativo');
        }
      });
      return;
    }
    const request: Observable<unknown> = this.id && this.id !== 'new'
      ? this.usersService.update(this.id, this.configuration.toUpdateInput(this.formGroup))
      : this.usersService.create(this.configuration.toCreateInput(this.formGroup));

    request.subscribe({
      next: (response: any) => {
        const userId = response?.user?.hash ?? response?.hash ?? this.userHash;
        if (memberId && userId) {
          this.usersService.linkMember(memberId, userId).subscribe({
            next: () => this.finishSave('Usuário salvo e vinculado ao membro com acesso confirmado.'),
            error: (error: any) => this.failSave(error, 'Usuário salvo, mas não foi possível concluir o vínculo com o membro')
          });
          return;
        }
        this.finishSave('Usuário salvo com sucesso');
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
        this.userHash = user.hash ?? null;
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

  private finishSave(detail: string): void {
    this.isSaving = this.showLoading = false;
    this.toast.success({summary: 'Usuários', detail});
    this.onCancel();
  }

  private createAndLinkMember(memberId: string): void {
    this.usersService.create(this.configuration.toCreateInput(this.formGroup)).subscribe({
      next: response => {
        const userId = response?.user?.hash;
        if (!userId) {
          this.failSave(null, 'Usuário criado, mas não foi possível identificar o acesso');
          return;
        }
        this.usersService.linkMember(memberId, userId).subscribe({
          next: () => this.finishSave('Usuário salvo e vinculado ao membro com acesso confirmado.'),
          error: (error: any) => this.failSave(error, 'Usuário salvo, mas não foi possível concluir o vínculo com o membro')
        });
      },
      error: (error: any) => this.failSave(error, 'Não foi possível salvar o usuário')
    });
  }

  private failSave(error: any, fallback: string): void {
    this.isSaving = this.showLoading = false;
    this.toast.error({summary: 'Usuários', detail: error?.error?.message ?? fallback});
  }
}
