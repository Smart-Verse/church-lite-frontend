import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {CookiesService} from '../../shared/services/cookies/cookies.service';
import {EnumCookie} from '../../shared/services/cookies/cookie.enum';
import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: 'app-member-layout',
  imports: [SharedCommonModule, RouterLink, RouterLinkActive, RouterOutlet, TooltipModule],
  templateUrl: './member-layout.component.html',
  styleUrls: ['./member-layout.component.scss', './member-layout-collapse.component.scss']
})
export class MemberLayoutComponent {
  collapsed = false;
  readonly canSwitchToStaff: boolean;
  readonly items = [{
    label: 'Feed',
    icon: 'pi pi-images',
    route: '/member',
    exact: true
  }, {
    label: 'Minhas contribuições',
    icon: 'pi pi-wallet',
    route: '/member/contributions',
    exact: false
  }, {label: 'Transparência', icon: 'pi pi-eye', route: '/member/finance', exact: false}, {
    label: 'Aprovações',
    icon: 'pi pi-thumbs-up',
    route: '/member/approvals',
    exact: false
  }];

  constructor(private readonly cookies: CookiesService, private readonly router: Router) {
    this.canSwitchToStaff = this.cookies.get(EnumCookie.AVAILABLE_ACCESS_PROFILES).split(',').includes('STAFF');
  }

  switchToStaff(): void {
    this.cookies.set(EnumCookie.ACCESS_PROFILE, 'STAFF');
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.cookies.clear();
    this.router.navigate(['/login']);
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
