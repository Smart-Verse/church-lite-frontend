import { Component, OnInit } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared/common/base-component/base-component';
import { TranslateService } from '../../shared/services/translate/translate.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { SecurityService } from '../services/security.service';
import { ToastService } from '../../services/toast/toast.service';
import { Login } from './login';
import { CookiesService } from '../../services/cookies/cookies.service';
import { EnumCookie } from '../../services/cookies/cookie.enum';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedCommonModule],
  providers: [SecurityService,ToastService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit {


  public value: string = "";
  public loginForm: FormGroup;

  constructor(
    private readonly translateLogin: TranslateService,
    private readonly fb: FormBuilder,
    private readonly fieldsService: FieldsService,
    private readonly router: Router,
    private readonly securityService: SecurityService,
    private readonly toastService: ToastService,
    private readonly coockieService: CookiesService
  ){
    super(translateLogin);
    this.loginForm = this.fieldsService.onCreateFormBuiderDynamic(new Login().fields);
  }


  ngOnInit(): void {
    
  }


  onSignUp() {
    this.router.navigate(["singup"])
  }

  onLogin(){
    if(!this.onValidator(this.loginForm)){
      this.toastService.info({summary: "Erro", detail: "Existem campos no formulario invalido"});
      return;
    }
    this.onShowLoading();
    this.securityService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if(res.accessToken){
          this.coockieService.set(EnumCookie.AUTHORIZATION,res.accessToken);
          this.router.navigate(["home"]);
        }
        this.onShowLoading();
      },
      error: (error) => {
        this.toastService.error({summary: "Erro", detail: "Ocorreu um erro"});
        this.onShowLoading();
      }
    });
  }
}
