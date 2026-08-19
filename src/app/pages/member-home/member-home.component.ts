import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {finalize} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {MemberDashboard} from './member-dashboard.models';
import {MemberDashboardService} from './member-dashboard.service';

@Component({
  selector: 'app-member-home',
  imports: [SharedCommonModule],
  templateUrl: './member-home.component.html',
  styleUrl: './member-home.component.scss'
})
export class MemberHomeComponent implements OnInit {
  readonly today = new Date();
  dashboard?: MemberDashboard;
  loading = true;
  error = '';

  constructor(
    private readonly router: Router,
    private readonly dashboardService: MemberDashboardService
  ) {
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.dashboardService.get().pipe(finalize(() => this.loading = false)).subscribe({
      next: dashboard => this.dashboard = dashboard,
      error: () => this.error = 'Não foi possível carregar seu portal agora.'
    });
  }

  openTransparency(): void {
    this.router.navigate(['/member/finance']);
  }

  openApprovals(): void {
    this.router.navigate(['/member/approvals']);
  }

  openFeed(): void {
    this.router.navigate(['/member/feed']);
  }
}
