import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { CookiesService } from '../../shared/services/cookies/cookies.service';
import { EnumCookie } from '../../shared/services/cookies/cookie.enum';

export interface AuthenticatedChurch {
  userId: string;
  name: string;
  tenant: string;
  accessToken: string;
}

@Component({
  selector: 'app-tenant-selection',
  imports: [SharedCommonModule],
  templateUrl: './tenant-selection.component.html',
  styleUrl: './tenant-selection.component.scss'
})
export class TenantSelectionComponent implements OnInit {
  churches: AuthenticatedChurch[] = [];

  constructor(
    private readonly router: Router,
    private readonly cookiesService: CookiesService
  ) {}

  ngOnInit(): void {
    const storedChurches = sessionStorage.getItem('authenticatedChurches');
    if (!storedChurches) {
      this.router.navigate(['/login']);
      return;
    }

    this.churches = JSON.parse(storedChurches);
    if (this.churches.length === 1) {
      this.selectChurch(this.churches[0]);
    }
  }

  selectChurch(church: AuthenticatedChurch): void {
    this.cookiesService.set(EnumCookie.AUTHORIZATION, church.accessToken);
    this.cookiesService.set(EnumCookie.HASH, church.userId);
    sessionStorage.removeItem('authenticatedChurches');
    this.router.navigate(['/home']);
  }

  cancel(): void {
    sessionStorage.removeItem('authenticatedChurches');
    this.router.navigate(['/login']);
  }
}
