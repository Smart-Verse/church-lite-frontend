import {Component, DestroyRef, HostListener, OnInit} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, timer } from 'rxjs';
import { SharedCommonModule } from '../../common/shared-common.module';
import { RouterLink, RouterOutlet} from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { SidebarSubmenuComponent } from './sidebar-submenu/sidebar-submenu.component';
import { MenuItens } from '../../../config/sidebar/menu-itens';
import {MenuModule} from "primeng/menu";

import {UserConfigurationService} from "../../../services/user-configuration/user-configuration.service";
import {ImageUploadService} from "../inputs/image-upload/image-upload.service";
import {ThemeService} from "../../services/theme/theme.service";
import {TranslateService} from "../../services/translate/translate.service";
import {SubscriptionBannerComponent} from '../subscription-banner/subscription-banner.component';
import {SubscriptionService} from '../../services/subscription/subscription.service';
import {NotificationService} from '../../../services/notification/notification.service';




@Component({
    selector: 'app-sidebar',
    imports: [
        SharedCommonModule,
        RouterLink,
        TooltipModule,
        AvatarModule,
        AvatarGroupModule,
        RouterOutlet,
        SidebarSubmenuComponent,
        MenuModule,
        SubscriptionBannerComponent
    ],
    providers: [
        UserConfigurationService,
        ImageUploadService
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  theme: string = 'aura-dark-purple';
  menu: MenuItens;
  isExpanded = false;
  menuItems: any;
  currentMenu: any;
  showSidebar: boolean = true;
  showSidebarMobile: boolean = false;
  screenWidth: number = 0;
  isMobile: boolean = false;
  image: string | null = null;
  unreadNotifications = 0;

  constructor(
    private readonly userConfigurationService: UserConfigurationService,
    private readonly imageService: ImageUploadService,
    private readonly themeService: ThemeService,
    private readonly translateService: TranslateService,
    private readonly subscriptionService: SubscriptionService,
    private readonly notificationService: NotificationService,
    private readonly destroyRef: DestroyRef,
  ){
    this.menu = new MenuItens(this.translateService);
    this.menuItems = this.menu.menuItems;
    this.currentMenu = this.menuItems[0];
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.onVerifyMobile();
    this.onSetConfigurationMobile();
    this.onLoadImage();
    timer(0, 60_000).pipe(
      switchMap(() => this.notificationService.list(true).pipe(catchError(() => of(null)))),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(response => this.unreadNotifications = response?.unreadCount ?? 0);

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
    });

    const activeLink = document.getElementById(this.currentMenu.name);
    if(activeLink){
      activeLink.classList.add('active');
    }
  }

  onMobileOpenMenu(){
    if (!this.currentMenu?.submenu?.length) {
      this.currentMenu = this.menuItems.find((item: any) => item.submenu?.length) ?? this.menuItems[0];
    }
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


  //Exclusivo para uso aqui
  onLoadImage(){
    this.userConfigurationService.getUser().subscribe({
      next: (res) => {
        this.themeService.onConfigurationTheme(res.output.theme);
        this.translateService.loadTranslationsUser(res.output.lang).subscribe(() => {
          this.menu = new MenuItens(this.translateService);
          this.menuItems = this.filterPaidItems(this.menu.menuItems);
          this.currentMenu = this.menuItems.find((item: any) => item.route === this.currentMenu?.route) ?? this.menuItems[0];
        });
        if (!res.output.userPhoto) {
          this.image = null;
          return;
        }
        this.imageService.onRequestDonwload(res.output.userPhoto).subscribe({
          next: (req) => this.image = req["url"],
          error: () => this.image = null
        });
      }
    });
  }

  private filterPaidItems(items: any[]): any[] {
    if (!this.subscriptionService.isFree()) return items;
    const blockedRoutes = new Set(['dashboard', 'translations', 'report-template']);
    return items.map(item => ({
      ...item,
      submenu: this.filterPaidItems(item.submenu ?? [])
    })).filter(item => !blockedRoutes.has(item.route));
  }


}
