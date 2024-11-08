import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/common/base-component/base-component';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { TranslateService } from '../../shared/services/translate/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterChurchService } from '../../services/register-church/register-church.service';
import { error } from 'console';

@Component({
  selector: 'app-register-church',
  standalone: true,
  providers: [RegisterChurchService],
  imports: [SharedCommonModule],
  templateUrl: './register-church.component.html',
  styleUrl: './register-church.component.scss'
})
export class RegisterChurchComponent extends BaseComponent implements OnInit {

  token: string | null = null;
  showMessage: string = "";

  constructor(
    private readonly translateRegister: TranslateService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly registerChurchService: RegisterChurchService
    
  ){
    super(translateRegister);
  }

  ngOnInit(): void {
    this.onShowLoading();
    this.route.paramMap.subscribe(p => {
      this.token = p.get('hash');

      this.registerChurchService.onValidURL(this.token).subscribe({
        next: (res) => {
          if(res.output){
            this.showMessage = "Sua conta foi confirmada com sucesso, agora poderá logar no sistema";
          }
        },
        error: (error) => {
          this.showMessage = "Houve uma falha ao confirmar sua conta";
        }
      })

    });
  }


}
