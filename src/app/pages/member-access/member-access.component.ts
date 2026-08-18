import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ToastService } from '../../shared/services/toast/toast.service';
import { MemberPortalAccessService, MemberRegistrationContext } from '../../services/member-portal/member-portal-access.service';

@Component({
  selector: 'app-member-access',
  imports: [SharedCommonModule, LoadingComponent],
  providers: [ToastService],
  templateUrl: './member-access.component.html',
  styleUrl: './member-access.component.scss',
})
export class MemberAccessComponent implements OnInit {
  form: FormGroup;
  churchId = '';
  memberId: string | null = null;
  context: MemberRegistrationContext | null = null;
  loading = true;
  submitted = false;
  existingAccess = false;

  constructor(private readonly fb: FormBuilder, private readonly route: ActivatedRoute,
              private readonly router: Router, private readonly service: MemberPortalAccessService,
              private readonly toast: ToastService) {
    this.form = this.fb.group({
      name: ['', Validators.required], email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required], phone: [''], password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.churchId = this.route.snapshot.paramMap.get('churchId') ?? '';
    this.memberId = this.route.snapshot.paramMap.get('memberId');
    this.service.context(this.churchId, this.memberId).subscribe({next: context => {
      this.context = context;
      if (context.memberName) this.form.patchValue({name: context.memberName});
      this.loading = false;
    }, error: () => {this.loading = false; this.context = null;}});
  }

  submit(): void {
    if (this.form.invalid || this.form.value.password !== this.form.value.passwordConfirmation) {
      this.form.markAllAsTouched();
      this.toast.warn({summary: 'Verifique os dados', detail: 'Preencha os campos corretamente e confirme a senha.'});
      return;
    }
    this.loading = true;
    this.service.register(this.churchId, this.memberId, this.form.value).subscribe({next: response => {
      this.existingAccess = response.existingAccess;
      this.submitted = true;
      this.loading = false;
    }, error: error => {
      this.loading = false;
      this.toast.error({summary: 'Não foi possível criar o acesso', detail: this.message(error.error?.message)});
    }});
  }

  formatCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    const value = digits.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1-$2');
    this.form.get('cpf')?.setValue(value, {emitEvent: false});
  }

  goLogin(): void { this.router.navigate(['/login']); }
  private message(key: string): string {
    const messages: Record<string, string> = {
      invalid_cpf: 'Informe um CPF válido.', member_portal_email_mismatch: 'Use o e-mail que já consta no cadastro do membro.',
      member_portal_cpf_mismatch: 'O CPF informado não corresponde ao cadastro.', member_portal_cpf_already_registered: 'Este CPF já possui cadastro nesta igreja.',
      member_portal_link_not_found: 'Este link não está mais disponível.',
    };
    return messages[key] ?? 'Revise os dados ou solicite um novo link à igreja.';
  }
}
