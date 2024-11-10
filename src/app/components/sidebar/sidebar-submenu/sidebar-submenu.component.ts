import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SharedCommonModule } from '../../../shared/common/shared-common.module';


@Component({
  selector: 'app-sidebar-submenu',
  standalone: true,
  imports: [
    SharedCommonModule,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './sidebar-submenu.component.html',
  styleUrl: './sidebar-submenu.component.scss'
})
export class SidebarSubmenuComponent implements OnInit {


  @Input() menu: any;
  @Output() colapsed: EventEmitter<boolean> = new EventEmitter();

  originalMenu: any;
  currentMenu: any;

  constructor(
    private readonly router: Router
  ){}

  ngOnInit(): void {
    this.originalMenu = this.menu;
    this.currentMenu = this.originalMenu;
  }

  onColapsed(){
    this.colapsed.emit();
  }

  onContextMenu(contextMenu: any) {
    if(contextMenu.route){
      this.router.navigate([contextMenu.route]);
      this.onColapsed();
    } else {
      this.currentMenu = contextMenu;
    }
  }
}
