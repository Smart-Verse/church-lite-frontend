import { Component, OnInit } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields.service';
import { SignUp } from './signup';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {


  public signUp: FormGroup;
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly fieldsService: FieldsService,
    private readonly router: Router
  ){
    this.signUp = this.fieldsService.onCreateFormBuiderDynamic(new SignUp().fields);
  }

  ngOnInit(): void {
    
  }

  onRegister() {
    console.log(this.signUp.value);
  }

  onSign() {
    this.router.navigate(["login"])
  }
}
