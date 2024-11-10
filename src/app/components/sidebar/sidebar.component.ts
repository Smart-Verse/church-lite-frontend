import { Component } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { SidebarSubmenuComponent } from './sidebar-submenu/sidebar-submenu.component';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SharedCommonModule,
    RouterLink,
    TooltipModule,
    RouterLinkActive,
    AvatarModule,
    AvatarGroupModule,
    RouterOutlet,
    SidebarSubmenuComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  isExpanded = false;
  currentMenu: any;

  public menuItems = [
    {
      route: "dashboard",
      iconClass: 'pi pi-chart-bar',
      tooltip: 'Dashboard',
      name: 'Dashboard',
      submenu: [
        {
          route: "dashboard",
          name: 'Dashboard',
        },
        {
          route: "dashboard",
          name: 'Dashboard',
        }
      ]
    },
    {
      route: "register",
      iconClass: "pi pi-check-square",
      tooltip: "Cadastros",
      name: 'Cadastros',
      submenu: [
        {
          route: "dashboard",
          name: 'Pessoas',
          submenu: [
            {
              route: "dashboard",
              name: 'Membros',
            },
            {
              route: "dashboard",
              name: 'Fornecedores',
            }
          ]
        },
        {
          route: "dashboard",
          name: 'Outros',
          submenu: [
            {
              route: "dashboard",
              name: 'Cargos',
            }
          ]
        }
      ]
    }
  ];

  toggleMenu(menu: any) {
    this.isExpanded = true;
    this.currentMenu = menu;
  }
  closeMenu(){
    this.isExpanded = !this.isExpanded;
  }
  
}
