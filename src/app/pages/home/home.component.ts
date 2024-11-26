import {Component, OnInit} from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import {UserConfigurationService} from "../../services/user-configuration/user-configuration.service";
import {ThemeService} from "../../shared/services/theme/theme.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {



}
