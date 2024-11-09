import { Component } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';


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
    RouterOutlet
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  public menuItems = [
    {
      route: "dashboard",
      iconClass: 'pi pi-chart-bar',
      tooltip: 'Dashboard'
    },
    {
      route: "activities",
      iconClass: "pi pi-check-square",
      tooltip: "Avaliações"
    },
    {
      route: "class",
      iconClass: "pi pi-user-edit",
      tooltip: "Turmas"
    },
    {
      route: "repository",
      iconClass: "pi pi-folder-open",
      tooltip: "Repositório"
    },

    {
      route: "settings",
      iconClass: 'pi pi-cog',
      tooltip: 'Configurações'
    }
  ];
}
