import {Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {BaseComponent} from '../../shared/common/base-component/base-component';
import {CrudService} from '../../shared/services/crud/crud.service';
import {RequestData} from '../../shared/interfaces/request-data';
import {CookiesService} from '../../shared/services/cookies/cookies.service';
import {EnumCookie} from '../../shared/services/cookies/cookie.enum';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';

@Component({
  selector: 'app-cash-approvals',
  imports: [SharedCommonModule, TableModule],
  providers: [CrudService, ToastService],
  templateUrl: './cash-approvals.component.html',
  styleUrl: './cash-approvals.component.scss'
})
export class CashApprovalsComponent extends BaseComponent implements OnInit {
  approvals: any[] = [];
  approving: string | null = null;

  constructor(private crud: CrudService, private cookies: CookiesService, private toast: ToastService, public translate: TranslateService) {
    super();
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const request = new RequestData();
    request.offset = 0;
    request.size = 100;
    this.showLoading = true;
    const hash = this.cookies.get(EnumCookie.HASH);
    this.crud.onGetAll('cashClosingApproval', request).subscribe({
      next: response => {
        this.approvals = (response.contents ?? []).filter((item: any) => !item.approved && item.approver?.hash === hash);
        this.showLoading = false;
      }, error: error => {
        this.showLoading = false;
        this.error(error);
      }
    });
  }

  approve(item: any): void {
    this.approving = item.id;
    this.crud.onSave('cashClosingApproval', {cashTransaction: {id: item.cashTransaction.id}}).subscribe({
      next: () => {
        this.approving = null;
        this.toast.success({
          summary: this.translate.translate('common_message'),
          detail: this.translate.translate('cash_approval_success')
        });
        this.load();
      }, error: error => {
        this.approving = null;
        this.error(error);
      }
    });
  }

  private error(error: any): void {
    this.toast.error({
      summary: this.translate.translate('common_message'),
      detail: error.error?.message ?? this.translate.translate('common_message_error')
    });
  }
}
