import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { SharedCommonModule } from '../../common/shared-common.module';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { SidebarSubmenuComponent } from './sidebar-submenu/sidebar-submenu.component';
import { MenuItens } from '../../../config/sidebar/menu-itens';
import {MenuModule} from "primeng/menu";


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SharedCommonModule,
    RouterLink,
    TooltipModule,
    AvatarModule,
    AvatarGroupModule,
    RouterOutlet,
    SidebarSubmenuComponent,
    MenuModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  menu = new MenuItens();
  isExpanded = false;
  menuItems: any;
  currentMenu: any;
  showSidebar: boolean = true;
  showSidebarMobile: boolean = false;
  screenWidth: number = 0;
  isMobile: boolean = false;
  showPopupMenu = false;
  items: any[] = [
    {
      label: 'Usuário',
      items: [
        {
          label: 'Configurações',
          icon: 'pi pi-settings'
        },
        {
          label: 'Logout',
          icon: 'pi pi-logout'
        }
      ]
    }
  ];

  constructor(){
    this.menuItems = this.menu.menuItems;
    this.currentMenu = this.menuItems[0];
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.onVerifyMobile();
    this.onSetConfigurationMobile();
    document.addEventListener('click', this.closePopupMenu.bind(this));
  }

  toggleMenu(menu: any) {
    this.isExpanded = false;
    if(menu.submenu.length > 0){
      this.isExpanded = true;

    }
    this.currentMenu = menu;
    this.onDisableAndSetActiveLink();
  }

  closeMenu(){
    this.isExpanded = false;
    if(this.isMobile){
      this.showSidebar = false;
      this.showSidebarMobile = true;
    }
    this.onDisableAndSetActiveLink();
  }


  onDisableAndSetActiveLink() {

    this.menu.menuItems.forEach(e => {

      const disableLink = document.getElementById(e.name);
      if(disableLink){
        disableLink.classList.remove('active');
      }
    })

    const activeLink = document.getElementById(this.currentMenu.name);
    if(activeLink){
      activeLink.classList.add('active');
    }
  }

  onMobileOpenMenu(){
    this.onDisableAndSetActiveLink();
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

  togglePopupMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showPopupMenu = !this.showPopupMenu;
  }

  closePopupMenu() {
    this.showPopupMenu = false;
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closePopupMenu.bind(this));
  }

}
