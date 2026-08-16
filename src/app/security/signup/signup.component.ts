import { Component, OnInit } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { SignUp } from './signup';
import {  Router } from '@angular/router';
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { SecurityService } from '../services/security.service';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
    selector: 'app-signup',
    imports: [SharedCommonModule, LoadingComponent],
    providers: [SecurityService, ToastService],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {


  public signUp: FormGroup;
  public showLoading = false;
  public pendingConfirmation = false;
  
  constructor(
    private readonly fieldsService: FieldsService,
    private readonly router: Router,
    private readonly securityService: SecurityService,
    private readonly toastService: ToastService,
  ){
    this.signUp = this.fieldsService.onCreateFormBuiderDynamic(new SignUp().fields);
  }

  ngOnInit(): void {
    
  }

  onValidator(): boolean{
    if(this.signUp.valid && this.signUp.value.confirPassword === this.signUp.value.password){
      return true;
    }
    return false;
  }

  onRegister() {
    if(!this.onValidator()){
      this.toastService.info({summary: "Erro", detail: "Existem campos no formulario invalido"});
      return;
    }
    this.pendingConfirmation = false;
    this.showLoading = true;
    this.securityService.register(this.signUp.value).subscribe({
      next: (res) => {
        this.toastService.success({summary: "Usuario cadastrado com sucesso",detail: "Você receberá um email para continuação do cadastro!"});
        this.showLoading = false;
        this.onSign();
      },
      error: (error) => {
        const errorKey = error?.error?.message ?? error?.error?.detail ?? error?.error;
        this.pendingConfirmation = errorKey === 'account_confirmation_pending';
        this.toastService.error({
          summary: "Erro",
          detail: this.pendingConfirmation
            ? "Esta conta ainda precisa ser confirmada. Você pode reenviar o e-mail."
            : "Ocorreu um erro ao cadastrar o usuário."
        });
        this.showLoading = false;
      }
    });
  }

  onResendConfirmation(): void {
    const email = this.signUp.value.email;
    if (!email || this.showLoading) return;

    this.showLoading = true;
    this.securityService.resendConfirmation(email).subscribe({
      next: () => {
        this.toastService.success({
          summary: "E-mail solicitado",
          detail: "Se a conta estiver pendente, você receberá um novo link de confirmação."
        });
        this.showLoading = false;
      },
      error: () => {
        this.toastService.error({ summary: "Erro", detail: "Não foi possível solicitar o reenvio agora." });
        this.showLoading = false;
      }
    });
  }

  onSign() {
    this.router.navigate(["login"])
  }
}
