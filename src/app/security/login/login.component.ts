import { Component } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  constructor(private readonly router: Router){}

  public value: string = "";



  onSignUp() {
    this.router.navigate(["singup"])
  }
}
