import { Component, HostListener, OnInit } from '@angular/core';
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
export class SidebarComponent implements OnInit {


  isExpanded = false;
  currentMenu: any;
  showSidebar: boolean = true;
  showSidebarMobile: boolean = false;
  screenWidth: number = 0;
  isMobile: boolean = false;

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.onVerifyMobile();
    this.onSetConfigurationMobile();      
  }

  public menuItems = [
    {
      route: "dashboard",
      iconClass: 'pi pi-chart-bar',
      tooltip: 'Dashboard',
      name: 'Dashboard',
    },
    {
      iconClass: "pi pi-check-square",
      tooltip: "Cadastros",
      name: 'Cadastros',
      submenu: [
        {
          name: 'Pessoas',
          submenu: [
            {
              route: "register",
              name: 'Membros',
            },
            {
              route: "dashboard",
              name: 'Fornecedores',
            }
          ]
        },
        {
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
    this.isExpanded = false;
    if(this.isMobile){
      this.showSidebar = false;
      this.showSidebarMobile = true;
    }
  }

  onMobileOpenMenu(){
    this.isExpanded = true;
    if(this.isMobile){
      this.showSidebar = true;
      this.showSidebarMobile = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.onVerifyMobile();
    this.onSetConfigurationMobile();  
  }

  onVerifyMobile(){
    if(this.screenWidth <= 600){
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  onSetConfigurationMobile(){
    if(this.isMobile) {
      this.showSidebarMobile = true;
      this.showSidebar = false;
    } else {
      this.showSidebarMobile = false;
      this.showSidebar = true;
    }
  }

}
