import { Component } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared/common/base-component/base-component';
import { TranslateService } from '../../shared/services/translate/translate.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent {


  constructor(
    private readonly router: Router,
    private readonly translateLogin: TranslateService
  ){
    super(translateLogin);
  }

  public value: string = "";



  onSignUp() {
    this.router.navigate(["singup"])
  }
}
