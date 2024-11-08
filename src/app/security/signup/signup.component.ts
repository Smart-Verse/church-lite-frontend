import { Component, OnInit } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { SignUp } from './signup';
import {  Router } from '@angular/router';
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { SecurityService } from '../services/security.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedCommonModule, LoadingComponent],
  providers: [SecurityService,ToastService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {


  public signUp: FormGroup;
  public showLoading = false;
  
  constructor(
    private readonly fb: FormBuilder,
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
    this.showLoading = true;
    this.securityService.register(this.signUp.value).subscribe({
      next: (res) => {
        this.toastService.success({summary: "Usuario cadastrado com sucesso",detail: "Você receberá um email para continuação do cadastro!"});
        this.showLoading = false;
        this.onSign();
      },
      error: (error) => {
        this.toastService.error({summary: "Erro", detail: "ocorreu um erro ao cadastrar usuário"});
        this.showLoading = false;
      }
    })
  }

  onSign() {
    this.router.navigate(["login"])
  }
}
