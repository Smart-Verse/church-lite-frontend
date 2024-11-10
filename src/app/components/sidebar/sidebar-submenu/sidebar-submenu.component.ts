import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SharedCommonModule } from '../../../shared/common/shared-common.module';

@Component({
  selector: 'app-sidebar-submenu',
  standalone: true,
  imports: [
    SharedCommonModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './sidebar-submenu.component.html',
  styleUrl: './sidebar-submenu.component.scss'
})
export class SidebarSubmenuComponent {
  @Input() menu: any;
}
