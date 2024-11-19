import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/common/base-component/base-component';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { TranslateService } from '../../shared/services/translate/translate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterChurchService } from '../../services/register-church/register-church.service';
import { error } from 'console';
import { ToastService } from '../../shared/services/toast/toast.service';


@Component({
  selector: 'app-register-church',
  standalone: true,
  providers: [RegisterChurchService, ToastService],
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
    private readonly registerChurchService: RegisterChurchService,
    private readonly toast: ToastService

  ){
    super();
  }

  ngOnInit(): void {
    this.onShowLoading();
    this.route.paramMap.subscribe(p => {
      this.token = p.get('hash');

      this.registerChurchService.onValidURL(this.token).subscribe({
        next: (res) => {
          if(res.authorize){
            this.toast.success({summary:"Conta confirmada com suceesso",detail: "Conta confirmada com sucesso"});
            this.router.navigate(["login"]);
          }
          this.onShowLoading();
        },
        error: (error) => {
          this.showMessage = "Houve uma falha ao confirmar sua conta";
          this.onShowLoading();
        }
      })

    });
  }


}
