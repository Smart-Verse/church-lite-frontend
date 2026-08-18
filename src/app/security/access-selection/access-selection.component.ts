import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { CookiesService } from '../../shared/services/cookies/cookies.service';
import { EnumCookie } from '../../shared/services/cookies/cookie.enum';

@Component({selector:'app-access-selection',imports:[SharedCommonModule],templateUrl:'./access-selection.component.html',styleUrl:'./access-selection.component.scss'})
export class AccessSelectionComponent {
  constructor(private readonly cookies:CookiesService,private readonly router:Router){}
  select(profile:'MEMBER'|'STAFF'):void{this.cookies.set(EnumCookie.ACCESS_PROFILE,profile);sessionStorage.removeItem('selectedChurchAccess');this.router.navigate([profile==='MEMBER'?'/member':'/home']);}
}
