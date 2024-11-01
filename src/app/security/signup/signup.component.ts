import { Component } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  onAlert() {
    alert('clicou')
  }
}
