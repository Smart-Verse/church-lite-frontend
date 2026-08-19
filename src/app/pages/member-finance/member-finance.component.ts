import {Component, OnInit} from '@angular/core';
import {finalize} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {MemberFinancialPortal} from './member-finance.models';
import {MemberFinanceService} from './member-finance.service';

@Component({
  selector: 'app-member-finance',
  imports: [SharedCommonModule],
  templateUrl: './member-finance.component.html',
  styleUrl: './member-finance.component.scss'
})
export class MemberFinanceComponent implements OnInit {
  data?: MemberFinancialPortal;
  loading = true;
  error = '';

  constructor(private readonly service: MemberFinanceService) {
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.get().pipe(finalize(() => this.loading = false)).subscribe({
      next: data => this.data = data,
      error: () => this.error = 'Não foi possível carregar as informações financeiras.'
    });
  }

  revenueAccounts() {
    return this.data?.accounts.filter(item => item.financialNature === 'REVENUE') ?? [];
  }

  expenseAccounts() {
    return this.data?.accounts.filter(item => item.financialNature === 'EXPENSE') ?? [];
  }
}
