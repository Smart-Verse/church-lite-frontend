import { Component } from '@angular/core';
import { BaseComponent } from '../../shared/common/base-component/base-component';
import { SharedCommonModule } from '../../shared/common/shared-common.module';

@Component({
  selector: 'app-register-church',
  standalone: true,
  imports: [SharedCommonModule],
  templateUrl: './register-church.component.html',
  styleUrl: './register-church.component.scss'
})
export class RegisterChurchComponent extends BaseComponent {

}
