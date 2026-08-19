import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {finalize} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {
  FinancialStatement,
  MemberFinancialApprovalService
} from '../../services/member-portal/member-financial-approval.service';

@Component({
  selector: 'app-member-approvals',
  imports: [SharedCommonModule],
  templateUrl: './member-approvals.component.html',
  styleUrl: './member-approvals.component.scss'
})
export class MemberApprovalsComponent implements OnInit {
  items: FinancialStatement[] = [];
  loading = true;
  voting = '';
  error = '';

  constructor(private readonly service: MemberFinancialApprovalService, private readonly router: Router) {
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.memberList().pipe(finalize(() => this.loading = false)).subscribe({
      next: v => this.items = v,
      error: () => this.error = 'Não foi possível carregar as prestações de contas.'
    });
  }

  vote(item: FinancialStatement, approved: boolean): void {
    this.voting = item.id;
    this.service.vote(item.id, approved).pipe(finalize(() => this.voting = '')).subscribe({
      next: updated => this.items = this.items.map(x => x.id === updated.id ? updated : x),
      error: e => this.error = e.error?.message === 'member_financial_approval_already_voted' ? 'Seu voto já foi registrado.' : 'Não foi possível registrar o voto.'
    });
  }

  back(): void {
    this.router.navigate(['/member']);
  }
}
