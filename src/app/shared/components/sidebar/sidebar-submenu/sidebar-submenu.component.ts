import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SharedCommonModule } from '../../../common/shared-common.module';
import {EnumCookie} from "../../../services/cookies/cookie.enum";
import {CookiesService} from "../../../services/cookies/cookies.service";


@Component({
  selector: 'app-sidebar-submenu',
  standalone: true,
  imports: [
    SharedCommonModule,
    RouterLink
  ],
  templateUrl: './sidebar-submenu.component.html',
  styleUrl: './sidebar-submenu.component.scss'
})
export class SidebarSubmenuComponent implements OnInit, OnChanges {


  @Input() menu: any;
  @Output() colapsed: EventEmitter<boolean> = new EventEmitter();

  currentMenu: any;
  stackMenu: any[] = [];

  constructor(
    private readonly router: Router,
    private readonly cookieService: CookiesService,
  ){}
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['menu']){
      this.currentMenu = changes['menu'].currentValue;
    }

  }

  ngOnInit(): void {
    this.currentMenu = this.menu;
    this.stackMenu.push(this.menu);
  }

  onColapsed(menu: any){
    if(!menu || this.stackMenu.length === 1)
      this.colapsed.emit();
    else {
      if(this.stackMenu.length > 1){
        this.stackMenu.pop();
        this.currentMenu = this.stackMenu[this.stackMenu.length - 1];
      }
    }
  }

  onContextMenu(contextMenu: any) {
    if(contextMenu.route){
      this.onLogout(contextMenu.route);
      this.onColapsed(null);
    } else {
      this.stackMenu.push(contextMenu);
      this.currentMenu = contextMenu;
    }
  }

  onLogout(route: any){
    if(route === 'login'){
      this.cookieService.delete(EnumCookie.AUTHORIZATION);
      this.router.navigate(['login']);
    }
  }
}
